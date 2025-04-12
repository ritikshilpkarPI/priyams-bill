import { Request, Response } from 'express';
import { Types } from 'mongoose';
import PurchaseOrder from '../db-models/purchase-order-model';
import { Item } from '../db-models/item-model';
import { toObjectId } from '../util/toObjectId';
import { getShelfLifeInfo } from '../util/calculateItemSelfLife';
import { ItemData, PurchasedItem } from '../types';
import { CONSTANTS } from '../constants/constants';

export const itemPurchaseBatches = async (req: Request, res: Response) => {
  try {
    const { item_id: filterItemId, page = '1', limit = '20' } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;
    const skip = filterItemId ? 0 : (pageNumber - 1) * limitNumber;

    // 1. Fetch static item info
    const staticQuery = filterItemId
      ? { _id: toObjectId(filterItemId as string) }
      : {};
    // Get total count
    const totalCount = await Item.countDocuments(staticQuery);

    const items = await Item.find(staticQuery)
      .skip(skip)
      .limit(limitNumber)
      .select(CONSTANTS.STATIC_FIELDS_TO_SELECT);

    // 2. Prepare result and extract item IDs
    const result: Record<
      string,
      { staticData: unknown; purchases: ItemData[] }
    > = {};
    const itemsIdList: string[] = [];

    for (const item of items) {
      if (item.sku) {
        itemsIdList.push(item._id.toString());
        result[item.sku] = {
          staticData: item,
          purchases: [],
        };
      }
    }

    // 3. Build optimized PO query using $in for matching item IDs
    const query: Record<string, unknown> = { isApproved: true };
    if (itemsIdList.length > 0) {
      query['purchasedItems.item_id'] = { $in: itemsIdList };
    }

    const purchaseOrders = await PurchaseOrder.find(query);

    for (const po of purchaseOrders) {
      const poApproveTime = po.approveTime;
      const purchaseOrderId = po._id;
      const purchaseDate = po.createdAt;

      for (const item of po.purchasedItems as PurchasedItem[]) {
        const {
          sku,
          costPrice,
          sellingPrice,
          expiryDates,
          itemQuantity,
          profitPercentage,
          item_id: currentItemId,
        } = item;

        if (!sku) continue;

        if (filterItemId && filterItemId.toString() !== currentItemId) continue;

        const latestExpiry = expiryDates?.[expiryDates.length - 1];
        const mfgDate = latestExpiry?.mfgDate;
        const expiryDate = latestExpiry?.date;

        const { totalShelfLife, leftShelfLife } = getShelfLifeInfo(
          mfgDate,
          expiryDate
        );

        const itemDoc = await Item.findById(toObjectId(currentItemId));
        const totalStockQty = itemDoc?.itemStockQuantity ?? null;

        const itemData: ItemData = {
          cp: costPrice,
          sp: sellingPrice,
          manufacturing: mfgDate,
          expiry: expiryDate,
          qty: itemQuantity,
          totalStockQty,
          profitPercentage,
          purchaseDate,
          totalShelfLife,
          leftShelfLife,
          purchaseOrderId,
          poApproveTime,
        };

        if (!result[sku]) {
          continue;
        }

        result[sku].purchases.push(itemData);
      }
    }

    //Send result + totalCount
    res.json({
      totalCount,
      data: result,
    });
  } catch (err) {
    console.error('Error fetching itemPurchaseBatches:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
