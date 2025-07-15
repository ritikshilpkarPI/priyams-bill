import { Request, Response } from 'express';
import { createAutoLowStockPOs } from '../services/autoLowStockPOService';

export const checkLowStockAndCreateAutoPO = async (req: Request, res: Response) => {
  try {
    const { storeId, staffId } = req.body;
    if (!storeId) {
      return res.status(400).json({ success: false, message: 'storeId is required' });
    }
    const result = await createAutoLowStockPOs({ storeId, staffId });
    return res.status(200).json({ success: true, ...result });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Error checking low stock items and creating auto POs', error: err.message });
  }
}; 