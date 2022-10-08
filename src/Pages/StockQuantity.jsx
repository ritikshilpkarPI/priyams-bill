import { useEffect, useState } from "react";
import Axios from "axios";
import { Loader, Table, Text } from "@mantine/core";

const StockQuantity = () => {
  const [minimumQuantityItem, setMinimumQuantityItem] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    const getAllItemsFeed = async () => {
      const fetch = await Axios.request({
        url: "/api/inventory/items",
        method: "get",
        params: {
          filters: {
            minStockOnly: true,
            isDeleted: false,
          },
        },
        headers: {
          Cookie: "",
        },
      });
      const minStockItems = fetch.data.message.items;
      setMinimumQuantityItem(minStockItems);
      setLoader(false);
    };
    getAllItemsFeed();
  }, []);

  const rows = minimumQuantityItem.map((item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.itemName}</td>
      <td>{item.itemStockQuantity}</td>
      <td>{item.minimumStockQuantity}</td>
      <td>{item.itemMRPperUnit}</td>
      <td>{item.itemCostPricePerUnit}</td>
      <td>{item.itemSellingPricePerUnit}</td>
    </tr>
  ));
  return (
    <>
      {loader ? (
        <div
          style={{
            height: "95vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader size="xl" />
        </div>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          <Text size="lg" weight="bold" align="center">
            Total Items: {minimumQuantityItem.length}
          </Text>

          <Table fontSize="lg" striped={true} style={{ marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>SR.No</th>
                <th>Item Name</th>
                <th>Current Stock</th>
                <th>Minimum Stock</th>
                <th>MRP/Unit</th>
                <th>Cost/Unit</th>
                <th>Selling Price/Unit</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default StockQuantity;
