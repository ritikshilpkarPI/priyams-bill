const PurchaseOrder = require('../db-models/purchase-order-model');

const fetchLastPurchaseOrders = async (chunk) => {
  try {
    const purchaseOrders = await PurchaseOrder.find({
      'purchasedItems.item_id': { $in: chunk },
    })
      .sort({ createdAt: -1 })
      .select('purchasedItems createdAt approveTime');

    const extractOrderDetails = (purchaseOrder, itemId) => {
      if (!purchaseOrder) return { approvalDate: null, amount: 0, costPrice: 0 };
      const matchedItem = purchaseOrder.purchasedItems.find(
        (item) => item.item_id.toString() === itemId
      );
      return {
        approvalDate: purchaseOrder.approveTime || null,
        amount: matchedItem ? matchedItem.itemQuantity || 0 : 0,
        costPrice: matchedItem ? matchedItem.costPrice || 0 : 0,
      };
    };

    return chunk.map((itemId) => {
      const ordersForItem = purchaseOrders.filter((order) =>
        order.purchasedItems.some((item) => item.item_id.toString() === itemId)
      );

      const [firstPurchaseOrder, secondPurchaseOrder, thirdPurchaseOrder] =
        ordersForItem.map((order) => extractOrderDetails(order, itemId));

      return {
        item_id: itemId,
        firstPurchaseOrder,
        secondPurchaseOrder,
        thirdPurchaseOrder,
      };
    });
  } catch (err) {
    console.error('Error fetching purchase orders:', err);
    return chunk.map((itemId) => ({
      item_id: itemId,
      firstPurchaseOrder: { approvalDate: null, amount: 0, costPrice: 0 },
      secondPurchaseOrder: { approvalDate: null, amount: 0, costPrice: 0 },
      thirdPurchaseOrder: { approvalDate: null, amount: 0, costPrice: 0 },
    }));
  }
};

module.exports = fetchLastPurchaseOrders;
