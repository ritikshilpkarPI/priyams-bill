import { Request, Response } from 'express';
import { DealerModel } from '../db-models/dealer-model';
import { MESSAGES } from '../constants/messages';

export const addNewDealer = async (req: Request, res: Response) => {
    try {
        const { dealerName, dealerBrands = [], dealerCompanies = [], dealerNumber } = req.body;

        if (!dealerName || !dealerNumber) {
            return res.status(400).json({ success: false, message: MESSAGES.MISSING_REQUIRED_FIELDS });
        }

        // ✅ Create Dealer
        const dealer = await DealerModel.create({
            dealerName,
            dealerBrands,
            dealerCompanies,
            dealerNumber
        });

        return res.status(201).json({ success: true, message: MESSAGES.DEALER_CREATED_SUCCESSFULLY, dealer });
    } catch (error) {
        return res.status(500).json({ success: false, message: error });
    }
};
