const { Bill } = require('../db-models/bill-model');

const sendMessage = async (req, res,next) => {
    const billId = req.body.id;
    try {
      const bill = await Bill.findByIdAndUpdate(
        billId,
        {
          $set: {
            messageSend: true,
          },
        },
        {
          new: true,
        }
      );
      res.status(200).json({ message: bill });
    } catch (error) {
      next(error)
    }
  };

  module.exports = sendMessage;