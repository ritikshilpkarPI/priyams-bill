import mongoose from 'mongoose';
import { queryMongoDB } from '../util/queryMongoDb';
import purchaseOrderModel from '../db-models/purchase-order-model';
import { BrandModel } from '../db-models/brand-model';
import { CompanyModel } from '../db-models/company-model';
import { DealerModel } from '../db-models/dealer-model';

const updateDealersAndPurchaseOrders = async () => {
  try {
    const purchaseOrders = await purchaseOrderModel.find({}).lean();

    for (const po of purchaseOrders) {
      const dealerId = po.dealerId;

      const updatedItems = [];
      const brandIdsSet = new Set<string>();
      const companyIdsSet = new Set<string>();

      for (const item of po.purchasedItems) {
        if (!item.brand || !item.companyName) continue;

        const [brand, company] = await Promise.all([
          BrandModel.findOne({ brandName: item.brand }),
          CompanyModel.findOne({ companyName: item.companyName }),
        ]);

        if (brand && company) {
          updatedItems.push({
            updateOne: {
              filter: {
                _id: po._id,
                'purchasedItems.barcode': item.barcode,
              },
              update: {
                $set: {
                  'purchasedItems.$.brandId': brand._id,
                  'purchasedItems.$.companyId': company._id,
                },
              },
            },
          });

          brandIdsSet.add(brand._id.toString());
          companyIdsSet.add(company._id.toString());
        }
      }

      if (updatedItems.length > 0) {
        await purchaseOrderModel.bulkWrite(updatedItems);
      }

      if (dealerId && (brandIdsSet.size > 0 || companyIdsSet.size > 0)) {
        await DealerModel.updateOne(
          { _id: dealerId },
          {
            $addToSet: {
              dealerBrands: {
                $each: Array.from(brandIdsSet).map(
                  (id) => new mongoose.Types.ObjectId(id)
                ),
              },
              dealerCompanies: {
                $each: Array.from(companyIdsSet).map(
                  (id) => new mongoose.Types.ObjectId(id)
                ),
              },
            },
          }
        );
      }
    }

    console.log('Update completed.');
  } catch (error) {
    console.error('Error updating dealers and purchase orders:', error);
  }
};

queryMongoDB(updateDealersAndPurchaseOrders);
