import { Request, Response } from 'express';
import { DealerModel } from '../db-models/dealer-model';
import { CompanyModel } from '../db-models/company-model';
import { BrandModel } from '../db-models/brand-model';
import { Types } from 'mongoose';
import { dealerCatalogBrand, dealerCatalogCompany, dealerCatalogDealer } from '../types';

export const getDealerCatalog = async (req: Request, res: Response) => {
    try {
        const { type = "dealer" } = req.body;

        const [dealers, companies, brands, totalDealers, totalCompanies, totalBrands] = await Promise.all([
            DealerModel.find().lean() as Promise<dealerCatalogDealer[]>,
            CompanyModel.find().lean() as Promise<dealerCatalogCompany[]>,
            BrandModel.find().lean() as Promise<dealerCatalogBrand[]>,
            DealerModel.countDocuments(),
            CompanyModel.countDocuments(),
            BrandModel.countDocuments()
        ]);

        const brandMap = new Map(brands.map(brand => [brand._id.toString(), brand]));
        const companyMap = new Map(companies.map(company => [company._id.toString(), company]));
        const dealerMap = new Map(dealers.map(dealer => [dealer._id.toString(), dealer]));

        const brandToDealers = new Map<string, dealerCatalogDealer[]>();
        const companyToDealers = new Map<string, dealerCatalogDealer[]>();
        const brandToCompanies = new Map<string, dealerCatalogBrand[]>();

        dealers.forEach(dealer => {
            if (!dealer._id) return;

            dealer.dealerBrands?.forEach((brandId: Types.ObjectId) => {
                if (!brandId) return;
                const brandIdStr = brandId.toString();
                if (!brandToDealers.has(brandIdStr)) {
                    brandToDealers.set(brandIdStr, []);
                }
                brandToDealers.get(brandIdStr)?.push(dealer);
            });

            dealer.dealerCompanies?.forEach((companyId: Types.ObjectId) => {
                if (!companyId) return;
                const companyIdStr = companyId.toString();
                if (!companyToDealers.has(companyIdStr)) {
                    companyToDealers.set(companyIdStr, []);
                }
                companyToDealers.get(companyIdStr)?.push(dealer);
            });
        });

        brands.forEach(brand => {
            if (!brand._id) return;
            if (brand.companyId) {
                const companyIdStr = brand.companyId.toString();
                if (!brandToCompanies.has(companyIdStr)) {
                    brandToCompanies.set(companyIdStr, []);
                }
                brandToCompanies.get(companyIdStr)?.push(brand);
            }
        });

        switch (type) {
            case 'dealer':
                const formattedDealers = dealers.map(dealer => ({
                    dealerName: dealer.dealerName,
                    _id: dealer._id,
                    dealerNumber: dealer.dealerNumber,
                    brands: dealer.dealerBrands?.filter(brandId => brandId).map(brandId => ({
                        _id: brandId,
                        brandName: brandMap.get(brandId.toString())?.brandName
                    })) || [],
                    companies: dealer.dealerCompanies?.filter(companyId => companyId).map(companyId => ({
                        _id: companyId,
                        companyName: companyMap.get(companyId.toString())?.companyName
                    })) || []
                }));

                return res.status(200).json({
                    success: true,
                    data: {
                        type: "dealer",
                        dealers: formattedDealers,
                        counts: {
                            dealers: totalDealers,
                            companies: totalCompanies,
                            brands: totalBrands
                        }
                    }
                });

            case 'company':
                const companyDetails = companies.map(company => {
                    if (!company._id) return null;
                    const companyBrands = brandToCompanies.get(company._id.toString()) || [];
                    const dealersWithBrands = new Set<string>();
                    
                    companyBrands.forEach(brand => {
                        if (!brand._id) return;
                        const dealers = brandToDealers.get(brand._id.toString()) || [];
                        dealers.forEach(dealer => {
                            if (dealer._id) dealersWithBrands.add(dealer._id.toString());
                        });
                    });

                    const dealersWithCompany = companyToDealers.get(company._id.toString()) || [];
                    dealersWithCompany.forEach(dealer => {
                        if (dealer._id) dealersWithBrands.add(dealer._id.toString());
                    });

                    const uniqueDealers = Array.from(dealersWithBrands).map(dealerId => {
                        const dealer = dealerMap.get(dealerId);
                        if (!dealer) return null;
                        return {
                            _id: dealer._id,
                            dealerName: dealer.dealerName,
                            dealerNumber: dealer.dealerNumber
                        };
                    }).filter((dealer): dealer is NonNullable<typeof dealer> => dealer !== null);

                    return {
                        companyName: company.companyName,
                        _id: company._id,
                        dealers: uniqueDealers,
                        brands: companyBrands.map(brand => ({
                            _id: brand._id,
                            brandName: brand.brandName
                        }))
                    };
                }).filter((company): company is NonNullable<typeof company> => company !== null);

                return res.status(200).json({
                    success: true,
                    data: {
                        type: "company",
                        companies: companyDetails,
                        counts: {
                            dealers: totalDealers,
                            companies: totalCompanies,
                            brands: totalBrands
                        }
                    }
                });

            case 'brand':
                const brandDetails = brands.map(brand => {
                    if (!brand._id) return null;
                    const dealersWithBrand = brandToDealers.get(brand._id.toString()) || [];
                    const company = brand.companyId ? companyMap.get(brand.companyId.toString()) : null;

                    return {
                        brandName: brand.brandName,
                        _id: brand._id,
                        companies: company ? [{
                            _id: company._id,
                            companyName: company.companyName
                        }] : [],
                        dealers: dealersWithBrand.map(dealer => ({
                            _id: dealer._id,
                            dealerName: dealer.dealerName,
                            dealerNumber: dealer.dealerNumber
                        }))
                    };
                }).filter((brand): brand is NonNullable<typeof brand> => brand !== null);

                return res.status(200).json({
                    success: true,
                    data: {
                        type: "brand",
                        brands: brandDetails,
                        counts: {
                            dealers: totalDealers,
                            companies: totalCompanies,
                            brands: totalBrands
                        }
                    }
                });

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid type parameter. Use "dealer", "company", or "brand"'
                });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}