import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BrandModel } from '../db-models/brand-model';
import { CompanyModel } from '../db-models/company-model';

export const getAllBrands = async (req: Request, res: Response) => {
  const { companyId } = req.query;

  try {
    // If companyId is provided, validate it
    if (companyId) {
      if (!mongoose.Types.ObjectId.isValid(companyId as string)) {
        return res.status(400).json({ error: 'Invalid companyId format' });
      }
      // Check if company exists
      const companyExists = await CompanyModel.exists({ _id: companyId });
      if (!companyExists) {
        return res.status(404).json({ error: 'Company not found' });
      }
      const brands = await BrandModel.find({ companyId });
      return res.status(200).json(brands);
    }

    // If no companyId, return all brands
    const allBrands = await BrandModel.find();
    res.status(200).json(allBrands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};