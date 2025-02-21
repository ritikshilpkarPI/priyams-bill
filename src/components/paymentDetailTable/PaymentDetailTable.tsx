import React, { useState } from 'react'
import { Button, Flex, Table, Title } from '@mantine/core';
import { useSelector } from 'react-redux'
import { selectPaymentDetails } from '../../redux/purchaseOrder/purchaseOrderSelectors';
import {  IconX } from '@tabler/icons-react';
import { deletePaymentByIdAPI } from '../../utils/apiUtils';
import { useDispatch } from 'react-redux';
import { setPurchaseOrder } from 'src/redux/purchaseOrder/purchaseOrderSlice';

export const PaymentDetailTable = ({
  purchaseOrderId,
  totalPaidAmount,
}: PaymentDetailTableProps) => {
  const dispatch = useDispatch();
  const paymentDetails = useSelector(selectPaymentDetails);
  const [removePaymentIdx, setRemovePaymentIdx] = useState(-1); 

  const deletePayment = async(index: number) => {
    if(!purchaseOrderId) return;
    setRemovePaymentIdx(index);
    const response = await deletePaymentByIdAPI(purchaseOrderId, index);
    setRemovePaymentIdx(-1);
    if(response.isError) return;
    if(!response.order) return;
    dispatch(setPurchaseOrder(response.order));
  }

  const rows = paymentDetails?.map((paymenrDetail, idx) => (
    <tr  key={paymenrDetail._id} className='purchased-item-table-row'>
        <td>{paymenrDetail?.paidBy || "-"}</td>
        <td>{paymenrDetail?.paidAmount || "-"}</td>
        <td>{paymenrDetail?.chequeNumber || "-"}</td>
        <td className='purchased-item-table-action-td'>
          <Button loading={idx === removePaymentIdx} disabled={idx !== removePaymentIdx && removePaymentIdx >= 0} variant='default' color="red" leftIcon={<IconX cursor="pointer" />} onClick={()=> deletePayment(idx)}>
              Remove
          </Button>
        </td>
    </tr>
  ))
  return (
    <Flex align="left" gap="16px" direction="column" sx={{ border: "1px solid grey", padding: "16px", borderRadius: "8px", textAlign: "left", overflow: "scroll" }} mx="sm" mt="16px">
      <Title order={3}>Payment Details</Title>
      <Table>
        <thead>
          <tr>
            <th>Paid By</th>
            <th>Amount</th>
            <th>Cheque</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
            {rows}
            <tr>
                <td>Total</td>
                <td style={{ color: "green" }}>{totalPaidAmount}</td>
                <td>-</td>
                <td>-</td>
              </tr>
        </tbody>
     </Table>
    </Flex>
  )
}