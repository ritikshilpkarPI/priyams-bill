import './App.scss';

import {
  lazy,
  Suspense,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';

import { SegmentedControl } from '@mantine/core';

import { AppStateContext } from './AppState/appState.context';
import CustomerBill from './Pages/CustomerBill';
import { Axios } from './utils/axios';

const BillFeed = lazy(() => import("./Pages/BillFeed"));
const Billing = lazy(() => import("./Pages/Billing"));
const DayWiseBillFeed = lazy(() => import("./Pages/DailyBill"));
const EditBill = lazy(() => import("./Pages/EditBill"));
const ItemsList = lazy(() => import("./Pages/ItemsList"));
const OpenClose = lazy(() => import("./Pages/OpenClose"));
const StockQuantity = lazy(() => import("./Pages/StockQuantity"));
const MiscellaneousExpenses = lazy(() =>
  import("./Pages/MiscellaneousExpenses")
);

// import { QRComp } from "./qr";

const PAGES = {
  "/": "Home",
  billing: "Billing",
  inventory: "Inventory",
  allBill: "All Bills",
  dayBill: "Day Bills",
  openClose: "Open Close",
  stockquantity: "Shortage Items",
  expenses: "Expenses",
};

function App({ history, location }) {
  const showBill = location.pathname.includes("showbill");
  const { itemsStateAndDispatch } = useContext(AppStateContext);
  const [itemsList, dispatch] = itemsStateAndDispatch;
  const [loaderDisplay, setLoaderDisplay] = useState(true);
  const [value, setValue] = useState(showBill ? {} : Object.keys(PAGES)[1]);
  useEffect(() => {
    (async () => {
      const fetch = await Axios.request({
        url: "/api/inventory/items",
        method: "get",
        params: {
          filters: {
            minStockOnly: false,
            isDeleted: false,
          },
        },
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
    if (!showBill) {
      history.push(value);
      console.log(true);
    }
  }, [value, history]);

  console.log({ itemsList });

  return (
    <>
      <div className="App">
        <div className="nav-btn">
          {showBill ? (
            ''
          ) : (
            <SegmentedControl
              value={value}
              onChange={setValue}
              color="blue"
              radius="md"
              size="md"
              data={Object.keys(PAGES).map((page) => ({
                label: PAGES[page],
                value: page,
              }))}
            />
          )}
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/openClose" component={OpenClose} />
            <Route
              exact
              path="/showBill/:customerBillId"
              component={CustomerBill}
            />
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
            <Route path="/expenses" component={MiscellaneousExpenses} />
            <Route path="/stockquantity" component={StockQuantity} />
            <Route path="/stockquantity" component={StockQuantity} />
            <Route path="/allBill" component={BillFeed} />
            <Route path="/:billingID" component={EditBill} />
          </Switch>
        </Suspense>
        {/* <QRComp /> */}
      </div>
    </>
  );
}

export default withRouter(App);
