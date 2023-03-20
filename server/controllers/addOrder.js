const PurchaseOrder = require('../db-models/purchase-order-model');

const addOrder = async (req, res) => {
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
  
      let billPhotos = await uploadImages(bills);
  
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
      console.log({ error });
      res.status(400).send({ message: error.message, success: false });
    }
  };

  module.exports = addOrder;