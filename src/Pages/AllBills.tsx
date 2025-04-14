import { useEffect, useState } from 'react';
import { Loader } from '@mantine/core';
import { DateRangePicker, DateRangePickerValue } from '@mantine/dates';
import { Typography, Box } from '@mui/material';
import { genericAxios } from '../utils/genericAxiosMethod';
import { API_PATHS } from '../utils/constants/apiPaths';
import { API_METHODS } from '../utils/constants/apiMethods';
import BillFeed from './BillFeed';
import { useSelector } from 'react-redux';
import { StoreSelect } from 'src/components/StoreSelect';
import { setSelectedStore, setStores } from 'src/redux/storeInventoryManagement/storeInventoryManagementSlice';
import { useDispatch } from 'react-redux';
import { getAllStoresAPI } from 'src/utils/apiUtils';
import { showNotification } from '@mantine/notifications';

const AllBills = ({ fromDayWise = false, bills = [] }) => {
  const [allBills, setAllBills] = useState<BillState[]>([]);
  const [totalBillCount, setTotalBillCount] = useState(0);
  const [dateRange, setDateRange] = useState<DateRangePickerValue>([
    new Date(),
    new Date(),
  ]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [loader, setLoader] = useState(false);
  const selectedStoreId = useSelector(
    (state: RootState) => state.storeInventoryManagement.selectedStoreId
  );

  const stores = useSelector(
    (state: RootState) => state.storeInventoryManagement.stores
  );


 const storeObject = stores.find(
    (store) => store.code === selectedStoreId
  );

  const getBillFeed = async (date: DateRangePickerValue) => {
    setLoader(true);
    const fetch: any = await genericAxios({
      url: API_PATHS.BILLING.GET_BILL_FEED,
      method: API_METHODS.GET,
      params: {
        page: pagination.page,
        size: pagination.pageSize,
        startDate: date[0],
        endDate: date[1],
        storeId: storeObject?._id,
      },
      headers: {
        Cookie: '',
      },
    });
    if (fetch.error) return;
    setAllBills(fetch.data.message.allBill);
    setTotalBillCount(fetch.data.message.billCount);
    setLoader(false);
  };

  useEffect(() => {
    if (bills.length) {
      setAllBills(bills);
    } else {
      getBillFeed(dateRange);
    }
    // eslint-disable-next-line
  }, [pagination, selectedStoreId]);

  const dispatch = useDispatch()

 const handleStoreChange = (storeId:string) => {
    dispatch(setSelectedStore(storeId));
  };

    useEffect(() => {
      const fetchStores = async () => {
        try {
          const res = await getAllStoresAPI();
          if (!res.stores) {
            showNotification({ message: 'No stores found', color: 'red' });
            return;
          }  
          dispatch(setStores(res.stores));
        } catch (error) {
          showNotification({ message: 'Failed to load stores', color: 'red' });
        }
      };
  
      fetchStores();
    }, [dispatch]);



  return (
    <>
      {loader ? (
        <div
          style={{
            height: '95vh',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loader color="blue" size="xl" />
        </div>
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
              onChange={(val) => {
                setDateRange(val);
                if (val.filter(Boolean).length === 2) getBillFeed(val);
              }}
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
      )}
    </>
  );
};

export default AllBills;
