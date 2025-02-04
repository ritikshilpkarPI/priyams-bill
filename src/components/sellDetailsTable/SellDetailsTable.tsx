import React from 'react';
import { Table, Text } from '@mantine/core';
import { LineGraph } from '../../components/lineGraph/LineGraph';
import './SellDetailsTable.css';
import { LastPurchaseOrdersTable } from '../../components/lastPurchaseOrdersTable/LastPurchaseOrdersTable';

export const SellDetailsTable: React.FC<SellDetailsTableProps> = ({
  tableData,
}) => {
  return (
    <div className="sell-details-table-component">
      {tableData.length > 0 ? (
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
              {tableData.length > 0 &&
                tableData.map((item, index) => (
                  <tr className="sell-details-table-tbody-tr" key={index}>
                    <td className="sell-details-table-tbody-tr-td">
                      {item.itemName || 'N/A'}
                    </td>
                    <td className="sell-details-table-tbody-tr-td">
                      {item.itemMRP}
                    </td>
                    <td className="sell-details-table-tbody-tr-td">
                      {item.soldAfterApproval}
                    </td>
                    <td className="sell-details-table-tbody-tr-td">
                      {item.lastMonthSold}
                    </td>
                    <td className="sell-details-table-tbody-tr-td">
                      {' '}
                      <div className="sell-details-table-line-graph">
                        {' '}
                        <LineGraph
                          data={item.lastThreeMonthSold || []}
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
                          data={item.lastYearSold || []}
                          width={850}
                          height={420}
                        />{' '}
                      </div>
                    </td>
                    <td className="sell-details-table-tbody-tr-td">
                      {item.lastPurchaseOrders.length > 0 ? (
                        
                        <LastPurchaseOrdersTable
                          lastPurchaseOrders={item.lastPurchaseOrders}
                        />
                      ) : (
                        <Text>No data found</Text>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Text>No data Found</Text>
      )}
    </div>
  );
};