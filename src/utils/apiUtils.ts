import { getAPI, postAPI } from './apiMethods';
import { API_PATHS } from './constants/apiPaths';

export const getUserDataAPI = async () => {
  try {
    const response = await getAPI({
      path: API_PATHS.BILLING.GET_USER_DETAILS,
    });
    return response;
  } catch (err) {
    return { isError: true, err };
  }
};

export const getBillingLeanItemsAPI = async () => {
  try {
    const response = await getAPI({
      path: API_PATHS.INVENTORY.GET_ITEMS_LEAN_FOR_BILLING,
    });
    
    return response.message;
  } catch (err) {
    return { isError: true, err };
  }
};

export const saveOrCacheBillAPI = async (data: SaveBillAPIDataType) => {
  try {
    const response = await postAPI({
      path: API_PATHS.BILLING.SAVE_OR_CACHE_BILL,
      data,
    });
    return response;
  } catch (err) {
    return { isError: true, err };
  }
};

export const createRzpQrCodeAPI = async (data: CreateRzpQRAPIDataType) => {
  try {
    const response = await postAPI({
      path: API_PATHS.RAZORPAY.QR,
      data,
    });
    return response;
  } catch (err) {
    return { isError: true, err };
  }
};

export const getItemsSellDetailsByPurchaseOrderIdAPI = async (
  purchaseOrderId: string,
  intervals: IntervalPropInterface[]
) => {
  try {
    const response = await postAPI({
      path: `${API_PATHS.PURCHASE_ORDER.GET_ITEM_SOLD}/${purchaseOrderId}`,
      data: { intervals },
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const getItemsSkuAPI = async () => {
  try {
    const response = await getAPI({
      path: API_PATHS.ITEMS.GET_ITEMS_SKU
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
}