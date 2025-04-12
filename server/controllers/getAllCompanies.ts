import { Request, Response } from 'express';
import { CompanyModel } from '../db-models/company-model';

export const getAllCompanies = async (_: Request, res: Response) => {
  try {
    const companies = await CompanyModel.find({});
    res.status(200).json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
