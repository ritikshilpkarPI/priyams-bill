import './App.scss';

import {
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';

import { Button } from '@mantine/core';

import { AppStateContext } from './AppState/appState.context';
import { BillFeed } from './Components/BillFeed';
import { Billing } from './Components/Billing';
import DayWiseBillFeed from './Components/DailyBill';
import EditBill from './Components/EditBill';
import { ItemsList } from './Components/ItemsList';
import { OpenClose } from './Components/OpenClose';
import StockQuantity from './Components/StockQuantity';
import { Axios } from './utils/axios';

// import { QRComp } from "./qr";

function App({ history }) {
  const [allBills, setAllBills] = useState();
  const { itemsStateAndDispatch } = useContext(AppStateContext);
  const [itemsList, dispatch] = itemsStateAndDispatch;
  const [loaderDisplay, setLoaderDisplay] = useState(true);



  useEffect(() => {
    (async () => {
      const fetch = await Axios.request({
        url: "/api/inventory/items",
        method: "get",
        headers: {
          Cookie: "",
        },
      });
      const itemsData = fetch.data.message.items;
      dispatch({ type: "NEW_ITEMS_LIST", payload: itemsData });
      setLoaderDisplay(false);
    })();
  }, [dispatch]);

  useEffect(() => {
    const getBillFeed = async () => {
      const fetch = await Axios.request({
        url: "/api/billing/getBillFeed",
        method: "get",
        params: {
          page: 1,
          size: 50,
        },
        headers: {
          Cookie: "",
        },
      });
      setAllBills(fetch.data.message.allBill);
    };
    getBillFeed();
    // setAllBills([]);
  }, []);

  console.log({ itemsList });

  return (
    <div className="App">
      <div className="nav-btn">
        <Button onClick={() => history.push("/")}>Home</Button>
        <Button onClick={() => history.push("billing")}>Billing</Button>
        <Button onClick={() => history.push("inventory")}>Inventory</Button>
        <Button onClick={() => history.push("allBill")}>All Bills</Button>
        <Button onClick={() => history.push("dayBill")}>Day Wise Bills</Button>
        <Button onClick={() => history.push("openClose")}>Open Close</Button>
        <Button onClick={() => history.push("stockquantity")}>Stock Quantity</Button>
      </div>
      <Switch>
        <Route path="/openClose" component={OpenClose} />
        <Route
          path="/billing"
          render={() => (
            <Billing
              loaderDisplay={loaderDisplay}
              setLoaderDisplay={setLoaderDisplay}
            />
          )}
        />
        <Route path="/inventory" component={ItemsList} />
        <Route path="/dayBill" component={DayWiseBillFeed} />
        <Route path="/stockquantity" component={StockQuantity} />
        <Route path="/allBill" render={() => <BillFeed bills={allBills} />} />
        <Route path="/:billingID" component={EditBill} />
      </Switch>
      {/* <QRComp /> */}
    </div>
  );
}

export default withRouter(App);
