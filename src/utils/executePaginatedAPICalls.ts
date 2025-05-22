export interface PaginationStrategy {
  limitParamName: string;
  offsetParamName: string;
  offsetType: 'page' | 'offset';
  startOffsetValue: number;
}

interface PaginatedAPIConfig<T> {
  apiFnToGetData: (params: Record<string, any>) => Promise<T[]>;
  totalObjectsCount: number;
  itemsPerCall: number;
  paginationStrategy: PaginationStrategy;
  parallelCalls: number;
  maxRetriesPerCall: number;
}

export async function executePaginatedAPICalls<T>({
  apiFnToGetData,
  totalObjectsCount,
  itemsPerCall,
  paginationStrategy,
  parallelCalls,
  maxRetriesPerCall,
}: PaginatedAPIConfig<T>): Promise<T[]> {
  const results: T[] = [];
  const totalPages = Math.ceil(totalObjectsCount / itemsPerCall);

  const startPage = paginationStrategy.startOffsetValue;
  const endPage = startPage + totalPages;
  

  console.log(`Fetching pages ${startPage} to ${endPage-1}, totalPages: ${totalPages}`);

  for (let currentPage = startPage; currentPage < endPage; currentPage += parallelCalls) {
    const batchPromises = [];
    
    for (let i = 0; i < parallelCalls && currentPage + i < endPage; i++) {
      const page = currentPage + i;
      const params = {
        [paginationStrategy.limitParamName]: itemsPerCall,
        [paginationStrategy.offsetParamName]: page,
      };

      let retryCount = 0;
      const executeWithRetry = async (): Promise<T[]> => {
        try {
          return await apiFnToGetData(params);
        } catch (error) {
          if (retryCount < maxRetriesPerCall) {
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            return executeWithRetry();
          }
          throw error;
        }
      };

      batchPromises.push(executeWithRetry());
    }

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.flat());
  }

  return results;
} 