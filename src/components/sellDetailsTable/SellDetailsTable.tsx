import React from 'react';
import { Table, Text } from '@mantine/core';
import { LineGraph } from 'components/lineGraph/LineGraph';
import './SellDetailsTable.css';

export const SellDetailsTable: React.FC<SellDetailsTableProps> = ({
  tableData,
}) => {
  return (
    <div className="sell-details-table-component">
      <div className="sell-details-table-container">
        <table className="sell-details-table">
          <thead className="sell-details-table-thead">
            <tr className="sell-details-table-thead-tr">
              <th className="sell-details-table-thead-tr-th">Name</th>
              <th className="sell-details-table-thead-tr-th">MRP</th>
              <th className="sell-details-table-thead-tr-th">
                Sold After Approval
              </th>
              <th className="sell-details-table-thead-tr-th">
                Last Month Sold
              </th>
              <th className="sell-details-table-thead-tr-th">
                Last 3 Month Sold
              </th>
              <th className="sell-details-table-thead-tr-th">Yearly Sold</th>
              <th className="sell-details-table-thead-tr-th">
                Last 3 Purchase Order
              </th>
            </tr>
          </thead>
          <tbody className="sell-details-table-tbody">
            {tableData.map((item, index) => (
              <tr className="sell-details-table-tbody-tr" key={index}>
                <td className="sell-details-table-tbody-tr-td">
                  {item.itemName || 'N/A'}
                </td>
                <td className="sell-details-table-tbody-tr-td">
                  {item.itemPrise || 'N/A'}
                </td>
                <td className="sell-details-table-tbody-tr-td">
                  {item.soldAfterApproval}
                </td>
                <td className="sell-details-table-tbody-tr-td">
                  {item.soldInLastMonth}
                </td>
                <td className="sell-details-table-tbody-tr-td">
                  {' '}
                  <div className="sell-details-table-line-graph">
                    {' '}
                    <LineGraph
                      data={item.soldInLastThreeMonths}
                      width={850}
                      height={420}
                    />{' '}
                  </div>
                </td>
                <td className="sell-details-table-tbody-tr-td">
                  {' '}
                  <div className="sell-details-table-line-graph">
                    {' '}
                    <LineGraph
                      data={item.soldInLastYear}
                      width={850}
                      height={420}
                    />{' '}
                  </div>
                </td>
                <td className="sell-details-table-tbody-tr-td">
                  <table className="sell-details-table">
                    <thead className="sell-details-table-thead">
                      <tr className="sell-details-table-thead-tr">
                        <th className="sell-details-table-thead-tr-th">#</th>
                        <th className="sell-details-table-thead-tr-th">AD</th>
                        <th className="sell-details-table-thead-tr-th">Amt</th>
                        <th className="sell-details-table-thead-tr-th">CP</th>
                      </tr>
                    </thead>
                    <tbody className="sell-details-table-tbody">
                      {item.lastThreePurchaseOrder.map(
                        (purchaseOrder, index) => (
                          <tr
                            className="sell-details-table-tbody-tr"
                            key={index}
                          >
                            <td className="sell-details-table-tbody-tr-td">
                              {purchaseOrder.orderSequence}
                            </td>
                            <td className="sell-details-table-tbody-tr-td">
                              {purchaseOrder.approvalDate}
                            </td>
                            <td className="sell-details-table-tbody-tr-td">
                              {purchaseOrder.amount}
                            </td>
                            <td className="sell-details-table-tbody-tr-td">
                              {purchaseOrder.costPrice}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};