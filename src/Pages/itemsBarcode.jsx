import { useEffect, useState } from 'react';
import { ReactBarcode } from 'react-jsbarcode';
import { genericAxios } from '../utils/genericAxiosMethod';
import { API_PATHS } from '../utils/constants/apiPaths';
import { API_METHODS } from '../utils/constants/apiMethods';
import '../CSS/_barcodeLabel.scss';
import { Loader } from '@mantine/core';

export const ItemsBarCode = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
      setData(Object.values(response.data.message.itemsNameMap));
      setIsLoading(false);
    })();
  }, []);

  const handleBarCodeSearchInput = (e) => {
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
    const searchData = itemApiData.itemNamesList
      .filter((itemName) =>
        itemName.toLowerCase().includes(e.target.value.toLowerCase())
      )
      .map((itemName) => itemApiData.itemsNameMap[itemName]);

    setData(searchData);
  };
  const printPage = () => {
    window.print();
  };

  return (
    <div className="barcode-wrapper-container">
      <div className="barcode-page-header">
        <input
          placeholder="Name Search"
          className="search-container"
          type="search"
          onChange={handleNameSearchInput}
        />
        <input
          placeholder="Barcode Search"
          type="search"
          className="search-container"
          onChange={handleBarCodeSearchInput}
        />
        <button className="print-page-button" onClick={printPage}>
          Print
        </button>
      </div>
      <div className="barcode-label">
        {isLoading ? (
          <div className="loader">
            <Loader />
          </div>
        ) : (
          data?.map((itemData) => {
            const {
              itemBarcode,
              itemName,
              itemMRPperUnit,
              itemSellingPricePerUnit,
            } = itemData;
            return (
              <div className="item-label">
                <div>
                  <ReactBarcode options={{
                    height: 35,
                    width: 4
                  }} value={itemBarcode} />
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '20px',
                  }}
                >
                  {itemName}
                </div>
                <div className="price-container">
                  <span className="product-price">
                    <span>MRP: </span>
                    <span>
                      <s>{itemMRPperUnit}</s>
                    </span>
                  </span>
                  <span className="myprice">
                    <span>PStore Price: </span>
                    <span className="ps-price">{itemSellingPricePerUnit}</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
