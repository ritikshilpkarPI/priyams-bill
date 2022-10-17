import React from 'react'
import Header from '../components/PurchaseOrder/Header';
import { Table, Title } from '@mantine/core';
import PurchaseOrderBody from '../components/PurchaseOrder/PurchaseOrderBody';

const PurchaseOrder = () => {
    return (
        <div className='purchase-order-container'>
            <Title className='page-title' order={3}>Purchase Order</Title>
            <Table>
                <Header />
                <PurchaseOrderBody />
            </Table>
        </div>
    )
}

export default PurchaseOrder;