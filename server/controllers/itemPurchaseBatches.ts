import { Request, Response } from 'express';
import PurchaseOrder from '../db-models/purchase-order-model';
import { Item } from '../db-models/item-model';
import { toObjectId } from '../util/toObjectId';
import { CONSTANTS } from '../constants/constants';
import { MESSAGES } from '../constants/messages';

export const itemPurchaseBatches = async (req: Request, res: Response) => {
  try {
    const {
      itemNameOrBarcode,
      item_id: filterItemId,
      page = '1',
      limit = '20',
    } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;
    const skip = filterItemId ? 0 : (pageNumber - 1) * limitNumber;

    let query = {};

    if (itemNameOrBarcode) {
      const barcode = itemNameOrBarcode.toString();
      const nameRegex = new RegExp(barcode, 'i');
      query = {
        $or: [{ itemBarcode: barcode }, { itemName: nameRegex }],
      };
    } else {
      query = filterItemId ? { _id: toObjectId(filterItemId as string) } : {};
    }
    const items = await Item.find(query)
    .skip(skip)
    .limit(limitNumber)
    .select(CONSTANTS.STATIC_FIELDS_TO_SELECT)
    .lean();
    
    if (items.length === 0) {
      return res
      .status(404)
      .json({ success: false, message: MESSAGES.NO_ITEMS_FOUND_BY_BARCODE });
    }

    const totalCount = await Item.countDocuments(query);
    
    const itemIdMap = new Map<string, any>();
    const itemIds: string[] = [];

    for (const item of items) {
      const itemId = item._id.toString();
      itemIds.push(itemId);
      itemIdMap.set(itemId, {
        ...item,
        itemShelfDates: item.itemShelfDates || [],
        purchaseData: [],
      });
    }

    if (itemIds.length === 0) {
      return res.status(200).json({ totalCount, data: [] });
    }

    const purchaseOrders = await PurchaseOrder.find({
      isApproved: true,
      'purchasedItems.item_id': { $in: itemIds },
    })
      .select({
        _id: 1,
        draftTime: 1,
        approveTime: 1,
        purchasedItems: 1,
      })
      .lean();

    for (const purchaseOrder of purchaseOrders) {
      const {
        _id: purchaseOrderId,
        draftTime,
        approveTime,
        purchasedItems,
      } = purchaseOrder;

      for (const pItem of purchasedItems) {
        const itemId = pItem.item_id?.toString();

        if (itemId && itemIdMap.has(itemId)) {
          const itemData = {
            purchaseOrderId,
            draftTime,
            approveTime,
            ...pItem,
          };
          itemIdMap.get(itemId).purchaseData.push(itemData);
        }
      }
    }

    const finalData = Array.from(itemIdMap.values());

    return res.status(200).json({
      totalCount,
      success: true,
      data: finalData,
    });
  } catch (err) {
    console.error('Error fetching items with purchase data:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
