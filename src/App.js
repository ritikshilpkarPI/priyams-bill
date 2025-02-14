import './CSS/App.scss';
import { useEffect } from 'react';
import AppFunction from './functions/AppFunction';
import Header from './components/Header';
import { genericAxios } from './utils/genericAxiosMethod';
import { useDispatch } from 'react-redux';
import { fetchBillingLeanItems } from './utils/fetchBillingLeanItems';
import { Outlet } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
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

  const devBg = process.env.NODE_ENV !== 'production' ? 'indianred' : 'none';
  console.log("Test Prod")

  return (
    <div className="App" style={{ backgroundColor: devBg }}>
        {staffUserName && (
          <Header
            staffName={staffName}
            staffUserName={staffUserName}
            showBill={showBill}
            setValue={setValue}
            value={value}
            logoutUser={logoutUser}
          />
      )}
      <Outlet />
      {/* <QRComp /> */}
    </div>
  );
}

export default App;
