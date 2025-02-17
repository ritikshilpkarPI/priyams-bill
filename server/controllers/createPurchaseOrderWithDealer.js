const {
  validateUpsertPODealerRequest,
} = require('../util/validateUpsertPODealerRequest');
const { Dealer } = require('../db-models/dealer-model');
const { Salesman } = require('../db-models/salesman-model');
const PurchaseOrder = require('../db-models/purchase-order-model');
const { uploadToCloudinary } = require('../util/image');
const { MESSAGES } = require('../constants/messages');
const { validateFile } = require('../util/validateFile');
const { parseStringToJson } = require('../util/parseStringToJson');

const fileValidation = validateFile({
  sizeInMB: 5,
  fileTypes: ['image/jpeg', 'image/png', 'image/jpg'],
});

const parseAndValidateRequest = (req, res) => {
  const parsedData = parseStringToJson(req.body.data);
  const { error } = validateUpsertPODealerRequest.validate(parsedData);
  if (error) {
    res.status(400).json({ status: false, message: error.details[0].message });
    return null;
  }
  return parsedData;
};

const validateDealerVisitingCardFiles = (req, res) => {
  if (req.files?.dealerVisitingCard) {
    const files = Array.isArray(req.files.dealerVisitingCard)
      ? req.files.dealerVisitingCard
      : [req.files.dealerVisitingCard];

    for (const file of files) {
      const validationResult = fileValidation(file);
      if (validationResult.error) {
        res.status(400).json({
          status: false,
          message: validationResult.error.details[0].message,
        });
        return false;
      }
    }
  }
  return true;
};

const findOrCreateDealer = async (parsedData) => {
  const { dealerId, dealerName, dealerAddress, dealerContactNumber } =
    parsedData;

  let dealer;
  if (dealerId) {
    dealer = await Dealer.findById(dealerId);
    if (!dealer) throw new Error(MESSAGES.DEALER_NOT_EXIST);

    dealer.dealerAddress = dealer.dealerAddress || [];
    dealer.dealerContactNumber = dealer.dealerContactNumber || [];
    dealer.dealerVisitingCard = dealer.dealerVisitingCard || [];

    if (dealerAddress && !dealer.dealerAddress.includes(dealerAddress)) {
      dealer.dealerAddress.push(dealerAddress);
    }
    if (
      dealerContactNumber &&
      !dealer.dealerContactNumber.includes(dealerContactNumber)
    ) {
      dealer.dealerContactNumber.push(dealerContactNumber);
    }
  } else {
    dealer = new Dealer({
      dealerName,
      dealerAddress: dealerAddress ? [dealerAddress] : [],
      dealerContactNumber: dealerContactNumber ? [dealerContactNumber] : [],
      dealerVisitingCard: [],
    });
  }

  return dealer;
};

const uploadDealerVisitingCardImages = async (req) => {
  const uploadedImages = [];
  if (req.files?.dealerVisitingCard) {
    const files = Array.isArray(req.files.dealerVisitingCard)
      ? req.files.dealerVisitingCard
      : [req.files.dealerVisitingCard];

    for (const file of files) {
      const uploadResult = await uploadToCloudinary(file.data, file.name);
      if (uploadResult?.secure_url && uploadResult?.public_id) {
        uploadedImages.push({
          publicId: uploadResult.public_id,
          secureUrl: uploadResult.secure_url,
        });
      }
    }
  }
  return uploadedImages;
};

const findOrCreateSalesman = async (parsedData, dealerId) => {
  const { salesmanId, salesmanName, salesmanContactNumber } = parsedData;

  let salesman;
  if (salesmanId) {
    salesman = await Salesman.findById(salesmanId);
    if (!salesman) throw new Error(MESSAGES.SALESMAN_NOT_EXIST);

    salesman.salesmanContactNumber = salesman.salesmanContactNumber || [];
    if (
      salesmanContactNumber &&
      !salesman.salesmanContactNumber.includes(salesmanContactNumber)
    ) {
      salesman.salesmanContactNumber.push(salesmanContactNumber);
    }
    salesman.dealerId = dealerId;
  } else {
    salesman = new Salesman({
      salesmanName,
      salesmanContactNumber: salesmanContactNumber
        ? [salesmanContactNumber]
        : [],
      dealerId,
    });
  }

  return salesman;
};

const createPurchaseOrderWithDealer = async (req, res, next) => {
  try {
    const parsedData = parseAndValidateRequest(req, res);
    if (!parsedData) return;

    if (!validateDealerVisitingCardFiles(req, res)) return;

    let dealer = await findOrCreateDealer(parsedData);
    const uploadedImages = await uploadDealerVisitingCardImages(req);
    dealer.dealerVisitingCard.push(...uploadedImages);
    await dealer.save();

    let salesman = await findOrCreateSalesman(parsedData, dealer._id);
    await salesman.save();

    const newPurchaseOrder = new PurchaseOrder({
      dealerId: dealer._id,
      salesmanId: salesman._id,
    });
    await newPurchaseOrder.save();

    res.status(200).json({
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
