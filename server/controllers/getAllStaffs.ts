import { NextFunction, Request, Response } from 'express';
const Staff = require('../db-models/staff-model');

export const getAllStaffs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const staffs = await Staff.find().select('-password');;
    res.status(200).send({
      success: true,
      data: staffs,
    });
  } catch (error) {
    next(error);
  }
};
