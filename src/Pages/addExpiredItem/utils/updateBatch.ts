import { ITEM_EXPIRY_BATCH_ACTION } from "src/constants/constants"
import { updateExpiredItemsBatchAPI } from "src/utils/apiUtils"
import { getCheckedExpiredItems } from "./getCheckedExpiredItems"

export async function updateBatch(
  id: string,
  actionType: string,
  expiryBatchItems: Record<string, any[]>,
): Promise<string> {
  try {
    switch (actionType) {
      case ITEM_EXPIRY_BATCH_ACTION.APPROVE: {
        const res = await updateExpiredItemsBatchAPI(id, { status: 'APPROVED' })
        if (res?.isError) {
          return res.error?.error ?? 'Failed to approve expired items batch'
        }
        return 'Expired items batch approved successfully'
      }

      case ITEM_EXPIRY_BATCH_ACTION.DRAFT: {
        const res = await updateExpiredItemsBatchAPI(id, { status: 'DRAFTED' })
        if (res?.isError) {
          return res.error?.error ?? 'Failed to draft expired items batch'
        }
        return 'Expired items batch drafted successfully'
      }

      case ITEM_EXPIRY_BATCH_ACTION.UPDATE: {
        const { items, expiryBatchCost } = getCheckedExpiredItems(expiryBatchItems)
        const res = await updateExpiredItemsBatchAPI(id, { items, expiryBatchCost })
        if (res?.isError) {
          return res.error?.error ?? 'Failed to update expired items batch'
        }
        return 'Expired items batch updated successfully'
      }

      default:
        return 'Unknown batch action'
    }
  } catch (err) {
    console.error('getExpiryBatchToastMessage error:', err)
    return 'Failed to update batch'
  }
}
