import { StoreModel } from '../db-models/store-model';
import { getStoreInventoryModel } from '../db-models/storeInventory-model';
import { Item } from '../db-models/item-model';
import PurchaseOrder from '../db-models/purchase-order-model';
import { CONSTANTS } from '../constants/constants';

export async function createAutoLowStockPOs({
  storeId,
  staffId,
}: {
  storeId: string;
  staffId: string;
}) {
  const store = await StoreModel.findById(storeId);
  if (!store) throw new Error('Store not found');
  const StoreInventory = getStoreInventoryModel(store.collectionName);
  const inventoryItems = await StoreInventory.find({}).lean();

  // Find low stock items
  const lowStockItems = inventoryItems.filter(item => {
    const sellFrequency = Number((item as any).sellFrequency) || 0;
    let qty = Number((item as any).itemQuantityInStore) || 0;
    if (qty < 0) qty = 0;
    let minStockMultiplier = (item as any).minStockMultiplier;
    if (typeof minStockMultiplier !== 'number' || minStockMultiplier <= 0) {
      minStockMultiplier = 2;
    }
    return sellFrequency > 0 && qty < minStockMultiplier * sellFrequency;
  });

  const createdPOs = [];
  console.log(`Found ${lowStockItems.length} low stock items for auto PO creation.`);
  for (const item of lowStockItems) {
    let minStockMultiplier = (item as any).minStockMultiplier;
    if (typeof minStockMultiplier !== 'number' || minStockMultiplier <= 0) {
      minStockMultiplier = 2;
    }
    let qty = Number((item as any).itemQuantityInStore) || 0;
    if (qty < 0) qty = 0;
    const deficiencyQty = Math.ceil(minStockMultiplier * Number((item as any).sellFrequency)) - qty;

    // Fetch item details
    const itemDoc = await Item.findById(item.itemId);
    if (!itemDoc) {
      console.log(`Item not found for itemId: ${item.itemId}`);
      continue;
    }

    // Check for existing unapproved auto PO for this item
    const existingPO = await PurchaseOrder.findOne({
      procurementSource: 'AUTO_PO_CREATION',
      isApproved: false,
      'purchasedItems.item_id': itemDoc._id.toString(),
    });
    if (existingPO) {
      console.log(`Skipping PO creation for itemId: ${item.itemId} - unapproved AUTO_PO_CREATION PO already exists (PO ID: ${existingPO._id})`);
      continue;
    }

    // Create PO for this item
    const po = new PurchaseOrder({
      purchasedItems: [
        {
          barcode: itemDoc.itemBarcode,
          inputName: itemDoc.itemName,
          sku: itemDoc.sku,
          stockQuantity: deficiencyQty,
          minimumQuantity: itemDoc.minimumStockQuantity,
          unit: itemDoc.quantityUnitName,
          itemRemark: '',
          sellingPrice: itemDoc.itemSellingPricePerUnit,
          mrp: itemDoc.itemMRPperUnit,
          costPrice: itemDoc.itemCostPricePerUnit,
          currentStock: qty,
          validate: false,
          item_id: itemDoc._id.toString(),
          brand: itemDoc.itemBrandName,
          brandId: itemDoc.brandId,
          companyId: itemDoc.companyId,
          category: itemDoc.itemCategory,
          subCategory: itemDoc.subCategory,
          flavourOrFeature: itemDoc.flavourOrFeature,
          freeItemsAvailable: false,
          freeItemsRemarks: '',
          returnPolicyAvailable: false,
          returnPolicyRemarks: '',
          companyName: itemDoc.companyName,
          saleTime: itemDoc.saleTime,
          images: [],
          globalImages: [],
          createdAt: new Date(),
          itemHasExpiry: null,
          expiryDates: [],
          slabPrice: [],
          profitPercentage: 0,
          newItem: false,
        },
      ],
      purchaseDetails: {
        totalPayableAmount: 0,
        totalBillAmount: 0,
        paymentType: '',
        totalItemsCost: 0,
        remark: 'AUTO_PO_CREATION',
        credits: [],
        payments: [],
      },
      remark: 'AUTO_PO_CREATION',
      isDraft: true,
      isApproved: false,
      isRejected: false,
      isPaid: false,
      createdAt: new Date(),
      dealerId: null,
      salesmanId: staffId,
      procurementSource: 'AUTO_PO_CREATION',
    });
    await po.save();
    console.log(`Created PO for itemId: ${item.itemId}, PO ID: ${po._id}`);
    createdPOs.push(po);
  }

  console.log(`Total auto POs created: ${createdPOs.length}`);
  return {
    lowStockItems,
    createdPOs,
    message: `${createdPOs.length} auto POs created for low stock items.`,
    poIds: createdPOs.map(po => po._id),
  };
} 