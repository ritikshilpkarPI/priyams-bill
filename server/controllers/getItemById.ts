import { Request, Response } from "express";
import { Item } from "../db-models/item-model";

export const getItemById = async (req: Request, res: Response) => {
    try {
        const itemId = req.params.id;
        const item = await Item.findById(itemId);
        if(!item) return res.status(400).json({ msg: "invalid item id" });
        return res.status(200).json({ item });
    } catch (error) {
        res.status(400).json({ error });
    }
}