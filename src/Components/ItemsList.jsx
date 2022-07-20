import { useEffect, useState, useContext } from "react";
import { Table, Text } from "@mantine/core";
import { AppStateContext } from "../AppState/appState.context";

export const ItemsList = () => {
  const [items, setItems] = useState([]);
  const { itemsStateAndDispatch } = useContext(AppStateContext);
  const [itemsList] = itemsStateAndDispatch;
  useEffect(() => {
    setItems(itemsList);
  }, [itemsList]);

  return (
    <div>
      Hi there
      <Table>
        <thead className="heading">
          <tr>
            <th>
              <Text>Bar Code</Text>
            </th>
            <th>
              <Text>Item Name</Text>
            </th>
            <th>
              <Text>MRP/Unit</Text>
            </th>
            <th>
              <Text>Cost/Unit</Text>
            </th>
            <th>
              <Text>Selling Price/Unit</Text>
            </th>
            <th>
              <Text>Total Stock</Text>
            </th>
            <th>
              <Text>Minimum Stock</Text>
            </th>
          </tr>
        </thead>
        <tbody className="body">
          {/* <tr>
            <th>
              <input>Bar Code</input>
            </th>
            <th>
              <input>Item Name</input>
            </th>
            <th>
              <input>MRP/Unit</input>
            </th>
            <th>
              <input>Cost/Unit</input>
            </th>
            <th>
              <input>Selling Price/Unit</input>
            </th>
            <th>
              <input>Total Stock</input>
            </th>
            <th>
              <input>Minimum Stock</input>
            </th>
          </tr> */}
          {items.map((item, idx) => {
            return (
              <tr className="bill-row" key={`${item}$${idx}`}>
                <td>
                  <Text color="black" weight={500}>
                    {item["itemBarcode"]}
                  </Text>
                </td>
                <td>
                  <Text color="black" weight={500}>
                    {item["itemName"]}
                  </Text>
                </td>
                <td>
                  <Text color="black" weight={500}>
                    {item["itemMRPperUnit"]}
                  </Text>
                </td>
                <td>
                  <Text color="black" weight={500}>
                    {item["itemCostPricePerUnit"]}
                  </Text>
                </td>
                <td>
                  <Text color="black" weight={500}>
                    {item["itemSellingPricePerUnit"]}
                  </Text>
                </td>
                <td>
                  <Text color="black" weight={500}>
                    {item["itemStockQuantity"]}
                  </Text>
                </td>
                <td>
                  <Text color="black" weight={500}>
                    {item["minimumStockQuantity"]}
                  </Text>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};
