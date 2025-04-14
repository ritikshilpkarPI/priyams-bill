import { setExpiredItems, setLoading } from 'src/redux/expiredItems/expiredItemsSlice';
import { getAPI, postAPI } from './apiMethods';
import { API_PATHS } from './constants/apiPaths';
import { getUserDetails, getUserDeviceInfo } from './getUserDeviceInfo';
import { AppDispatch } from 'src/redux/store';
import { API_METHODS } from './constants/apiMethods';
import { genericAxios } from './genericAxiosMethod';
import { parseJwt } from './cookie';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';



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

export const getAllStoresAPI = async () => {
  try {
    const response = await getAPI({
      path: API_PATHS.STORE.GET_ALL_STORES,
    });    
    return response;
  } catch (error) {
    return { isError: true, error };
  }
}

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

export const getAllCompaniesAPI = async ()=>{
  try {
    const response = await getAPI({
      path: API_PATHS.COMPANY.GET_ALL_COMPANY,
    });    
    return response;
  } catch (error) {
    return { isError: true, error };
  }
}

export const getAllBrandsAPI = async ()=>{
  try {
    const response = await getAPI({
      path: API_PATHS.BRAND.GET_ALL_BRAND,
    });    
    return response;
  } catch (error) {
    return { isError: true, error };
  }
}

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
export const fetchExpiredItems = (startDate: Date, endDate: Date) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await postAPI({
      path: API_PATHS.INVENTORY.POST_FILTER_EXPIRY_DATES,
      data: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      },
    });
    

    dispatch(setExpiredItems(response?.message?.expiredItems || [] ));
  } catch (err) {
    console.log('Error fetching expired items', err);
    dispatch(setExpiredItems([]));
  } finally {
    dispatch(setLoading(false));
  }
};
export const handleApiCall = async (
  apiFunc: () => Promise<any>,
  id: string,
  setLoading: (id: string, state: boolean, buttonName: string) => void,
  successMessage: string,
  errorMessage: string,
  onSuccess: () => void,
  buttonName: string
) => {
  try {
    setLoading(id, true, buttonName);
    await apiFunc();
    toast.success(successMessage);
    onSuccess();
  } catch (err) {
    console.error(err);
    toast.error(errorMessage);
  } finally {
    setLoading(id, false, buttonName);
  }
};

export const approvePurchaseOrder = async (
  id: string,
  index: number,
  list: any,
  getOrders: (type: string) => void,
  setLoading: (id: string, state: boolean, buttonName: string) => void
) => {
  await handleApiCall(
    async () =>
      await genericAxios({
        url: API_PATHS.INVENTORY.POST_SAVE_INVENTORY,
        method: API_METHODS.POST,
        data: {
          newItems: list.purchasedItems,
          purchaseOrderId: id,
          userDetail: await getUserDetails(),
        },
      }),
    id,
    setLoading,
    'Order approved successfully',
    'Something went wrong, unable to approve order',
    () => getOrders('draft'),
    'approve'
  );
};

export const rejectPurchaseOrder = async (
  id: string,
  index: number,
  getOrders: (type: string) => void,
  setLoading: (id: string, state: boolean, buttonName: string) => void
) => {
  await handleApiCall(
    async () =>
      await genericAxios({
        method: API_METHODS.POST,
        url: `${API_PATHS.APPROVAL.POST_REJECT_ORDER}/${id}`,
        data: {
          username: parseJwt(Cookies.get('token')).username,
          userDetail: await getUserDetails(),
        },
      }),
    id,
    setLoading,
    'Order rejected successfully',
    'Something went wrong, unable to reject order',
    () => getOrders('rejected'),
    'reject'
  );
};

export const draftPurchaseOrder = async (
  id: string,
  index: number,
  allPurchaseList: any[],
  getOrders: (type: string) => void,
  setLoading: (id: string, state: boolean, buttonName: string) => void
) => {
  if (window.confirm('Do you want to draft this order ?')) {
    const order = allPurchaseList[index];
    console.log({allPurchaseList,index2:index});
    
    let validate = true;
    let once = true;

    if (!order.billAmount || !order.dealerName?.length) {
      alert('please fill payment details information');
      return;
    }

    order.purchasedItems.forEach((item: any) => {
      if (!item.validate) {
        validate = false;
        if (once) {
          alert('Cannot draft orders, please validate the orders');
          once = false;
        }
      }
    });

    if (!validate) return;

    await handleApiCall(
      async () =>
        await genericAxios({
          method: API_METHODS.POST,
          url: API_PATHS.PURCHASE_ORDER.POST_DRAFT_ORDER,
          data: {
            id,
            userDetail: await getUserDetails(),
          },
        }),
      id,
      setLoading,
      'Order drafted successfully',
      'Something went wrong, unable to draft the order',
      () => getOrders('draft'),
      'draft'
    );
  }
};

export const getAllDealersAPI = async ()=>{
  try {
    const response = await getAPI({
      path: API_PATHS.DEALER.GET_ALL_DEALERS,
    });   
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const addNewDealerAPI = async (
  dealerName: string,
  dealerNumber: number,
  dealerBrands: string[] = [],
  dealerCompanies: string[] = []
) => {
  
  try {
    const response = await postAPI({
      path: API_PATHS.DEALER.ADD_NEW_DEALER,
      data: {
        dealerName,
        dealerNumber,
        dealerBrands,
        dealerCompanies,
      },
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};
export const getStockTransactions = async () => {
  try {
    const response = await getAPI({
      path: API_PATHS.STOCK_TRANSACTION.GET_STOCK_TRANSACTIONS,
    });    
    return response;
  } catch (error) {
    return { isError: true, error };
  }
}