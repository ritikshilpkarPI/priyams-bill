const PurchaseOrder = require('../db-models/purchase-order-model');

const getDetailsById = async (req, res) => {
    const id = req.params.id;
    try {
      const data = await PurchaseOrder.findById(id);
      res.status(200).send({ data });
    } catch (err) {
      console.log({ err });
      res.status(400).send({ message: err });
    }
  };

  module.exports = getDetailsById;