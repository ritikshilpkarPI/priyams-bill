import { AppDispatch } from "src/redux/store";
import { getBillingLeanItemsAPI } from "./apiUtils";
import { setBillingItems } from "src/redux/bill/billSlice";

export const fetchBillingItems = () => async (dispatch: AppDispatch) => {
    try {
      const response = await getBillingLeanItemsAPI();
      if (response && !response.isError) {
        dispatch(setBillingItems(response));
      } else {
        throw new Error(response.err || 'Something went wrong');
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };
