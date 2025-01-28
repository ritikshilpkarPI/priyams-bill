const { validateDealerRequest } = require('../util/validateDealerRequest');
const { Dealer } = require('../db-models/dealer-model');
const { Salesman } = require('../db-models/salesman-model');
const purchaseOrderDealerDetail = async (req, res,next) => {
  try {
    const { error } = validateDealerRequest.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });
    }
    const {
      dealerName,
      dealerAddress,
      dealerContactNumber,
      dealerVisitingCard,
      salesmanName,
      salesmanContactNumber,
      dealerId,
      salesmanId,
    } = req.body;
    let dealer;
    if (!dealerId) {
      dealer = new Dealer({
        dealerName,
        dealerAddress,
        dealerContactNumber,
        dealerVisitingCard,
      });
      await dealer.save();
    } else {
      dealer = await Dealer.findById(dealerId);
    }
    let salesman;
    if (!salesmanId) {
      salesman = new Salesman({
        salesmanName,
        salesmanContactNumber,
        dealerReference: dealer._id,
      });
      await salesman.save();
    } else {
      salesman = await Salesman.findById(salesmanId);
    }

    return res.status(200).json({
      status: true,
      message: 'Dealer and Salesman details saved successfully.',
      data: {
        dealer,
        salesman,
      },
    });
  } catch (error) {
    next(error)
  }
};
module.exports = { purchaseOrderDealerDetail };
