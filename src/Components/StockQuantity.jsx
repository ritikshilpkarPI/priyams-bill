import {
  useEffect,
  useState,
} from 'react';

import Axios from 'axios';

import {
  Loader,
  Table,
} from '@mantine/core';

const StockQuantity = () => {
  const [minimumQuantityItem, setMinimumQuantityItem] = useState([]);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    setLoader(true);
    const getBillFeed = async () => {
      const fetch = await Axios.request({
        url: "/api/inventory/items",
        method: "get",
        params: {
          page: 1,
          size: 50,
        },
        headers: {
          Cookie: "",
        },
      });
      let allItems = fetch.data.message.items;
      const filterItems = allItems.filter(
        (item) => item.minimumStockQuantity >= item.itemStockQuantity
      );
      console.log({ filterItems });
      setMinimumQuantityItem(filterItems);
      setLoader(false);
    };
    getBillFeed();
    // setAllBills([]);
  }, []);

  const rows = minimumQuantityItem.map((item, index) => (
    <tr key={index}>
      <td>{item.itemBarcode}</td>
      <td>{item.itemName}</td>
      <td>{item.itemMRPperUnit}</td>
      <td>{item.itemCostPricePerUnit}</td>
      <td>{item.itemSellingPricePerUnit}</td>
      <td>{item.itemStockQuantity}</td>
      <td>{item.minimumStockQuantity}</td>
    </tr>
  ));
  return (
    <>
      {loader ? (
       <div style={{ height:"95vh", width:"100%", display: "flex", justifyContent: "center", alignItems:"center" }}>
        <Loader size="xl" />
       </div> 
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Barcode </th>
              <th>Item Name</th>
              <th>MRP/Unit</th>
              <th>Cost/Unit</th>
              <th>Selling Price/Unit</th>
              <th>Total Stock</th>
              <th>Minimum Stock</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      )}
    </>
  );
};

export default StockQuantity;
