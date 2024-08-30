const { uploadImages } = require('../util/image');
const PurchaseOrder = require('../db-models/purchase-order-model');
const { clodinaryFoldersPath } = require('../util/constant');

const addOrder = async (req, res,next) => {
    try {
      const {
        details,
        bills,
        orders,
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
  
      const purchaseOrder = {
        purchasedItems: [...orders],
        purchaseDetails: [...details],
        billPhotos,
        isDraft,
        billAmount,
        remark,
        totalPaidAmount,
        payment,
        procurementSource,
        dealerName,
        phoneNumber,
        minimumQuantity,
      };
      const order = await PurchaseOrder.create(purchaseOrder);
      res.status(201).send({ message: order, success: true });
    } catch (error) {
      next(error)
    }
  };

  module.exports = addOrder;