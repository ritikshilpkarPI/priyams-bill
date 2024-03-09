const { UnSavedBill } = require('../db-models/unSavedBill-model');

const getUnSavedBills = async (req, res) => {
  try {
    const unsavedBills = await UnSavedBill.find({});
    res.status(200).json({ success: true, message: 'Successfully retrieved unsaved bills', unsavedBills });
  } catch (error) {
    res
      .status(400)
      .json({
        success: false,
        message: 'Unable to retrieve unsaved bills',
        unsavedBills: [],
      });
  }
};

module.exports = getUnSavedBills;
