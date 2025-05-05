import { Request, Response } from 'express';
import PurchaseOrder from '../db-models/purchase-order-model';
import { Item } from '../db-models/item-model';
import { toObjectId } from '../util/toObjectId';
import { getShelfLifeInfo } from '../util/calculateItemSelfLife';
import { ItemData, PurchasedItem, ItemShelfDate } from '../types';
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
      .select(CONSTANTS.STATIC_FIELDS_TO_SELECT)
      .lean();

    const result: Record<
      string,
      { staticData: unknown; purchases: ItemData[] }
    > = {};
    const itemIdToSkuMap: Record<string, string> = {};
    const itemIdToStockMap: Record<string, number | null> = {};
    const shelfDatesBySkuAndPo: Record<
      string,
      Record<string, ItemShelfDate[]>
    > = {};

    for (const it of items) {
      const sku = it.sku as string;
      const itemId = it._id.toString();
      if (!sku) continue;

      result[sku] = { staticData: it, purchases: [] };
      itemIdToSkuMap[itemId] = sku;
      itemIdToStockMap[itemId] = it.itemStockQuantity ?? null;

      // group this item's shelf dates by their purchaseOrderId
      const byPo: Record<string, ItemShelfDate[]> = {};
      for (const sd of (it.itemShelfDates as ItemShelfDate[]) || []) {
        const poId = sd.purchaseOrderId.toString();
        if (!byPo[poId]) byPo[poId] = [];
        byPo[poId].push(sd);
      }
      shelfDatesBySkuAndPo[sku] = byPo;

      if (Object.keys(itemIdToSkuMap).length === 0) {
        return res.json({ totalCount, data: result });
      }
    }

    const itemIds = Object.keys(itemIdToSkuMap);
    if (itemIds.length === 0) {
      return res.json({ totalCount, data: result });
    }

    const purchaseOrders = await PurchaseOrder.find({
      isApproved: true,
      'purchasedItems.item_id': { $in: itemIds },
    }).select(CONSTANTS.PURCHASE_ORDER_FIELDS_TO_SELECT);

    for (const po of purchaseOrders) {
      const {
        _id: purchaseOrderId,
        approveTime: poApproveTime,
        createdAt: purchaseDate,
        dateOnBill,
        draftTime,
      } = po;

      for (const item of po.purchasedItems as PurchasedItem[]) {
        const {
          item_id,
          costPrice,
          sellingPrice,
          itemQuantity,
          profitPercentage,
          sku,
          newItem,
        } = item;

        const itemId = item_id.toString();

        if (!itemIdToSkuMap[itemId]) continue;
        if (filterItemId && filterItemId.toString() !== itemId) continue;

        const expiryDates =
          shelfDatesBySkuAndPo[sku]?.[purchaseOrderId.toString()] ?? [];

        const expiryDetails = expiryDates?.map((ed) => {
          const sl =
            ed.manufacturingDate && ed.expiryDate
              ? getShelfLifeInfo(ed.manufacturingDate, ed.expiryDate)
              : { totalShelfLife: '', leftShelfLife: '' };

          return {
            date: ed.expiryDate,
            value: ed.quantity,
            mfgDate: ed.manufacturingDate,
            currentStockQuantity: ed.currentStockQuantity,
            initialItemQuantity: ed.initialStockQuantity,
            totalShelfLife: sl.totalShelfLife,
            leftShelfLife: sl.leftShelfLife,
          };
        });

        const itemData: ItemData = {
          cp: costPrice,
          sp: sellingPrice,
          qty: itemQuantity,
          profitPercentage,
          purchaseDate,
          purchaseOrderId,
          poApproveTime,
          expiryDetails,
          newItem,
          dateOnBill : dateOnBill ? new Date (dateOnBill): null,
          draftedDate: draftTime ? new Date(draftTime) : null,
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
