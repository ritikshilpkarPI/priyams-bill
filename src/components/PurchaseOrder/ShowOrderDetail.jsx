import { Button, Table } from "@mantine/core";
import React from "react";

const ShowOrderDetail = ({ purchaseList, handleItemEdit, deleteOrder }) => {
  const rows = purchaseList.orders.map((element, index) => (
    <tr className={element.validate ? "validate" : "not-validate"} key={index + 1}>
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
                  <td>{String(date.date).slice(0, 10)}</td>
                </tr>
                <tr>
                  <td>{date.value}</td>
                </tr>
              </tbody>
            </table>
          );
        })}
      </td>
      <td>{element.itemRemark || "No remarks"}</td>
      <td>
        <Button onClick={() => handleItemEdit(element, index)}>Edit</Button>
      </td>
      <td>
        <Button
          style={{ backgroundColor: "#F03E3E" }}
          onClick={() => deleteOrder(element._id)}
        >
          Delete
        </Button>
      </td>
    </tr>
  ));
  return (
    <>
      {purchaseList.orders.length ? (
        <>
          <h3 style={{ margin: "2vmin" }}>Order Detail List</h3>
          <Table withColumnBorders striped withBorder>
            <thead>
              <tr>
                <th>Barcode123</th>
                <th>Item name</th>
                <th>Order Quantity</th>
                <th>Minimum Quantity</th>
                <th>Pkt. Amt. Quantity</th>
                <th>Unit</th>
                <th>Selling Price</th>
                <th>MRP</th>
                <th>Cost Price</th>
                <th>Expiry Dates</th>
                <th>Remarks</th>
                <th>Update</th>
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

export default ShowOrderDetail;
