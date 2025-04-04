const { uploadImages } = require('../util/image');
const PurchaseOrder = require('../db-models/purchase-order-model');
const { clodinaryFoldersPath } = require('../util/constant');
const { isShelfExpired } = require('../util/isShelfExpired');
const { getItemSKU } = require('../util/getItemSKU');
const { DealerModel } = require('../db-models/dealer-model');
const { MESSAGES } = require ('../constants/messages');

const createNewDealer = async (
  dealerName,
  dealerNumber,
  dealerBrands = [],
  dealerCompanies = []
) => {
  try {
    const newDealer = await DealerModel.create({
      dealerName,
      dealerBrands,
      dealerCompanies,
      dealerNumber,
    });
    return newDealer;
  } catch (error) {
    return res
      .status(404)
      .json({ message: MESSAGES.UNABLE_TO_CREATE_DEALER, success: false });
  }
};

const addOrder = async (req, res,next) => {
    try {
      const {
        details = [],
        bills = [],
        orders = [],
        billAmount,
        remark,
        totalPaidAmount,
        payment,
        procurementSource,
        dealerName,
        phoneNumber,
        minimumQuantity,
      } = req.body.new_order.purchaseObj;
      const isDraft = req.body.new_order.isDraft;
  
      let billPhotos = await uploadImages(bills,clodinaryFoldersPath.bill);

      let dealer = await DealerModel.findOne({ dealerName });

      if (!dealer) {
        const formattedDealerName = dealerName.toUpperCase();
        const formattedPhoneNumber = Number(phoneNumber);
        dealer = await createNewDealer(formattedDealerName, formattedPhoneNumber);
      }

      if(orders && orders.length){
        orders.forEach((order => {
          order.sku = getItemSKU({
            itemQuantity: order.itemQuantity,
            unit: order.unit,
            itemName: order.inputName,
            barcode: order.barcode,
            mrp: order.mrp
          });
          if(order.expiryDates) {
            order.expiryDates.forEach(expiryDates => {
              order.isShelfExpired = isShelfExpired(expiryDates.mfgDate, expiryDates.date);
            })
          }
        }))
      }
  
      const purchaseOrder = {
        purchasedItems: [...orders],
        purchaseDetails: {},
        billPhotos,
        isDraft,
        billAmount,
        remark,
        totalPaidAmount,
        payment,
        procurementSource,
        dealerName: dealer?.dealerName,
        phoneNumber: dealer?.dealerNumber,
        minimumQuantity,
        dealerId: dealer?._id,
      };
      if(isDraft){
        purchaseOrder.draftTime = Date.now();
      }
      const order = await PurchaseOrder.create(purchaseOrder);
      res.status(201).send({ message: order, success: true });
    } catch (error) {
      next(error)
    }
  };

  module.exports = addOrder;