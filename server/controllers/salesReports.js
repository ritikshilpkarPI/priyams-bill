const { Bill } = require('../db-models/bill-model');
const { Item } = require('../db-models/item-model');
const { DealerModel } = require('../db-models/dealer-model');
const PurchaseOrder = require('../db-models/purchase-order-model');

// Helper function to get default date range (last 15 days)
const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 15);
  return { startDate, endDate };
};

// Date Range Report Functions
const getTotalAmountReport = async (startDate, lastDate) => {
  const totalAmountReport = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(lastDate) },
      },
    },
    {
      $group: {
        _id: null,
        totalAmountSum: {
          $sum: '$billAmountTotal',
        },
      },
    },
  ]);
  return totalAmountReport;
};

const getTotalProfitReport = async (startDate, lastDate) => {
  const totalProfitReport = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(lastDate) },
      },
    },
    {
      $group: {
        _id: null,
        totalProfitSum: {
          $sum: '$totalBillProfit',
        },
      },
    },
  ]);
  return totalProfitReport;
};

const getTotalDiscountReport = async (startDate, lastDate) => {
  const totalDiscountReport = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(lastDate) },
      },
    },
    {
      $group: {
        _id: null,
        totalDiscountSum: {
          $sum: '$billDiscountTotal',
        },
      },
    },
  ]);
  return totalDiscountReport;
};

const getTotalMRPReport = async (startDate, lastDate) => {
  const totalMRPReport = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(lastDate) },
      },
    },
    {
      $group: {
        _id: null,
        totalMRPSum: {
          $sum: '$billMRPTotal',
        },
      },
    },
  ]);
  return totalMRPReport;
};

const getItemTrendReport = async (startDate, lastDate, itemName) => {
  const unwindedItemBills = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(lastDate) },
      },
    },
    {
      $unwind: '$items',
    },
  ]);
  const populatedBills = await Bill.populate(unwindedItemBills, [
    {
      path: 'items',
      populate: {
        path: 'itemDetail',
        model: 'Item',
        match: { sku: { $eq: itemName } },
      },
    },
    {
      path: 'staffId',
      model: 'staff',
    },
  ]);
  
  const itemTrendReport = populatedBills.filter(
    (bill) => bill.items.itemDetail
  );
  return itemTrendReport;
};

const getAllItemsTrendReport = async (startDate, lastDate) => {
  const unwindedItemDetails = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(lastDate) },
      },
    },
    {
      $unwind: '$items',
    },
    {
      $group: {
        _id: '$items.itemDetail',
        createdAtDates: { $push: '$createdAt' },
        items: { $push: '$items' },
        totalDiscountSum: {
          $sum: '$items.itemDiscountTotal',
        },
        totalAmountSum: {
          $sum: '$items.itemSellingPriceTotal',
        },
        totalMRPsum: {
          $sum: '$items.itemMRPtotal',
        },
        totalQuantitysum: {
          $sum: '$items.itemQuantityInBill',
        },
        itemBarcode: { $first: '$items.itemBarcode' },
        staffId: { $first: '$staffId' }
      },
    },
  ]);
  const allItemsBillingTrend = await Bill.populate(unwindedItemDetails, [
    {
      path: 'items.itemDetail',
      model: 'Item',
    },
    {
      path: 'staffId',
      model: 'staff',
    },
  ]);
  return allItemsBillingTrend;
};

const getPurchasedItemsReport = async (startDate, lastDate) => {
  return await PurchaseOrder.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(lastDate) },
        isApproved: true,
        isRejected: false,
      },
    },
    { $unwind: '$purchasedItems' },
    {
      $unwind: {
        path: '$purchasedItems.expiryDates',
        preserveNullAndEmptyArrays: true, 
      },
    },
    {
      $group: {
        _id: '$purchasedItems.barcode',
        itemName: { $first: '$purchasedItems.inputName' },
        totalStock: { $sum: '$purchasedItems.stockQuantity' },
        itemQuantity: { $first: '$purchasedItems.itemQuantity' },
        unit: { $first: '$purchasedItems.unit' },
        mrp: { $first: '$purchasedItems.mrp' },
        costPrice: { $first: '$purchasedItems.costPrice' },
        purchaseDates: { $addToSet: '$createdAt' },
        suppliers: { $addToSet: '$procurementSource' },
        purchaseOrderIds: { $addToSet: '$_id' },
        expiryDates: { $addToSet: '$purchasedItems.expiryDates' },
      },
    },
    {
      $project: {
        _id: 0,
        barcode: '$_id',
        itemName: 1,
        totalStock: 1,
        mrp: 1,
        costPrice: 1,
        lastPurchaseDate: { $max: '$purchaseDates' },
        firstPurchaseDate: { $min: '$purchaseDates' },
        totalOrders: { $size: '$purchaseOrderIds' },
        suppliers: { $setUnion: ['$suppliers'] }, // Get unique suppliers
        itemQuantity: 1,
        unit: 1,
        expiryDates: 1,
      }
    }
  ]);
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
  // First get items and their dealers from Purchase Orders
  const dealerItems = await PurchaseOrder.aggregate([
    {
      $match: {
        isApproved: true,
        isRejected: false
      }
    },
    { $unwind: '$purchasedItems' },
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
        _id: {
          dealerId: '$dealerDetails._id',
          itemId: '$purchasedItems.item_id'
        },
        dealerName: { $first: '$dealerDetails.dealerName' },
        itemName: { $first: '$purchasedItems.inputName' },
        itemBarcode: { $first: '$purchasedItems.barcode' }
      }
    }
  ]);

  // Get all items from the dealer items
  const itemIds = [...new Set(dealerItems.map(di => di._id.itemId))];

  // Now get sales data for these items from Bills
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
      $match: {
        'itemDetails._id': { $in: itemIds }
      }
    },
    {
      $group: {
        _id: '$itemDetails._id',
        totalAmount: { $sum: '$items.itemSellingPriceTotal' },
        totalQuantity: { $sum: '$items.itemQuantityInBill' },
        itemName: { $first: '$itemDetails.itemName' },
        itemBarcode: { $first: '$itemDetails.itemBarcode' }
      }
    }
  ]);

  // Combine the data and calculate dealer totals
  const dealerTotals = dealerItems.reduce((acc, curr) => {
    const dealerId = curr._id.dealerId;
    const itemSales = result.find(r => r._id.toString() === curr._id.itemId.toString());
    
    if (!acc[dealerId]) {
      acc[dealerId] = {
        dealerName: curr.dealerName,
        totalAmount: 0,
        totalQuantity: 0,
        items: new Set()
      };
    }

    if (itemSales) {
      acc[dealerId].totalAmount += itemSales.totalAmount;
      acc[dealerId].totalQuantity += itemSales.totalQuantity;
      acc[dealerId].items.add(curr.itemName);
    }

    return acc;
  }, {});

  // Convert to array and sort
  const finalResult = Object.entries(dealerTotals)
    .map(([dealerId, data]) => ({
      _id: dealerId,
      dealerName: data.dealerName,
      totalAmount: data.totalAmount,
      totalQuantity: data.totalQuantity,
      items: Array.from(data.items)
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, limit);

  return finalResult;
};

// Main controller function to handle all report requests
const getSalesReport = async (req, res, next) => {
  try {
    const { reportType, startDate, endDate, limit, itemName } = req.body;
    
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
      // Add new report types
      case 'totalAmount':
        report = await getTotalAmountReport(dateRange.startDate, dateRange.endDate);
        break;
      case 'totalProfit':
        report = await getTotalProfitReport(dateRange.startDate, dateRange.endDate);
        break;
      case 'totalDiscount':
        report = await getTotalDiscountReport(dateRange.startDate, dateRange.endDate);
        break;
      case 'totalMRP':
        report = await getTotalMRPReport(dateRange.startDate, dateRange.endDate);
        break;
      case 'itemBillingTrend':
        report = await getItemTrendReport(dateRange.startDate, dateRange.endDate, itemName);
        break;
      case 'allItemsBillingTrend':
        report = await getAllItemsTrendReport(dateRange.startDate, dateRange.endDate);
        break;
      case 'purchasedItems':
        report = await getPurchasedItemsReport(dateRange.startDate, dateRange.endDate);
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