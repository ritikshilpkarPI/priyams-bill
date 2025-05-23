import { toast } from 'react-toastify';
import {
  setExpiredItems,
  setLoading,
} from 'src/redux/expiredItems/expiredItemsSlice';
import { getAPI, postAPI } from './apiMethods';
import { API_PATHS } from './constants/apiPaths';
import { getUserDetails, getUserDeviceInfo } from './getUserDeviceInfo';
import { AppDispatch } from 'src/redux/store';
import { API_METHODS } from './constants/apiMethods';
import { genericAxios } from './genericAxiosMethod';
import { parseJwt } from './cookie';
import Cookies from 'js-cookie';
import MESSAGES from './constants/messages';
import { CONSTANTS } from '../constants/constants';
import { getServerBaseUrl } from './getServerBaseUrl';
import axios from 'axios';

export const getBillingLeanItemsAPI = async (selectedStoreId?: string, storeId?: string, sourceType?:string ) => {
  try {
  
    let path = '';

    if (sourceType === CONSTANTS.WAREHOUSE) {
      path = `${API_PATHS.INVENTORY.GET_ITEMS_LEAN_FOR_BILLING}?storeId=''&storeCode=''&pincode=''`;
    } else {
      const pincode = localStorage.getItem('userPincode') || '';
      path = `${API_PATHS.INVENTORY.GET_ITEMS_LEAN_FOR_BILLING}?storeId=${storeId || ''}&storeCode=${selectedStoreId || ''}&pincode=${pincode || ''}`;
    }
    const response = await getAPI({path});
    return response.message;
  } catch (err) {
    return { isError: true, err };
  }
};

export const saveOrCacheBillAPI = async (data: SaveBillAPIDataType) => {
  try {
    const storeData = localStorage.getItem('storeData');
    if (!storeData) {
      return toast.error(MESSAGES.STOREDATA_IS_REQUIRED);
    }
    const parsedStoreData = storeData ? JSON.parse(storeData) : null;
    const requestData = { ...data, storeData: parsedStoreData };

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
  index?: number
) => {
  try {
    const formData = new FormData();

    formData.append(
      'data',
      JSON.stringify({
        paymentMethod,
        purchaseData: paymentDetails,
      })
    );

    if (paymentImages?.length) {
      paymentImages.forEach((image) => {
        formData.append('paymentImages', image);
      });
    }

    const response = await postAPI({
      path: `${API_PATHS.PAYMENT.POST_UPDATE_PAYMENT_BY_ID}/${purchaseOrderId}`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const deletePaymentByIdAPI = async (
  purchaseOrderId: string,
  paymentMethod: string,
  paymentId: string
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

export const transferStockToStoreAPI = async (
  selectedStoreId: string,
  items: any[]
) => {
  try {
    const response = await postAPI({
      path: API_PATHS.INVENTORY.POST_TRANSFER_STOCK_TO_STORE,
      data: {
        items,
        collectionName: selectedStoreId,
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
};
export const getAllStaffsAPI = async () => {
  try {
    const response = await getAPI({
      path: API_PATHS.STAFF.GET_STAFFS,
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};


export const getAllStaffsByStoreIdAPI = async (storeId: string)=>{
  try {
    let finalStoreId;
    if (!storeId.length){
    const storedStoreDataString = localStorage.getItem('storeData');

    if (!storedStoreDataString) {
      throw new Error(MESSAGES.NO_STORE_DATA_FOUND_IN_LOCAL_STORAGE);
    }

    const storeData = JSON.parse(storedStoreDataString);
    finalStoreId = storeData._id;
  }else{
    finalStoreId = storeId
  }
    const response = await getAPI({
      path: `${API_PATHS.STAFF.GET_STAFFS}/${finalStoreId}`,
    });

    return response;
  } catch (error) {
    
    return { isError: true, error };
  }
};
export const fetchExpiredItems =
  (startDate: Date, endDate: Date) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await postAPI({
        path: API_PATHS.INVENTORY.POST_FILTER_EXPIRY_DATES,
        data: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        },
      });

      dispatch(setExpiredItems(response?.message?.expiredItems || []));
    } catch (err) {
      console.log('Error fetching expired items', err);
      dispatch(setExpiredItems([]));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getAllCompaniesAPI = async () => {
  try {
    const response = await getAPI({
      path: API_PATHS.COMPANY.GET_ALL_COMPANY,
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const getAllBrandsAPI = async () => {
  try {
    const response = await getAPI({
      path: API_PATHS.BRAND.GET_ALL_BRAND,
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const getAllDealersAPI = async () => {
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
          storeCode: CONSTANTS.WAREHOUSE_COLLECTION_NAME,
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

export const itemPurchaseBatchesAPI = async ({
  page,
  limit,
  itemId,
  itemNameOrBarcode,
}: {
  page?: number;
  limit?: number;
  itemId?: string;
  itemNameOrBarcode?: string;
}
) => {
  try {    
    const params = new URLSearchParams();
    if (itemId) params.append('item_id', itemId);
    if (itemNameOrBarcode) params.append('itemNameOrBarcode', itemNameOrBarcode);
    if (typeof page === 'number') params.append('page', page.toString());
    if (typeof limit === 'number') params.append('limit', limit.toString());

    const response:any = await genericAxios({
      url: `${API_PATHS.ITEMS.GET_ITEM_PURCHASE_BATCHES}?${params.toString()}`,
      method: API_METHODS.GET,
    });
    return response.data;
  } catch (error) {
    return { isError: true, error };
  }
};

export const itemPurchaseBatchesWebAPI = async ({
  page,
  limit,
  itemId,
  itemNameOrBarcode,
}: {
  page?: number;
  limit?: number;
  itemId?: string;
  itemNameOrBarcode?: string;
}) => {
  try {
    const queryParams: Record<string, string> = {};
    if (itemId) queryParams['item_id'] = String(itemId);
    if (itemNameOrBarcode) queryParams['itemNameOrBarcode'] = String(itemNameOrBarcode);
    if (typeof page === 'number') queryParams['page'] = String(page);
    if (typeof limit === 'number') queryParams['limit'] = String(limit);

    const queryString = new URLSearchParams(queryParams).toString();
    const pathWithParams = `${API_PATHS.ITEMS.GET_ITEM_PURCHASE_BATCHES}${queryString ? '?' + queryString : ''}`;

    const response = await getAPI({ 
      path: pathWithParams 
    });

    // Return the entire response object, as it likely contains { data: T[], totalCount: number, ... }
    return response; 
  } catch (error: any) {
    return {
      isError: true,
      error: error.response?.data || error.message || 'Unknown error',
    };
  }
};

export const getItemsFromStoreInventoryAPI = async (  
  storeId: string, 
  query: { size: number; page: number; itemNameOrBarcode: string }
) => {
  try {
    const params = new URLSearchParams({
      size: String(query.size),
      page: String(query.page),
      itemNameOrBarcode: query.itemNameOrBarcode || '',
    });

    const response = await getAPI({
      path: `${API_PATHS.STORE.GET_ITEMS_BY_STORE_ID}/${storeId}?${params.toString()}`,
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
}


export const getStockTransactions = async ({
  startDate,
  endDate,
  storeId,
  page = 1,
  limit = 100,
  itemIds = []
}: StockTransactionParams) => {
  try {
    const data: any = {
      storeId,
      page,
      limit,
    };
    if (startDate) data.startDate = startDate.toISOString();
    if (endDate) data.endDate = endDate.toISOString();
    if (itemIds.length > 0) data.itemId = itemIds;

    const response = await postAPI({
      path: API_PATHS.STOCK_TRANSACTION.GET_STOCK_TRANSACTIONS,
      data
    });

    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const getItemTransactions = async ({
  storeIds = [],
  page = 1,
  limit = 100,
  itemIds = []
}: StockTransactionParams) => {
  try {
    const response = await postAPI({
      path: API_PATHS.STOCK_TRANSACTION.GET_ITEM_TRANSACTIONS,
      data: {
        storeIds,
        page,
        limit,
        itemIds
      }
    });

    return response;
  } catch (error) {
    return { isError: true, error };
  }
};
export const addNewStockTransactionsAPI = async (
  StockTransaction: StockTransactionType
) => {

  try {
    const response = await postAPI({
      path: API_PATHS.STOCK_TRANSACTION.ADD_NEW_STOCK_TRANSACTION,
      data: {
        transactions: [StockTransaction],
      },
    });
    return response;
    
  } catch (error) {
    return { isError: true, error };
  }
}


export const getStockTransactionsApi = async (
  transactionsId: string
) => {
  try {
    const response = await postAPI({
      path: API_PATHS.STOCK_TRANSACTION.GET_STOCK_TRANSACTIONS,
      data: {
        transactionId: [transactionsId],
      }
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const updateStockTransactionsAPI = async (
  transactionsId: string,
  itemByDate: any,
) => {

   const data = {
    transactionId: transactionsId,
    itemByDate,
  };
  try {

  const response = await postAPI({
    path: API_PATHS.STOCK_TRANSACTION.UPDATE_DESTINATION,
    data,
  });
  return response;
  } catch (error) {
    return { isError: true, error };
  }

}

export const approveStockTransactionsAPI = async (
  transactionsId: string,
  approvedByAdmin: boolean,
  adminRemark: string,
  stockTransaction: StockTransactionType
) => {
     const data = {
      transactionId: transactionsId,
      adminRemark,
      stockTransaction
      };
  try {
    const response = await postAPI({
      path: API_PATHS.STOCK_TRANSACTION.PUT_UPDATE_STOCK_TRANSACTION,
      data,
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
}

export const getStockTransactionsByStatusApi = async (
  status:string,
  page:number,
  limit:number,
) => {
  try {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (typeof page === 'number') params.append('page', page.toString());
    if (typeof limit === 'number') params.append('limit', limit.toString());
    const response = await postAPI({
      path: `${API_PATHS.STOCK_TRANSACTION.GET_STOCK_TRANSACTIONS_BY_STATUS}?${params.toString()}`,
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const getAllExpiryItemsBatchAPI = async (queryParams: ExpiryItemsQueryParams = {}) => {
  try {
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const pathWithQuery = `${API_PATHS.EXPIRED_ITEMS_BATCH.GET_ALL_EXPIRED_ITEMS_BATCH}?${queryString}`;

    const response = await getAPI({ path: pathWithQuery });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const getExpiryItemsBatchByIdAPI = async (
  id: string
) => {
  try {
    const response = await getAPI({
      path: `${API_PATHS.EXPIRED_ITEMS_BATCH.GET_EXPIRED_ITEMS_BATCH_BY_ID}/${id}`,
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};

export const updateItemMismatchInStockAPI = async (
  storeId: string,
  item: {
    itemsId: string;
    expiryDate: string;
    manufacturingDate: string;
    currentStockQuantity: number;
    updateQuantity: number;
  },
  type?: string
) => {
  try {
    const response = await postAPI({
      path: API_PATHS.STOCK_TRANSACTION.MISMATCH_STOCK_TRANSACTION,
      data: {
        storeId,
        item: {
          itemId: item.itemsId,
          expiryDate: item.expiryDate,
          manufacturingDate: item.manufacturingDate,
          currentCount: item.currentStockQuantity,
          updateCount: item.updateQuantity,
        },
        ...(type && { type }),
      },
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
};


export const addNewStockTransactionsBySourceAPI = async (
  transactionsId: string,
  transactionItems: any
  ) => {
  try {
    const response = await postAPI({
      path: API_PATHS.STOCK_TRANSACTION.UPDATE_STOCK_TRANSACTION_BY_SOURCE,
      data: {
        transactionsId,
        transactionItems,
      },
    });
    return response;
  } catch (error) {
    return { isError: true, error };
  }

}

export const getStaffByToken = async ()=>{
  await genericAxios({
    url: API_PATHS.STAFF.GET_STAFF_BY_TOKEN,
  })
};


export const addNewExpiredItemsBatchAPI = async (data: any) => {
  try {    
    const response = await postAPI({
      path: API_PATHS.EXPIRED_ITEM.CREATE_EXPIRED_ITEMS_BATCH,
      data,
    });

    return response;
  } catch (error) {
    return { isError: true, error };
  }
}
export const getBillFeedAPI = async (
  page?: number,
  size?: number,
  startDate?: string,
  endDate?: string,
  storeId?: string
) => {
  const path = `${API_PATHS.BILLING.GET_BILL_FEED}?page=${page || ''}&size=${size || ''}&startDate=${startDate || ''
    }&endDate=${endDate || ''}&storeId=${storeId || ''}`;

  try {
    const response = await getAPI({ path });
    return response;
  } catch (error) {
    return { isError: true, error };
  }
}



export const markExpiryItemsBatchClearedAPI = async (
  id: string,
  data: {
    clearanceDetails: any
    statusChangeRemark?: string
    staffId: string
    browser: string
    os: string
    ipReferrer: string
  }
) => {
  try {
    const response = await postAPI({
      path: `${API_PATHS.EXPIRED_ITEMS_BATCH.MARK_EXPIRED_ITEMS_BATCH_CLEARED_BY_ID}/${id}`,
      data,
    })
    return response
  } catch (error) {
    return { isError: true, error }
  }
}
