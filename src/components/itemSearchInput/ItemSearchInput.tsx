import React, { useEffect, useState } from 'react';
import { Box, InputBase } from '@mui/material';
import { IconSearch } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import {
  getItemsFromStoreInventoryAPI,
  itemPurchaseBatchesAPI,
} from 'src/utils/apiUtils';
import { useDispatch } from 'react-redux';
import {
  setIsLoading,
  setRowCount,
  showRows,
} from 'src/redux/inventoryPage/inventorySlice';
import {
  setItems,
  setItemCount,
  setLoading,
} from '../../redux/storeInventory/StoreInventoryState';
import { CONSTANTS } from 'src/constants/constants';

const ItemSearchInput = ({
  page,
  rowsPerPage,
  placeholder = 'Search for a document',
  disabled = false,
  searchType,
  storeId,
}: {
  placeholder?: string;
  disabled?: boolean;
  page: number;
  rowsPerPage: number;
  searchType: string;
  storeId?: string;
}) => {
  const dispatch = useDispatch();
  const [itemNameOrBarcode, setItemNameOrBarcode] = useState('');
  const [debouncedSearchInput] = useDebouncedValue(itemNameOrBarcode, 500);

  const fetchItemPurchaseBatchesApi = async () => {
    try {
      dispatch(setIsLoading(true));
      const response = await itemPurchaseBatchesAPI({
        page: page,
        limit: rowsPerPage,
        itemNameOrBarcode: itemNameOrBarcode,
      });

      if (response?.success) {
        dispatch(showRows(response.data));
        dispatch(setRowCount(response.totalCount));
      } else {
        dispatch(showRows([]));
        dispatch(setRowCount(0));
      }
    } catch (error) {
      dispatch(showRows([]));
      dispatch(setRowCount(0));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const fetchGetItemsFromStoreInventoryAPI = async () => {
      dispatch(setLoading(true));
      const response = await getItemsFromStoreInventoryAPI(storeId!, {
        page: page + 1,
        size: rowsPerPage,
        itemNameOrBarcode: itemNameOrBarcode,
      });
      if(response.success){
        dispatch(setItems(response?.data ?? []));
        dispatch(setItemCount(response?.count ?? 0));
      }
      if(response.isError){ 
        dispatch(setItems([]));
        dispatch(setItemCount(0));
      }
    
      dispatch(setLoading(false));

  };
  useEffect(() => {
    if (!disabled) {
       if (searchType === CONSTANTS.STORE) {
        fetchGetItemsFromStoreInventoryAPI();
      } else if (searchType === CONSTANTS.WAREHOUSE) {
        fetchItemPurchaseBatchesApi();
      }
    }
  }, [page, rowsPerPage, debouncedSearchInput, disabled, searchType, storeId]);

  return (
    <Box
      sx={{
        border: '2px solid',
        borderImageSlice: 1,
        borderImageSource:
          'linear-gradient(90deg, rgba(39,181,207,1) 0%, rgba(50,105,207,1) 33%, rgba(222,51,213,1) 67%, rgb(255, 82, 108) 100%)',
        display: 'flex',
        alignItems: 'center',
        px: 2,
        height: '45px',
        width: '100%',
        backgroundColor: disabled ? '#f5f5f5' : '#fff',
      }}
    >
      <IconSearch size={20} stroke={1.5} color="#666" />
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
          fontSize: '15px',
          color: '#333',
        }}
        placeholder={placeholder}
        value={itemNameOrBarcode}
        onChange={(e) => setItemNameOrBarcode(e.target.value)}
        inputProps={{ 'aria-label': 'search' }}
        disabled={disabled}
      />
    </Box>
  );
};

export default ItemSearchInput;
