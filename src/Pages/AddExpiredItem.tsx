import '../CSS/addExpiredItem.scss';
import React, { useEffect, useState } from 'react';
import { Title, Button, Flex, Grid, Loader, Center, Select, Text, Chip } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { ItemSearch } from '../components/ItemSearch/ItemSearch';

import { genericAxios } from '../utils/genericAxiosMethod';
import { API_PATHS } from '../utils/constants/apiPaths';
import { API_METHODS } from '../utils/constants/apiMethods';
import { StoreSelect } from 'src/components/StoreSelect';
import { addNewExpiredItemsBatchAPI, getAllDealersAPI } from 'src/utils/apiUtils';
import { string } from 'joi';
import { itemPurchaseBatchesAPI } from 'src/utils/apiUtils';
import { InventoryRow } from 'src/types';
import { ExpiredItemPOTable } from 'src/components/ExpiredItemPOTable';
import { toast } from 'react-toastify';
import { selectDealerLoading, selectDealers } from 'src/redux/dealerlist/dealerSelectors';
import { setDealers, setDealersLoading } from 'src/redux/dealerlist/dealerSlice';
import { setDealerIdToBatch } from 'src/redux/ExpiryBatch/expiryBatchSlice';



function getCheckedExpiredItems(resp: Record<string, any[]>) {
  const items: {
    itemId: string;
    expiryDate: Date;
    quantity: number;
    purchaseOrderId: string;
    costPricePerUnit: number;
    totalCostPrice: number;
  }[] = [];
  let expiryBatchCost = 0;

  for (const [itemId, batches] of Object.entries(resp)) {
    const checkedBatches = (batches as any[]).filter(b => b.checked);
    if (checkedBatches.length === 0) continue;

    checkedBatches.forEach(batch => {
      const {
        expiryDate,
        quantity,
        purchaseOrderId,
        costPrice = 0,
      } = batch;
      const totalCostPrice = costPrice * quantity;
      expiryBatchCost += totalCostPrice;

      items.push({
        itemId,
        expiryDate: new Date(expiryDate),
        quantity,
        purchaseOrderId,
        costPricePerUnit: costPrice,
        totalCostPrice,
      });
    });
  }

  return { items, expiryBatchCost };
}


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
            Add Expired Item
          </Title>
        </Grid.Col>

        <Grid.Col span={12}>
          <ItemSearch
            onItemSelect={handleItemSelect}
            isApprovedPO={undefined}
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
            <ExpiredItemPOTable items={items as any} />
          </Grid.Col>

        <Grid.Col span={false ? 12 : 4}>
          <Button loading={false} w="100%" onClick={addExpiredItemsBatch} disabled={noOfItemsInBatch === 0}>
            Add expired items batch
          </Button>
        </Grid.Col>
      </Grid>
    </Flex>
  );
};
export default AddExpiredItem;
