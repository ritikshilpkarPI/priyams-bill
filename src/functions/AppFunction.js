// import React, { useState, useEffect, useContext } from 'react';
import { useContext, useEffect, useState } from 'react';
import { AppStateContext } from '../AppState/appState.context';
import { PAGES } from '../constants/HeaderTypes';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { API_METHODS } from 'src/utils/constants/apiMethods';

const AppFunction = (history, location) => {
  const showBill = location.pathname.includes('showbill');
  const { itemsStateAndDispatch } = useContext(AppStateContext);
  const [itemsList, dispatch] = itemsStateAndDispatch;
  const [loaderDisplay, setLoaderDisplay] = useState(true);
  const [value, setValue] = useState(showBill ? {} : Object.keys(PAGES)[1]);
  const { name: staffName = '', username: staffUserName = '' } =
    JSON.parse(localStorage.getItem('priyam-store')) || {};

  useEffect(() => {
    (async () => {
    const fetch = await genericAxios({
      url: API_PATHS.INVENTORY.GET_ITEMS,
      method: API_METHODS.GET,
      params: {
        filters: {
          minStockOnly: false,
          isDeleted: false,
        },
      },
      headers: {
        Cookie: '',
      },
    });
    const itemsData = fetch?.data?.message?.items;
    dispatch({ type: 'NEW_ITEMS_LIST', payload: itemsData });
    setLoaderDisplay(false);
 
    })();
    // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    if (!showBill) {
      history.push(`/${value}`);
    }
    // eslint-disable-next-line
  }, [value, showBill]);

  const logoutUser = async () => {
    localStorage.removeItem('priyam-store');
    history.push('/login');
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
