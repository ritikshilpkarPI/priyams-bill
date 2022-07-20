import { useEffect, useState, useContext } from "react";
import { Table, Text } from "@mantine/core";
import { AppStateContext } from "../AppState/appState.context";
import { VariableSizeGrid as Grid } from "react-window";

export const ItemsList = () => {
  const [items, setItems] = useState([]);
  const { itemsStateAndDispatch } = useContext(AppStateContext);
  const [itemsList] = itemsStateAndDispatch;
  useEffect(() => {
    setItems(itemsList);
  }, [itemsList]);

  const Row = ({ index, style }) => {
    return (
      <tr style={style} className="bill-row" key={`${items[index]}$${index}`}>
        <td>
          <Text color="black" weight={500}>
            {items[index]["itemBarcode"]}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {items[index]["itemName"]}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {items[index]["itemMRPperUnit"]}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {items[index]["itemCostPricePerUnit"]}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {items[index]["itemSellingPricePerUnit"]}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {items[index]["itemStockQuantity"]}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {items[index]["minimumStockQuantity"]}
          </Text>
        </td>
      </tr>
    );
  };

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
          <Grid
            className="list-it"
            columnCount={Object.keys(items[0]).length}
            columnWidth={() => 200}
            height={500}
            rowCount={items.length}
            rowHeight={() => 100}
            width={300}
          >
            {Row}
          </Grid>
        </tbody>
      </Table>
    </div>
  );
};
