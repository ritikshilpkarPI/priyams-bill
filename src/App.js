import { useEffect, useContext } from "react";
import { Button } from "@mantine/core";
// import { ItemsList } from "./Components/ItemsList";
import { AppStateContext } from "./AppState/appState.context";
import { Axios } from "./utils/axios";
import { Route, Switch, withRouter } from "react-router-dom";
import { Billing } from "./Components/Billing";
import { BillFeed } from "./Components/BillFeed";
import "./App.scss";
// import { QRComp } from "./qr";

function App({ history }) {
  const { itemsStateAndDispatch } = useContext(AppStateContext);
  const [itemsList, dispatch] = itemsStateAndDispatch;
  useEffect(() => {
    (async () => {
      const fetch = await Axios.request({
        url: "/api/inventory/items",
        method: "get",
        headers: {
          Cookie: "",
        },
      });
      dispatch({ type: "ADD_ITEM", payload: fetch.data.message.items });
    })();
  }, [dispatch]);

  console.log({ itemsList });

  return (
    <div className="App">
      <div className="nav-btn">
        <Button onClick={() => history.push("/")}>Home</Button>
        <Button onClick={() => history.push("billing")}>Billing</Button>
        {/* <Button onClick={() => history.push("inventory")}>Inventory</Button> */}
        <Button onClick={() => history.push("allBill")}>All Bills</Button>
      </div>
      <Switch>
        <Route path="/billing" component={Billing} />
        {/* <Route path="/inventory" component={ItemsList} /> */}
        <Route path="/allBill" component={BillFeed} />
      </Switch>
      {/* <QRComp /> */}
    </div>
  );
}

export default withRouter(App);
