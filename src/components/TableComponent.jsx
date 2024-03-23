import '../CSS/_searchTable.scss';
import { TableRowComponent } from './RowComponent';

export const TableComponent = ({ data, handleOnSelect }) => {
  return (
    <table className="item-quantity-search-table">
      <thead className="item-quantity-table-header-container">
        <th className="search-header-barcode">Barcode</th>
        <th className="item-name-header">Name</th>
        <th className="search-header-mrp">MRP</th>
      </thead>
      <tbody className="item-quantity-search-table-body">
        {Array.isArray(data) &&
          data?.map((rowData) => {
            return (
              <TableRowComponent
                rowData={rowData}
                handleOnSelect={handleOnSelect}
                className="search-item-quantity-table-row"
              />
            );
          })}
      </tbody>
    </table>
  );
};
