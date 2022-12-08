import React from "react";
import { Table } from "@mantine/core";
const ShowPurchaseDetails = ({ PurchaseList }) => {
  const rows = PurchaseList.values.details.map((element, index) => (
    <tr key={index + 1}>
        <td>{element.dealerName}</td>
        <td>{element.phoneNumber}</td>
        <td>{element.payment}</td>
        <td>{element.billAmount}</td>
        <td>{element.paidAmount}</td>
        <td>{element.paidBy}</td>
        <td>{element.chequeNumber}</td>
        <td>{element.procurementSource}</td>
        <td>{element.remark}</td>
        <td></td>
    </tr>
  ));
  return (
    <div>
      {PurchaseList.values.details.length ? (
        <Table withColumnBorders striped withBorder>
          <thead>
            <tr>
              <th>Dealer Name</th>
              <th>Phone Number</th>
              <th>Payment</th>
              <th>Bill Amount</th>
              <th>Paid Amount</th>
              <th>Paid By</th>
              <th>Cheque Number</th>
              <th>Procurement Source</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default ShowPurchaseDetails;
