import { API_PATHS } from 'src/utils/constants/apiPaths';
import '../CSS/_itemQuantity.scss';
import { useEffect, useState } from 'react';
import { API_METHODS } from 'src/utils/constants/apiMethods';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import { TableComponent } from 'src/components/TableComponent';
export const ItemQuantity = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [itemApiData, setItemApiData] = useState({
    itemBarCodesList: [],
    itemNamesList: [],
    itemsBarCodeMap: {},
    itemsNameMap: {},
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const response = await genericAxios({
        url: API_PATHS.INVENTORY.GET_ITEMS_LEAN_FOR_BILLING,
        method: API_METHODS.GET,
      });
      setItemApiData({ ...response.data.message });
      setIsLoading(false);
    })();
  }, []);

  const handleBarCodeSearchInput = (e) => {
    if (e.target?.value?.toString()?.length === 0) {
      setData([]);
      return;
    }
    const searchData = itemApiData.itemBarCodesList
      .filter((itemBarcode) =>
        itemBarcode
          .toString()
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      )
      .map((itemBarcode) => itemApiData.itemsBarCodeMap[itemBarcode])
      .flat();

    setData(searchData);
  };
  const handleNameSearchInput = (e) => {
    if (e.target.value.length === 0) {
      setData([]);
      return;
    }
    const searchData = itemApiData.itemNamesList
      .filter((itemName) =>
        itemName.toLowerCase().includes(e.target.value.toLowerCase())
      )
      .map((itemName) => itemApiData.itemsNameMap[itemName]);

    setData(searchData);
  };
  const handleOnSelect = (rowData) => {
    selectedData.push(rowData);
    setSelectedData([...selectedData]);
    setData([]);
  };
  const handleOnQuantityChange = ({ e, index }) => {
    const updatedSelectedData = [...selectedData];
    updatedSelectedData[index] = {
      ...updatedSelectedData[index],
      itemQuantity: Number(e.target.value),
    };
    setSelectedData(updatedSelectedData);
  };
  const handleOnDelete = (index) => {
    selectedData.splice(index, 1);
    setSelectedData([...selectedData]);
  };
  const handleOnAddCartClick = () => {};
  return (
    <div className="item-quantity-container">
      <div className="search-container-wrapper">
        <input
          placeholder="Name Search"
          className="item-search-container"
          type="search"
          onChange={handleNameSearchInput}
        />
        <input
          placeholder="Barcode Search"
          type="search"
          className="item-search-container"
          onChange={handleBarCodeSearchInput}
        />
      </div>
      {Boolean(data?.length) && (
        <TableComponent data={data} handleOnSelect={handleOnSelect} />
      )}
      <table className="item-quantity-table-container">
        <thead className="item-quantity-table-header-container">
          <th>Barcode</th>
          <th>Name</th>
          <th>Stock Qty</th>
          <th>MRP</th>
          <th>S.P</th>
          <th>Qty</th>
        </thead>
        <tbody className="item-quantity-table-body-container">
          {Boolean(selectedData?.length) &&
            selectedData.map((rowData, index) => {
              return (
                <tr className="item-quantity-row">
                  <td>{rowData?.itemBarcode}</td>
                  <td>{rowData?.itemName}</td>
                  <td>{rowData?.itemStockQuantity}</td>
                  <td>{rowData?.itemMRPperUnit}</td>
                  <td>{rowData?.itemSellingPricePerUnit}</td>
                  <td>
                    <input
                      className="quantity-input"
                      type="number"
                      onChange={(e) => handleOnQuantityChange({ e, index })}
                    />
                  </td>
                  <td className="delete-row-button">
                    <span
                      className="delete-button"
                      onClick={() => {
                        handleOnDelete(index);
                      }}
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {Boolean(selectedData?.length) && (
        <div className="add-cart-button-container">
          <button className="add-cart-button" onClick={handleOnAddCartClick}>
            Add Cart
          </button>
        </div>
      )}
    </div>
  );
};
