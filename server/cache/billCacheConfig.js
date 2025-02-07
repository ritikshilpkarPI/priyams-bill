import { LRUCache } from "lru-cache";
/**
 * max -> maximum no of items allowed in cache
 * updateAgeOnGet, updateAgeOnHas -> update item from cache. If true, age will be updated
 * maxAge in miliseconds -> the  time after which an item will be removed
 */
const billsCache = new LRUCache({
  max: 20000,
  updateAgeOnGet: false,
  updateAgeOnHas: false,
  ttl: 1000 * 60 * 60 * 24 * 20,
  // maxAge -> 1728000000ms -> 240hours -> 20days
});

const setToBillsCache = (uniqueId, data) => {
  try {
    billsCache.set(uniqueId, data);
  } catch (error) {
    console.error(`Cannot set Bill Cache for data - ${data}`, error);
  }
};

const getFromBillsCacheById = (uniqueId) => {
  try {
    return billsCache.get(uniqueId);
  } catch (error) {
    console.error(`Cannot get Bill Cache for id - ${uniqueId}`, error);
  }
};

const deleteBillFromBillCacheById = (uniqueId) => {
  try {
    billsCache.delete(uniqueId);
  } catch (error) {
    console.error(`Unable to remove data for - ${uniqueId}`, error);
  }
};

const getAllCachedBills = () => {
  const billCacheList = [];
  billsCache.forEach((value, key) => {
    billCacheList.push({ cacheId: key, value });
  });
  return billCacheList;
};

module.exports = {
  setToBillsCache,
  getFromBillsCacheById,
  deleteBillFromBillCacheById,
  getAllCachedBills,
};
