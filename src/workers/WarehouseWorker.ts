/// <reference lib="webworker" />
import { itemPurchaseBatchesWebAPI } from 'src/utils/apiUtils';
import { generateWarehouseCSV } from '../utils/generateWarehouseCSV';

const LIMIT = 100;
const MAX_RETRIES = 3;

const fetchAllItems = async (): Promise<any[]> => {
  const firstResponse = await itemPurchaseBatchesWebAPI({ page: 1, limit: LIMIT });

  if (!firstResponse || firstResponse.isError) {
    throw new Error('Failed to fetch first page');
  }

  const totalCount = firstResponse.totalCount;
  const firstPageItems = firstResponse.data ?? [];

  const totalPages = Math.ceil(totalCount / LIMIT);
  const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2); // Pages 2 to N

  const fetchPageWithRetry = async (page: number): Promise<any[]> => {
    let retries = 0;
    while (retries < MAX_RETRIES) {
      const response = await itemPurchaseBatchesWebAPI({ page, limit: LIMIT });
      if (response && !response.isError && Array.isArray(response.data)) {
        return response.data;
      }
      retries++;
      console.log(`Retry ${retries}/${MAX_RETRIES} for page ${page}`);
      await new Promise((res) => setTimeout(res, 1000));
    }
    throw new Error(`Failed to fetch page ${page} after ${MAX_RETRIES} retries`);
  };

  const parallelFetches = remainingPages.map((page) => fetchPageWithRetry(page));

  const remainingResults = await Promise.all(parallelFetches);

  const allItems = [firstPageItems, ...remainingResults].flat();
  return allItems;
};

/* eslint-disable no-restricted-globals */
addEventListener('message', async (event) => {
  try {
    const items = await fetchAllItems();    
    const csv = generateWarehouseCSV(items);
    postMessage({ status: 'success', csv });
  } catch (error) {    
    postMessage({ status: 'error', error: (error as Error).message });
  }
});
/* eslint-enable no-restricted-globals */
