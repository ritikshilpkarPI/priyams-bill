import { BrandModel } from '../db-models/brand-model';
import { CompanyModel } from '../db-models/company-model';

export const createBrandAndCompany = async (
  companyName: string,
  brandName: string
) => {
  try {
    let company = await CompanyModel.findOne({ companyName });
    console.log(company);
    
    if (!company) {
      company = await CompanyModel.create({ companyName });
    }
    let brand = await BrandModel.findOne({ brandName });
    console.log(company);
    if (!brand) {
        brand = await BrandModel.create({
        brandName,
        companyId: company._id,
      });
    }
    return { company, brand, success: true, error: '' };
  } catch (error) {
    return {
      company: null,
      brand: null,
      success: false,
      error: error,
    };
  }
};
