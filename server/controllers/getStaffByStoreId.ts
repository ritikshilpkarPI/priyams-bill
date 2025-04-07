import { Request, Response } from 'express';
import Staff from '../db-models/staff-model';
import { MESSAGES } from '../constants/messages';

export const getStaffByStoreId = async (req: Request, res: Response) => {
  const { storeId } = req.params;

  try {
    const staffList = await Staff.find({ storeId }).select('-password');

    if (!staffList.length) {
      return res.status(400).json({ message: MESSAGES.NO_STAFF_FOUND });
    }

    return res.status(200).json({
      success: true,
      data: staffList,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
