import { Request, Response } from 'express';
import { handleLowStockAndCreateTransactions } from '../services/lowStockTransactionService';

export const checkLowStockAndCreateTransaction = async (req: Request, res: Response) => {
  try {
    const { storeId, staffId } = req.body;
    if (!storeId) {
      return res.status(400).json({ success: false, message: 'storeId is required' });
    }
    const result = await handleLowStockAndCreateTransactions({ storeId, staffId });
    return res.status(200).json({ success: true, ...result });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Error checking low stock items', error: err.message });
  }
};

