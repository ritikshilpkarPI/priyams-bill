import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_METHODS } from 'src/utils/constants/apiMethods';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import { orderMapper } from 'src/utils/orderMapper';

function OrderStatusDetail() {
  const { orderStatus } = useParams();
  const [orders, setOrders] = useState({});
  const callAPi = async () => {
    const response = await genericAxios({
      url: `${API_PATHS.ORDERS.GET_USER_ORDERS}?orderStatus=${orderStatus}`,
      method: API_METHODS.GET,
    });
    setOrders( orderMapper(response.data.orders)[`${orderStatus}`].orders);
  };
  useEffect(() => {
    callAPi();
  }, []);
  console.log({ orders });
  return <div>OrderStatusDetail</div>;
}

export default OrderStatusDetail;
