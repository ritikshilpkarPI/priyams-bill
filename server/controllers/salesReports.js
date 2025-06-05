const { Bill } = require('../db-models/bill-model');
const { Item } = require('../db-models/item-model');
const { DealerModel } = require('../db-models/dealer-model');

// Helper function to get default date range (last 15 days)
const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 15);
  return { startDate, endDate };
};

// 1. Highest selling items by quantity
const getHighestSellingItemsByQuantity = async (startDate, endDate, limit = 10) => {
  const result = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.itemDetail',
        totalQuantity: { $sum: '$items.itemQuantityInBill' },
        totalAmount: { $sum: '$items.itemSellingPriceTotal' }
      }
    },
    {
      $lookup: {
        from: 'items',
        localField: '_id',
        foreignField: '_id',
        as: 'itemDetails'
      }
    },
    { $unwind: '$itemDetails' },
    {
      $project: {
        _id: 1,
        itemName: '$itemDetails.itemName',
        sku: '$itemDetails.sku',
        barcode: '$itemDetails.itemBarcode',
        totalQuantity: 1,
        totalAmount: 1
      }
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: limit }
  ]);
  return result;
};

// 2. Highest selling items by selling price
const getHighestSellingItemsByAmount = async (startDate, endDate, limit = 10) => {
  const result = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.itemDetail',
        totalAmount: { $sum: '$items.itemSellingPriceTotal' },
        totalQuantity: { $sum: '$items.itemQuantityInBill' }
      }
    },
    {
      $lookup: {
        from: 'items',
        localField: '_id',
        foreignField: '_id',
        as: 'itemDetails'
      }
    },
    { $unwind: '$itemDetails' },
    {
      $project: {
        _id: 1,
        itemName: '$itemDetails.itemName',
        sku: '$itemDetails.sku',
        barcode: '$itemDetails.itemBarcode',
        totalAmount: 1,
        totalQuantity: 1
      }
    },
    { $sort: { totalAmount: -1 } },
    { $limit: limit }
  ]);
  return result;
};

// 3. Category wise top 5 products
const getCategoryWiseTopProducts = async (startDate, endDate, limit = 5) => {
  const result = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }
    },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'items',
        localField: 'items.itemDetail',
        foreignField: '_id',
        as: 'itemDetails'
      }
    },
    { $unwind: '$itemDetails' },
    {
      $group: {
        _id: {
          category: '$itemDetails.itemCategory',
          itemId: '$items.itemDetail'
        },
        totalQuantity: { $sum: '$items.itemQuantityInBill' },
        totalAmount: { $sum: '$items.itemSellingPriceTotal' },
        itemName: { $first: '$itemDetails.itemName' },
        sku: { $first: '$itemDetails.sku' },
        barcode: { $first: '$itemDetails.itemBarcode' }
      }
    },
    {
      $group: {
        _id: '$_id.category',
        topProducts: {
          $push: {
            itemId: '$_id.itemId',
            itemName: '$itemName',
            sku: '$sku',
            barcode: '$barcode',
            totalQuantity: '$totalQuantity',
            totalAmount: '$totalAmount'
          }
        }
      }
    },
    {
      $project: {
        category: '$_id',
        topProducts: { $slice: ['$topProducts', limit] }
      }
    }
  ]);
  return result;
};

// 4. Brand wise top 5 products
const getBrandWiseTopProducts = async (startDate, endDate, limit = 5) => {
  const result = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }
    },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'items',
        localField: 'items.itemDetail',
        foreignField: '_id',
        as: 'itemDetails'
      }
    },
    { $unwind: '$itemDetails' },
    {
      $lookup: {
        from: 'brands',
        localField: 'itemDetails.brandId',
        foreignField: '_id',
        as: 'brandDetails'
      }
    },
    { $unwind: '$brandDetails' },
    {
      $group: {
        _id: {
          brand: '$brandDetails.brandName',
          itemId: '$items.itemDetail'
        },
        totalQuantity: { $sum: '$items.itemQuantityInBill' },
        totalAmount: { $sum: '$items.itemSellingPriceTotal' },
        itemName: { $first: '$itemDetails.itemName' },
        sku: { $first: '$itemDetails.sku' },
        barcode: { $first: '$itemDetails.itemBarcode' }
      }
    },
    {
      $group: {
        _id: '$_id.brand',
        topProducts: {
          $push: {
            itemId: '$_id.itemId',
            itemName: '$itemName',
            sku: '$sku',
            barcode: '$barcode',
            totalQuantity: '$totalQuantity',
            totalAmount: '$totalAmount'
          }
        }
      }
    },
    {
      $project: {
        brand: '$_id',
        topProducts: { $slice: ['$topProducts', limit] }
      }
    }
  ]);
  return result;
};

// 5. Top 10 dealers by quantity
const getTopDealersByQuantity = async (startDate, endDate, limit = 10) => {
  const result = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }
    },
    {
      $lookup: {
        from: 'dealers',
        localField: 'dealerId',
        foreignField: '_id',
        as: 'dealerDetails'
      }
    },
    { $unwind: '$dealerDetails' },
    {
      $group: {
        _id: '$dealerDetails._id',
        dealerName: { $first: '$dealerDetails.dealerName' },
        totalQuantity: { $sum: { $sum: '$items.itemQuantityInBill' } },
        totalAmount: { $sum: '$billAmountTotal' }
      }
    },
    {
      $project: {
        _id: 1,
        dealerName: 1,
        totalQuantity: 1,
        totalAmount: 1
      }
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: limit }
  ]);
  return result;
};

// 6. Top 10 dealers by bill amount
const getTopDealersByAmount = async (startDate, endDate, limit = 10) => {
  const result = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }
    },
    {
      $lookup: {
        from: 'dealers',
        localField: 'dealerId',
        foreignField: '_id',
        as: 'dealerDetails'
      }
    },
    { $unwind: '$dealerDetails' },
    {
      $group: {
        _id: '$dealerDetails._id',
        dealerName: { $first: '$dealerDetails.dealerName' },
        totalAmount: { $sum: '$billAmountTotal' },
        totalQuantity: { $sum: { $sum: '$items.itemQuantityInBill' } }
      }
    },
    {
      $project: {
        _id: 1,
        dealerName: 1,
        totalAmount: 1,
        totalQuantity: 1
      }
    },
    { $sort: { totalAmount: -1 } },
    { $limit: limit }
  ]);
  return result;
};

// Main controller function to handle all report requests
const getSalesReport = async (req, res, next) => {
  try {
    const { reportType, startDate, endDate, limit } = req.body;
    
    // Use default date range if not provided
    const dateRange = startDate && endDate 
      ? { startDate, endDate }
      : getDefaultDateRange();

    let report;
    switch (reportType) {
      case 'highestSellingByQuantity':
        report = await getHighestSellingItemsByQuantity(dateRange.startDate, dateRange.endDate, limit);
        break;
      case 'highestSellingByAmount':
        report = await getHighestSellingItemsByAmount(dateRange.startDate, dateRange.endDate, limit);
        break;
      case 'categoryWiseTopProducts':
        report = await getCategoryWiseTopProducts(dateRange.startDate, dateRange.endDate, limit);
        break;
      case 'brandWiseTopProducts':
        report = await getBrandWiseTopProducts(dateRange.startDate, dateRange.endDate, limit);
        break;
      case 'topDealersByQuantity':
        report = await getTopDealersByQuantity(dateRange.startDate, dateRange.endDate, limit);
        break;
      case 'topDealersByAmount':
        report = await getTopDealersByAmount(dateRange.startDate, dateRange.endDate, limit);
        break;
      default:
        return res.status(400).json({ error: 'Invalid report type' });
    }

    res.status(200).json({
      success: true,
      data: report,
      dateRange: {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSalesReport
}; 