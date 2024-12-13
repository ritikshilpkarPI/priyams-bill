import React, { useEffect, useRef, useState } from 'react';
import OrderCard from 'src/components/OrderCard';
import OrderStatus from 'src/components/OrderStatus';
import { API_METHODS } from 'src/utils/constants/apiMethods';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import { orderMapper } from 'src/utils/orderMapper';
import '../CSS/_orders.scss';
import { Loader, Modal, Button } from '@mantine/core';
import { ORDER_CARDS } from '../utils/constants/orders';

import { useBeep } from 'src/utils/beep';
import { subscribeToPushNotification } from 'src/utils/subscribeToPushNotification';

function Orders() {
  const [userOrders, setUserOrders] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { beep, stopBeep } = useBeep(`${process.env.ORDER_NOTIFICATION_SOUND}`);

  const handleMessage = (event) => {
    if (event.data && event.data.type === 'NOTIFY_REACT') {
      
      beep();
      setTimeout(() => {
        setShowConfirmDialog(true);
      }, 1000);
    }
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      }
    };
  }, []);

  const getUserOrders = async () => {
    setLoader(true);
    try {
      const response = await genericAxios({
        url: API_PATHS.ORDERS.GET_USER_ORDERS,
        method: API_METHODS.GET,
        headers: {
          Cookie: '',
        },
      });
      setUserOrders(orderMapper(response.data.orders));
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
        getUserOrders();
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getUserOrders();
    
    subscribeToPushNotification();
  }, []);

  return (
    <div className="order-card-page-container">
      <Modal
        opened={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        title={`New order inserted. Please confirm the order`}
      >
        <Button
          color="red"
          onClick={() => {
            stopBeep();
            getUserOrders();
            setShowConfirmDialog(false);
          }}
          style={{ display: 'flex', alignItems: 'center', margin: 'auto' }}
        >
          Yes
        </Button>
      </Modal>
      {loader ? (
        <div className="order-loader-container">
          <Loader color="blue" size="xl" />
        </div>
      ) : (
        <>
          <h1>Orders Page</h1>
          <div className="orders-container">
            {ORDER_CARDS.map((card, index) => {
              const { orders = [] } = userOrders[`${card.title}`] || {};
              return (
                <div className="order-status-conatiner" key={index}>
                  <OrderStatus
                    title={card.title}
                    orderStatus={card.title}
                    number={index + 1}
                    children={orders.map((order, index) => {
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
