import { Response, Request, NextFunction } from "express";
import Staff from "../db-models/staff-model";

export const removeAllowedRoutes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, routes = [], removeAllRoutes = false } = req.body;
  
      if (!username) return res.status(400).json({ message: 'username is required' });
  
      const staff = await Staff.findOne({ username });
      if (!staff) return res.status(404).json({ message: 'Staff not found' });
  
      if (removeAllRoutes) {
        staff.allowedRoutes = [];
      } else if (Array.isArray(routes) && routes.length > 0) {
        staff.allowedRoutes = staff.allowedRoutes.filter((route:string) => !routes.includes(route));
      } else {
        return res.json({ message: 'No routes removed' });
      }
  
      await staff.save();
      res.json({ message: 'Routes updated successfully', allowedRoutes: staff.allowedRoutes });
    } catch (err) {
        next(err);
    }
  };