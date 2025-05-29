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
import mongoose from 'mongoose';

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

    const transaction = await StockTransactionModel.findById(id).lean();
    if (!transaction || transaction.isDeleted) {
      return res
        .status(404)
        .json({ success: false, message: MESSAGES.TRANSACTION_NOT_FOUND });
    }

    const [sourceExists, destinationExists] = await Promise.all([
      updateData.source?.sourceEntityId 
        ? StoreModel.exists({ _id: updateData.source.sourceEntityId })
        : Promise.resolve(true),
      updateData.destination?.destinationEntityId
        ? StoreModel.exists({ _id: updateData.destination.destinationEntityId })
        : Promise.resolve(true)
    ]);

    if (!sourceExists) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid sourceEntityId' });
    }

    if (!destinationExists) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid destinationEntityId' });
    }

    const restrictedFields = [
      '_id',
      'createdAt',
      'updatedAt',
      '__v',
      'isDeleted',
    ];
    restrictedFields.forEach((field) => delete updateData[field]);

    if (updateData.approvedByAdmin && updateData.transactionItems?.length) {
      const itemsToTransfer = [];
      const destinationItemsToTransfer = [];

      for (const txnItem of updateData.transactionItems) {
        const sourceTotalQty = txnItem.itemByDate?.reduce(
          (sum: number, entry: any) => sum + (entry.sourceQuantity?.qty || 0),
          0
        );

        const destTotalQty = txnItem.itemByDate?.reduce(
          (sum: number, entry: any) => sum + (entry.destinationQuantity?.qty || 0),
          0
        );

        if (sourceTotalQty && txnItem.itemId) {
          
          const itemId = typeof txnItem.itemId === 'object' && txnItem.itemId !== null
            ? txnItem.itemId._id || txnItem.itemId.id
            : txnItem.itemId;
          
          itemsToTransfer.push({
            itemId: String(itemId),
            quantity: sourceTotalQty,
            itemShelfDates: txnItem.itemByDate?.map((entry: any) => ({
              expiryDate: entry.sourceQuantity?.expiryDate,
              manufacturingDate: entry.sourceQuantity?.manufacturingDate,
              quantityToAdd: entry.sourceQuantity?.qty,
              initialStockQuantity: entry.sourceQuantity?.qty,
              currentStockQuantity: entry.sourceQuantity?.qty,
            })),
          });
        }

        if (destTotalQty && txnItem.itemId) {
      
          const itemId = typeof txnItem.itemId === 'object' && txnItem.itemId !== null
            ? txnItem.itemId._id || txnItem.itemId.id
            : txnItem.itemId;
          
          destinationItemsToTransfer.push({
            itemId: String(itemId),
            quantity: destTotalQty,
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

      const updatePromises = [];

      if (
        !itemsToTransfer.length &&
        ((sourceType === CONSTANTS.STORE && destinationType === CONSTANTS.STORE) ||
          (sourceType === CONSTANTS.WAREHOUSE && destinationType === CONSTANTS.WAREHOUSE))
      ) {
        updatePromises.push(
          updateDestination({
            userId: user?._id.toString(),
            items: destinationItemsToTransfer,
            destinationType,
            destinationEntityId: destinationEntityId.toString(),
            transactionId: transaction._id.toString()
          })
        );
      } else if (
        itemsToTransfer.length > 0 &&
        ((sourceType === CONSTANTS.STORE && destinationType === CONSTANTS.STORE) ||
          (sourceType === CONSTANTS.WAREHOUSE && destinationType === CONSTANTS.WAREHOUSE))
      ) {
        updatePromises.push(
          updateSource({
            userId: user?._id.toString(),
            items: itemsToTransfer,
            sourceType,
            sourceEntityId: sourceEntityId.toString(),
            transactionId: transaction._id.toString()
          })
        );
      } else if (itemsToTransfer.length > 0) {
        updatePromises.push(
          updateSource({
            userId: user?._id.toString(),
            items: itemsToTransfer,
            sourceType,
            sourceEntityId: sourceEntityId.toString(),
            transactionId: transaction._id.toString()
          }),
          updateDestination({
            userId: user?._id.toString(),
            items: itemsToTransfer,
            destinationType,
            destinationEntityId: destinationEntityId.toString(),
            transactionId: transaction._id.toString()
          })
        );
      }

      await Promise.all(updatePromises);
    }

    const updateFields: any = {};
    if (adminRemark !== undefined) {
      transaction.adminRemark = adminRemark;
      transaction.transactionStatus = CONSTANTS.TRANSACTIONS_STATUS.DESTINATION_UPDATED;
    }

    const updatedTransaction = await StockTransactionModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...updateData, ...updateFields } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: MESSAGES.TRANSACTION_UPDATED_SUCCESSFULLY,
      transaction: updatedTransaction,
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
