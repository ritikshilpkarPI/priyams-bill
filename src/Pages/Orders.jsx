import React, { useEffect, useState } from 'react';
import OrderCard from 'src/components/OrderCard';
import OrderStatus from 'src/components/OrderStatus';
import { API_METHODS } from 'src/utils/constants/apiMethods';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import { orderMapper } from 'src/utils/orderMapper';
import '../CSS/_orders.scss';
import { Loader } from '@mantine/core';
import { ORDER_CARDS } from '../utils/constants/orders';

function Orders() {
  const [purchaseOrder, setPurchaseOrder] = useState([]);
  const [loader, setLoader] = useState(false);
  const getOnlineOrders = async () => {
    setLoader(true);
    try {
      const response = await genericAxios({
        url: API_PATHS.ORDERS.GET_USER_ORDERS,
        method: API_METHODS.GET,
        headers: {
          Cookie: '',
        },
      });
      setPurchaseOrder(orderMapper(response.data.orders));
      
    } catch (error) {
      console.error(error);
    }
    setLoader(false);
  };

  const updateOrderStatus = async (orderStatusStep, id, buttonStatus) => {
    try {
      if (window.confirm(`Do you want to ${buttonStatus}`)) {
        setLoader(true);
        await genericAxios({
          url: API_PATHS.ORDERS.UPDATE_USER_ORDERS,
          method: API_METHODS.POST,
          data: {
            step: ++orderStatusStep,
            id,
          },
          headers: {
            Cookie: '',
          },
        });
        setLoader(false);
        getOnlineOrders();
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getOnlineOrders();
  }, []);
  return (
    <div className="order-card-page-container">
      {loader ? (
        <div className="order-loader-container">
          <Loader color="blue" size="xl" />
        </div>
      ) : (
        <>
          <h1>Orders Page</h1>
          <div className="orders-container">
            {ORDER_CARDS.map((card, index) => {
              const { orders = [] } = purchaseOrder[`${card.title}`] || {};
              return (
                <div className="order-status-conatiner" key={index}>
                  <OrderStatus
                    title={card.title}
                    orderStatus={card.title}
                    number={index}
                    children={orders.map((order,index) => {
                      return (
                        <div key={index}>
                            <OrderCard
                              order={order}
                              buttonStatus={card.button}
                              updateOrderStatus={updateOrderStatus}
                            />
                        </div>
                      );
                    })}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Orders;
