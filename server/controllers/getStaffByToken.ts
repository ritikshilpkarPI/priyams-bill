import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "server/types";

import { NotFound } from '../util/errors';
import Staff from '../db-models/staff-model';

export const getStaffByToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { username } = req.user || {} ;

    const user = await Staff.findOne({ username });
    if (!user) {
      throw new NotFound("Username doesn't exist");
    }
    const token = user.getJwtToken();
    const expireTime = Number(process.env.COOKIE_TIME) || 3;
    const options = {
      expires: new Date(
        Date.now() + expireTime * 24 * 60 * 60 * 1000
      ),
    };
    res.status(200).cookie('token', token, options).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
