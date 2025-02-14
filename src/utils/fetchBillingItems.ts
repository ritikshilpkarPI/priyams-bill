import { AppDispatch } from "src/redux/store";
import { getBillingLeanItemsAPI } from "./apiUtils";
import { setItemsFeedData } from "src/redux/allItemsFeedData/allItemsFeedDataSlice";

export const fetchBillingItems = () => async (dispatch: AppDispatch) => {
    try {
      const response = await getBillingLeanItemsAPI();
      if (response && !response.isError) {
        dispatch(setItemsFeedData(response));
      } else {
        console.error(response.err || 'Something went wrong');
      }
    } catch (error: any) {
        console.error(error);
    }
  };
