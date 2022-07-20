import { useEffect, useContext } from "react";
import { Button } from "@mantine/core";
import { ItemsList } from "./Components/ItemsList";
import { AppStateContext } from "./AppState/appState.context";
import Axios from "axios";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Billing } from "./Components/Billing";
import { BillFeed } from "./Components/BillFeed";
import "./App.scss";
// import { QRComp } from "./qr";

export default function App() {
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
      // console.log({ itemsList: fetch.data.message.items });
    })();
  }, []);
  return (
    <div className="App">
      {/* <button onClick={() => history.push("/billing")}>Billing</button> */}
      <Router>
        <ul className="home-nav">
          <li>
            <Button>
              <Link to="/">Home</Link>
            </Button>
          </li>
          <li>
            <Button>
              <Link to="/billing">Billing</Link>
            </Button>
          </li>
          <li>
            <Button>
              <Link to="/inventory">Inventory</Link>
            </Button>
          </li>
          <li>
            <Button>
              <Link to="/allBill">All Bills</Link>
            </Button>
          </li>
        </ul>
        <Switch>
          <Route path="/billing" component={Billing} />
          <Route path="/inventory" component={ItemsList} />
          <Route path="/allBill" component={BillFeed} />
        </Switch>
      </Router>
      {/* <QRComp /> */}
    </div>
  );
}
