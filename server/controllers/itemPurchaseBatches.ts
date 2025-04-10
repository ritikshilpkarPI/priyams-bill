import { Request, Response } from 'express';
import { Types } from 'mongoose';
import PurchaseOrder from '../db-models/purchase-order-model';
import { Item } from '../db-models/item-model';
import { toObjectId } from '../util/toObjectId';
import { getShelfLifeInfo } from '../util/calculateItemSelfLife';
import { ItemData, PurchasedItem } from '../types';

export const itemPurchaseBatches = async (req: Request, res: Response) => {
  try {
    const { item_id : filterItemId } = req.query;

    const query: Record<string, unknown> = { isApproved: true };
    if (filterItemId) {
      query['purchasedItems.item_id'] = filterItemId.toString();
    }

    const purchaseOrders = await PurchaseOrder.find(query);
    const result: Record<string, ItemData[]> = {};

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

        const { totalShelfLife, leftShelfLife } = getShelfLifeInfo(mfgDate, expiryDate);

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
          result[sku] = [];
        }

        result[sku].push(itemData);
      }
    }

    res.json(result);
  } catch (err) {
    console.error('Error fetching itemPurchaseBatches:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
