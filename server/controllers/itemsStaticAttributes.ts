import { NextFunction, Request, Response } from 'express';
import { Item } from '../db-models/item-model';
import { CONSTANTS } from '../constants/constants';
import { MESSAGES } from '../constants/messages';

export const itemsStaticAttributes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (id) {
      const item = await Item.findById(id).select(
        CONSTANTS.STATIC_FIELDS_TO_SELECT
      );

      if (!item) {
        return res.status(404).json({
          success: false,
          message: MESSAGES.NOT_FOUND,
        });
      }

      return res.status(200).json({
        success: true,
        data: [item],
      });
    }

    const items = await Item.find().select(CONSTANTS.STATIC_FIELDS_TO_SELECT);

    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
      error,
    });
  }
};
