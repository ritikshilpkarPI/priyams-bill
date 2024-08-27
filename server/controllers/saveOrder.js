const PurchaseOrder = require('../db-models/purchase-order-model');

const saveOrder = async (req, res, next) => {
  try {
    const { new_order } = req.body;
    console.log({ new_order });

    const purchaseOrder = await PurchaseOrder.create({
      purchasedItems: [new_order],
    });
    console.log({ purchaseOrder });

    res.status(201).send({
      message: 'order added successfully',
      success: true,
      order: purchaseOrder,
    });
  } catch (error) {
    next(error)
  }
};

module.exports = saveOrder;