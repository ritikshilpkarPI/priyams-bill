const { validateDealerRequest } = require('../util/validateDealerRequest');
const { Dealer } = require('../db-models/dealer-model');
const { Salesman } = require('../db-models/salesman-model');
const PurchaseOrder = require('../db-models/purchase-order-model');
const { uploadToCloudinary } = require('../util/image');
const { MESSAGES } = require('../constants/messages');
const createPurchaseOrderWithDealer = async (req, res, next) => {
  try {
    const { error } = validateDealerRequest.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });
    }
    const {
      dealerName,
      dealerAddress,
      dealerContactNumber,
      dealerVisitingCard,
      salesmanName,
      salesmanContactNumber,
      dealerId,
      salesmanId,
    } = req.files;

    let uploadedVisitingCard = null;
    if (dealerVisitingCard && dealerVisitingCard.data) {
      const result = await uploadToCloudinary(
        dealerVisitingCard.data,
        dealerVisitingCard.name
      );

      if (result) {
        uploadedVisitingCard = {
          publicId: result.public_id,
          secureUrl: result.secure_url,
        };
      }
    }
    let dealer;
    if (!dealerId) {
      dealer = new Dealer({
        dealerName,
        dealerAddress,
        dealerContactNumber,
        dealerVisitingCard: uploadedVisitingCard,
      });
      await dealer.save();
    } else {
      dealer = await Dealer.findById(dealerId);
      if (!dealer) {
        return res.status(400).json({
          status: false,
          message: MESSAGES.DEALER_NOT_EXIST,
        });
      }
    }
    let salesman;
    if (!salesmanId) {
      salesman = new Salesman({
        salesmanName,
        salesmanContactNumber,
        dealerReference: dealer._id,
      });
      await salesman.save();
    } else {
      salesman = await Salesman.findById(salesmanId);
      if (!salesman) {
        return res.status(400).json({
          status: false,
          message: MESSAGES.SALESMAN_NOT_EXIST,
        });
      }
    }
    const newPurchaseOrder = new PurchaseOrder({
      dealerId: dealer._id,
      salesmanId: salesman._id,
    });

    await newPurchaseOrder.save();

    return res.status(200).json({
      status: true,
      message: MESSAGES.DEALER_AND_SALESMAN_DATA_SAVE_SUCCESSFULLY,
      data: {
        dealer,
        salesman,
      },
    });
  } catch (error) {
    console.log({ error });

    next(error);
  }
};
module.exports = { createPurchaseOrderWithDealer };
