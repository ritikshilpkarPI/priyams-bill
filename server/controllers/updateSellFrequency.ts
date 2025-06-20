import { Request, Response } from 'express';
import { updateSellFrequencyForStore } from '../services/sellFrequencyService';

export const updateSellFrequency = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.body;
    if (!storeId) {
      return res.status(400).json({ success: false, message: 'storeId is required' });
    }
    const result = await updateSellFrequencyForStore(storeId);
    return res.status(200).json({ success: true, ...result });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Error updating sellFrequency', error: err.message });
  }
};
