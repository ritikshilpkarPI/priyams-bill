import '../CSS/addExpiredItem.scss';
import React, { useEffect, useState } from 'react';
import { Title, Button, Flex, Grid, Loader, Center } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { ItemSearch } from '../components/ItemSearch';

import { genericAxios } from '../utils/genericAxiosMethod';
import { API_PATHS } from '../utils/constants/apiPaths';
import { API_METHODS } from '../utils/constants/apiMethods';
import { StoreSelect } from 'src/components/StoreSelect';
import { itemPurchaseBatches } from 'src/utils/apiUtils';
import { string } from 'joi';
import { InventoryRow } from 'src/types';
import { ExpiredItemPOTable } from 'src/components/ExpiredItemPOTable';
import { toast } from 'react-toastify';

const AddExpiredItem = () => {
  const [errors, setErrors] = useState<YupValidationErrorMapType>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<InventoryRow[]>([]);

  const getItemPurchaseBatches = async (itemId: string) => {
    try {
      const isAlreadyAdded = items.some(item => item?.staticData?._id === itemId);
      if (isAlreadyAdded) {
        toast('Item already added to the list. Please select a different item.');
        return;
      } 
      setIsLoading(true);      
      const res = await itemPurchaseBatches({ itemId });
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

        {isLoading ? (
          <Grid.Col span={12}>
            <Center>
              <Loader size="md" />
            </Center>
          </Grid.Col>
        ) : (
          <Grid.Col span={12}>
            <ExpiredItemPOTable items={items} />
          </Grid.Col>
        )}

        <Grid.Col span={false ? 12 : 4}>
          <Button loading={false} w="100%" onClick={() => {}}>
            Add expired items batch
          </Button>
        </Grid.Col>
      </Grid>
    </Flex>
  );
};
export default AddExpiredItem;
