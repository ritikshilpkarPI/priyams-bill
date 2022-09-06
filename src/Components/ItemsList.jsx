import {
  useContext,
  useEffect,
  useState,
} from 'react';

import { VariableSizeList as List } from 'react-window';

import {
  Button,
  Input,
  Table,
  Text,
} from '@mantine/core';

import { AppStateContext } from '../AppState/appState.context';
import { Axios } from '../utils/axios';

const ITEM_INITIAL_INPUT = {
  itemBarcode: "",
  itemName: "",
  itemMRPperUnit: "",
  itemCostPricePerUnit: "",
  itemSellingPricePerUnit: "",
  itemStockQuantity: "",
  minimumStockQuantity: "",
};

let itemToBeUpdated = {};

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
    setNewItemInput({ ...newItemInput, [name]: value });
    const filteredItems = itemsList.filter(
      (itemObj) =>
        itemObj[name] &&
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
      dispatch({ type: "ADD_NEW_ITEM_TO_LIST", payload: newItem.data.message });
    })();
    setApiLoading(false);
    setNewItemInput(ITEM_INITIAL_INPUT);
  };

  const handleItemInputChange = (e, itemInput, setItemInput, index) => {
    const { name, value, type } = e.target;
    itemToBeUpdated = { [index]: { ...items[index] } };
    setItemInput({
      ...itemInput,
      [name]: type === "number" ? Number(value) : value,
    });
    itemToBeUpdated[index][name] = value;
  };

  const SoftDeleteButton = ({ items, index, style }) => {
    const [apiLoading, setApiLoading] = useState(false);

    const handleAddItem = async () => {
      const { _id } = items[index];
      setApiLoading(true);
      const deletedItem = await Axios.request({
        url: "/api/inventory/softDeleteItem",
        method: "post",
        data: { id: _id },
        headers: {
          Cookie: "some_cookie",
        },
      });
      const newList = deletedItem.data.items;
      dispatch({ type: "NEW_ITEMS_LIST", payload: [...newList] });
      setApiLoading(false);
    };

    return (
      <Button loading={apiLoading} onClick={handleAddItem} style={{ ...style }}>
        <Text>{index + 1}. Soft Delete</Text>
      </Button>
    );
  };

  const BarcodeRow = ({ index, style }) => {
    const name = "itemBarcode";

    const [itemInput, setItemInput] = useState({
      itemBarcode: items[index][name],
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
      itemMRPperUnit: items[index][name],
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
      itemCostPricePerUnit: items[index][name],
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
      itemSellingPricePerUnit: items[index][name],
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
      itemStockQuantity: items[index][name],
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
    return (
      <tr>
        <td>
          <UpdateItemButton
            style={style}
            dispatch={dispatch}
            index={index}
            items={items}
          />
        </td>
      </tr>
    );
  };
  const ItemSoftDeleteButtonRow = ({ index, style }) => {
    return (
      <tr>
        <td>
          <SoftDeleteButton
            style={style}
            index={index}
            items={items}
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
          <th>
            <Text>Update Button</Text>
          </th>
        </tr>
      </thead>
      <tbody className="body">
        <tr className="bill-row">
          <td>
            {items.length}
            <Input
              style={{ width: "200px" }}
              value={newItemInput["itemBarcode"]}
              onChange={handleNewItemInput}
              name="itemBarcode"
              type="number"
              autoComplete="off"
            />
          </td>
          <td>
            <Input
              type="text"
              style={{ width: "200px", marginLeft: "-10px" }}
              value={newItemInput["itemName"]}
              onChange={handleNewItemInput}
              name="itemName"
              autoComplete="off"
            />
          </td>
          <td>
            <Input
              style={{ width: "130px", marginLeft: "-10px" }}
              value={newItemInput["itemMRPperUnit"]}
              onChange={handleNewItemInput}
              name="itemMRPperUnit"
              type="number"
              autoComplete="off"
            />
          </td>
          <td>
            <Input
              style={{ width: "130px" }}
              value={newItemInput["itemCostPricePerUnit"]}
              onChange={handleNewItemInput}
              name="itemCostPricePerUnit"
              type="number"
              autoComplete="off"
            />
          </td>
          <td>
            <Input
              style={{ width: "130px" }}
              value={newItemInput["itemSellingPricePerUnit"]}
              onChange={handleNewItemInput}
              name="itemSellingPricePerUnit"
              type="number"
              autoComplete="off"
            />
          </td>
          <td>
            <Input
              style={{ width: "130px" }}
              value={newItemInput["itemStockQuantity"]}
              onChange={handleNewItemInput}
              name="itemStockQuantity"
              type="number"
              autoComplete="off"
            />
          </td>
          <td>
            <Input
              style={{ width: "130px" }}
              value={newItemInput["minimumStockQuantity"]}
              onChange={handleNewItemInput}
              name="minimumStockQuantity"
              type="number"
              autoComplete="off"
            />
          </td>
          <td>
            <Button
              loading={apiLoading}
              onClick={addItemToDb}
              style={{ width: "140px" }}
            >
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
              itemSize={() => 50}
              width={220}
              style={{ marginRight: "-8px" }}
            >
              {BarcodeRow}
            </List>
          </td>

          <td>
            <List
              className="list-it"
              height={500}
              itemCount={items.length}
              itemSize={() => 50}
              width={220}
              style={{ marginRight: "-2px", marginLeft: "-20px" }}
            >
              {ItemNameRow}
            </List>
          </td>
          <td>
            <List
              className="list-it"
              height={500}
              itemCount={items.length}
              itemSize={() => 50}
              width={150}
              style={{ marginRight: "-8px", marginLeft: "-15px" }}
            >
              {ItemMRPRow}
            </List>
          </td>
          <td>
            <List
              className="list-it"
              height={500}
              itemCount={items.length}
              itemSize={() => 50}
              width={150}
              style={{ marginRight: "-8px" }}
            >
              {ItemCostPriceRow}
            </List>
          </td>
          <td>
            <List
              className="list-it"
              style={{ marginRight: "-2px" }}
              height={500}
              itemCount={items.length}
              itemSize={() => 50}
              width={150}
            >
              {ItemSellingPriceRow}
            </List>
          </td>
          <td>
            <List
              className="list-it"
              height={500}
              itemCount={items.length}
              itemSize={() => 50}
              width={150}
              style={{ marginRight: "-8px", marginLeft: "-10px" }}
            >
              {ItemStockQuantityRow}
            </List>
          </td>
          <td>
            <List
              className="list-it"
              height={500}
              itemCount={items.length}
              itemSize={() => 50}
              width={150}
              style={{ marginRight: "-8px" }}
            >
              {ItemMinimumStockQuantityRow}
            </List>
          </td>
          <td>
            <List
              className="list-it"
              height={500}
              itemCount={items.length}
              itemSize={() => 50}
              width={140}
            >
              {ItemUpdateButtonRow}
            </List>
          </td>
          <td>
            <List
              className="list-it"
              height={500}
              itemCount={items.length}
              itemSize={() => 50}
              width={140}
            >
              {ItemSoftDeleteButtonRow}
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
  index,
}) => {
  return (
    <tr style={style} className="bill-row">
      <td>{index + 1}.</td>
      <td>
        <Input
          value={itemInput[name]}
          onChange={(e) =>
            handleItemInputChange(e, itemInput, setItemInput, index)
          }
          name={name}
          type="search"
          autoComplete="off"
        />
      </td>
    </tr>
  );
};

const UpdateItemButton = ({ dispatch, items, index, style }) => {
  const [apiLoading, setApiLoading] = useState(false);
  const handleAddItem = async () => {
    const { _id } = itemToBeUpdated[index];
    setApiLoading(true);
    const updatedItem = await Axios.request({
      url: "/api/inventory/editItemById",
      method: "put",
      data: { id: _id, itemToBeUpdated: itemToBeUpdated[index] },
      headers: {
        Cookie: "some_cookie",
      },
    });
    const newList = [...items];
    newList.splice(index, 1, { ...updatedItem.data.message });
    dispatch({ type: "UPDATE_ITEMS_LIST", payload: [...newList] });
    setApiLoading(false);
  };

  return (
    <Button loading={apiLoading} onClick={handleAddItem} style={{ ...style }}>
      <Text>{index + 1}. UPDATE</Text>
    </Button>
  );
};
