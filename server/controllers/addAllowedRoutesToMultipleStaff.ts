import { NextFunction, Request, Response } from "express";
import Staff from "../db-models/staff-model";

export const addAllowedRoutesToMultipleStaff = async (req:Request, res: Response, next: NextFunction) => {
    try {
      const { data, commonRoutes } = req.body;
  
      if (commonRoutes && Array.isArray(commonRoutes) && Array.isArray(data)) {
        await Promise.all(data.map(async (username) => {
          const staff = await Staff.findOne({ username });
          if (staff) {
            staff.allowedRoutes = Array.from(new Set([...staff.allowedRoutes, ...commonRoutes]));
            await staff.save();
          }
        }));
        return res.json({ message: 'Common routes added to multiple staff' });
      }
  
      if (Array.isArray(data)) {
        await Promise.all(data.map(async ({ username, routes }) => {
          if (!username || !Array.isArray(routes)) return;
          const staff = await Staff.findOne({ username });
          if (staff) {
            staff.allowedRoutes = Array.from(new Set([...staff.allowedRoutes, ...routes]));
            await staff.save();
          }
        }));
        return res.json({ message: 'Routes added to specific staff successfully' });
      }
  
      res.status(400).json({ message: 'Invalid input format' });
    } catch (err) {
        next(err);
    }
  };