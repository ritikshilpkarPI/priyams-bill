import React from 'react';
import { Button, Table } from '@mantine/core';
const ShowPurchaseDetails = ({
  purchaseList,
  handlePurchaseDetail,
  deletePurchaseDetail,
}) => {
  const rows = purchaseList.details.map((element, index) => (
    <tr key={index + 1}>
      <td>{element.paidAmount}</td>
      <td>{element.paidBy}</td>
      <td>{element.chequeNumber}</td>
      <td>
        <Button onClick={() => handlePurchaseDetail(element, index)}>
          Edit
        </Button>
      </td>
      <td>
        <Button
          style={{ backgroundColor: '#F03E3E' }}
          onClick={() => deletePurchaseDetail(index)}
        >
          Delete
        </Button>
      </td>
    </tr>
  ));

  return (
    <div>
      {purchaseList.details.length ? (
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

export default ShowPurchaseDetails;
