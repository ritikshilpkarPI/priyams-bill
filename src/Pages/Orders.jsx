import React, { useEffect, useState } from 'react';
import OrderCard from 'src/components/OrderCard';
import OrderStatus from 'src/components/OrderStatus';
import { API_METHODS } from 'src/utils/constants/apiMethods';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import { orderMapper } from 'src/utils/orderMapper';
import '../CSS/_orders.scss';
import { Loader } from '@mantine/core';

function Orders() {
  const [orders, setOrders] = useState({});
  const [loader, setLoader] = useState(false);
  const callAPi = async () => {
    setLoader(true);
    const response = await genericAxios({
      url: API_PATHS.ORDERS.GET_USER_ORDERS,
      method: API_METHODS.GET,
      headers: {
        Cookie: '',
      },
    });
    setOrders(orderMapper(response.data.orders));
    setLoader(false);
  };
  useEffect(() => {
    callAPi();
  }, []);
  console.log({ orders });

  return (
    <div className="order-card-page-container">
      {loader ? (
        <Loader color="blue" size="lg" />
      ) : (
        <div className="orders-container">
          <div className="order-status-conatiner">
            <OrderStatus
              title={'Pending Confirmation Orders'}
              orderStatus={'pending_confirmation'}
              children={
                orders?.pending_confirmation &&
                orders?.pending_confirmation.orders.map((ele) => {
                  return (
                    <div>
                      <OrderCard order={ele} />
                    </div>
                  );
                })
              }
            />
          </div>
          <div className="order-status-conatiner">
            <OrderStatus
              title={'Pending Packaging Orders'}
              orderStatus={'pending_packaging'}
              children={
                orders?.pending_packaging &&
                orders?.pending_packaging.orders.map((ele) => {
                  return <OrderCard order={ele} />;
                })
              }
            />
          </div>
          <div className="order-status-conatiner">
            <OrderStatus
              title={'Pending dispatch Orders'}
              orderStatus={'pending_dispatch'}
              children={
                orders?.pending_dispatch &&
                orders?.pending_dispatch.orders.map((ele) => {
                  return <OrderCard order={ele} />;
                })
              }
            />
          </div>
          <div className="order-status-conatiner">
            <OrderStatus
              title={'Pending delivery dispatch Orders'}
              orderStatus={'pending_delivery_dispatch'}
              children={
                orders?.pending_delivery_dispatch &&
                orders?.pending_delivery_dispatch.orders.map((ele) => {
                  return <OrderCard order={ele} />;
                })
              }
            />
          </div>
          <div className="order-status-conatiner">
            <OrderStatus
              title={'Delivered Successfully Orders'}
              orderStatus={'delivered_successfully'}
              children={
                orders?.delivered_successfully &&
                orders?.delivered_successfully.orders.map((ele) => {
                  return <OrderCard order={ele} />;
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
