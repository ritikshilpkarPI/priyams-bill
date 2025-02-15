const { Bill } = require("../db-models");

const findBillBySlug = async (slug) => {
    const bill = await Bill.findOne({slug})
      .populate({
        path: 'items',
        populate: {
          path: 'itemDetail',
          model: 'Item',
        },
      })
      .populate({
        path: 'returnBills',
        model: 'ReturnBill',
        populate: [
          {
            path: 'items',
            populate: {
              path: 'itemDetail',
              model: 'Item',
            },
          },
          {
            path: 'itemsReturned',
            populate: {
              path: 'itemDetail',
              model: 'Item',
            },
          },
        ],
      }).lean();
    return bill;
  };
module.exports = { findBillBySlug }; 