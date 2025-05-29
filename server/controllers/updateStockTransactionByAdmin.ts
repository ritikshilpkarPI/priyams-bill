import { Request, Response } from 'express';
import { StockTransactionModel } from '../db-models/stock-transaction-model';
import { StoreModel } from '../db-models/store-model';
import { MESSAGES } from '../constants/messages';
import { AuthenticatedRequest } from 'server/types';
import { transferStockToWarehouse } from '../util/transferStockToWarehouse.ts';
import { transferStockToStore } from '../util/transferStockToStore';
import { subtractFromSourceInventory } from '../util/subtractFromSourceInventory';
import { CONSTANTS } from '../constants/constants';
import { updateDestination } from '../util/updateDestination';
import { updateSource } from '../util/updateSource';

export const updateStockTransactionByAdmin = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user = req.user;

    const {
      transactionId: id,
      adminRemark,
      stockTransaction: updateData,
    } = req.body;

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
        const destinationItemsToTransfer = []

  
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

      for (const txnItem of updateData.transactionItems) {
        const totalQty = txnItem.itemByDate?.reduce(
          (sum: number, entry: any) => {
            return sum + (entry.destinationQuantity?.qty || 0);
          },
          0
        );

        if (totalQty && txnItem.itemId) {
          destinationItemsToTransfer.push({
            itemId: txnItem.itemId,
            quantity: totalQty,
            itemShelfDates: txnItem.itemByDate?.map((entry: any) => ({
              expiryDate: entry.destinationQuantity?.expiryDate,
              manufacturingDate: entry.destinationQuantity?.manufacturingDate,
              quantityToAdd: entry.destinationQuantity?.qty,
              initialStockQuantity: entry.destinationQuantity?.qty,
              currentStockQuantity: entry.destinationQuantity?.qty,
            })),
          });
        }
      }
      const { source, destination } = updateData;
      const { sourceType, sourceEntityId } = source;
      const { destinationType, destinationEntityId } = destination;
      if (
        !itemsToTransfer.length &&
        ((sourceType === CONSTANTS.STORE &&
          destinationType === CONSTANTS.STORE) ||
          (sourceType === CONSTANTS.WAREHOUSE &&
            destinationType === CONSTANTS.WAREHOUSE))
      ){        
        await updateDestination({
          userId: user?._id,
          items: destinationItemsToTransfer,
          destinationType,
          destinationEntityId,
          transactionId: transaction._id
        });
      }
      else if (
        itemsToTransfer.length > 0 && 
        ((sourceType === CONSTANTS.STORE && 
          destinationType === CONSTANTS.STORE) ||
          (sourceType === CONSTANTS.WAREHOUSE &&
            destinationType === CONSTANTS.WAREHOUSE))
      ){        
        await updateSource({
          userId: user?._id,
          items: itemsToTransfer,
          sourceType,
          sourceEntityId,
          transactionId: transaction._id
        });
      }
      else if (itemsToTransfer.length > 0) {     

        await updateSource({
          userId: user?._id,
          items: itemsToTransfer,
          sourceType,
          sourceEntityId,
          transactionId: transaction._id
        });
        await updateDestination({
          userId: user?._id,
          items: itemsToTransfer,
          destinationType,
          destinationEntityId,
          transactionId: transaction._id
        });
      }
    }

   
    if (updateData.approvedByAdmin) {
      transaction.transactionStatus = CONSTANTS.TRANSACTIONS_STATUS.APPROVED;
    } else if (!updateData.approvedByAdmin) {
      transaction.transactionStatus = CONSTANTS.TRANSACTIONS_STATUS.DESTINATION_UPDATED;
    }
      if (adminRemark !== undefined) {
        transaction.adminRemark = adminRemark;
        transaction.transactionStatus = CONSTANTS.TRANSACTIONS_STATUS.APPROVED;
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
      .json({
        success: false,
        message: error?.message || 'Unknown error',
        error: MESSAGES.SERVER_ERROR,
      });
  }
};
