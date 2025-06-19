import { AppDispatch } from 'src/redux/store';
import {
  setItemsFeedData,
  setItemsFeedAPILoading,
} from 'src/redux/allItemsFeedData/allItemsFeedDataSlice';
import { getBillingLeanItemsAPI } from './apiUtils';
import {
  BILLING_LEAN_ITEMS_API_RETRY_DELAY_MS,
  MAX_RETRIES_BILLING_LEAN_ITEMS_API,
} from './constants/apiConstants';
import { CONSTANTS } from '../constants/constants';
import { setWarehouseItemsFeedAPILoading, setWarehouseItemsFeedData } from '../redux/allItemsFeedData/allWarehouseItemsFeedDataSlice';

export const fetchBillingLeanItems = (selectedStoreId?: string, storeId?: any, sourceType?:string) => async (dispatch: AppDispatch) => {
  let attempts = 0;

    const isWarehouse = sourceType === CONSTANTS.WAREHOUSE;

  while (attempts < MAX_RETRIES_BILLING_LEAN_ITEMS_API) {
    try {
      dispatch(setItemsFeedAPILoading(true));
      dispatch(setWarehouseItemsFeedAPILoading(true));
      const response = await getBillingLeanItemsAPI(selectedStoreId = selectedStoreId ?? "", storeId = storeId ?? "", sourceType = sourceType ?? "");
      if (response && !response.isError) {
        if (isWarehouse) {
          dispatch(setWarehouseItemsFeedData(response));
        } else {
          dispatch(setItemsFeedData(response));
        }
        return;
      } else {
        console.error(
          `BillingLeanItems API Error: ${response.err || 'Unknown error'} (Attempt ${attempts + 1})`
        );
      }
    } catch (error: any) {
      console.error(
        `BillingLeanItems API - Attempt ${attempts + 1} failed due to network error:`,
        error
      );
    } finally {
      dispatch(setItemsFeedAPILoading(false));
      dispatch(setWarehouseItemsFeedAPILoading(false));
    }

    attempts++;
    if (attempts < MAX_RETRIES_BILLING_LEAN_ITEMS_API) {
      await new Promise((resolve) =>
        setTimeout(resolve, attempts * BILLING_LEAN_ITEMS_API_RETRY_DELAY_MS)
      );
    }
  }
  console.error(
    `BillingLeanItems API failed after ${MAX_RETRIES_BILLING_LEAN_ITEMS_API} attempts.`
  );
};
