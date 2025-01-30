import { NextFunction, Request, Response } from "express";

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.cookie('token', '', {
      expires: new Date(Date.now()),
    });
    res.status(200).json({
      success: true,
      message: 'Logout successfully',
    });
  } catch (error) {
    next(error)
  }
};
