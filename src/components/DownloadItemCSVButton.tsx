import { Button, Text } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import React, { useState } from 'react';
import { generateWarehouseCSV } from '../utils/generateWarehouseCSV';
import {
  getItemsFromStoreInventoryAPI,
  itemPurchaseBatchesAPI,
} from 'src/utils/apiUtils';
import { executePaginatedAPICalls, PaginationStrategy } from 'src/utils/executePaginatedAPICalls';
import { CONSTANTS } from '../constants/constants';
import { generateStoreCSV } from '../utils/generateStoreCSV';
const DEFAULT_LIMIT = 100;
const MAX_RETRIES_PER_CALL = 3;
const DEFAULT_PARALLEL_CALLS = 5;

interface FullAPIResponse<T> {
  count: number;
  data: T[];
  totalCount: number;
  isError?: boolean;
}

interface DownloadItemCSVButtonProps {
  sourceType: string;
  storeId?: string;
}
export const DownloadItemCSVButton: React.FC<DownloadItemCSVButtonProps> = ({
  sourceType,
  storeId,
}: {
  sourceType?: string;
  storeId?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (loading) return; // Prevent multiple clicks if already loading

    setLoading(true);
    setError(null);

    try {
      const allItems = await fetchAllItemsInBatches(sourceType, storeId);

      if (allItems && allItems.length > 0) {
        const csv = sourceType === CONSTANTS.STORE ? generateStoreCSV(allItems) : generateWarehouseCSV(allItems);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'warehouse_data.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } else {
        setError('No data available to download.');
      }
    } catch (err) {
      console.error('Failed to generate CSV:', err);
      setError((err as Error).message || 'Failed to generate CSV.');
    } finally {
      setLoading(false);
    }
  };
  const isDisabled = loading || (sourceType === CONSTANTS.STORE && !storeId);

  return (
    <Button
      leftIcon={<IconDownload size={16} />}
      onClick={handleDownload}
      loading={loading}
      disabled={isDisabled}
    >
      Download Warehouse CSV
    </Button>
  );
};


export async function fetchAllItemsInBatches<T = any>(
  sourceType?: string,
  storeId?: string,
  itemsPerCallOverride: number = DEFAULT_LIMIT,
  parallelCallsOverride: number = DEFAULT_PARALLEL_CALLS
): Promise<T[]> {
  let allItems: T[] = [];
  let totalItemsFromAPI = 0;
  let initialPageData: T[] = [];
  const initialPageToFetch = 1;
  const isStore = sourceType === 'STORE';

  let initialResponse: FullAPIResponse<T>;

  try {
    if (isStore) {
      if (!storeId) throw new Error('Missing storeId for store inventory request.');
      initialResponse = await getItemsFromStoreInventoryAPI(storeId, {
        page: 1,
        size: itemsPerCallOverride,
        itemNameOrBarcode: '',
      }) as FullAPIResponse<T>;
    } else {
      initialResponse = await itemPurchaseBatchesAPI({
        page: initialPageToFetch,
        limit: itemsPerCallOverride,
      }) as FullAPIResponse<T>;
    }

    if (initialResponse.isError || !initialResponse.data) {
      throw new Error('Initial API call failed or returned no data');
    }
if(isStore){
  totalItemsFromAPI = initialResponse.count;
}else{
  totalItemsFromAPI = initialResponse.totalCount;
}
    initialPageData = initialResponse.data;
    allItems = allItems.concat(initialPageData);

    if (initialPageData.length === 0 && totalItemsFromAPI > 0) {
      console.warn('Initial API call returned no data, but totalCount > 0.');
    }
  } catch (error) {
    console.error('Error during initial API call:', error);
    throw error;
  }

  const itemsFetchedInitially = initialPageData.length;
  if (totalItemsFromAPI === 0 || itemsFetchedInitially >= totalItemsFromAPI) {
    return allItems.slice(0, totalItemsFromAPI);
  }

  const itemsToFetchInSubsequentCalls = totalItemsFromAPI - itemsFetchedInitially;

  // ✅ Correct paginated API function
  const paginatedApiFunction = async (params: Record<string, any>): Promise<T[]> => {
    if (isStore) {
      const response = await getItemsFromStoreInventoryAPI(storeId!, {
        page: params.page,
        size: params.size,
        itemNameOrBarcode: '',
      }) as FullAPIResponse<T>;
      if (response.isError || !response.data) {
        throw new Error(`Store API call failed for params: ${JSON.stringify(params)}`);
      }
      return response.data;
    } else {
      const response = await itemPurchaseBatchesAPI({
        page: params.page,
        limit: params.limit,
      }) as FullAPIResponse<T>;
      if (response.isError || !response.data) {
        throw new Error(`Warehouse API call failed for params: ${JSON.stringify(params)}`);
      }
      return response.data;
    }
  };

  const paginationStrategy = {
    limitParamName: isStore ? 'size' : 'limit',
    offsetParamName: 'page',
    offsetType: 'page',
    startOffsetValue: initialPageToFetch + 1,
  } as PaginationStrategy;

  const subsequentItems = await executePaginatedAPICalls<T>({
    apiFnToGetData: paginatedApiFunction,
    totalObjectsCount: itemsToFetchInSubsequentCalls,
    itemsPerCall: itemsPerCallOverride,
    paginationStrategy,
    parallelCalls: parallelCallsOverride,
    maxRetriesPerCall: MAX_RETRIES_PER_CALL,
  });

  allItems = allItems.concat(subsequentItems);

  if (allItems.length > totalItemsFromAPI && totalItemsFromAPI > 0) {
    allItems = allItems.slice(0, totalItemsFromAPI);
  }

  return allItems;
} 