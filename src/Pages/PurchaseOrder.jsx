import React from 'react';
// import Header from '../components/PurchaseOrder/Header';
// import { Table, Title } from '@mantine/core';
// import PurchaseOrderBody from '../components/PurchaseOrder/PurchaseOrderBody';
// import PurchaseDetail from '../components/PurchaseOrder/PurchaseDetail';
import PurchaseOrderItems from 'src/components/PurchaseOrderItems';

const PurchaseOrder = () => {
  return (
    <div className="purchase-order-container">
      {/* <Title className='page-title' order={3}>Purchase Order</Title> */}
      <PurchaseOrderItems />
      {/* <Table>
                <Header />
                <PurchaseOrderBody />
            </Table>
            <PurchaseDetail /> */}
    </div>
  );
};

export default PurchaseOrder;
