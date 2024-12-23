const { isValidObjectId, default: mongoose } = require('mongoose');
const { orderSchema } = require('../db-models/orderSchema');
const { Rider } = require('../db-models/rider-model'); 

const getCancellationOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Validate pagination parameters
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ error: 'Invalid pagination parameters.' });
    }

    // Connect to pstores app Orders DB
    const ordersDb = mongoose.createConnection(process.env.APP_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const Order = ordersDb.model('Orders', orderSchema);

    // Fetch orders with pending cancellation requests
    const cancellationOrders = await Order.find({
      cancellationRequest: true,
      cancellationRequestStatus: 'pending',
    })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    if (!cancellationOrders.length) {
      return res.status(400).json({ error: 'No cancellations order found' });
    }  

    // Get total count for pagination
    const total = await Order.countDocuments({
      cancellationRequest: true,
      cancellationRequestStatus: 'pending',
    });

    

    // Extract unique riderIds from orders
    const riderIds = cancellationOrders
      .map(order => order.riderId)
      .filter(id => isValidObjectId(id))
      .map(id => mongoose.Types.ObjectId(id));

    // If no valid riderIds found
    if (riderIds.length === 0) {
      await ordersDb.close();
      return res.status(404).json({ error: 'No cancellation requests found.' });
    }

    

    // Fetch rider details
    const riders = await Rider.find({ _id: { $in: riderIds } })
      .select('name contactNumber status') 
      .lean();

      
      

    // // Create a map of riderId to rider details
    const riderMap = {};
    riders.forEach(rider => {
      riderMap[rider._id] = rider;
    });

    

    // Attach rider details to orders
    const ordersWithRiderInfo = cancellationOrders.map(order => ({
      ...order,
      rider: riderMap[order.riderId] || null, 
    }));

    
    

    // Close both database connections
    await ordersDb.close();

    if (ordersWithRiderInfo.length === 0) {
      return res.status(404).json({ error: 'No cancellation requests found.' });
    }

    // Calculate total pages
    const totalPages = Math.ceil(total / limitNum);

    
    return res.status(200).json({
      message: 'Fetched cancellation requests successfully.',
      data: ordersWithRiderInfo,
      pagination: {
        total,
        page: pageNum,
        pages: totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching cancellation orders:', error);
    return res.status(500).json({
      error: 'Internal server error.',
    });
  }
};

module.exports = getCancellationOrders;
