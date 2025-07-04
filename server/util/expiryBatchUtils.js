import ExpiredItemsBatch from '../db-models/expired-items-batch-model';
import { expiredStatus } from '../util/constants/expiredItemsConstant';

/**
 * Mark expiry batches as cleared after PO approval.
 * @param {Array} expiryBatches - Array of expiry batch IDs
 * @param {string|ObjectId} purchaseOrderId - The PO ID that cleared the batch
 * @param {string} clearanceReason - Reason for clearance (e.g., 'Order Approved')
 * @param {string} staffId - Staff ID performing the clearance
 * @param {string} browser - Browser info
 * @param {string} os - OS info
 * @param {string} ipReferrer - IP or referrer
 * @param {string} statusChangeRemark - Remark for status change
 */
export async function addClearanceToExpiryBatches(
  expiryBatches,
  purchaseOrderId,
  clearanceReason = 'Order Approved',
  staffId = null,
  browser = '',
  os = '',
  ipReferrer = '',
  statusChangeRemark = ''
) {
  for (const batchId of expiryBatches) {
    try {
      const batch = await ExpiredItemsBatch.findById(batchId);
      if (!batch) continue;
      batch.status = expiredStatus.CLEARED;
      batch.isCleared = true;
      batch.purchaseOrderId = purchaseOrderId;
      batch.clearanceDetails = {
        ...(batch.clearanceDetails || {}),
        clearanceReason,
        clearedOn: new Date(),
      };
      batch.statusHistory = batch.statusHistory || [];
      batch.statusHistory.push({
        status: expiredStatus.CLEARED,
        staffId,
        dateTime: new Date(),
        browser,
        os,
        ipReferrer,
        statusChangeRemark,
      });
      await batch.save();
    } catch (err) {
      console.error('Failed to add clearance to expiry batch', batchId, err);
    }
  }
}

module.exports = { addClearanceToExpiryBatches }; 