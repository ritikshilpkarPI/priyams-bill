const { getItemNameByItem } = require('src/utils/getItemNameByItem');
const PurchaseOrder = require('../db-models/purchase-order-model');

const saveOrder = async (req, res ) => {
  try {
    const { new_order = {} } = req.body;
    const itemName = getItemNameByItem(new_order);
    const purchaseOrder = await PurchaseOrder.create({
      purchasedItems: [{
        ...new_order,
        inputName: itemName,
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