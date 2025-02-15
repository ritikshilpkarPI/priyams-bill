import { Request, Response } from "express";
import purchaseOrderModel from "../db-models/purchase-order-model";
import { Item } from "../db-models/item-model";

export const getItemsSku = async (req: Request, res: Response) => {
    try {
        const items = await Item.find({ sku: { $exists: true } }, { sku: 1 });
        const purchaseOrders = await purchaseOrderModel.find({ "purchasedItems.sku": { $exists: true }, isApproved: false, isRejected: false }, { "purchasedItems.sku": 1 });
        const itemsSku = items.map(items => items.sku);
        purchaseOrders.map((purchaseOrder) => {
            const purchasedItemsSku = purchaseOrder.purchasedItems.map(purchasedItem => purchasedItem.sku)
            itemsSku.push(...purchasedItemsSku);
        })
        res.status(200).json({ itemsSku: itemsSku });
    } catch (err) {
        res.status(400).json({ err })
    }
}