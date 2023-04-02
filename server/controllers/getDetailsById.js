const PurchaseOrder = require('../db-models/purchase-order-model');

const getDetailsById = async (req, res,next) => {
    const id = req.params.id;
    try {
      const data = await PurchaseOrder.findById(id);
      res.status(200).send({ data });
    } catch (error) {
      next(error)
    }
  };

  module.exports = getDetailsById;