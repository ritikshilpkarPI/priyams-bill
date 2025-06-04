import { executePaginatedAPICalls } from './executePaginatedAPICalls';

type FullAPIResponse<T> = {
  data: T[];
  isError: boolean;
  totalCount: number;
};

type PaginationStrategy = {
  limitParamName: string;
  offsetParamName: string;
  offsetType: 'page' | 'offset';
  startOffsetValue: number;
};

type FetchPaginatedItemsOptions<T> = {
  apiFunction: (params: Record<string, any>) => Promise<FullAPIResponse<T>>;
  itemsPerCall?: number;
  parallelCalls?: number;
  paginationStrategy: PaginationStrategy;
  maxRetriesPerCall?: number;
};

export async function fetchAllPaginatedAPI<T = any>({
  apiFunction,
  itemsPerCall = 100,
  parallelCalls = 5,
  paginationStrategy,
  maxRetriesPerCall = 2,
}: FetchPaginatedItemsOptions<T>): Promise<T[]> {
  const allItems: T[] = [];
  const { limitParamName, offsetParamName, offsetType } = paginationStrategy;

  let totalCount = 0;
  let firstPageData: T[] = [];

  try {
    const initialParams = {
      [limitParamName]: itemsPerCall,
      [offsetParamName]: offsetType === 'page' ? 1 : 0,
    };

    const initialResponse = await apiFunction(initialParams);
    if (initialResponse.isError || !initialResponse.data) {
      throw new Error('Initial API call failed or returned no data');
    }

    totalCount = initialResponse.totalCount;
    firstPageData = initialResponse.data;
    allItems.push(...firstPageData);

    if (firstPageData.length === 0 && totalCount > 0) {
      console.warn('Initial API call returned no data, but totalCount > 0');
    }
  } catch (err) {
    console.error('Initial API fetch error:', err);
    throw err;
  }

  const alreadyFetched = firstPageData.length;
  if (totalCount === 0 || alreadyFetched >= totalCount) {
    return allItems.slice(0, totalCount);
  }

  const remainingItems = totalCount - alreadyFetched;

  const paginatedApiFn = async (params: Record<string, any>): Promise<T[]> => {
    const response = await apiFunction(params);
    if (response.isError || !response.data) {
      throw new Error(`API call failed for params: ${JSON.stringify(params)}`);
    }
    return response.data;
  };

  const subsequentPaginationStrategy = {
    ...paginationStrategy,
    startOffsetValue: offsetType === 'page' ? 2 : itemsPerCall
  };

  const subsequentItems = await executePaginatedAPICalls<T>({
    apiFnToGetData: paginatedApiFn,
    totalObjectsCount: remainingItems,
    itemsPerCall,
    paginationStrategy: subsequentPaginationStrategy,
    parallelCalls,
    maxRetriesPerCall,
  });

  allItems.push(...subsequentItems);

  return allItems.slice(0, totalCount);
}
