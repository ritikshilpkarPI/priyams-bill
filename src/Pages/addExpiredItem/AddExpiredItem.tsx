import '../../CSS/addExpiredItem.scss';
import React, { useEffect, useState } from 'react';
import { Title, Button, Flex, Grid, Loader, Center, Select, Text, Chip, Badge } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { ItemSearch } from '../../components/ItemSearch/ItemSearch';

import { genericAxios } from '../../utils/genericAxiosMethod';
import { API_PATHS } from '../../utils/constants/apiPaths';
import { API_METHODS } from '../../utils/constants/apiMethods';
import { StoreSelect } from 'src/components/StoreSelect';
import { addNewExpiredItemsBatchAPI, getAllDealersAPI, getExpiryItemsBatchByIdAPI, updateExpiredItemsBatchAPI } from 'src/utils/apiUtils';
import { string } from 'joi';
import { itemPurchaseBatchesAPI } from 'src/utils/apiUtils';
import { InventoryRow } from 'src/types';
import { ExpiredItemPOTable } from 'src/components/ExpiredItemPOTable';
import { toast } from 'react-toastify';
import { selectDealerLoading, selectDealers } from 'src/redux/dealerlist/dealerSelectors';
import { setDealers, setDealersLoading } from 'src/redux/dealerlist/dealerSlice';
import { setBoxIdToBatch, setDealerIdToBatch, setBatchStatus, addItemData, removeItemData, setItemsData, clearBatch } from 'src/redux/ExpiryBatch/expiryBatchSlice';
import { useParams } from 'react-router';
import { isAdmin } from 'src/utils/isAdmin';
import { ITEM_EXPIRY_BATCH_ACTION, ITEM_EXPIRY_BATCH_STATUS } from 'src/constants/constants';
import { getCheckedExpiredItems } from './utils/getCheckedExpiredItems';
import { updateBatch } from './utils/updateBatch';






const AddExpiredItem = () => {
  const [errors, setErrors] = useState<YupValidationErrorMapType>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
    const [items, setItems] = useState<InventoryRow[]>([]);
    const expiryBatchItems = useSelector(
      (state: RootState) => state.expiryBatch.items
    );
  
    const boxId = useSelector(
      (state: RootState) => state.expiryBatch.boxId
    );
    const dealerId = useSelector(
      (state: RootState) => state.expiryBatch.dealerId
    );
    const dealerNameInExpiryBatch = useSelector(
      (state: RootState) => state.expiryBatch.dealerNameInExpiryBatch
    );

    const batchStatus = useSelector(
      (state: RootState) => state.expiryBatch.batchStatus
    );

     const dispatch = useDispatch();

  const getItemPurchaseBatches = async (itemId: string) => {
    try {
      const isAlreadyAdded = items.some(item => item?._id === itemId);
      if (isAlreadyAdded) {
        toast('Item already added to the list. Please select a different item.');
        return;
      } 
      setIsLoading(true);      
      const res = await itemPurchaseBatchesAPI({ itemId });
      const data = res.data as Record<string, InventoryRow>;
      const rows = Object.values(data);
      const newItem = rows[0];

      setItems([...items, newItem]);

    } finally {
      setIsLoading(false);
    }
  };
  

  const handleItemSelect = (item: ItemWithQuantity) => {
    const itemId = item.itemDetail._id;
    if (itemId) {
      getItemPurchaseBatches(itemId);
    }
  };

  const addExpiredItemsBatch = async () => {    
    try {      
      const data = getCheckedExpiredItems(expiryBatchItems);
            
      const res = await addNewExpiredItemsBatchAPI({
        items: data.items,
        boxId,
        dealerId,
        expiryBatchCost: data.expiryBatchCost,
      });      

      if (!res?.isError) {
        toast('Expired items batch added successfully');
        setErrors({});
        setItems([]);
        dispatch(setItemsData([]));
        dispatch(setBoxIdToBatch({ boxId: '' }));
        dispatch(setDealerIdToBatch({ dealerId: '', dealerName: '' }));
        dispatch(clearBatch());
      }
      if (res?.isError) {
        toast(res?.error?.error ?? 'Failed to add expired items batch');
      }

    } catch (error) {
      console.error('Error adding expired items batch:', error);
      toast('Failed to add expired items batch');
    }
  }

  const noOfItemsInBatch = getCheckedExpiredItems(expiryBatchItems).items.length;

 const getDealers = async ()=>{
    try {
      dispatch(setDealersLoading(true))
      const response = await getAllDealersAPI()
      dispatch(setDealers(response?.dealers))
      dispatch(setDealersLoading(false))
    } catch (error) {
      dispatch(setDealersLoading(false))
    }
  }

  const dealers = useSelector(selectDealers);    
  const dealersLoading = useSelector(selectDealerLoading);    
  
  useEffect(()=>{
    if (dealers.length === 0) {
      getDealers();
    }
  },[])  

  const [selectedDealer, setSelectedDealer] = useState<string | null>(null);

  const dealerOptions: { value: string; label: string }[] = dealers
  .filter((d): d is Dealer & { _id: string } => Boolean(d._id))
  .map((dealer) => ({
    value: dealer._id,
    label: dealer.dealerName,
  }));
  
  const onDealerSelect = (value: string | null) => {
    setSelectedDealer(value);
    if (value) {
      dispatch(setDealerIdToBatch({dealerId: value, dealerName: dealers.find((dealer) => dealer._id === value)?.dealerName}));
    } 
  }

  const params = useParams();
  const { id } = params as { id: string };
  const [expiryBatchData, setExpiryBatchData] = useState<any>(null);

  const getItemExpiryBatchData = async () => {
    try {
      const res = await getExpiryItemsBatchByIdAPI(id);     

      if (res.success) {
        const itemsArray = res?.data?.items?.map((item: ItemSoldInterface)=> {
          return item?.itemId
        })
                setItems(itemsArray);
        setExpiryBatchData(res?.data?.items);
        dispatch(setDealerIdToBatch({
          dealerId: res?.data?.dealerId?._id,
          dealerName: res?.data?.dealerId?.dealerName,
        }));
        dispatch(setBoxIdToBatch({ boxId: res?.data?.boxId }));
        dispatch(setBatchStatus(res?.data?.status));
        setSelectedDealer(res?.data?.dealerId?._id);
        
        setExpiryBatchData((prev: any) => {
          if (JSON.stringify(prev) !== JSON.stringify(res?.data?.items)) {
            return res?.data?.items;
          }
          return prev;
        });
      }
    } catch (error) {
      toast.error('Error fetching batch. Please try again.');
      console.error('Error fetching batch:', error);
    } 
  };

useEffect(() => {
  getItemExpiryBatchData();
   if(!id) {
      dispatch(setDealerIdToBatch({ dealerId: '', dealerName: '' }));
      setItems([]);
    }
  }, [id])

  const isAdminUser = isAdmin();


 const updateExpiryBatch = async (actionType: string) => {
    try {
      const message = await updateBatch(id, actionType, expiryBatchItems);
            let newStatus = '';
      switch (actionType) {
        case ITEM_EXPIRY_BATCH_ACTION.DRAFT:
          newStatus = ITEM_EXPIRY_BATCH_STATUS.DRAFTED;
          toast.success('Batch drafted successfully');
          break;
        case ITEM_EXPIRY_BATCH_ACTION.APPROVE:
          newStatus = ITEM_EXPIRY_BATCH_STATUS.APPROVED;
          toast.success('Batch approved successfully');
          break;
        case ITEM_EXPIRY_BATCH_ACTION.UPDATE:
          newStatus = ITEM_EXPIRY_BATCH_STATUS.SAVED;
          toast.success('Batch updated successfully');
          break;
      }

      dispatch(setBatchStatus(newStatus));
      
      await getItemExpiryBatchData();
      
    } catch (error) {
      toast.error('Failed to update batch. Please try again.');
      console.error('Error updating batch:', error);
    }
  };
  

  return (
    <Flex
      gap="16px"
      direction="column"
      sx={{
        padding: '16px 56px',
        overflow: 'scroll',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        backgroundColor: '#DAEDF5',
        height: '100vh'
        
      }}
      
    >
      <Grid columns={12} sx={{ width: '100%' }}>
        <Grid.Col span={12}>
          <Title order={2} mb="md">
            Add Expired Item
          </Title>
          {
            batchStatus && 
            (
              <Badge size="lg" color="blue" variant="filled" >{batchStatus}</Badge>
            )
          }
        </Grid.Col>

        <Grid.Col span={12}>
          <ItemSearch
            onItemSelect={handleItemSelect}
            isApprovedPO={Boolean(batchStatus) && batchStatus !== 'SAVED'}
            error={errors.inventoryItems}

          />
        </Grid.Col>

        <Grid.Col span={12}>
          {dealerNameInExpiryBatch && (
                  <Text
                    size="sm"
                    weight={500}
                    color="dimmed"
                    style={{ padding: '8px 12px', textAlign: 'center' }}
                  >
                    <Chip size="md" color="blue" variant="filled" checked>
                      {dealerNameInExpiryBatch}
                    </Chip>
                  </Text>
                )}
                
        {
          dealerId && noOfItemsInBatch > 0 && (
            <Flex gap="xs" align="center" mb="2px">
              <Title order={3}
              sx={{
                color: 'red',
                fontSize: '14px',
                fontWeight: 500,
                marginTop: '8px',
                marginBottom: '8px',
                textAlign: 'center',
                textTransform: 'capitalize',
              }}
              >
                You can't change the dealer once the items are added to the batch from the dealer.
              </Title>
            </Flex>
          )
        }
        
        </Grid.Col>   
          <Grid.Col span={12}>
            <ExpiredItemPOTable items={items as any} expiryBatchData={expiryBatchData} setItemsData={setItems} id={id} isLoading={isLoading} />
          </Grid.Col>

      { !id ?  <Grid.Col span={false ? 12 : 4}>
          <Button loading={false} w="100%" onClick={addExpiredItemsBatch} disabled={noOfItemsInBatch === 0}  bg={'#3199C0'}>
            Add expired items batch
          </Button>
        </Grid.Col>
      :   
      <Flex gap="xs" align="center" mb="2px">
        <Grid.Col span={false ? 12 : 8}>
          <Button loading={false} w="100%" onClick={()=> updateExpiryBatch(ITEM_EXPIRY_BATCH_ACTION.UPDATE)} disabled={Boolean(batchStatus) && batchStatus !== ITEM_EXPIRY_BATCH_STATUS.SAVED}>
            Update expired items batch
          </Button>
        </Grid.Col>
       {isAdminUser && <Grid.Col span={false ? 12 : 4}>
          <Button loading={false} w="100%" onClick={()=> updateExpiryBatch(ITEM_EXPIRY_BATCH_ACTION.APPROVE)} disabled={Boolean(batchStatus) && batchStatus !== ITEM_EXPIRY_BATCH_STATUS.DRAFTED} color='green'>
            Approve batch
          </Button>
        </Grid.Col>}
        <Grid.Col span={false ? 12 : 4}>
          <Button loading={false} w="100%" onClick={()=> updateExpiryBatch(ITEM_EXPIRY_BATCH_ACTION.DRAFT)} disabled={batchStatus === ITEM_EXPIRY_BATCH_STATUS.DRAFTED || batchStatus === ITEM_EXPIRY_BATCH_STATUS.APPROVED || batchStatus === ITEM_EXPIRY_BATCH_STATUS.CLEARED}>
            Draft batch
          </Button>
        </Grid.Col>
        </Flex>
      }
        
       
      </Grid>
    </Flex>
  );
};
export default AddExpiredItem;
