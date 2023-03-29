// import React, { useState, useEffect, useContext } from 'react';
import { useContext, useEffect, useState } from 'react';
import { AppStateContext } from '../AppState/appState.context';
import { PAGES } from '../constants/HeaderTypes';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { API_METHODS } from 'src/utils/constants/apiMethods';
import { parseJwt } from 'src/utils/cookie';
import Cookies from 'js-cookie';

const AppFunction = (history, location) => {
  const showBill = location.pathname.includes('showbill');
  const { itemsStateAndDispatch } = useContext(AppStateContext);
  const [itemsList, dispatch] = itemsStateAndDispatch;
  const [loaderDisplay, setLoaderDisplay] = useState(true);
  const [value, setValue] = useState(showBill ? {} : Object.keys(PAGES)[1]);
  const { name: staffName = '', username: staffUserName = '' } =
    parseJwt(Cookies.get('token')) || {};

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
      if (fetch.error) return;
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
    await genericAxios({
      url: API_PATHS.AUTH.GET_LOGOUT,
      method: API_METHODS.GET,
    });
    Cookies.remove('token');
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
