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

export const addNewOrderAPI = async (data: any) => {
  try {
    const response = await postAPI({
      path: API_PATHS.PURCHASE_ORDER.POST_ADD_NEW_ORDER,
      data
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
}

export const updateOrderDetailsAPI = async (data: any) => {
  try {
    const response = await postAPI({
      path: API_PATHS.PURCHASE_ORDER.POST_UPDATE_DETAILS,
      data
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
}

export const saveOrderAPI = async (purchaseOrderData: any) => {
  try {
    const response = await postAPI({
      path: API_PATHS.PURCHASE_ORDER.POST_SAVE_ORDER,
      data: { new_order: purchaseOrderData }
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
}

export const getPurchaseOrderDetailsAPI = async (purchaseOrderId: string) => {
  try {
    const response = await getAPI({
      path: `${API_PATHS.PURCHASE_ORDER.GET_ORDER_DETAILS}/${purchaseOrderId}`
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
}

export const updatePurchaseOrderByIdAPI = async (purchasedItemData: PurchasedItemDetailFormType, id: string) => {
  try {
    const response = await postAPI({
      path: `${API_PATHS.PURCHASE_ORDER.POST_UPDATE_SAVED_ORDER}/${id}`,
      data: { new_order: purchasedItemData }
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
}

export const deletePurchaseOrderItemByIdAPI = async (purchaseOrderId: string, purchasedItemId: string) => {
  try {
    const response = await postAPI({
      path: `${API_PATHS.PURCHASE_ORDER.POST_DELETE_ITEM}/${purchaseOrderId}`,
      data: {
        itemId: purchasedItemId
      }
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
}

export const updatePurchaseOrderItemByIdxAPI =  async (purchaseOrderId: string, purchasedItemIdx: number, purchaseOrderData: PurchasedItemDetailFormType) => {
  try {
    const response = await postAPI({
      path: `${API_PATHS.PURCHASE_ORDER.POST_UPDATE_ORDER_BY_INDEX}/${purchaseOrderId}`,
      data: {
        new_order: purchaseOrderData,
        index: purchasedItemIdx
      }
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
}

export const getItemByIdAPI = async (itemId: string) => {
  try {
    const response = await getAPI({
      path: `${API_PATHS.ITEMS.GET_ITEM_BY_ID}/${itemId}`,
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
}