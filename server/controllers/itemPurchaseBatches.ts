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

    const staticQuery = filterItemId
      ? { _id: toObjectId(filterItemId as string) }
      : {};

    const totalCount = await Item.countDocuments(staticQuery);

    const items = await Item.find(staticQuery)
      .skip(skip)
      .limit(limitNumber)
      .select(CONSTANTS.STATIC_FIELDS_TO_SELECT);

    const result: Record<string, { staticData: unknown; purchases: ItemData[] }> = {};
    const itemIdToSkuMap: Record<string, string> = {};
    const itemIdToStockMap: Record<string, number | null> = {};

    for (const item of items) {
      const sku = item.sku;
      const itemId = item._id.toString();

      if (sku) {
        result[sku] = { staticData: item, purchases: [] };
        itemIdToSkuMap[itemId] = sku;
        itemIdToStockMap[itemId] = item.itemStockQuantity ?? null;
      }
    }

    const itemIds = Object.keys(itemIdToSkuMap);
    if (itemIds.length === 0) {
      return res.json({ totalCount, data: result });
    }

    const purchaseOrders = await PurchaseOrder.find({
      isApproved: true,
      'purchasedItems.item_id': { $in: itemIds },
    }).select(['_id', 'approveTime', 'createdAt', 'purchasedItems']);

    for (const po of purchaseOrders) {
      const { _id: purchaseOrderId, approveTime: poApproveTime, createdAt: purchaseDate } = po;

      for (const item of po.purchasedItems as PurchasedItem[]) {
        const {
          item_id,
          costPrice,
          sellingPrice,
          expiryDates,
          itemQuantity,
          profitPercentage,
        } = item;

        const itemId = item_id.toString();

        if (!itemIdToSkuMap[itemId]) continue;
        if (filterItemId && filterItemId.toString() !== itemId) continue;

        const expiryDetails = (expiryDates || []).map((ed) => {
          const shelfLife = ed.mfgDate && ed.date
            ? getShelfLifeInfo(ed.mfgDate, ed.date)
            : { totalShelfLife: '', leftShelfLife: '' };
        
          return {
            date: ed.date,
            value: ed.value,
            mfgDate: ed.mfgDate,
            isShelfExpired: ed.isShelfExpired,
            totalShelfLife: shelfLife.totalShelfLife,
            leftShelfLife: shelfLife.leftShelfLife,
          };
        });
        const latestExpiry = expiryDates?.[expiryDates.length - 1];
        const mfgDate = latestExpiry?.mfgDate;
        const expiryDate = latestExpiry?.date;

        let shelfLife;
        if(mfgDate && expiryDate){
           shelfLife = getShelfLifeInfo(mfgDate, expiryDate);
        }

        const itemData: ItemData = {
          cp: costPrice,
          sp: sellingPrice,
          manufacturing: mfgDate,
          expiry: expiryDate,
          qty: itemQuantity,
          totalStockQty: itemIdToStockMap[itemId],
          profitPercentage,
          purchaseDate,
          totalShelfLife: shelfLife?.totalShelfLife ?? "",
          leftShelfLife: shelfLife?.leftShelfLife ?? "",
          purchaseOrderId,
          poApproveTime,
          expiryDetails,
        };

        const itemSku = itemIdToSkuMap[itemId];
        result[itemSku].purchases.push(itemData);
      }
    }

    res.status(200).json({ totalCount, data: result });
  } catch (err) {
    console.error('Error fetching itemPurchaseBatches:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
