import { Request, Response } from "express";
import { Item } from "../db-models/item-model";

export const getItemsSku = async (req: Request, res: Response) => {
    try {
        const items = await Item.find({ sku: { $exists: true } }, { sku: 1 });
        const itemsSku = items.map(items => items.sku);
        res.status(200).json({ itemsSku: itemsSku });
    } catch (err) {
        res.status(400).json({ err })
    }
}