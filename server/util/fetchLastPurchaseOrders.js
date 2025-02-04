const PurchaseOrder = require('../db-models/purchase-order-model');

const fetchLastPurchaseOrders = async (chunk, limit = 0) => {
  try {
    const purchaseOrders = await PurchaseOrder.find({
      'purchasedItems.item_id': { $in: chunk },
      isApproved: true,
    })
      .sort({ createdAt: -1 }) 
      .select('purchasedItems createdAt approveTime _id');
      

    const extractOrderDetails = (purchaseOrder, itemId) => {
      if (!purchaseOrder) return { approvalDate: null, amount: 0, costPrice: 0, purchaseOrderId: null  };
      const matchedItem = purchaseOrder.purchasedItems.find(
        (item) => item.item_id.toString() === itemId
      );
      return {
        purchaseOrderId: purchaseOrder._id.toString(), 
        approvalDate: purchaseOrder.approveTime || null,
        amount: matchedItem ? matchedItem.itemQuantity || 0 : 0,
        costPrice: matchedItem ? matchedItem.costPrice || 0 : 0,
      };
    };

    return chunk.map((itemId) => {
      const ordersForItem = purchaseOrders.filter((order) =>
        order.purchasedItems.some((item) => item.item_id.toString() === itemId)
      );

      const limitedOrders = limit > 0 ? ordersForItem.slice(0, limit) : ordersForItem;
      const purchaseOrderDetails = limitedOrders.map((order) => extractOrderDetails(order, itemId));

      return {
        item_id: itemId,
        purchaseOrders: purchaseOrderDetails, 
      };
    });
  } catch (err) {
    console.error('Error fetching purchase orders:', err);
    return chunk.map((itemId) => ({
      item_id: itemId,
      purchaseOrders: Array(limit || 1).fill({
        purchaseOrderId: null ,
        approvalDate: null,
        amount: 0,
        costPrice: 0,
      }),
    }));
  }
};

module.exports = fetchLastPurchaseOrders;
