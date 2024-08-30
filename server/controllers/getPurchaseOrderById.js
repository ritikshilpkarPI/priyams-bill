const PurchaseOrder  = require("../db-models/purchase-order-model");

const getPurchaseOrderById = async (req, res, next) => {
  try {
    const  { id }  = req.body;

    if(!id){
        return res.status(400).send({ message: 'Purchase Order ID is required' });
    }
    
    const purchaseOrder = await PurchaseOrder.findById(id);
    
    if (!purchaseOrder) {
      return res.status(404).send({ message: 'Purchase Order not found' });
    }
    res.status(200).send(purchaseOrder);
  } catch (error) {
    next(error)
  }
};

module.exports = getPurchaseOrderById;