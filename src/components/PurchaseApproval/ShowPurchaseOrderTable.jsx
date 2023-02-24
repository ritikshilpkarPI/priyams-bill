import React from 'react';
import { Table } from '@mantine/core';
const ShowPurchaseOrderTable = ({ purchaseList }) => {
  const rows = purchaseList.purchaseDetails.map((element, index) => (
    <tr key={index + 1}>
      <td>{element.paidAmount}</td>
      <td>{element.paidBy}</td>
      <td>{element.chequeNumber}</td>
    </tr>
  ));

  return (
    <div>
      {purchaseList.purchaseDetails.length ? (
        <>
          <h3 style={{ margin: '2vmin' }}>Purchase Detail List</h3>
          <Table
            className="show-detail-table"
            withColumnBorders
            striped
            withBorder
          >
            <thead>
              <tr>
                <th>Paid Amount</th>
                <th>Paid By</th>
                <th>Cheque Number</th>
              </tr>
            </thead>
            <tbody>
              {rows}
              <tr>
                <td>
                  <b>Total : {purchaseList.totalPaidAmount} </b>
                </td>
              </tr>
            </tbody>
          </Table>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ShowPurchaseOrderTable;
