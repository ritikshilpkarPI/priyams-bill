import { Request, Response } from 'express';
import PurchaseOrder from '../db-models/purchase-order-model';

export const combinePOsController = async (req: Request, res: Response) => {
  try {
    const { mainPOId, mergePOIds } = req.body;
    if (!mainPOId || !Array.isArray(mergePOIds) || mergePOIds.length === 0) {
      return res.status(400).json({ success: false, message: 'mainPOId and mergePOIds[] are required.' });
    }
    // Fetch main PO
    const mainPO = await PurchaseOrder.findById(mainPOId);
    if (!mainPO) {
      return res.status(404).json({ success: false, message: 'Main PO not found.' });
    }
    // Fetch POs to merge
    const mergePOs = await PurchaseOrder.find({ _id: { $in: mergePOIds } });
    const foundPOIds = mergePOs.map(po => po._id.toString());
    const missingPOIds = mergePOIds.filter(id => !foundPOIds.includes(id));
    if (mergePOs.length === 0) {
      return res.status(404).json({ success: false, message: 'No merge POs found.' });
    }
    // Collect all items from main and merged POs
    const allItems = [...mainPO.purchasedItems];
    for (const po of mergePOs) {
      allItems.push(...po.purchasedItems);
    }

    // Group by item_id
    const itemGroups: Record<string, any[]> = {};
    for (const item of allItems) {
      const key = item.item_id?.toString();
      if (!key) continue;
      if (!itemGroups[key]) itemGroups[key] = [];
      itemGroups[key].push(item);
    }

    // Deep merge function
    function deepMergeItems(items: any[]): any {
      const merged = { ...items[0] };
      for (const item of items.slice(1)) {
        for (const key of Object.keys(item)) {
          if (
            merged[key] === undefined ||
            merged[key] === null ||
            merged[key] === '' ||
            (Array.isArray(merged[key]) && merged[key].length === 0)
          ) {
            merged[key] = item[key];
          }
          // For arrays, merge or prefer the longer one
          if (Array.isArray(merged[key]) && Array.isArray(item[key])) {
            merged[key] = [...new Set([...(merged[key] || []), ...(item[key] || [])])];
          }
        }
      }
      return merged;
    }

    // Deep merge each group
    const mergedItems = Object.values(itemGroups).map((group: any[]) => mainPO.purchasedItems.create(deepMergeItems(group)));

    // Replace purchasedItems
    mainPO.purchasedItems.splice(0, mainPO.purchasedItems.length);
    for (const mergedItem of mergedItems) {
      mainPO.purchasedItems.push(mergedItem);
    }
    mainPO.remark = (mainPO.remark || '') + ' [COMBINED]';
    mainPO.procurementSource = 'COMBINED_AUTO_PO';
    await mainPO.save();
    // Delete merged POs
    await PurchaseOrder.deleteMany({ _id: { $in: foundPOIds } });
    return res.status(200).json({
      success: true,
      mainPOId: mainPO._id,
      mergedCount: mergePOs.length,
      deletedPOs: foundPOIds,
      missingPOs: missingPOIds,
      message: `Merged ${mergePOs.length} POs into main PO.${missingPOIds.length ? ' Some selected POs were not found and skipped: ' + missingPOIds.join(', ') : ''}`
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}; 