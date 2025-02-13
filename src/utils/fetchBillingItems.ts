import { AppDispatch } from "src/redux/store";
import { getBillingLeanItemsAPI } from "./apiUtils";
import { setItemsFeedData, setLoading } from "src/redux/allItemsFeedData/allItemsFeedDataSlice";

export const fetchBillingItems = () => async (dispatch: AppDispatch) => {
    const MAX_RETRIES = 3;
    let attempts = 0;
    dispatch(setLoading(true)); 
    while (attempts < MAX_RETRIES) {
      try {
        const response = await getBillingLeanItemsAPI();
        if (response && !response.isError) {
          dispatch(setItemsFeedData(response));
          return; 
        } else {
          console.error(response.err || 'Something went wrong');
        }
      } catch (error: any) {
        console.error(`Attempt ${attempts + 1} failed:`, error);
      }
      
      attempts++;
      if (attempts < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, attempts * 500)); 
      }
    }
    dispatch(setLoading(false));
    console.error(`All ${MAX_RETRIES} attempts failed.`);
  };
  