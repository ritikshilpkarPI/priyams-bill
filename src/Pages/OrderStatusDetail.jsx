import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_METHODS } from 'src/utils/constants/apiMethods';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import { orderMapper } from 'src/utils/orderMapper';
import { Loader, Table, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import OrderDetail from 'src/components/OrderDetail';
import '../CSS/orderStatusDetail.scss'

function OrderStatusDetail() {
  const { orderStatus } = useParams();
  const [purchasedOrders, setPurchasedOrders] = useState([]);
  const [order, setOrder] = useState({});
  const [loader, setLoader] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const callAPi = async () => {
    setLoader(true)
    const response = await genericAxios({
      url: `${API_PATHS.ORDERS.GET_USER_ORDERS}?orderStatus=${orderStatus}`,
      method: API_METHODS.GET,
    });
    setPurchasedOrders(orderMapper(response?.data?.orders)[`${orderStatus}`].orders);
    setLoader(false)
  };

  const rows = purchasedOrders?.map((order, index) => {
    return (
      <tr key={index} onClick={() => {
        setOrder(order)
        open()
      }}>
        <td>{order?.orderNumber}</td>
        <td>{new Date(order?.orderDate).toLocaleDateString()}</td>
        <td>{order?.contactNumber}</td>
        <td>{order?.paymentId}</td>
        <td>{order?.paymentMethod}</td>
        <td>{order?.shippingAddress.address}</td>
        <td>{order?.timeSlot}</td>
        <td>{order?.totalPayableAmount}</td>
        <td>{order?.totalQuantity}</td>
      </tr>
    );
  })
  
  useEffect(() => {
    callAPi();
  }, []);

  return (
    <div>
      {loader ? (
        <div className='order-loader-container'>
          <Loader color="blue" size="xl" />
        </div>
      ) : (
        <>
          <h3 className='order-status-title'>{orderStatus.split('_').join(" ")}</h3>
          <Table captionSide='top' withBorder={true} highlightOnHover verticalSpacing="xl" fontSize="md">
            <thead className="heading">
              <tr>
                <th>
                  <Text align="center">Order Number</Text>
                </th>
                <th>
                  <Text align="center">Order Date</Text>
                </th>
                <th>
                  <Text align="center">Contact number</Text>
                </th>
                <th>
                  <Text align="center">Payment Id</Text>
                </th>
                <th>
                  <Text align="center">Payment Method</Text>
                </th>
                <th>
                  <Text align="center">Address</Text>
                </th>
                <th>
                  <Text align="center">Time Slot</Text>
                </th>
                <th>
                  <Text align="center">Total Payable Amount</Text>
                </th>
                <th>
                  <Text align="center">Total Quantity</Text>
                </th>
              </tr>
            </thead>
            <tbody className="body">
              {rows}
            </tbody>
          </Table>
        </>
      )}
      <OrderDetail opened={opened} close={close} order={order} />
    </div>
  );
}

export default OrderStatusDetail;