import React, { useEffect, useState } from 'react';
import OrderCard from 'src/components/OrderCard';
import OrderStatus from 'src/components/OrderStatus';
import { API_METHODS } from 'src/utils/constants/apiMethods';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import { orderMapper } from 'src/utils/orderMapper';
import '../CSS/_orders.scss';

function Orders() {
  const [orders, setOrders] = useState({});
  const callAPi = async () => {
    const response = await genericAxios({
      url: API_PATHS.ORDERS.GET_USER_ORDERS,
      method: API_METHODS.GET,
      headers: {
        Cookie: '',
      },
    });
    setOrders(orderMapper(response.data.orders));
  };
  useEffect(() => {
    callAPi();
  }, []);
  console.log({ orders });

  return (
    <div className="orders-container">
      <OrderStatus title={"Pending Confirmation Orders"} 
    children={
      orders?.pending_confirmation &&
      orders?.pending_confirmation.orders.map((ele) => {
        return <OrderCard order={ele} />;
      })
    } 
    />
     <OrderStatus title={"Pending Packaging Orders"} 
    children={
      orders?.pending_packaging &&
      orders?.pending_packaging.orders.map((ele) => {
        return <OrderCard order={ele} />;
      })
    }
    />
     <OrderStatus title={"Pending dispatch Orders"} 
    children={
      orders?.pending_dispatch &&
      orders?.pending_dispatch.orders.map((ele) => {
        return <OrderCard order={ele} />;
      })
    }
    />
      <OrderStatus
        title={'Pending delivery dispatch Orders'}
        children={
          orders?.pending_delivery_dispatch &&
          orders?.pending_delivery_dispatch.orders.map((ele) => {
            return <OrderCard order={ele} />;
          })
        }
      />
      <OrderStatus title={"Delivered Successfully Orders"} 
     
    children={
      orders?.delivered_successfully &&
      orders?.delivered_successfully.orders.map((ele) => {
        return <OrderCard order={ele} />;
      })
    }
    />
    </div>
  );
}

export default Orders;
