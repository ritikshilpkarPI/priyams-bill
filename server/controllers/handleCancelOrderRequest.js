const { isValidObjectId } = require('mongoose');
const { Order } = require('../db-models/orderSchema');

const handleCancellationRequest = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { action } = req.body;

    if (!isValidObjectId(orderId)) {
      return res.status(401).json({ error: 'Invalid Order Id' });
    }

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Must be "approve" or "reject".' });
    }

    const updateData = {};
    if (action === 'approve') {
      updateData.cancellationRequestStatus = 'approved';
      updateData.cancellationRequest = false;
      updateData.orderUpdatedAt = new Date();
     
    } else {
      updateData.cancellationRequestStatus = 'rejected';
      updateData.orderUpdatedAt = new Date();
      
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, cancellationRequest: true, cancellationRequestStatus: 'pending' },
      { $set: updateData },
      { new: true }
    );

    if (updatedOrder) {
      return res.status(200).json({ message: `Order ${action}ed successfully`, updatedOrder });
    } else {
      return res.status(404).json({ error: 'No pending cancellation request found for this order or order not found' });
    }
  } catch (error) {
    next({
      responseCode: 500,
      message: 'Internal server error',
      err: error.message,
    });
  }
};

module.exports = handleCancellationRequest;
