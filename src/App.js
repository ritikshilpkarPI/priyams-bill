import './CSS/App.scss';
import { Suspense, useEffect } from 'react';
import AppFunction from './functions/AppFunction';
import Header from './components/Header';
import { useDispatch } from 'react-redux';
import { fetchBillingLeanItems } from './utils/fetchBillingLeanItems';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import useGeolocationPermission from './hooks/useGeoLocationPermission';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { getStaffByToken } from './utils/apiUtils';
const defaultTheme = createTheme();

function App() {
  const dispatch = useDispatch();
  const { isGeolocationPermissionGranted, GeoLocationPermission } = useGeolocationPermission();

  const selectedStoreId = useSelector(
    (state) => state.storeInventoryManagement.selectedStoreId
  );
  useEffect(() => {
    dispatch(fetchBillingLeanItems(selectedStoreId));
  }, [selectedStoreId]);

  useEffect(() => {
    getStaffByToken();
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

  return (
    <ThemeProvider theme={defaultTheme}>
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
          {isGeolocationPermissionGranted ? <Outlet /> : <GeoLocationPermission />}
        </Suspense>
        <ToastContainer />
      </div>
    </ThemeProvider>
  );
}

export default App;
