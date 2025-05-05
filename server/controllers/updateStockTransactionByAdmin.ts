import { Request, Response } from 'express';
import { StockTransactionModel } from '../db-models/stock-transaction-model';
import { StoreModel } from '../db-models/store-model';
import { MESSAGES } from '../constants/messages';
import { AuthenticatedRequest } from 'server/types';
import { transferStockToWarehouse } from '../util/transferStockToWarehouse.ts';
import { transferStockToStore } from '../util/transferStockToStore';
import { subtractFromSourceInventory } from '../util/subtractFromSourceInventory';
import { CONSTANTS } from '../constants/constants';


export const updateStockTransactionByAdmin = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user = req.user;

    const { transactionId: id, adminRemark, stockTransaction: updateData } = req.body;
    

    const transaction = await StockTransactionModel.findById(id);
    if (!transaction || transaction.isDeleted) {
      return res
        .status(404)
        .json({ success: false, message: MESSAGES.TRANSACTION_NOT_FOUND });
    }

    if (updateData.source?.sourceEntityId) {
      const storeExists = await StoreModel.exists({
        _id: updateData.source.sourceEntityId,
      });
      if (!storeExists) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid sourceEntityId' });
      }
    }

    if (updateData.destination?.destinationEntityId) {
      const storeExists = await StoreModel.exists({
        _id: updateData.destination.destinationEntityId,
      });
      if (!storeExists) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid destinationEntityId' });
      }
    }

    const restrictedFields = [
      '_id',
      'createdAt',
      'updatedAt',
      '__v',
      'isDeleted',
    ];
    restrictedFields.forEach((field) => delete updateData[field]);

    //  Merge incoming fields
    for (const key in updateData) {
      if (
        typeof updateData[key] === 'object' &&
        !Array.isArray(updateData[key])
      ) {
        transaction.set(key, {
          ...(transaction.get(key) as object),
          ...updateData[key],
        });
      } else {
        (transaction as any)[key] = updateData[key];
      }
    }

    
    if (updateData.approvedByAdmin && updateData.transactionItems?.length) {
        const itemsToTransfer = [];
  
        for (const txnItem of updateData.transactionItems) {
          const totalQty = txnItem.itemByDate?.reduce(
            (sum: number, entry: any) => {
              return sum + (entry.sourceQuantity?.qty || 0);
            },
            0
          );
  
          if (totalQty && txnItem.itemId) {
            itemsToTransfer.push({
              itemId: txnItem.itemId,
              quantity: totalQty,
              itemShelfDates: txnItem.itemByDate?.map((entry: any) => ({
                expiryDate: entry.sourceQuantity?.expiryDate,
                manufacturingDate: entry.sourceQuantity?.manufacturingDate,
                quantityToAdd: entry.sourceQuantity?.qty,
                initialStockQuantity: entry.sourceQuantity?.qty,
                currentStockQuantity: entry.sourceQuantity?.qty,
              })),
            });
          }
        }
  
        if (itemsToTransfer.length > 0) {
          const { sourceType, destinationType } = updateData;
  
          if (updateData?.destination?.destinationType === CONSTANTS.WAREHOUSE) {
            await transferStockToWarehouse({
              items: itemsToTransfer,
              storeId: updateData?.source?.sourceEntityId,
              userId: user?._id,
            });
          } else if (updateData?.destination?.destinationType === CONSTANTS.DEALER) {
            await subtractFromSourceInventory({
              items: itemsToTransfer,
              storeId: updateData?.source?.sourceEntityId,
              userId: user?._id,
              sourceType: sourceType === CONSTANTS.WAREHOUSE ? CONSTANTS.WAREHOUSE : CONSTANTS.STORE,
              transactionId: transaction._id,
            });
          } else {
            await transferStockToStore({
              items: itemsToTransfer,
              storeId: updateData?.destination?.destinationEntityId,
              userId: user?._id,
              transactionId: transaction._id,
            });
          }
        }
      }

      if (adminRemark !== undefined) {
        transaction.adminRemark = adminRemark;
        transaction.transactionStatus = 'approved';
      }
  
  

    await transaction.save();

    return res.status(200).json({
      success: true,
      message: MESSAGES.TRANSACTION_UPDATED_SUCCESSFULLY,
      transaction,
    });
  } catch (error: any) {
    console.error('Admin update error:', error);
    return res
      .status(500)
      .json({ success: false, message: error?.message || 'Unknown error', error: MESSAGES.SERVER_ERROR});
  }
};
