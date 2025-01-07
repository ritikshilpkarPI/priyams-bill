const { isValidObjectId } = require('mongoose');
const { Rider } = require('../db-models/rider-model'); 

const approveRider = async (req, res, next) => {
  try {
    const riderId = req.params.id;
    const { status } = req.body;

    if (!isValidObjectId(riderId)) {
      return res.status(401).json({ error: 'Invalid Rider Id' });
    }


    const updatedRider = await Rider.findOneAndUpdate(
      { _id: riderId },
      { $set: { status } },
      { new: true }
    );

    if (updatedRider) {
      res.status(200).json({ message: 'Rider approved successfully', updatedRider });
    } else {
      res.status(404).json({ error: 'Rider not found' });
    }
  } catch (error) {
    next({
      responseCode: 500,
      message: 'Internal server error',
      err: error.message,
    });
  }
};

module.exports = approveRider;
