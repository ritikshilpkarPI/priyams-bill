import { getAPI, postAPI } from './apiMethods';
import { API_PATHS } from './constants/apiPaths';
import { getUserDeviceInfo } from './getUserDeviceInfo';



export const getBillingLeanItemsAPI = async () => {
  try {
    const pincode = localStorage.getItem('userPincode');
    const response = await getAPI({
      path: `${API_PATHS.INVENTORY.GET_ITEMS_LEAN_FOR_BILLING}?pincode=${pincode}`,
    });

    return response.message;
  } catch (err) {
    return { isError: true, err };
  }
};

export const saveOrCacheBillAPI = async (data: SaveBillAPIDataType) => {
  try {
    const storeData = localStorage.getItem('storeData');
    const parsedStoreData = storeData ? JSON.parse(storeData) : null;
    const requestData = { ...data, storeData:parsedStoreData };

    const response = await postAPI({
      path: API_PATHS.BILLING.SAVE_OR_CACHE_BILL,
      data: requestData,
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
      path: API_PATHS.ITEMS.GET_ITEMS_SKU,
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const addNewOrderAPI = async (data: AddNewOrderAPIArgs) => {
  try {
    const response = await postAPI({
      path: API_PATHS.PURCHASE_ORDER.POST_ADD_NEW_ORDER,
      data,
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const updateOrderDetailsAPI = async (data: UpdateOrderAPIArgs) => {
  try {
    const response = await postAPI({
      path: API_PATHS.PURCHASE_ORDER.POST_UPDATE_DETAILS,
      data,
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const saveOrderAPI = async (
  purchaseOrderData: PurchaseOrderDataType
) => {
  try {
    const response = await postAPI({
      path: API_PATHS.PURCHASE_ORDER.POST_SAVE_ORDER,
      data: { new_order: purchaseOrderData },
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const getPurchaseOrderDetailsAPI = async (purchaseOrderId: string) => {
  try {
    const response = await getAPI({
      path: `${API_PATHS.PURCHASE_ORDER.GET_ORDER_DETAILS}/${purchaseOrderId}`,
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const updatePurchaseOrderByIdAPI = async (
  purchasedItemData: PurchasedItemDetailFormType,
  id: string
) => {
  try {
    const response = await postAPI({
      path: `${API_PATHS.PURCHASE_ORDER.POST_UPDATE_SAVED_ORDER}/${id}`,
      data: { new_order: purchasedItemData },
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const deletePurchaseOrderItemByIdAPI = async (
  purchaseOrderId: string,
  purchasedItemId: string
) => {
  try {
    const response = await postAPI({
      path: `${API_PATHS.PURCHASE_ORDER.POST_DELETE_ITEM}/${purchaseOrderId}`,
      data: {
        itemId: purchasedItemId,
      },
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const updatePurchaseOrderItemByIdxAPI = async (
  purchaseOrderId: string,
  purchasedItemIdx: number,
  purchaseOrderData: PurchasedItemDetailFormType
) => {
  try {
    const response = await postAPI({
      path: `${API_PATHS.PURCHASE_ORDER.POST_UPDATE_ORDER_BY_INDEX}/${purchaseOrderId}`,
      data: {
        new_order: purchaseOrderData,
        index: purchasedItemIdx,
      },
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const getItemByIdAPI = async (itemId: string) => {
  try {
    const response = await getAPI({
      path: `${API_PATHS.ITEMS.GET_ITEM_BY_ID}/${itemId}`,
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};



export const updatePOPaymentAPI = async (
  paymentDetails: PaymentDetailType,
  paymentMethod: string,
  purchaseOrderId: string,
  paymentImages?: File[],
  index?: number,
) => {
  try {
    const formData = new FormData();

    formData.append('data', JSON.stringify({
      paymentMethod,
      purchaseData: paymentDetails,
    }));

    if (paymentImages?.length) {
      paymentImages.forEach((image) => {
        formData.append('paymentImages', image);
      });
    }

    const response = await postAPI({
      path: `${API_PATHS.PAYMENT.POST_UPDATE_PAYMENT_BY_ID}/${purchaseOrderId}`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const deletePaymentByIdAPI = async (
  purchaseOrderId: string,
  paymentMethod: string,
  paymentId: string,
) => {
  try {
    const response = await postAPI({
      path: `${API_PATHS.PAYMENT.POST_DELETE_PAYMENT_BY_ID}/${purchaseOrderId}`,
      data: {
        paymentMethod,
        paymentId,        
      },
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const draftOrderByIdAPI = async (purchaseOrderId: string) => {
  try {
    const response = await postAPI({
      path: API_PATHS.PURCHASE_ORDER.POST_DRAFT_ORDER,
      data: {
        id: purchaseOrderId,
        userDetail: await getUserDeviceInfo(),
      },
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const transferStockToStoreAPI = async (selectedStoreId:string, items:any[])=>{
  try {
    const response = await postAPI({
      path: API_PATHS.INVENTORY.POST_TRANSFER_STOCK_TO_STORE,
      data:{
        items,
        collectionName:selectedStoreId,
      },
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
}

export const getAllStoresAPI = async () => {
  try {
    const response = await getAPI({
      path: API_PATHS.STORE.GET_ALL_STORES,
    });   
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};
export const getAllStaffsAPI = async ()=>{
  try {
    const response = await getAPI({
      path: API_PATHS.STAFF.GET_STAFFS,
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
}