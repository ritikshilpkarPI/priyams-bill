import { LoadingOverlay } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import PurchaseDetailsApproval from 'src/components/PurchaseApproval/PurchaseDetailsApproval';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { API_METHODS } from 'src/utils/constants/apiMethods';
import { useLocation } from 'react-router-dom';
import { genericAxios } from 'src/utils/genericAxiosMethod'; 

const Approval = () => {
  const [filter, setFilter] = useState([]);
  const [Loading, setLoading] = useState(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  let option = query.get('option');
  option = option.split(' ')[0];
  useEffect(() => {
    getOrders();
    // eslint-disable-next-line
  }, [option]);

  const getOrders = async (value) => {
    try {
      onLoader();
      let query = {};
      const role = JSON.parse(localStorage.getItem('priyam-store')).role;
      if ((value === 'approved' || option === 'Approved') && role === 'admin') {
        query = { isApproved: true };
      } else if (
        (value === 'draft' || option === 'Drafted') &&
        role === 'admin'
      ) {
        query = { isDraft: true, isApproved: false };
      } else if (value === 'rejected' || option === 'Rejected') {
        query = { isRejected: true };
      } else if (value === 'saved' || option === 'Saved') {
        query = { isDraft: false, isRejected: false };
      } else if (role !== 'admin') {
        query = { isApproved: false, isDraft: false };
      }
      const  {data}  = await genericAxios({
        method: API_METHODS.POST,
        url: API_PATHS.PURCHASE_ORDER.GET_ORDERS_BY_QUERY,
        data: {
          query,
        },
      });
      const { orders } = data;
      setFilter([...orders]);
      offLoader();
    } catch (err) {
      offLoader();
      console.log({ err });
    }
  };

  const onLoader = () => {
    setLoading(true);
    hideScrollBar();
  };
  const offLoader = () => {
    setLoading(false);
    showScrollBar();
  };
  const hideScrollBar = () => {
    window.scrollTo(0, 0);
    document.body.style.overflowY = 'hidden';
    document.body.style.overflowX = 'hidden';
  };
  const showScrollBar = () => {
    document.body.style.overflowY = 'visible';
    document.body.style.overflowX = 'visible';
  };
  return (
    <div>
      <LoadingOverlay
        className="purchase-loader"
        visible={Loading}
        overlayBlur={1}
      />
      <PurchaseDetailsApproval
        getOrders={getOrders}
        allPurchaseList={filter}
        setAllPurchaseList={setFilter}
      />
    </div>
  );
};

export default Approval;
