const { getAllCachedBills } = require('../cache/billCacheConfig');
const { UnSavedBill } = require('../db-models/unSavedBill-model');

const getUnSavedBills = async (req, res) => {
  try {
    const unsavedBills = await UnSavedBill.find({});
    const allCachedBills = getAllCachedBills();
    const cachedBillMapByCacheId = allCachedBills.reduce(
      (billMap, cachedBill) => {
        const cacheId = cachedBill && cachedBill.cacheId;
        ({
          ...billMap,
          [cacheId]: {
            billId: cacheId,
            billData: cachedBill,
          },
        })
      },
      {}
    );
    const unsavedUniqueBillList = [
      ...unsavedBills.map((unsavedBill) => {
        const billId = unsavedBill && unsavedBill.data && unsavedBill.data.billId;
        if (cachedBillMapByCacheId[billId]) {
          cachedBillMapByCacheId[billId] = null;
        }
        return unsavedBill;
      }),
      ...Object.values(cachedBillMapByCacheId).filter((value) => value),
    ];

    res.status(200).json({
      success: true,
      message: 'Successfully retrieved unsaved bills',
      unsavedBillList: unsavedUniqueBillList,
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: 'Unable to retrieve unsaved bills',
      unsavedBills: [],
    });
  }
};

module.exports = getUnSavedBills;
