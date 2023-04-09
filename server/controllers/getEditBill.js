const { Bill } = require('../db-models/bill-model');

const getEditBill = async (req, res, next) => {
  try {
    const id = req.params.id;
    const bill = await Bill.findById(id).populate({
      path: 'items',
      populate: {
        path: 'itemDetail',
        model: 'Item',
        select:
          'itemBrandName itemCategory itemName itemSellingPricePerUnit itemMRPperUnit',
      },
    });

    res.status(200).json({ message: bill });
  } catch (error) {
    next(error);
  }
};

module.exports = getEditBill;
