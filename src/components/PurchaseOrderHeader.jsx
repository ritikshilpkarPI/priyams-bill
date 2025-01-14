import React from 'react';
import { tableHead } from '../constants/purchaseOrderConstants';

const PurchaseOrderHeader = () => {
  return (
    <thead>
      <tr>
        {tableHead.map((item, index) => {
          return <td key={index}>{item}</td>;
        })}
      </tr>
    </thead>
  );
};

export default PurchaseOrderHeader;
