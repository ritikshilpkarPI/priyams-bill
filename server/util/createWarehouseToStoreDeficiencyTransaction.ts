import { Types } from 'mongoose';
import { StockTransactionModel } from '../db-models/stock-transaction-model';
import { StoreModel } from '../db-models/store-model';
import { CONSTANTS } from '../constants/constants';

interface DeficiencyItem {
  itemId: string;
  deficiencyQty: number;
  expiryDate?: Date;
  manufacturingDate?: Date;
}

interface CreateDeficiencyTransactionParams {
  storeId: string;
  staffId: string;
  items: DeficiencyItem[];
}

export async function createWarehouseToStoreDeficiencyTransaction({
  storeId,
  staffId,
  items,
}: CreateDeficiencyTransactionParams) {
  const warehouse = await StoreModel.findOne({ type: 'WAREHOUSE' });
  if (!warehouse) throw new Error('Warehouse store not found');

  const transactionItems = items.map(item => ({
    itemId: new Types.ObjectId(item.itemId),
    itemByDate: [
      {
        sourceQuantity: {
          expiryDate: item.expiryDate || null,
          manufacturingDate: item.manufacturingDate || null,
          qty: 0,
        },
        destinationQuantity: {
          expiryDate: item.expiryDate || null,
          manufacturingDate: item.manufacturingDate || null,
          qty: item.deficiencyQty,
        },
      },
    ],
  }));

  const transaction = await StockTransactionModel.create({
    transactionType: CONSTANTS.IN,
    source: {
      sourceStaff: staffId,
      sourceEntityId: warehouse._id,
      sourceType: CONSTANTS.WAREHOUSE,
    },
    destination: {
      destinationStaff: staffId,
      destinationEntityId: storeId,
      destinationType: CONSTANTS.STORE,
    },
    transactionReason: CONSTANTS.QUANTITY_UPDATE,
    transactionStatus: CONSTANTS.TRANSACTIONS_STATUS.SOURCE_CREATED,
    approvedByAdmin: false,
    transactionItems,
    dateOfTransaction: new Date(),
  });
  return transaction;
} 