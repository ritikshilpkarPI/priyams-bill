import { useEffect, useState } from 'react';
import { Loader } from '@mantine/core';
import { DateRangePicker, DateRangePickerValue } from '@mantine/dates';
import { Typography, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { showNotification } from '@mantine/notifications';

import { StoreSelect } from 'src/components/StoreSelect';
import BillFeed from './BillFeed';
import {
  setSelectedStore,
  setStores,
} from 'src/redux/storeInventoryManagement/storeInventoryManagementSlice';
import {
  getAllStoresAPI,
  getBillFeedAPI,
} from 'src/utils/apiUtils';

const AllBills = ({ fromDayWise = false, bills = [] }) => {
  const dispatch = useDispatch();

  const [allBills, setAllBills] = useState<BillState[]>([]);
  const [totalBillCount, setTotalBillCount] = useState(0);
  const [loader, setLoader] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangePickerValue>([
    new Date(),
    new Date(Date.now() + 24 * 60 * 60 * 1000),
  ]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [hasInitialDateLoaded, setHasInitialDateLoaded] = useState(false);

  const stores = useSelector(
    (state: RootState) => state.storeInventoryManagement.stores
  );
  const selectedStoreId = useSelector(
    (state: RootState) => state.storeInventoryManagement.selectedStoreId
  );
  const storeObject = stores.find((store) => store.code === selectedStoreId);

  const handleStoreChange = (storeId: string) => {
    dispatch(setSelectedStore(storeId));
  };

  const fetchStores = async () => {
    try {
      const res = await getAllStoresAPI();
      const firstStore = res?.stores?.[0];

      if (!firstStore) return;

      dispatch(setStores(res.stores));
      dispatch(setSelectedStore(firstStore.code));
      return firstStore;
    } catch (error) {
      showNotification({ message: 'Failed to load stores', color: 'red' });
      return;
    }
  };

  const getBillFeed = async (
    storeId: string,
    start: Date,
    end: Date,
    page = 1,
    pageSize = 10
  ) => {
    setLoader(true);

    try {
      const response = await getBillFeedAPI(
        page,
        pageSize,
        start.toISOString(),
        end.toISOString(),
        storeId
      );

      const allBill = response?.message?.allBill;
      const billCount = response?.message?.billCount;

      if (!Array.isArray(allBill)) {
        showNotification({ message: 'Failed to load bills', color: 'red' });
        return;
      }

      setAllBills(allBill);
      setTotalBillCount(billCount || 0);
    } catch (error) {
      showNotification({ message: 'Failed to load bills', color: 'red' });
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoader(true)

      const firstStore = await fetchStores();
      if (!firstStore?._id){
        setLoader(false)
        return;
      } 

      setHasInitialDateLoaded(true);

      await getBillFeed(firstStore._id, dateRange[0]!, dateRange[1]!);
    };

    init();
  }, []);

  useEffect(() => {
    if (
      hasInitialDateLoaded &&
      dateRange.filter(Boolean).length === 2 &&
      storeObject?._id
    ) {
      getBillFeed(
        storeObject._id,
        dateRange[0]!,
        dateRange[1]!,
        pagination.page,
        pagination.pageSize
      );
    }
  }, [dateRange, storeObject, pagination]);

  return loader ? (
    <Box
      sx={{
        height: '95vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Loader color="blue" size="xl" />
    </Box>
  ) : (
    <>
    <Box p={2}>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        All Bill
      </Typography>
      <StoreSelect
        stores={stores}
        value={selectedStoreId}
        onChange={handleStoreChange}
        />
      <DateRangePicker
        mb={10}
        style={{ width: '350px' }}
        label="Date Range"
        placeholder="Pick dates range"
        value={dateRange}
        onChange={setDateRange}
        />
      <BillFeed
        pagination={pagination}
        setPagination={setPagination}
        totalBillCount={totalBillCount}
        bills={allBills}
        fromDayWise={fromDayWise}
        isLoading={loader}
        />
    </Box>
        </>
  );
};

export default AllBills;
