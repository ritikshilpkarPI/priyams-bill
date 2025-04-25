import React, { useEffect, useState } from 'react';
import {
  Title,
  Button,
  Group,
  Paper,
  Box,
  Flex,
  Grid,
  Text,
  Textarea,
  Chip,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { ItemSearch } from '../../components/ItemSearch';
import { StoreSelect } from '../../components/StoreSelect';
import { InventoryItemPanel } from '../../components/InventoryItemPanel';
import {
  setSelectedStore,
  addInventoryItem,
  updateInventoryItemQuantity,
  removeInventoryItem,
  setStores,
  setDestinationStaff,
  setSourceStaff,
  resetStoreStockInventory,
} from '../../redux/storeInventoryManagement/storeInventoryManagementSlice';
import {
  addNewStockTransactionsAPI,
  approveStockTransactionsAPI,
  getAllStaffsByStoreIdAPI,
  getAllStoresAPI,
  getStockTransactionsApi,
  updateStockTransactionsAPI,
} from '../../utils/apiUtils';
import { useMediaQuery } from '@mantine/hooks';
import { getYupValidationErrorMap } from '../../utils/getYupValidationErrorMap';
import { fetchBillingLeanItems } from 'src/utils/fetchBillingLeanItems';
import { AppDispatch } from '../../redux/store';
import { toast } from 'react-toastify';
import {
  addTransactionDestination,
  addTransactionItem,
  addTransactionSource,
  removeTransactionItem,
  resetStoreInventory,
  setTransactionData,
  updateTransactionItemQuantity,
} from '../../redux/stockTransactionManagement/StockTransactionManagement';
import StoreInventoryForm from 'src/components/storeInventoryForm/StoreInventoryForm';
import {
  destinationValidation,
  sourceValidation,
  transactionReasonValidation,
} from 'src/utils/validations/StoreInventoryManagementValidation';
import { useNavigate, useParams } from 'react-router';
import { isAdmin } from 'src/utils/isAdmin';
import * as Yup from 'yup';
import MESSAGES from 'src/utils/constants/messages';

const StoreInventoryManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const storeInventory = useSelector(
    (state: RootState) => state.storeInventoryManagement
  );

  const selectedStoreId = useSelector(
    (state: RootState) => state.storeInventoryManagement.selectedStoreId
  );
  const inventoryItems = useSelector(
    (state: RootState) => state.storeInventoryManagement.inventoryItems
  );

  const stockTransaction = useSelector(
    (state: RootState) => state.stockTransaction
  );

  const stores = useSelector(
    (state: RootState) => state.storeInventoryManagement.stores
  );

  const transactionItems = useSelector(
    (state: RootState) => state.stockTransaction.transactionItems
  );

  const transactionSource = useSelector(
    (state: RootState) => state.stockTransaction.source
  );

  const transactionDestination = useSelector(
    (state: RootState) => state.stockTransaction.destination
  );

  const sourceStaff = useSelector(
    (state: RootState) => state.storeInventoryManagement.sourceStaff
  );
  const destinationStaff = useSelector(
    (state: RootState) => state.storeInventoryManagement.destinationStaff
  );

  const params = useParams();
  const transactionId = params?.id;

  const isAdminUser = transactionId ? isAdmin() : false;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await getAllStoresAPI();
        if (!res.stores) {
          showNotification({ message: 'No stores found', color: 'red' });
          return;
        }
        dispatch(setStores(res.stores));
      } catch (error) {
        showNotification({ message: 'Failed to load stores', color: 'red' });
      }
    };

    fetchStores();
  }, [dispatch]);

  const [errors, setErrors] = useState<YupValidationErrorMapType>({});
  const [loading, setLoading] = useState(false);

  const handleStoreChange = (storeId: string) => {
    dispatch(setSelectedStore(storeId));
  };

  const handleItemSelect = (item: ItemWithQuantity) => {
    // Check if item already exists in the inventory items
    if (
      inventoryItems.find(
        (invItem) => invItem.itemDetail._id === item.itemDetail._id
      )
    ) {
      showNotification({ message: 'Item already added', color: 'yellow' });
      return;
    }

    const newTransactionItem: TransactionItemType = {
      itemId: item.itemDetail._id ?? '',
      itemBarcode: item.itemDetail.itemBarcode ?? '',
      itemMRPperUnit: item.itemDetail.itemMRPperUnit ?? 0,
      itemName: item.itemDetail.itemName ?? '',
      itemQtyInStore: item.itemDetail.itemQtyInStore ?? 0,
      itemStockQuantity: item.itemDetail.itemStockQuantity ?? 0,
      itemSellingPricePerUnit: item.itemDetail.itemSellingPricePerUnit ?? 0,
      itemShelfDates: item.itemDetail.itemShelfDates ?? [],
      totalQtyAdd: 0,
      sku: item.itemDetail.sku ?? '',
      itemByDate: item.itemDetail.itemShelfDates
        ? item.itemDetail.itemShelfDates.map((shelf) => ({
            sourceQuantity: {
              expiryDate: shelf.expiryDate,
              manufacturingDate: shelf.manufacturingDate,
              qty: shelf.quantityToAdd,
              quantity: shelf.quantity,
            },
            shelfId: shelf._id,
          }))
        : [],
    };
    dispatch(addTransactionItem(newTransactionItem));
  };

  const handleQuantityChange = (
    itemId: string,
    quantity: number,
    shelfId?: string
  ) => {
    dispatch(updateTransactionItemQuantity({ itemId, quantity, shelfId }));
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeTransactionItem(itemId));
  };
  const convertToItemsArray = () => {
    const itemsArray = [];
    for (const item of inventoryItems) {
      itemsArray.push({
        itemId: item.itemDetail._id,
        quantity: item.quantityToAdd,
        itemShelfDates: item?.itemShelfDates ?? [],
      });
    }
    return itemsArray;
  };

 

  const validateStockTransactionData = async () => {
    try {
  
       await sourceValidation.validate(transactionSource, {
        abortEarly: false, 
      });
       await destinationValidation.validate(
        transactionDestination,
        {
          abortEarly: false,
        }
      );
      
       await transactionReasonValidation.validate(
        stockTransaction.transactionReason,
        {
          abortEarly: false,
        }
      );
      
      if (!transactionItems.length) {
         toast.error(MESSAGES.AT_LEAST_ONE_TRANSACTION_ITEM_REQUIRED)
      }

     const totalItemsQuantity = transactionItems.reduce((acc, curr: any) => {      
      return acc + curr.totalQtyAdd;
      }, 0);
      if (totalItemsQuantity === 0) {
        toast.error(MESSAGES.AT_LEAST_ONE_TRANSACTION_ITEM_REQUIRED)
        return true;
      }
  
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const formattedErrors = error.inner.reduce((acc: Record<string, string>, curr) => {          
          if (curr.path || curr.message) {
            acc[curr.path ?? ''] = curr.message;
            toast.error(curr.message); 
          }

          return acc;
        }, {} as Record<string, string>);  
        return formattedErrors;
      } else {
        console.error('Unexpected error during validation:', error);
      }
    }
  };
  
  const onSubmitTransaction = async () => {
    const errors =  await validateStockTransactionData();
    if(!errors){      
    setLoading(true);
     await addNewStockTransactionsAPI(stockTransaction);
    setLoading(false);
    navigate('/stockTransactions');
    }
   
  };

  const onChangeTransactionSource = (field: string, value: string | number) => {
    dispatch(addTransactionSource({ ...transactionSource, [field]: value }));
  };
  const onChangeTransactionDestination = (
    field: string,
    value: string | number
  ) => {
    dispatch(
      addTransactionDestination({ ...transactionDestination, [field]: value })
    );
  };

  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const storesData = stores
    .filter((dealer) => dealer.type === 'STORE')
    .map((store) => ({
      value: store._id ?? '',
      label: store.code + ' - ' + store.name,
    }));

  const warehouseData = stores
    .filter((dealer) => dealer.type === 'WAREHOUSE')
    .map((store) => ({
      value: store._id ?? '',
      label: store.code + ' - ' + store.name,
    }));

  const fetchDestinationStaffs = async (storeId: string) => {
    try {
      const response = await getAllStaffsByStoreIdAPI(storeId ?? '');
      if (response.success) {
        dispatch(setDestinationStaff(response.data));
      } else {
        dispatch(setDestinationStaff([]));
      }
    } catch (error) {
      dispatch(setDestinationStaff([]));
      toast.error('Failed to fetch staff');
    }
  };

  const fetchSourceStaffs = async (storeId: string) => {
    try {
      const response = await getAllStaffsByStoreIdAPI(storeId ?? '');
      if (response.success) {
        dispatch(setSourceStaff(response.data));
      } else {
        dispatch(setSourceStaff([]));
      }
    } catch (error) {
      dispatch(setSourceStaff([]));
      toast.error('Failed to fetch staff');
    }
  };

  useEffect(() => {
    fetchDestinationStaffs(transactionDestination.destinationEntityId);
  }, [stockTransaction.destination.destinationEntityId]);

  useEffect(() => {
    fetchSourceStaffs(transactionSource.sourceEntityId);
    dispatch(fetchBillingLeanItems('', transactionSource.sourceEntityId));
  }, [stockTransaction.source.sourceEntityId]);

  const getStockTransactions = async () => {
    try {
      const response = await getStockTransactionsApi(transactionId ?? '');
      if (response.success) {
        dispatch(setTransactionData(response.data[0]));
      }
    } catch (error) {
      toast.error('Transfer failed');
    }
  };

  useEffect(() => {
    const response = getStockTransactions();
  }, []);

  const [confirmZeroQty, setConfirmZeroQty] = useState(false);


  const hasZeroQty = transactionItems.some((item) =>
    item.itemByDate?.some(
      (batch: any) =>
        batch.destinationQuantity?.qty === 0 || batch.destinationQuantity?.qty === undefined
    )
  );
  

  const onDestinationSubmit = async () => {

    if (hasZeroQty && !confirmZeroQty) {
      toast.warning(MESSAGES.STOCK_QUANTITY_WARNING);
      setConfirmZeroQty(true);
      return;
    }
    
    const response = await updateStockTransactionsAPI(transactionId ?? '', {
      transactionItems: transactionItems.map((item) => ({
        itemId: item.itemId,
        itemByDate: item.itemByDate,
      })),
    });

    if (response.success) {
      toast.success('Destination added successfully');
      dispatch(resetStoreInventory());
      dispatch(resetStoreStockInventory());
      navigate('/stockTransactions');
    }
  };

  const onApproveByAdmin = async (approveByAdmin: boolean) => {
    const response = await approveStockTransactionsAPI(
      transactionId ?? '',
      true,
      stockTransaction.adminRemark ?? '',
      { ...stockTransaction, approvedByAdmin: approveByAdmin }
    );

    if (response.success && approveByAdmin) {
      toast.success('Transaction approved successfully');
      dispatch(resetStoreInventory());
      dispatch(resetStoreStockInventory());
    }
    if (response.success && !approveByAdmin) {
      toast.success('Transaction updated successfully');
    }
  };

  useEffect(() => {
    if (!transactionId) {
      dispatch(resetStoreInventory());
      dispatch(resetStoreStockInventory());
    }
  }, [transactionId]);

  return (
    <Flex
      gap="16px"
      direction="column"
      sx={{
        border: '1px solid grey',
        padding: '16px',
        borderRadius: '8px',
        overflow: 'scroll',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
      mx="sm"
      mt="16px"
    >
      <Grid columns={12} sx={{ width: '100%' }}>
        <Grid.Col span={12}>
          <Title order={2} mb="md">
            New Transaction
          </Title>
          {stockTransaction.approvedByAdmin && (
          <Chip defaultChecked color="green">
            Approved
          </Chip>
        )}
        </Grid.Col>

       

        <Grid.Col>
          <StoreInventoryForm
            onChangeSource={onChangeTransactionSource}
            onChangeDestination={onChangeTransactionDestination}
            storesData={storesData}
            warehouseData={warehouseData}
            sourceStaff={sourceStaff.map((staff) => ({
              value: staff._id,
              label: staff.name,
            }))}
            destinationStaff={destinationStaff.map((staff) => ({
              value: staff._id,
              label: staff.name,
            }))}
            disabled={
              (transactionId && !isAdminUser) ||
              stockTransaction?.approvedByAdmin
            }
          />
        </Grid.Col>

        {Boolean(stockTransaction.source.sourceType) &&
          !(transactionId && !isAdminUser) &&
          !stockTransaction.approvedByAdmin && (
            <Grid.Col span={12}>
              <ItemSearch
                onItemSelect={handleItemSelect}
                // passing the selected store id to the item search to disable the items search
                isApprovedPO={
                  !stockTransaction.source.sourceEntityId ||
                  stockTransaction.approvedByAdmin
                }
                error={errors.inventoryItems}
              />
              {!stockTransaction.source.sourceEntityId && (
                <Text
                  sx={{
                    color: 'red',
                    fontSize: '12px',
                    marginTop: '4px',
                  }}
                >
                  Please select a Source Store to add items.
                </Text>
              )}
            </Grid.Col>
          )}

        <Grid.Col span={12}>
          {transactionItems.length > 0 && (
            <InventoryItemPanel
              items={transactionItems}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
              enableDestinationForm={transactionId ? true : false}
              disabled={stockTransaction?.approvedByAdmin}
            />
          )}
        </Grid.Col>

        {!transactionId && (
          <Grid.Col span={isSmallScreen ? 12 : 4}>
            <Button
              loading={loading}
              w="100%"
              onClick={onSubmitTransaction}
            >
              Create Transaction
            </Button>
          </Grid.Col>
        )}

        {!isAdminUser && transactionId && (
          <Grid.Col span={isSmallScreen ? 12 : 4}>
            <Button
              loading={loading}
              w="100%"
              onClick={onDestinationSubmit}
              disabled={stockTransaction?.approvedByAdmin}
            >
      {confirmZeroQty ? 'Yes, save' : 'Save'}
      </Button>
          </Grid.Col>
        )}

        {isAdminUser && transactionId && (
          <Grid.Col span={isSmallScreen ? 12 : 4}>
            <Textarea
              label="Admin Remark"
              placeholder="Add admin remark"
              value={stockTransaction.adminRemark}
              onChange={(e) =>
                dispatch(
                  setTransactionData({
                    adminRemark: e.target.value,
                  })
                )
              }
              error={errors.adminRemark}
              disabled={stockTransaction?.approvedByAdmin}
            />
            <Flex
              gap="sm"
              justify="space-between"
              align="center"
              mt={20}
              >
            <Button
              loading={loading}
              w="100%"
              onClick={()=> onApproveByAdmin(true)}
              color="green"
              disabled={stockTransaction?.approvedByAdmin}
            >
              {stockTransaction?.approvedByAdmin ? 'Approved' : 'Approve'}
            </Button>
            <Button
              loading={loading}
              w="100%"
              onClick={()=> onApproveByAdmin(false)}
              color="blue"
              disabled={stockTransaction?.approvedByAdmin}
            >
              {stockTransaction?.approvedByAdmin ? 'Approved' : 'Update'}
            </Button>
            </Flex>
          </Grid.Col>
        )}
      </Grid>
    </Flex>
  );
};

export default StoreInventoryManagement;
