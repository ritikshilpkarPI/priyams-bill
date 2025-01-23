const { uploadImages } = require('../util/image');
const PurchaseOrder = require('../db-models/purchase-order-model');
const { clodinaryFoldersPath } = require('../util/constant');
const { getItemNameByItem } = require('../util/getItemNameByItem');
const { isShelfExpired } = require('../util/isShelfExpired');

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

      if(orders && orders.length){
        orders.forEach((order => {
          order.inputName = getItemNameByItem(order);
          if(order.expiryDates) {
            order.expiryDates.forEach(expiryDates => {
              order.isShelfExpired = isShelfExpired(expiryDates.mfgDate, expiryDates.date);
            })
          }
        }))
      }
  
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