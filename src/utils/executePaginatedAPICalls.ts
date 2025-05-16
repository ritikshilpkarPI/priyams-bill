const MAX_RETRIES_PER_CALL = 3;
const DEFAULT_PARALLEL_CALLS = 5;

export async function executePaginatedAPICalls<T>({
  apiFnToGetData,
  totalObjectsCount,
  itemsPerCall,
  paginationStrategy,
  parallelCalls = DEFAULT_PARALLEL_CALLS,
  maxRetriesPerCall = MAX_RETRIES_PER_CALL,
}: ExecutePaginatedAPICallsParams<T>): Promise<T[]> {
  if (totalObjectsCount <= 0) {
    return [];
  }

  const numberOfApiCallsNeeded = Math.ceil(totalObjectsCount / itemsPerCall);
  const collectedItems: T[] = [];

  console.log(`executePaginatedAPICalls: Need to make ${numberOfApiCallsNeeded} calls to fetch ${totalObjectsCount} items, ${itemsPerCall} items per call.`);

  const apiCallPromises: (() => Promise<T[]>)[] = []; // Array of functions that return a Promise

  for (let i = 0; i < numberOfApiCallsNeeded; i++) {
    let currentOffset: number;
    if (paginationStrategy.offsetType === 'page') {
      currentOffset = paginationStrategy.startOffsetValue + i;
    } else { // 'skip'
      currentOffset = paginationStrategy.startOffsetValue + (i * itemsPerCall);
    }

    const apiParams = {
      [paginationStrategy.limitParamName]: itemsPerCall,
      [paginationStrategy.offsetParamName]: currentOffset,
    };

    apiCallPromises.push(async () => {
      let retries = 0;
      while (retries <= maxRetriesPerCall!) {
        try {
          console.log(`executePaginatedAPICalls: Calling API with params: ${JSON.stringify(apiParams)}, attempt: ${retries + 1}`);
          const data = await apiFnToGetData(apiParams);
          return data;
        } catch (err) {
          retries++;
          console.error(`executePaginatedAPICalls: Error calling API with params ${JSON.stringify(apiParams)} (attempt ${retries}):`, err);
          if (retries > maxRetriesPerCall!) {
            console.error(`executePaginatedAPICalls: Max retries reached for params ${JSON.stringify(apiParams)}.`);
            throw err;
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * retries)); 
        }
      }
      return [];
    });
  }

  for (let i = 0; i < apiCallPromises.length; i += parallelCalls) {
    const batchPromises = apiCallPromises.slice(i, i + parallelCalls).map(promiseFn => promiseFn());
    console.log(`executePaginatedAPICalls: Processing a batch of ${batchPromises.length} API calls.`);
    try {
      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(result => collectedItems.push(...result));
      console.log(`executePaginatedAPICalls: Batch processed. Fetched ${batchResults.reduce((sum, r) => sum + r.length, 0)} items. Total collected so far: ${collectedItems.length}`);
    } catch (error) {
      console.error('executePaginatedAPICalls: Error processing a batch of API calls. Some calls in the batch might have failed after retries.', error);
      throw new Error('executePaginatedAPICalls: A batch of API calls failed. See console for details.');
    }
  }
  return collectedItems.slice(0, totalObjectsCount); 
}