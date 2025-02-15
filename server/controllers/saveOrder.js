const PurchaseOrder = require('../db-models/purchase-order-model');
const { getItemSKU } = require('../util/getItemSKU');
const { isShelfExpired } = require('../util/isShelfExpired');

const saveOrder = async (req, res ) => {
  try {
    const { new_order = {} } = req.body;
    const itemSKU = getItemSKU(new_order);
    if(new_order.expiryDates) {
      new_order.expiryDates.forEach(expiryDates => {
        expiryDates.isShelfExpired = isShelfExpired(expiryDates.mfgDate, expiryDates.date);
      })
    }
    new_order.sku = getItemSKU(new_order);
    const purchaseOrder = await PurchaseOrder.create({
      purchasedItems: [{
        ...new_order,
        sku: itemSKU
      }],
    });
    res.status(201).send({
      message: 'order added successfully',
      success: true,
      order: purchaseOrder,
    });
  } catch (error) {
    res.status(500).send({message: 'failed to creating order', error: error});
  }
};

module.exports = saveOrder;