import { useEffect, useState, useContext } from "react";
import { Table, Text, Button } from "@mantine/core";
import { AppStateContext } from "../AppState/appState.context";
import { VariableSizeList as List } from "react-window";
import { Axios } from "../utils/axios";

export const ItemsList = () => {
  const [items, setItems] = useState([]);
  const { itemsStateAndDispatch } = useContext(AppStateContext);
  const [itemsList] = itemsStateAndDispatch;

  useEffect(() => {
    setItems(itemsList);
  }, [itemsList]);

  const Row = ({ index, style }) => {
    return (
      <TableRow
        index={index}
        style={style}
        items={items}
        itemsList={itemsList}
      />
    );
  };

  return (
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
        <List

          className="list-it"
          height={500}
          itemCount={items.length}
          itemSize={() => 100}
          width={1000}
        >

          {Row}

        </List>

      </tbody>
    </Table>
  );
};

const TableRow = ({
  index,
  itemsList,
  style,
  items,
}) => {
  const [itemInput, setItemInput] = useState({
    itemBarcode: items[index]["itemBarcode"],
    itemName: items[index]["itemName"],
    itemMRPperUnit: items[index]["itemMRPperUnit"],
    itemCostPricePerUnit: items[index]["itemCostPricePerUnit"],
    itemSellingPricePerUnit: items[index]["itemSellingPricePerUnit"],
    itemStockQuantity: items[index]["itemStockQuantity"],
    minimumStockQuantity: items[index]["minimumStockQuantity"]
  });

  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    setItemInput({ ...itemInput, [name]: value });
  };

  return (
    <tr style={style} className="bill-row">
      <td >
        <input
          style={{ width: "200px" }}
          value={itemInput["itemBarcode"]}
          onChange={handleItemInputChange}
          name="itemBarcode"
        />
      </td>
      <td>
        <input
          type="text"
          style={{ width: "200px" }}
          value={itemInput["itemName"]}
          onChange={handleItemInputChange}
          name="itemName"
        />
      </td>
      <td>
        <input
          style={{ width: "200px" }}
          value={itemInput["itemMRPperUnit"]}
          onChange={handleItemInputChange}
          name="itemMRPperUnit"
        />
      </td>
      <td>
        <input
          style={{ width: "200px" }}
          value={itemInput["itemCostPricePerUnit"]}
          onChange={handleItemInputChange}
          name="itemCostPricePerUnit"
        />
      </td>
      <td>
        <input
          style={{ width: "200px" }}
          value={itemInput["itemSellingPricePerUnit"]}
          onChange={handleItemInputChange}
          name="itemSellingPricePerUnit"
        />
      </td>
      <td>
        <input
          style={{ width: "200px" }}
          value={itemInput["itemStockQuantity"]}
          onChange={handleItemInputChange}
          name="itemStockQuantity"
        />
      </td>
      <td>
        <input
          style={{ width: "200px" }}
          value={itemInput["minimumStockQuantity"]}
          onChange={handleItemInputChange}
          name="minimumStockQuantity"
        />
      </td>
      <td>
        <AddItemButton
          itemToBeChanged={itemsList[index]}
          itemInput={itemInput}
        />
      </td>
    </tr>
  );
};

const AddItemButton = ({ itemToBeChanged, itemInput }) => {
  const [apiLoading, setApiLoading] = useState(false);
  const handleAddItem = async () => {
    const { _id } = itemToBeChanged;
    const itemWithChanges = { ...itemToBeChanged, ...itemInput };
    console.log(itemWithChanges);
    setApiLoading(true);
    await Axios.request({
      url: "/api/inventory/editItemById",
      method: "put",
      data: { id: _id, itemWithChanges },
      headers: {
        Cookie: "some_cookie",
      },
    });
    setApiLoading(false);
  };

  return (
    <Button loading={apiLoading} onClick={handleAddItem}>
      ADD ITEM
    </Button>
  );
};
