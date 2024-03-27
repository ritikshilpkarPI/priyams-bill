export const TableRowComponent = ({ rowData, handleOnSelect, className }) => {
    const handleOnSelectedRow = () => {
        handleOnSelect(rowData);
    }
    return (
      <tr
        className={`search-row-data-container ${className}`}
        onClick={handleOnSelectedRow}
      >
        <td className="item-barcode-container">{rowData?.itemBarcode}</td>
        <td className="item-name-container">{rowData?.itemName}</td>
        <td className="item-mrp-container">{rowData?.itemMRPperUnit}</td>
      </tr>
    );
}