import { Request, Response } from 'express';
import { DealerModel } from '../db-models/dealer-model';

export const getAllDealers = async (req: Request, res: Response) => {
    try {
        const dealers = await DealerModel.find().populate(['dealerBrands', 'dealerCompanies']);
        return res.status(200).json({ success: true, dealers });
    } catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
};
