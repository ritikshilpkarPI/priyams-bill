import './CSS/App.scss';
import { Suspense, useEffect } from 'react';
import AppFunction from './functions/AppFunction';
import Header from './components/Header';
import { genericAxios } from './utils/genericAxiosMethod';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBillingLeanItems } from './utils/fetchBillingLeanItems';
import { Outlet } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import {
  checkGeolocationPermissionGranted,
  getDeviceLocation,
} from './utils/getDeviceLocationPoints';
import { GeolocationToggle } from './components/GeolocationPermission/GeolocationPermission';
import {
  setGeolocationPermissionGranted,
  setUserDeviceLocation,
} from './redux/user/userSlice';
import {
  selectDeviceLocation,
  selectGeolocationPermission,
} from './redux/user/userSelectors';

function App() {
  const dispatch = useDispatch();
  const isGeolocationPermissionGranted = useSelector(
    selectGeolocationPermission
  );
  useEffect(() => {
    dispatch(fetchBillingLeanItems());
  }, []);
  useEffect(() => {
    const timeOut = 36_00_000;
    async function saveBills() {
      // get all bill Ids from localStorage at once
      const unSavedBillIds = Object.keys(localStorage);

      if (unSavedBillIds.length) {
        for (let i = 0; i < unSavedBillIds.length; i++) {
          const billId = unSavedBillIds[i];
          const billObject = JSON.parse(localStorage.getItem(billId));

          const { url, method, data: billData } = billObject;

          const response = await saveBill({
            url,
            method,
            data: billData,
          });

          if (response.status === 200) {
            localStorage.removeItem(billId);
          }
        }

      }
      console.log("api call will start in " + timeOut + "ms")
      setTimeout(saveBills, timeOut);
    }

    async function saveBill(bill) {
      const requestConfig = {
        ...bill,
        headers: {
          Cookie: '',
        },
      };

      return genericAxios(requestConfig);
    }

    setTimeout(saveBills, timeOut);
  }, []);
  const {
    logoutUser,
    staffName,
    staffUserName,
    showBill,
    value,
    setValue,
  } = AppFunction();

  const devBg = process.env.NODE_ENV !== 'production' ? 'none' : 'none';
  console.log("Test Prod")

  useEffect(() => {
    checkGeolocationPermissionGranted()
      .then((val) => {
        dispatch(setGeolocationPermissionGranted(val));
      })
      .catch((error) => {
        console.error('Geolocation permission denied', error);
        toast.error(error?.message);
      });
  }, []);

  useEffect(() => {
    if (isGeolocationPermissionGranted) {
      getDeviceLocation()
        .then((position) => {
          dispatch(setUserDeviceLocation(position));
        })
        .catch((error) => {
          console.error('Geolocation error', error);
          toast.error(error?.message);
        });
    }
  }, [isGeolocationPermissionGranted]);

  return (
    <div className="App" style={{ backgroundColor: devBg }}>
      {staffUserName && isGeolocationPermissionGranted && (
        <Header
          staffName={staffName}
          staffUserName={staffUserName}
          showBill={showBill}
          setValue={setValue}
          value={value}
          logoutUser={logoutUser}
        />
      )}
      <Suspense fallback={<p>Loading...</p>}>
        {isGeolocationPermissionGranted ? <Outlet /> : <GeolocationToggle />}
      </Suspense>
      <ToastContainer />
      {/* <QRComp /> */}
    </div>
  );
}

export default App;
