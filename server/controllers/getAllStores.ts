import { Request, Response } from "express";
import { StoreModel } from "../db-models/store-model";

export const getAllStores = async (req: Request, res: Response) => {
    try {
    const stores = await StoreModel.find();
    return res.status(200).json({ stores });
    } catch (error) {
        res.status(400).json({ error });
    }

}

