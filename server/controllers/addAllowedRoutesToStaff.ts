import { Response, Request, NextFunction } from "express";
import Staff from "../db-models/staff-model";

export const addAllowedRoutesToStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, allowedRoutes } = req.body;

    if (!username || !Array.isArray(allowedRoutes)) {
      return res.status(400).json({ message: 'username and allowedRoutes (array) are required' });
    }

    const staff = await Staff.findOne({ username });
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    const updatedRoutes = Array.from(new Set([...staff.allowedRoutes, ...allowedRoutes]));
    staff.allowedRoutes = updatedRoutes;
    await staff.save();

    res.json({ message: 'Routes added successfully' });
  } catch (err) {
    next(err)
  }
};
