const { validateUpsertPODealerRequest } = require('../util/validateUpsertPODealerRequest');
const { Dealer } = require('../db-models/dealer-model');
const { Salesman } = require('../db-models/salesman-model');
const PurchaseOrder = require('../db-models/purchase-order-model');
const { uploadToCloudinary } = require('../util/image');
const { MESSAGES } = require('../constants/messages');
const { validateFile } = require('../util/validateFile');
const { parseStringToJson } = require('../util/parseStringToJson');

const fileValidation = validateFile({ sizeInMB: 5, fileTypes: ['image/jpeg', 'image/png','image/jpg'] });

const createPurchaseOrderWithDealer = async (req, res, next) => {
  try {
    const parsedData = parseStringToJson(req.body.data)
    
    const { error } = validateUpsertPODealerRequest.validate(parsedData);
    if (error) {
      return res.status(400).json({ status: false, message: error.details[0].message });
    }

    if (req.files && req.files.dealerVisitingCard) {
      const fileError = fileValidation.validate(req.files.dealerVisitingCard).error;
      if (fileError) {
        return res.status(400).json({ status: false, message: fileError.details[0].message });
      }
    }

    const {
      dealerName,
      dealerAddress,
      dealerContactNumber,
      salesmanName,
      salesmanContactNumber,
      dealerId,
      salesmanId,
    } = parsedData;

    let dealer;

    if (dealerId) {
      dealer = await Dealer.findById(dealerId);
      if (!dealer) return res.status(400).json({ status: false, message: MESSAGES.DEALER_NOT_EXIST });
      Object.assign(dealer, { dealerName: dealerName || dealer.dealerName, dealerAddress: dealerAddress || dealer.dealerAddress, dealerContactNumber: dealerContactNumber || dealer.dealerContactNumber });
    } else {
      dealer = new Dealer({ dealerName, dealerAddress, dealerContactNumber });
    }

    if (req.files && req.files.dealerVisitingCard) {
      const { dealerVisitingCard } = req.files;
      const uploadResult = await uploadToCloudinary(dealerVisitingCard.data, dealerVisitingCard.name);
      if (uploadResult) {
        dealer.dealerVisitingCard = { publicId: uploadResult.public_id, secureUrl: uploadResult.secure_url };
      }
    }

    await dealer.save();

    let salesman;

    if (salesmanId) {
      salesman = await Salesman.findById(salesmanId);
      if (!salesman) return res.status(400).json({ status: false, message: MESSAGES.SALESMAN_NOT_EXIST });
      Object.assign(salesman, { salesmanName: salesmanName || salesman.salesmanName, salesmanContactNumber: salesmanContactNumber || salesman.salesmanContactNumber });
    } else {
      salesman = new Salesman({ salesmanName, salesmanContactNumber, dealerReference: dealer._id });
    }

    await salesman.save();

    const newPurchaseOrder = new PurchaseOrder({ dealerId: dealer._id, salesmanId: salesman._id });
    await newPurchaseOrder.save();

    return res.status(200).json({
      status: true,
      message: MESSAGES.DEALER_AND_SALESMAN_DATA_SAVE_SUCCESSFULLY,
      data: { dealer, salesman },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = createPurchaseOrderWithDealer;
