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

export const fetchBillingLeanItems = (selectedStoreId?: string) => async (dispatch: AppDispatch) => {
  let attempts = 0;
  dispatch(setItemsFeedAPILoading(true));

  while (attempts < MAX_RETRIES_BILLING_LEAN_ITEMS_API) {
    try {
      const response = await getBillingLeanItemsAPI(selectedStoreId);
      if (response && !response.isError) {
        dispatch(setItemsFeedData(response));
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
    }

    attempts++;
    if (attempts < MAX_RETRIES_BILLING_LEAN_ITEMS_API) {
      await new Promise((resolve) =>
        setTimeout(resolve, attempts * BILLING_LEAN_ITEMS_API_RETRY_DELAY_MS)
      );
    }
  }

  dispatch(setItemsFeedAPILoading(false));
  console.error(
    `BillingLeanItems API failed after ${MAX_RETRIES_BILLING_LEAN_ITEMS_API} attempts.`
  );
};
