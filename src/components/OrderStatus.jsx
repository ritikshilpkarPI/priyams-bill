import { Button } from '@mantine/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import '../CSS/_orders.scss';

function OrderStatus({ title, children, number }) {
  const history = useHistory();
  return (
    <>
      <div className="order-number-container">{number}</div>
      <div className="orders-wrapper">
        <header className="header">
          <p className="orders-title">{title.split('_').join(' ')} Orders</p>
          <Button onClick={() => history.push(`/orders/${title}`)}>
            View Status
          </Button>
        </header>
        <div className="order-children-container">{children}</div>
      </div>
    </>
  );
}

export default OrderStatus;
