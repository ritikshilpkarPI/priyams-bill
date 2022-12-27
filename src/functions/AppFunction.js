// import React, { useState, useEffect, useContext } from 'react';
import { useContext, useEffect, useState } from "react";
import { Axios } from "../utils/axios";
import { AppStateContext } from "../AppState/appState.context";
import { PAGES } from "../constants/HeaderTypes";

const AppFunction = (history, location) => {
  const showBill = location.pathname.includes("showbill");
  const { itemsStateAndDispatch } = useContext(AppStateContext);
  const [itemsList, dispatch] = itemsStateAndDispatch;
  const [loaderDisplay, setLoaderDisplay] = useState(true);
  const [value, setValue] = useState(showBill ? {} : Object.keys(PAGES)[2]);
  const { name: staffName = "", username: staffUserName = "" } =
    JSON.parse(localStorage.getItem("priyam-store")) || {};

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
      const itemsData = fetch?.data?.message?.items || itemsList;
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
    localStorage.removeItem("priyam-store");
    history.push("/login");
  };

  return {
    logoutUser,
    setValue,
    setLoaderDisplay,
    loaderDisplay,
    staffName,
    staffUserName,
    itemsList,
    showBill,
    value,
  };
};
export default AppFunction;
