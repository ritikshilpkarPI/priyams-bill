import { Button } from '@mantine/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import '../CSS/_orders.scss';

function OrderStatus({ title, children, orderStatus }) {
  const history = useHistory();
  console.log({ title });
  return (
    <div className="orders-wrapper">
      <header className="header">
        <p className="orders-title">{title}</p>
        <Button onClick={() => history.push(`/orders/${orderStatus}`)}>
          View Status
        </Button>
      </header>
     <div>
     {children}
     </div>
    </div>
  );
}

export default OrderStatus;
