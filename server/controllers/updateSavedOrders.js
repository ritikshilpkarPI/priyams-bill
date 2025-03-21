const PurchaseOrder = require('../db-models/purchase-order-model');
const { isShelfExpired } = require('../util/isShelfExpired');
const { getItemSKU } = require('../util/getItemSKU');

const updateSavedOrders = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { new_order } = req.body;
    const itemSKU = getItemSKU({
      itemQuantity: new_order.itemQuantity,
      unit: new_order.unit,
      itemName: new_order.inputName,
      barcode: new_order.barcode,
      mrp: new_order.mrp
    });;
    let updatedExpiryDates = new_order.expiryDates;
    if(new_order.expiryDates) {
      updatedExpiryDates = new_order.expiryDates.map(expiryDates => ({
        ...expiryDates,
        isShelfExpired: isShelfExpired(expiryDates.mfgDate, expiryDates.date)
      }))
    }
    const purchaseOrder = await PurchaseOrder.findById(id);
    const newItemCost = new_order.costPrice * new_order.itemQuantity;
    const updatedOrder = await purchaseOrder.updateOne({
      purchasedItems: [...purchaseOrder.purchasedItems, {
        ...new_order,
        expiryDates: updatedExpiryDates,
        sku: itemSKU
      }],
      purchaseDetails:{
        ...purchaseOrder.purchaseDetails,
        totalItemsCost: (purchaseOrder.purchaseDetails?.totalItemsCost || 0) + newItemCost,
      
      }
    });
    res.status(200).send({
      message: 'order added successfully',
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    next(error)
  }
};

module.exports = updateSavedOrders;