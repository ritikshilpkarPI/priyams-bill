import React from 'react'
import { Badge, Flex, Table, Title } from '@mantine/core';
import { useSelector } from 'react-redux'
import { selectPurchasedItems } from '../../redux/purchaseOrder/purchaseOrderSelectors';
import { ItemExpiryTable } from '../ItemExpiryTable/ItemExpiryTable';

export const PurchasedItemTable = () => {
  const purchasedItems = useSelector(selectPurchasedItems);
  const rows = purchasedItems?.map(purchasedItem => (
    <tr key={purchasedItem._id}>
        <td>{purchasedItem?.barcode}</td>
        <td>{purchasedItem?.inputName}</td>
        <td>{purchasedItem?.itemQuantity}</td>
        <td>{purchasedItem?.unit}</td>
        <td>{purchasedItem?.mrp}</td>
        <td>{purchasedItem?.costPrice}</td>
        <td>{purchasedItem?.sellingPrice}</td>
        <td>{purchasedItem?.stockQuantity}</td>
        <td>{purchasedItem?.itemRemark}</td>
        <td>
          {
            purchasedItem.expiryDates?.length && ( <ItemExpiryTable 
              expiryDates={purchasedItem.expiryDates}
            />)
          }
        </td>
        <td>
          {
            !purchasedItem.item_id && (<Badge color="green">
            New Item
          </Badge>)
          }
        </td>
    </tr>
  ))
  return (
    <Flex align="left" gap="16px" direction="column" sx={{ border: "1px solid grey", padding: "16px", borderRadius: "8px", textAlign: "left" }} mx="sm" mt="16px">
      <Title order={3}>Added Items</Title>
      <Table>
      <thead>
        <tr>
          <th>Barcode</th>
          <th>Item Name</th>
          <th>Packet Amount</th>
          <th>Unit</th>
          <th>MRP</th>
          <th>CP</th>
          <th>SP</th>
          <th>Order Quantity</th>
          <th>Remarks</th>
          <th>Expiry Summary</th>
          <th>Tags</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
          {rows}
      </tbody>
    </Table>
    </Flex>
  )
}