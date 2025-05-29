import { Button, Text } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import React, { useState } from 'react';
import { generateWarehouseCSV } from '../utils/generateWarehouseCSV';
import { itemPurchaseBatchesWebAPI } from 'src/utils/apiUtils';
import { executePaginatedAPICalls } from 'src/utils/executePaginatedAPICalls';
const DEFAULT_LIMIT = 100;
const MAX_RETRIES_PER_CALL = 3;
const DEFAULT_PARALLEL_CALLS = 5;

interface FullAPIResponse<T> {
  data: T[];
  totalCount: number;
  isError?: boolean;
}

export const DownloadWarehouseItemCSVButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (loading) return; // Prevent multiple clicks if already loading

    setLoading(true);
    setError(null);

    try {
      const allItems = await fetchAllItemsInBatches();

      if (allItems && allItems.length > 0) {
        const csv = generateWarehouseCSV(allItems);
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

  return (
    <Button
      leftIcon={<IconDownload size={16} />}
      onClick={handleDownload}
      loading={loading}
      disabled={loading}
    >
      Download Warehouse CSV
    </Button>
  );
};


export async function fetchAllItemsInBatches<T = any>(
  itemsPerCallOverride: number = DEFAULT_LIMIT,
  parallelCallsOverride: number = DEFAULT_PARALLEL_CALLS
): Promise<T[]> {
  let allItems: T[] = [];
  let totalItemsFromAPI = 0;
  let initialPageData: T[] = [];
  const initialPageToFetch = 1;

  // 1. Initial call to get totalCount and the first batch of data
  try {
    console.log(`fetchAllItemsInBatches: Fetching initial batch, page: ${initialPageToFetch}, limit: ${itemsPerCallOverride}`);
    // Assuming itemPurchaseBatchesWebAPI returns the FullAPIResponse structure
    const initialResponse = await itemPurchaseBatchesWebAPI({ page: initialPageToFetch, limit: itemsPerCallOverride }) as FullAPIResponse<T>;
    
    if (initialResponse.isError || !initialResponse.data) {
      throw new Error('fetchAllItemsInBatches: Initial API call failed or returned no data');
    }
    totalItemsFromAPI = initialResponse.totalCount;
    initialPageData = initialResponse.data;
    allItems = allItems.concat(initialPageData);
    
    if (initialPageData.length === 0 && totalItemsFromAPI > 0) {
        console.warn('fetchAllItemsInBatches: Initial API call returned no data, but totalCount > 0.');
    }
    console.log(`fetchAllItemsInBatches: Initial fetch complete. Total items from API: ${totalItemsFromAPI}. Fetched in first call: ${initialPageData.length}`);

  } catch (error) {
    console.error('fetchAllItemsInBatches: Error during initial API call:', error);
    throw error;
  }

  const itemsFetchedInitially = initialPageData.length;
  if (totalItemsFromAPI === 0 || itemsFetchedInitially >= totalItemsFromAPI) {
    console.log('fetchAllItemsInBatches: No more items to fetch after initial call or totalItems is 0.');
    return allItems.slice(0, totalItemsFromAPI); // Ensure not to exceed totalCount
  }

  // 2. Prepare to call the generic executor for remaining items
  const itemsToFetchInSubsequentCalls = totalItemsFromAPI - itemsFetchedInitially;
  
  // This is the actual API function that executePaginatedAPICalls will use.
  // It needs to match the signature (params: Record<string, any>) => Promise<T[]>
  const paginatedApiFunction = async (params: Record<string, any>): Promise<T[]> => {
    const response = await itemPurchaseBatchesWebAPI(params as { page: number; limit: number}) as FullAPIResponse<T>; 
    if (response.isError || !response.data) {
      throw new Error(`Paginated API call failed for params: ${JSON.stringify(params)}`); 
    }
    return response.data;
  };

  const paginationStrategyForSubsequentCalls: PaginationStrategy = {
    limitParamName: 'limit',
    offsetParamName: 'page',
    offsetType: 'page',
    startOffsetValue: initialPageToFetch + 1,
  };

  console.log(`fetchAllItemsInBatches: Preparing to fetch remaining ${itemsToFetchInSubsequentCalls} items.`);

  const subsequentItems = await executePaginatedAPICalls<T>({
    apiFnToGetData: paginatedApiFunction,
    totalObjectsCount: itemsToFetchInSubsequentCalls,
    itemsPerCall: itemsPerCallOverride,
    paginationStrategy: paginationStrategyForSubsequentCalls,
    parallelCalls: parallelCallsOverride,
    maxRetriesPerCall: MAX_RETRIES_PER_CALL,
  });

  allItems = allItems.concat(subsequentItems);
  
  if (allItems.length > totalItemsFromAPI && totalItemsFromAPI > 0) { 
    console.warn(`fetchAllItemsInBatches: Fetched ${allItems.length} items, but totalCount from API was ${totalItemsFromAPI}. Slicing to totalCount.`);
    allItems = allItems.slice(0, totalItemsFromAPI);
  }

  console.log(`fetchAllItemsInBatches: All fetching complete. Total items retrieved: ${allItems.length}`);
  return allItems;
} 