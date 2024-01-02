import './CSS/App.scss';
import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import AppFunction from './functions/AppFunction';
import StoreRoutes from './components/StoreRoutes';
import Header from './components/Header';
import { genericAxios } from './utils/genericAxiosMethod';

function App({ history, location }) {
  console.log({ env: Object.keys(localStorage) });
  useEffect(() => {
    async function saveBills() {
      // get all bill Ids from localStorage at once
      const unSavedBillIds = Object.keys(localStorage);

      if (unSavedBillIds.length) {
        const billSaves = unSavedBillIds.map(async (billId) => {
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
        });

        await Promise.allSettled(billSaves);
      }
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

    const intervalId = setInterval(saveBills, 36_00_000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  const {
    logoutUser,
    loaderDisplay,
    setLoaderDisplay,
    staffName,
    staffUserName,
    showBill,
    value,
    setValue,
  } = AppFunction(history, location);

  const devBg = process.env.NODE_ENV !== 'production' ? 'indianred' : 'none';
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
      <StoreRoutes
        setLoaderDisplay={setLoaderDisplay}
        loaderDisplay={loaderDisplay}
        style={{ marginLeft: '100px' }}
      />

      {/* <QRComp /> */}
    </div>
  );
}

export default withRouter(App);
