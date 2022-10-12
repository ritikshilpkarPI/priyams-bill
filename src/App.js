import "./CSS/App.scss";
import { useContext, useEffect, useState, lazy, Suspense } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { Axios } from "./utils/axios";
import { SegmentedControl, Button } from "@mantine/core";
import { AppStateContext } from "./AppState/appState.context";
import CustomerBill from "./Pages/CustomerBill";
import ProtectedRoutes from "./components/ProtectedRoutes";

// import ProtectedRoutes from "./components/ProtectedRoutes";
const Home = lazy(() => import("./Pages/Home"));
const BillFeed = lazy(() => import("./Pages/BillFeed"));
const Billing = lazy(() => import("./Pages/Billing"));
const DayWiseBillFeed = lazy(() => import("./Pages/DailyBill"));
const EditBill = lazy(() => import("./Pages/EditBill"));
const ItemsList = lazy(() => import("./Pages/ItemsList"));
const OpenClose = lazy(() => import("./Pages/OpenClose"));
const StockQuantity = lazy(() => import("./Pages/StockQuantity"));
const Login = lazy(() => import("./Pages/Login"));

// import { QRComp } from "./qr";

const PAGES = {
  Home: "Home",
  billing: "Billing",
  inventory: "Inventory",
  allBill: "All Bills",
  dayBill: "Day Bills",
  openClose: "Open Close",
  stockquantity: "Shortage Items",
};

function App({ history, location }) {
  const showBill = location.pathname.includes("showbill");
  const { itemsStateAndDispatch } = useContext(AppStateContext);
  const [itemsList, dispatch] = itemsStateAndDispatch;
  const [loaderDisplay, setLoaderDisplay] = useState(true);
  const [value, setValue] = useState(showBill ? {} : Object.keys(PAGES)[1]);
  const staffName = JSON.parse(localStorage.getItem("priyam-store"))?.name;
  const staffUserName = JSON.parse(
    localStorage.getItem("priyam-store")
  )?.username;

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
      history.push(`/${value}`);
    }
    // eslint-disable-next-line
  }, [value, showBill]);

  const logoutUser = async () => {
    // const fetch = await Axios.request({
    //   url: "/api/auth/logout",
    //   method: "get",
    // });

    // if (fetch.data.status === true && fetch.data.message === "logout user") {
    localStorage.removeItem("priyam-store");
    history.push("/login");
    // }
  };

  console.log({ itemsList });

  return (
    <div className="App">
      {localStorage.getItem("priyam-store") && !showBill && (
        <div className="nav-btn">
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
          <Button className="logout-btn" onClick={logoutUser}>
            Logout
          </Button>
        </div>
      )}

      {staffName && <h3 className="staffname">{staffName}</h3>}
      {staffUserName && <p className="staffname">{staffUserName}</p>}

      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route
            exact
            path="/showBill/:customerBillId"
            component={CustomerBill}
          />
          <ProtectedRoutes>
            <Route
              path="/billing"
              exact
              render={() => (
                <Billing
                  loaderDisplay={loaderDisplay}
                  setLoaderDisplay={setLoaderDisplay}
                />
              )}
            />
            <Route path="/openClose" component={OpenClose} />

            <Route exact path="/inventory" component={ItemsList} />
            <Route exact path="/" component={Home} />
            <Route exact path="/dayBill" component={DayWiseBillFeed} />
            <Route exact path="/stockquantity" component={StockQuantity} />
            <Route exact path="/allBill" component={BillFeed} />
          </ProtectedRoutes>
          <Route exact path="/edit/:billingID" component={EditBill} />
        </Switch>
      </Suspense>
      {/* <QRComp /> */}
    </div>
  );
}

export default withRouter(App);
