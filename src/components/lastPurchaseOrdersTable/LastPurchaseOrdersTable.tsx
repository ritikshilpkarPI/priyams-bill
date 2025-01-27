import React, { useState } from 'react';
import "./LastPurchaseOrdersTable.css"

export const LastPurchaseOrdersTable: React.FC<LastPurchaseOrderTableProps> = ({
  lastPurchaseOrders,
  isDropdown = false
}) => {
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };


  return (
    <div>
      <table className="last-purchase-order-table">
        <thead className="last-purchase-order-table-thead">
          <tr className="last-purchase-order-table-thead-tr">
            <th className="last-purchase-order-table-thead-tr-th">#</th>
            <th className="last-purchase-order-table-thead-tr-th">AD</th>
            <th className="last-purchase-order-table-thead-tr-th">Amt</th>
            <th className="last-purchase-order-table-thead-tr-th">CP</th>
          </tr>
        </thead>
        <tbody className="last-purchase-order-table-tbody">
          {lastPurchaseOrders.length>0 && lastPurchaseOrders.map((purchaseOrder, index) => (
            <tr className="last-purchase-order-table-tbody-tr" 
            key={index}
            onClick={()=>console.log(purchaseOrder.purchaseOrderId)}
            >
              <td className="last-purchase-order-table-tbody-tr-td">
                {purchaseOrder.orderSequence}
              </td>
              <td className="last-purchase-order-table-tbody-tr-td">
                {purchaseOrder.approvalDate || 'N/A'}
              </td>
              <td className="last-purchase-order-table-tbody-tr-td">
                {purchaseOrder.amount}
              </td>
              <td className="last-purchase-order-table-tbody-tr-td">
                {purchaseOrder.costPrice}
              </td>
            </tr>
          ))}
              {isDropdown&& (
                <button className='last-purchase-order-table-drop-down-button' onClick={toggleShowAll}>
                  <img className='last-purchase-order-table-drop-down-button-image' src={!showAll?"/images/dropdown.svg":"/images/cross.svg"} alt="drop" />
                </button>
              )}
        </tbody>
      </table>
    </div>
  );
};