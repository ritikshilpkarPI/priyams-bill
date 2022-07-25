import { useEffect, useState, useContext } from "react";
import { Table, Text, Button } from "@mantine/core";
import { AppStateContext } from "../AppState/appState.context";
import { VariableSizeList as List } from "react-window";
import { Axios } from "../utils/axios";

export const ItemsList = () => {
  const [items, setItems] = useState([]);
  const { itemsStateAndDispatch } = useContext(AppStateContext);
  const [itemsList] = itemsStateAndDispatch;

  const [itemInput, setItemInput] = useState({
    itemBarcode: "",
    itemName: "",
    itemMRPperUnit: "",
    itemCostPricePerUnit: "",
    itemSellingPricePerUnit: "",
    itemStockQuantity: "",
    minimumStockQuantity: "",
  });

  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    console.log({ name, value });
    setItemInput({ ...itemInput, [name]: value });
  };

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
        itemInput={itemInput}
        handleItemInputChange={handleItemInputChange}
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
          width={500}
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
  itemInput,
  handleItemInputChange,
}) => {
  return (
    <tr style={style} className="bill-row">
      <td>
        <input
          style={{ width: "200px" }}
          value={items[index]["itemBarcode"]}
          onChange={handleItemInputChange}
          name="itemBarcode"
        />
      </td>
      <td>
        <input
          style={{ width: "200px" }}
          value={items[index]["itemName"]}
          onChange={handleItemInputChange}
          name="itemName"
        />
      </td>
      <td>
        <input
          style={{ width: "200px" }}
          value={items[index]["itemMRPperUnit"]}
          onChange={handleItemInputChange}
          name="itemMRPperUnit"
        />
      </td>
      <td>
        <input
          style={{ width: "200px" }}
          value={items[index]["itemCostPricePerUnit"]}
          onChange={handleItemInputChange}
          name="itemCostPricePerUnit"
        />
      </td>
      <td>
        <input
          style={{ width: "200px" }}
          value={items[index]["itemSellingPricePerUnit"]}
          onChange={handleItemInputChange}
          name="itemSellingPricePerUnit"
        />
      </td>
      <td>
        <input
          style={{ width: "200px" }}
          value={items[index]["itemStockQuantity"]}
          onChange={handleItemInputChange}
          name="itemStockQuantity"
        />
      </td>
      <td>
        <input
          style={{ width: "200px" }}
          value={items[index]["minimumStockQuantity"]}
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
    console.log({ ...itemToBeChanged, ...itemInput });
    const itemWithChanges = { ...itemToBeChanged, ...itemInput };
    setApiLoading(true);
    await Axios.request({
      url: "/api/inventory/editItemById",
      method: "put",
      data: { id: _id, itemWithChanges },
      headers: {
        Cookie: "",
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
