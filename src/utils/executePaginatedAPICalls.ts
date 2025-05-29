export interface PaginationStrategy {
  limitParamName: string;
  offsetParamName: string;
  offsetType: 'page' | 'offset' | 'skip';
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
  const batches = Math.ceil(totalPages / parallelCalls);

  for (let batch = 0; batch < batches; batch++) {
    const batchPromises = [];
    const startPage = paginationStrategy.startOffsetValue + (batch * parallelCalls);

    for (let i = 0; i < parallelCalls && startPage + i <= totalPages; i++) {
      const page = startPage + i;
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
