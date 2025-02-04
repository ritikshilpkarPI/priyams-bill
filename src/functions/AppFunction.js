// import React, { useState, useEffect, useContext } from 'react';
import { useState } from 'react';
import { PAGES } from '../constants/HeaderTypes';
import { genericAxios } from '../utils/genericAxiosMethod';
import { API_PATHS } from '../utils/constants/apiPaths';
import { API_METHODS } from '../utils/constants/apiMethods';
import { parseJwt } from '../utils/cookie';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AppFunction = (history, location) => {
  const showBill = location.pathname.includes('showbill');
  const navigate = useNavigate();
  const [value, setValue] = useState(showBill ? {} : Object.keys(PAGES)[1]);
  const { name: staffName = '', username: staffUserName = '' } =
    parseJwt(Cookies.get('token')) || {};

  const logoutUser = async () => {
    await genericAxios({
      url: API_PATHS.AUTH.GET_LOGOUT,
      method: API_METHODS.GET,
    });
    Cookies.remove('token');
    navigate('/login');
  };

  return {
    logoutUser,
    setValue,
    staffName,
    staffUserName,
    showBill,
    value,
  };
};
export default AppFunction;
