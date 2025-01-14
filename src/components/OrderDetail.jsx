import { Button, Card, Checkbox, Drawer, Group, Loader, Modal, Table, Text, TextInput, Title } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import '../CSS/_orderDetail.scss';
import { genericAxios } from '../utils/genericAxiosMethod';
import { API_PATHS } from '../utils/constants/apiPaths';
import { API_METHODS } from '../utils/constants/apiMethods';
import AssignOrderToRider from './AssignOrderRider/AssignOrderToRider';
// import { useBeep } from '../utils/beep';

function OrderDetail({
  order,
  opened,
  close,
  buttonStatus,
  updateOrderStatus,
  getUserOrders,
  handleOnExpelRider,
  riders,
  handleOnAssignOrder
}) {  
  const {
    contactNumber,
    shippingAddress,
    orderNumber,
    orderStatus,
    orderDate,
    paymentMethod,
    discountAmount,
    totalQuantity,
    totalPayableAmount,
    orderItems,
    timeSlot,
    _id,
    orderCreatedAt
  } = order || {};
 
  const orderPlacedDate = new Date(orderCreatedAt).toLocaleString('en-IN');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loader, setLoader] = useState(false);
  const [updatedTotalAmount, setUpdatedTotalAmount] = useState(0);
const [updatedDiscount, setUpdatedDiscount] = useState(0);
const [updatedTotalQuantity, setUpdatedTotalQuantity] = useState(0);
  const [productQuantities, setProductQuantities] = useState(
    orderItems?.reduce(
      (acc, item) => ({ ...acc, [item.product._id]: item.quantity }),
      {}
    )
  );
  

  const calculateTotals = () => {
    let newTotalAmount = 0;
    let newDiscount = 0;
    let newTotalQuantity = 0;
  
    orderItems?.forEach((item) => {
      const productId = item.product._id;
      const quantity = productQuantities[productId] ?? item.quantity; 
      const unitPrice = item.price;
  
      newTotalAmount += unitPrice * quantity;
      newTotalQuantity += quantity;
      newDiscount += item.discountAmount ? item.discountAmount * quantity : 0;
    });
  
    return {
      updatedTotalAmount: newTotalAmount,
      updatedDiscount: newDiscount,
      updatedTotalQuantity: newTotalQuantity,
    };
  };
  useEffect(() => {
    const { updatedTotalAmount, updatedDiscount, updatedTotalQuantity } = calculateTotals();
  
    setUpdatedTotalAmount(updatedTotalAmount);
    setUpdatedDiscount(updatedDiscount);
    setUpdatedTotalQuantity(updatedTotalQuantity);
  }, [productQuantities]); 
  
  const handleQuantityChange = (productId, value) => {
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      const quantity = value === "" ? "" : parseInt(value, 10);
      const maxQuantity = orderItems.find((item) => item.product._id === productId)?.quantity;
  
      if ((quantity >= 0 && quantity <= maxQuantity) || value === "") {
        setProductQuantities((prev) => ({
          ...prev,
          [productId]: quantity,
        }));
       
      } else if (quantity > maxQuantity) {
        alert(`You cannot enter a quantity greater than the available stock (${maxQuantity}).`);
      }
    }
  };
  
  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter((id) => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(orderItems.map((item) => item.product._id));
    } else {
      setSelectedProducts([]);
    }
  };
  
  const confirmOrderProducts = async (data) => {
    try {
      if (window.confirm(`Do you want to ${buttonStatus}`)) {
        setLoader(true);
      await genericAxios({
        url: API_PATHS.ORDERS.CONFIRM_ORDER_PRODUCTS,
        method: API_METHODS.POST,
        data: data,
        params:{orderId:order._id},
        headers: {
          Cookie: '',
        },
      });
      setLoader(false);
      getUserOrders();
    }
    } catch (error) {
      console.error('Error confirming order products:', error);
    }
  };
  const confirmedProducts = selectedProducts.map((productId) => ({
    productId,
    quantity: productQuantities[productId],
  }));
  const orderStatusStep=orderStatus?.[orderStatus?.length - 1]?.step

  const payload = {
    confirmedProducts,
    step: orderStatusStep + 1,
  };
  
  const handleAction = () => {
      confirmOrderProducts(payload);
  };
 

  const rows = orderItems?.map((item, index) => {
    const unitPrice = item.price;
    const quantity = productQuantities[item.product._id] ?? item.quantity; 
    const totalPrice = unitPrice * quantity;
    return (
    <tr key={index}>
      <td>
        <Checkbox
          checked={selectedProducts.includes(item.product._id)}
          onChange={() => handleCheckboxChange(item.product._id)}
        />
      </td>
      <td>
        {' '}
        <img
          style={{
            width: '100px',
            height: '100px',
          }}
          src={item.product?.images?.[0]?.secureUrl}
          alt="product-image"
        />
      </td>
      <td>{item.product.itemName}</td>
      <td>
        <TextInput
         value={productQuantities[item.product._id] ?? item.quantity} 
          onChange={(e) =>
            handleQuantityChange(item.product._id, e.target.value)
          }
          type="number" 
        />
      </td>
      <td>
      {totalPrice}
      </td>
    </tr>)
  });
  const handleOnExpelRiderClick = async()=>{
    const riderId =order.riderId;
    const orderId=order._id
    handleOnExpelRider({ riderId,orderId })
  }

  // const { beep, stopBeep } = useBeep(`${process.env.ORDER_NOTIFICATION_SOUND || process.env.REACT_APP_ORDER_NOTIFICATION_SOUND}` );
  // const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  // const [isConfirmed, setIsConfirmed] = useState(false);
  // const isCheckingRef = useRef(false);

  // const latestOrderStatus = orderStatus?.[orderStatus?.length - 1]?.status || "Pending";

  // const checkPendingPackaging = () => {
  //   const pendingStatuses = orderStatus?.filter((status) =>
  //     (status.step === 2 && !orderStatus.some((s) => s.step === 3)) || 
  //     (status.step === 3 && !orderStatus.some((s) => s.step === 4))
  //   );
    
  //   const hasPendingPackaging = pendingStatuses.length > 0;
  //   if (hasPendingPackaging) {
  //     isCheckingRef.current = true;
  //     beep();
  //     setTimeout(() => {
  //       setShowConfirmDialog(true);
  //     }, 1000);
  //   }
  // };

  // const handleConfirm = () => {
  //   stopBeep();
  //   setShowConfirmDialog(false);
  //   setIsConfirmed(true);
  //   isCheckingRef.current = false;

  //   setTimeout(() => {
  //     setIsConfirmed(false);
  //   }, 10000);
  // };

  // const handleCloseModal = () => {
  //   setShowConfirmDialog(false);
  //   setIsConfirmed(false);
  // };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     checkPendingPackaging();
  //   }, 600000);

  //   return () => clearInterval(interval);
  // }, [isConfirmed]);

  return (
    
    <>
    {loader ? (
      <div className="order-loader-container">
        <Loader color="blue" size="xl" />
      </div>
    ) : (
      <div>
      {/* <Modal
        opened={showConfirmDialog}
        onClose={handleCloseModal}
        title={`Please confirm the Order ${orderNumber} - Status: ${latestOrderStatus}`}
        overlayOpacity={0} 
        overlayColor="transparent" 
        styles={{
          overlay: {
            backgroundColor: 'transparent', 
          },
        }}
      >
        <Button onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal> */}
      <Drawer
        padding="xl"
        position="right"
        keepMounted={true}
        size={650}
        opened={opened}
        onClose={close}
        title={`Purchased Order`}
      >
        <Card>
          <Title className="purchase-order-title" order={4}>
            Users Details
          </Title>
          <Group>
            <Title order={5}>Contact Number:</Title>
            <Text>{contactNumber}</Text>
          </Group>
          <Group>
            <Title order={5}>Address:</Title>
            <Text>{shippingAddress?.address}</Text>
          </Group>
        </Card>
        <Card>
          <Title className="purchase-order-title" order={4}>
            Order Details
          </Title>
          <Group className="order-detail">
            <Title className='order-pace-date-time-label' order={5}>Order Placed Date:</Title>
            <Text className='order-pace-date-time'>{ orderPlacedDate }</Text>
          </Group>
          <Group className="order-detail">
            <Title order={5}>Order Number:</Title>
            <Text>{orderNumber}</Text>
           
          </Group>
          <Checkbox
              checked={selectedProducts.length === orderItems?.length}
              onChange={handleSelectAll}
              label="Select All"
              className='checkbox'
            />
          <Table
            className="order-detail"
            withBorder
            withColumnBorders
            verticalSpacing="md"
          >
            <thead>
              <tr>
                <th>Select</th> 
                <th>Product Image</th>
                <th>Product</th>
                <th>Product Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
          <Group className="order-detail">
            <Title order={5}>Order Status:</Title>
            {/* <Text>{latestOrderStatus}</Text> */}
            {order?.orderStatus?.[order?.orderStatus?.length - 1]?.status}
          </Group>
          <Group className="order-detail">
            <Title order={5}>Order Date:</Title>
            <Text>{new Date(orderDate).toLocaleDateString()}</Text>
          </Group>
          <Group className="order-detail">
            <Title order={5}>Time Slot:</Title>
            <Text>{timeSlot}</Text>
          </Group>
          <Group className="order-detail">
            <Title order={5}>Order Quantity:</Title>
            <Text>{updatedTotalQuantity}</Text>
          </Group>
        </Card>
        <Card>
          <Title className="purchase-order-title" order={4}>
            Rider Details
           </Title>
           <div className='rider-details-container-wrapper'>
            { order?.rider &&<div className='rider-details-container'>
              {order?.rider?.name && <Group className="order-card">
                <Title order={5}>Name:</Title>
                <Text >{ order?.rider?.name }</Text>
              </Group>}
              {
                order?.rider?.phone && <Group >
                <Title  order={5}>Phone:</Title>
                <Text>{ order?.rider?.phone }</Text>
              </Group>}
            </div>}
            {!order?.rider && <AssignOrderToRider
              order={order}
              riders={riders}
              onAssignRider={handleOnAssignOrder}
           />}
            {order?.rider && <div className="expel-order-button" onClick={ handleOnExpelRiderClick }>Remove Rider</div>}
           </div>
        </Card>
        <Card>
          <Title className="purchase-order-title" order={4}>
            Payment Details
          </Title>
          <Group>
            <Title order={5}>Method:</Title>
            <Text>{paymentMethod}</Text>
          </Group>
          <Group>
            <Title order={5}>Discount:</Title>
            <Text>{updatedDiscount}</Text>
          </Group>
          <Group>
            <Title order={5}>Amount:</Title>
            <Text>{updatedTotalAmount}</Text>
          </Group>
        </Card>
        <Card>
          {buttonStatus && (
            <Button
              color="teal"
              disabled={selectedProducts.length === 0} 
              onClick={() =>
                handleAction()
              }
            >
              {buttonStatus}
            </Button>
          )}
        </Card>
      </Drawer>
    </div>)}
    </>

  );
}

export default OrderDetail;
