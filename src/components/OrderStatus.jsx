import { Button } from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/_orders.scss';

function OrderStatus({ title, children, number }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="order-number-container">{number}</div>
      <div className="orders-wrapper">
        <header className="header">
          <p className="orders-title">{title.split('_').join(' ')} Orders</p>
          <Button onClick={() => navigate(`/orders/${title}`)}>
            View Status
          </Button>
        </header>
        <div className="order-children-container">{children}</div>
      </div>
    </>
  );
}

export default OrderStatus;
