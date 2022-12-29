import { Table } from "@mantine/core";
import React from "react";

const ShowOrderDetailTable = ({ purchaseList}) => {
  const rows = purchaseList.purchasedItems.map((element, index) => (
    <tr key={index + 1}>
      <td>{element.barcode}</td>
      <td>{element.inputName}</td>
      <td>{element.stockQuantity}</td>
      <td>{element.minimumQuantity}</td>
      <td>{element.itemQuantity}</td>
      <td>{element.unit}</td>
      <td>{element.sellingPrice}</td>
      <td>{element.mrp}</td>
      <td>{element.costPrice}</td>
      <td>
        {element.expiryDates.map((date, index) => {
          return (
            <table key={index}>
              <tbody>
                <tr>
                  <th>Date</th>
                  <td>{new Date(date.date).toLocaleString}</td>
                </tr>
                <tr>
                  <th>Quantity</th>
                  <td>{date.quantity}</td>
                </tr>
              </tbody>
            </table>
          );
        })}
      </td>
      <td>{element.itemRemark || "No remarks"}</td>
    </tr>
  ));
  return (
    <>
      {purchaseList.purchasedItems.length ? (
        <>
          <h3 style={{ margin: "2vmin" }}>Order Detail List</h3>
          <Table withColumnBorders striped withBorder>
            <thead>
              <tr>
                <th>Barcode</th>
                <th>Item name</th>
                <th>Stock Quantity</th>
                <th>Minimum Quantity</th>
                <th>Item Quantity</th>
                <th>Unit</th>
                <th>Selling Price</th>
                <th>MRP</th>
                <th>Cost Price</th>
                <th>Expiry Dates</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ShowOrderDetailTable;
