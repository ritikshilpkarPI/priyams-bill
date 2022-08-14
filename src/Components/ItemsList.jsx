import { useEffect, useState, useContext } from "react";
import { Table, Text, Button, Input } from "@mantine/core";
import { AppStateContext } from "../AppState/appState.context";
import { VariableSizeList as List } from "react-window";
import { Axios } from "../utils/axios";

const ITEM_INITIAL_INPUT = {
  itemBarcode: "",
  itemName: "",
  itemMRPperUnit: "",
  itemCostPricePerUnit: "",
  itemSellingPricePerUnit: "",
  itemStockQuantity: "",
  minimumStockQuantity: "",
};

export const ItemsList = () => {
  const [items, setItems] = useState([]);
  const { itemsStateAndDispatch } = useContext(AppStateContext);
  const [itemsList, dispatch] = itemsStateAndDispatch;
  const [newItemInput, setNewItemInput] = useState(ITEM_INITIAL_INPUT);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    setItems([...itemsList]);
  }, [itemsList]);

  const handleNewItemInput = (e) => {
    const { name, value } = e.target;
    console.log({ name, value });
    setNewItemInput({ ...newItemInput, [name]: value });
    const filteredItems = itemsList.filter(
      (itemObj) =>
        itemObj[name] &&
        // value &&
        itemObj[name]
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase())
    );
    setItems([...filteredItems]);
  };

  const addItemToDb = async () => {
    setApiLoading(true);
    (async () => {
      const newItem = await Axios.request({
        url: "/api/inventory/addNewItem",
        method: "post",
        data: { ...newItemInput },
        headers: {
          Cookie: "",
        },
      });
      console.log({ newItem });
      dispatch({ type: "ADD_NEW_ITEM_TO_LIST", payload: newItem.data.message });
    })();
    setApiLoading(false);
    setNewItemInput(ITEM_INITIAL_INPUT);
  };

  const handleItemInputChange = (e, itemInput, setItemInput) => {
    const { name, value, type } = e.target;
    setItemInput({
      ...itemInput,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const BarcodeRow = ({ index, style }) => {
    const name = "itemBarcode";
    const [itemInput, setItemInput] = useState({
      itemBarcode: items[index][name],
      // itemName: items[index]["itemName"],
      // itemMRPperUnit: items[index]["itemMRPperUnit"],
      // itemCostPricePerUnit: items[index]["itemCostPricePerUnit"],
      // itemSellingPricePerUnit: items[index]["itemSellingPricePerUnit"],
      // itemStockQuantity: items[index]["itemStockQuantity"],
      // minimumStockQuantity: items[index]["minimumStockQuantity"],
    });

    return (
      <>
        <TableRow
          index={index}
          style={style}
          items={items}
          itemsList={itemsList}
          dispatch={dispatch}
          handleItemInputChange={handleItemInputChange}
          itemInput={itemInput}
          setItemInput={setItemInput}
          name={name}
        />
      </>
    );
  };

  const ItemNameRow = ({ index, style }) => {
    const name = "itemName";
    const [itemInput, setItemInput] = useState({
      itemName: items[index][name],
      // itemMRPperUnit: items[index]["itemMRPperUnit"],
      // itemCostPricePerUnit: items[index]["itemCostPricePerUnit"],
      // itemSellingPricePerUnit: items[index]["itemSellingPricePerUnit"],
      // itemStockQuantity: items[index]["itemStockQuantity"],
      // minimumStockQuantity: items[index]["minimumStockQuantity"],
    });

    return (
      <>
        <TableRow
          index={index}
          style={style}
          items={items}
          itemsList={itemsList}
          dispatch={dispatch}
          handleItemInputChange={handleItemInputChange}
          itemInput={itemInput}
          setItemInput={setItemInput}
          name={name}
        />
      </>
    );
  };

  const ItemMRPRow = ({ index, style }) => {
    const name = "itemMRPperUnit";
    const [itemInput, setItemInput] = useState({
      // itemName: items[index]["itemName"],
      itemMRPperUnit: items[index][name],
      // itemCostPricePerUnit: items[index]["itemCostPricePerUnit"],
      // itemSellingPricePerUnit: items[index]["itemSellingPricePerUnit"],
      // itemStockQuantity: items[index]["itemStockQuantity"],
      // minimumStockQuantity: items[index]["minimumStockQuantity"],
    });

    return (
      <>
        <TableRow
          index={index}
          style={style}
          items={items}
          itemsList={itemsList}
          dispatch={dispatch}
          handleItemInputChange={handleItemInputChange}
          itemInput={itemInput}
          setItemInput={setItemInput}
          name={name}
        />
      </>
    );
  };

  const ItemCostPriceRow = ({ index, style }) => {
    const name = "itemCostPricePerUnit";
    const [itemInput, setItemInput] = useState({
      // itemName: items[index]["itemName"],
      // itemMRPperUnit: items[index][name],
      itemCostPricePerUnit: items[index][name],
      // itemSellingPricePerUnit: items[index]["itemSellingPricePerUnit"],
      // itemStockQuantity: items[index]["itemStockQuantity"],
      // minimumStockQuantity: items[index]["minimumStockQuantity"],
    });

    return (
      <>
        <TableRow
          index={index}
          style={style}
          items={items}
          itemsList={itemsList}
          dispatch={dispatch}
          handleItemInputChange={handleItemInputChange}
          itemInput={itemInput}
          setItemInput={setItemInput}
          name={name}
        />
      </>
    );
  };

  const ItemSellingPriceRow = ({ index, style }) => {
    const name = "itemSellingPricePerUnit";
    const [itemInput, setItemInput] = useState({
      // itemName: items[index]["itemName"],
      // itemMRPperUnit: items[index][name],
      // itemCostPricePerUnit: items[index][name],
      itemSellingPricePerUnit: items[index][name],
      // itemStockQuantity: items[index]["itemStockQuantity"],
      // minimumStockQuantity: items[index]["minimumStockQuantity"],
    });

    return (
      <>
        <TableRow
          index={index}
          style={style}
          items={items}
          itemsList={itemsList}
          dispatch={dispatch}
          handleItemInputChange={handleItemInputChange}
          itemInput={itemInput}
          setItemInput={setItemInput}
          name={name}
        />
      </>
    );
  };

  const ItemStockQuantityRow = ({ index, style }) => {
    const name = "itemStockQuantity";
    const [itemInput, setItemInput] = useState({
      // itemName: items[index]["itemName"],
      // itemMRPperUnit: items[index][name],
      // itemCostPricePerUnit: items[index][name],
      // itemSellingPricePerUnit: items[index][name],
      itemStockQuantity: items[index][name],
      // minimumStockQuantity: items[index]["minimumStockQuantity"],
    });

    return (
      <>
        <TableRow
          index={index}
          style={style}
          items={items}
          itemsList={itemsList}
          dispatch={dispatch}
          handleItemInputChange={handleItemInputChange}
          itemInput={itemInput}
          setItemInput={setItemInput}
          name={name}
        />
      </>
    );
  };

  const ItemMinimumStockQuantityRow = ({ index, style }) => {
    const name = "minimumStockQuantity";
    const [itemInput, setItemInput] = useState({
      // itemName: items[index]["itemName"],
      // itemMRPperUnit: items[index][name],
      // itemCostPricePerUnit: items[index][name],
      // itemSellingPricePerUnit: items[index][name],
      // itemStockQuantity: items[index][name],
      minimumStockQuantity: items[index][name],
    });

    return (
      <>
        <TableRow
          index={index}
          style={style}
          items={items}
          itemsList={itemsList}
          dispatch={dispatch}
          handleItemInputChange={handleItemInputChange}
          itemInput={itemInput}
          setItemInput={setItemInput}
          name={name}
        />
      </>
    );
  };

  const ItemUpdateButtonRow = ({ index, style }) => {
    // const name = "minimumStockQuantity";
    // const [itemInput, setItemInput] = useState({
    //   // itemName: items[index]["itemName"],
    //   // itemMRPperUnit: items[index][name],
    //   // itemCostPricePerUnit: items[index][name],
    //   // itemSellingPricePerUnit: items[index][name],
    //   // itemStockQuantity: items[index][name],
    //   minimumStockQuantity: items[index][name],
    // });

    return (
      <tr>
        <td>
          <UpdateItemButton
            itemToBeChanged={itemsList[index]}
            // itemInput={itemInput}
            // dispatch={dispatch}
            // index={index}
            // items={items}
          />
        </td>
      </tr>
    );
  };

  return (
    <Table striped highlightOnHover>
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
        <tr className="bill-row">
          <td>
            <Input
              style={{ width: "200px" }}
              value={newItemInput["itemBarcode"]}
              onChange={handleNewItemInput}
              name="itemBarcode"
              type="number"
            />
          </td>
          <td>
            <Input
              type="text"
              style={{ width: "200px" }}
              value={newItemInput["itemName"]}
              onChange={handleNewItemInput}
              name="itemName"
            />
          </td>
          <td>
            <Input
              style={{ width: "200px" }}
              value={newItemInput["itemMRPperUnit"]}
              onChange={handleNewItemInput}
              name="itemMRPperUnit"
              type="number"
            />
          </td>
          <td>
            <Input
              style={{ width: "200px" }}
              value={newItemInput["itemCostPricePerUnit"]}
              onChange={handleNewItemInput}
              name="itemCostPricePerUnit"
              type="number"
            />
          </td>
          <td>
            <Input
              style={{ width: "200px" }}
              value={newItemInput["itemSellingPricePerUnit"]}
              onChange={handleNewItemInput}
              name="itemSellingPricePerUnit"
              type="number"
            />
          </td>
          <td>
            <Input
              style={{ width: "200px" }}
              value={newItemInput["itemStockQuantity"]}
              onChange={handleNewItemInput}
              name="itemStockQuantity"
              type="number"
            />
          </td>
          <td>
            <Input
              style={{ width: "200px" }}
              value={newItemInput["minimumStockQuantity"]}
              onChange={handleNewItemInput}
              name="minimumStockQuantity"
              type="number"
            />
          </td>
          <td>
            <Button loading={apiLoading} onClick={addItemToDb}>
              ADD NEW ITEM
            </Button>
          </td>
        </tr>
        <tr>
          <td>
            <List
              className="list-it"
              height={500}
              itemCount={items.length}
              itemSize={() => 75}
              width={250}
            >
              {BarcodeRow}
            </List>
          </td>
          <td>
            <List
              className="list-it"
              height={500}
              itemCount={items.length}
              itemSize={() => 75}
              width={250}
            >
              {ItemNameRow}
            </List>
          </td>
          <td>
            <List
              className="list-it"
              height={500}
              itemCount={items.length}
              itemSize={() => 75}
              width={250}
            >
              {ItemMRPRow}
            </List>
          </td>
          <td>
            <List
              className="list-it"
              height={500}
              itemCount={items.length}
              itemSize={() => 75}
              width={250}
            >
              {ItemCostPriceRow}
            </List>
          </td>
          <td>
            <List
              className="list-it"
              height={500}
              itemCount={items.length}
              itemSize={() => 75}
              width={250}
            >
              {ItemSellingPriceRow}
            </List>
          </td>
          <td>
            <List
              className="list-it"
              height={500}
              itemCount={items.length}
              itemSize={() => 75}
              width={250}
            >
              {ItemStockQuantityRow}
            </List>
          </td>
          <td>
            <List
              className="list-it"
              height={500}
              itemCount={items.length}
              itemSize={() => 75}
              width={250}
            >
              {ItemMinimumStockQuantityRow}
            </List>
          </td>
          <td>
            <List
              className="list-it"
              height={500}
              itemCount={items.length}
              itemSize={() => 75}
              width={250}
            >
              {ItemUpdateButtonRow}
            </List>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

const TableRow = ({
  style,
  handleItemInputChange,
  itemInput,
  setItemInput,
  name,
}) => {
  return (
    <tr style={style} className="bill-row">
      <td>
        <Input
          style={{ width: "200px" }}
          value={itemInput[name]}
          onChange={(e) => handleItemInputChange(e, itemInput, setItemInput)}
          name={name}
          type="search"
        />
      </td>
    </tr>
  );
};

const UpdateItemButton = ({
  itemToBeChanged,
  itemInput,
  dispatch,
  items,
  index,
}) => {
  const [apiLoading, setApiLoading] = useState(false);
  const handleAddItem = async () => {
    const { _id } = itemToBeChanged;
    const itemWithChanges = { ...itemToBeChanged, ...itemInput };
    setApiLoading(true);
    const updatedItem = await Axios.request({
      url: "/api/inventory/editItemById",
      method: "put",
      data: { id: _id, itemWithChanges },
      headers: {
        Cookie: "",
      },
    });
    const newList = [...items];
    newList.splice(index, 1, { ...updatedItem.data.message });
    dispatch({ type: "UPDATE_ITEMS_LIST", payload: [...newList] });
    setApiLoading(false);
  };

  return (
    <Button loading={apiLoading} onClick={handleAddItem}>
      UPDATE ITEM
    </Button>
  );
};
