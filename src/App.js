import "./App.scss";
import { useContext, useEffect, useState, lazy, Suspense } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { Axios } from "./utils/axios";
import { Button } from "@mantine/core";
import { AppStateContext } from "./AppState/appState.context";

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

function App({ history }) {
  const { itemsStateAndDispatch } = useContext(AppStateContext);
  const [itemsList, dispatch] = itemsStateAndDispatch;
  const [loaderDisplay, setLoaderDisplay] = useState(true);

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
        <Button onClick={() => history.push("stockquantity")}>
          Shortage Product
        </Button>
        <Button onClick={() => history.push("expenses")}>Expenses</Button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
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
          <Route path="/expenses" component={MiscellaneousExpenses} />
          <Route path="/stockquantity" component={StockQuantity} />
          <Route path="/allBill" component={BillFeed} />
          <Route path="/:billingID" component={EditBill} />
        </Switch>
      </Suspense>
      {/* <QRComp /> */}
    </div>
  );
}

export default withRouter(App);
