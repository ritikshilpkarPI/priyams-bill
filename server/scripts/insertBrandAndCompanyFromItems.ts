import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { Item } from '../db-models/item-model';
import { BrandModel } from '../db-models/brand-model';
import { CompanyModel } from '../db-models/company-model';
import dotenv from 'dotenv';

dotenv.config();

const {
  ENV_NAME = '',
  NODE_ENV = '',
  STAGING_DB = '',
  PROD_DB = '',
  DEV_DB = '',
} = process.env;

const mongoUriEnvMap: { [key: string]: string } = {
  staging: STAGING_DB,
  production: PROD_DB,
  dev: DEV_DB,
};

const MONGODB_URI = mongoUriEnvMap[ENV_NAME] || mongoUriEnvMap[NODE_ENV] || '';

const queryMongoDB = async (callBack: ()=>Promise<void>) => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    await callBack()
  } catch (error) {
    console.error('Error in ',callBack.name,' :', error);
  } finally {
    mongoose.disconnect();
    console.log('Connection closed');
    process.exit();
  }
};
/**
 *  Insert companies and brands from item collection
 *  And then update items with mapped companyId and brandId
 */
const insertBrandAndCompanyFromItems = async () => {
  try {
    const items = await Item.find(
      {
        $or: [
          { itemBrandName: { $ne: null } },
          { companyName: { $ne: null } },
        ],
      },
      'itemBrandName companyName'
    );

    const brandSet = new Set<string>();
    const brandCompanyPairs: { brand: string; company?: string }[] = [];
    const companySet = new Set<string>();

    for (const item of items) {
      const brand = item.itemBrandName?.trim();
      const company = item.companyName?.trim();

      if (brand) {
        brandSet.add(brand);
        brandCompanyPairs.push({ brand, company });
      }
      if (company) {
        companySet.add(company);
      }
    }

    // Fetch and insert companies
    const existingCompanies = await CompanyModel.find({
      companyName: { $in: Array.from(companySet) },
    });

    const companyMap = new Map<string, mongoose.Types.ObjectId>();
    for (const company of existingCompanies) {
      companyMap.set(company.companyName, company._id);
    }

    // Insert missing companies
    const newCompanies = Array.from(companySet).filter((name) => !companyMap.has(name));
    const companyDocs = newCompanies.map((name) => ({ companyName: name }));

    const insertedCompanies = await CompanyModel.insertMany(companyDocs, { ordered: false });
    for (const company of insertedCompanies) {
      companyMap.set(company.companyName, company._id);
      console.log(`Inserted company: ${company.companyName}`);
    }

    // Fetch and insert brands
    const existingBrands = await BrandModel.find({
      brandName: { $in: Array.from(brandSet) },
    });

    const brandMap = new Map<string, mongoose.Types.ObjectId>();
    for (const brand of existingBrands) {
      brandMap.set(brand.brandName, brand._id);
    }

    const newBrands = brandCompanyPairs
      .filter(({ brand }) => !brandMap.has(brand))
      .map(({ brand, company }) => ({
        brandName: brand,
        ...(company ? {companyId: companyMap.get(company)} : {}),
      }));

    const insertedBrands = await BrandModel.insertMany(newBrands, { ordered: false });
    for (const brand of insertedBrands) {
      brandMap.set(brand.brandName, brand._id);
      console.log(`Inserted brand: ${brand.brandName}`);
    }

    // Bulk update items
    const bulkUpdates = [];

    for (const item of items) {
      const brand = item.itemBrandName?.trim();
      const company = item.companyName?.trim();

      const brandId = brand ? brandMap.get(brand) : undefined;
      const companyId = company ? companyMap.get(company) : undefined;

      const updateFields: any = {};
      if (brandId) updateFields.brandId = brandId;
      if (companyId) updateFields.companyId = companyId;

      if (Object.keys(updateFields).length > 0) {
        bulkUpdates.push({
          updateOne: {
            filter: { _id: item._id },
            update: { $set: updateFields },
          },
        });
      }
    }

    if (bulkUpdates.length > 0) {
      await Item.bulkWrite(bulkUpdates);
      console.log(`Bulk updated ${bulkUpdates.length} items.`);
    }

    console.log('Process completed.');
  } catch (error) {
    console.error('Error:', error);
  }
};


const generateBrandsAndCompaniesCsvs = async () => {
  try {
    const items = await Item.find(
      { itemBrandName: { $ne: null }, companyName: { $ne: null } },
      '_id itemBrandName companyName'
    );

    const brandMap = new Map<string, string[]>(); 
    const companyMap = new Map<string, string[]>();
    const brandCompanyMap = new Map<string, { brand: string; company: string }>();

    for (const item of items) {
      const brand = item.itemBrandName?.trim();
      const company = item.companyName?.trim();
      const itemId = item._id.toString();

      if (brand) {
        if (!brandMap.has(brand)) brandMap.set(brand, []);
        brandMap.get(brand)?.push(itemId);
      }

      if (company) {
        if (!companyMap.has(company)) companyMap.set(company, []);
        companyMap.get(company)?.push(itemId);
      }

      if (brand && company) {
        brandCompanyMap.set(`${brand}_${company}`, { brand, company });
      }

    }

    // Generate CSV for brands
    const brandCsvPath = path.join(__dirname, 'Brands.csv');
    const brandCsvHeader = 'Brand,ItemIds\n';
    const brandCsvRows = Array.from(brandMap.entries())
      .map(([brand, ids]) => `"${brand}","${ids.join(',')}"`)
      .join('\n');
    fs.writeFileSync(brandCsvPath, brandCsvHeader + brandCsvRows);
    console.log(`Brand CSV created: ${brandCsvPath}`);

    // Generate CSV for companies
    const companyCsvPath = path.join(__dirname, 'Companies.csv');
    const companyCsvHeader = 'Company,ItemIds\n';
    const companyCsvRows = Array.from(companyMap.entries())
      .map(([company, ids]) => `"${company}","${ids.join(',')}"`)
      .join('\n');
    fs.writeFileSync(companyCsvPath, companyCsvHeader + companyCsvRows);
    console.log(`Company CSV created: ${companyCsvPath}`);

    // Generate CSV for companies
    const brandCompanyCsvPath = path.join(__dirname, 'brand-company.csv');
    const brandCompanyCsvHeader = 'Company,Brand\n';
    const brandCompanyCsvRows = Array.from(brandCompanyMap.values())
      .map(({ brand, company }) => `"${company}","${brand}"`)
      .join('\n');

    fs.writeFileSync(brandCompanyCsvPath, brandCompanyCsvHeader + brandCompanyCsvRows);
    console.log(`Brand-Company CSV created: ${brandCompanyCsvPath}`);
  } catch (error) {
    console.error('Error generating CSVs:', error);
  }
};


// queryMongoDB(insertBrandAndCompanyFromItems);

queryMongoDB(generateBrandsAndCompaniesCsvs);
