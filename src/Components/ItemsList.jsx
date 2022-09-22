import {
  useContext,
  useEffect,
  useState,
} from 'react';

import { parse } from 'json2csv';
import { VariableSizeList as List } from 'react-window';

import {
  Button,
  Input,
  Table,
  Text,
  Textarea,
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
  const [checked, setChecked] = useState(false);
  const [filterItems, setFilterItems] = useState("");

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

  // const handleChange = (filterName) => {
  //   handleCheckboxFilter(filterName)
  // }

  const handleCheckboxFilter = (filterName) => {
    setFilterItems(filterName);
    if (filterName !== filterItems) {
      handleFilter(filterName);
    } else {
      resetFilter();
    }
  };

  const handleFilter = (name) => {
    const filteredData = itemsList.filter((item) => item[name] === null);
    setItems([...filteredData]);
  };
  const resetFilter = () => {
    setItems([...itemsList]);
    setFilterItems(" ");
  };

  const addItemToDb = async () => {
    if (
      !newItemInput.itemCostPricePerUnit ||
      !newItemInput.itemMRPperUnit ||
      !newItemInput.itemName ||
      !newItemInput.itemSellingPricePerUnit ||
      !newItemInput.itemStockQuantity ||
      !newItemInput.minimumStockQuantity
    ) {
      alert("Fill all required fields!");
      return;
    }

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

    const handleDeleteItem = async () => {
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
      <Button
        color="red"
        loading={apiLoading}
        onClick={handleDeleteItem}
        style={{ ...style }}
      >
        <Text>Delete</Text>
      </Button>
    );
  };

  const BarcodeRow = ({ index }) => {
    const name = "itemBarcode";
    const [itemInput, setItemInput] = useState({
      itemBarcode: items[index][name],
    });
    return (
      <>
        <TableRow
          index={index}
          style={{ width: "160px" }}
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

  const ItemNameRow = ({ index }) => {
    const name = "itemName";
    const [itemInput, setItemInput] = useState({
      itemName: items[index][name],
    });
    return (
      <>
        <TableRow
          index={index}
          style={{ width: "250px" }}
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
          style={{ width: "100px" }}
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
          style={{ width: "100px" }}
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
          style={{ width: "100px" }}
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

  // const ItemSlabPriceRow = ({ index, style }) => {
  //   const name = "itemSlabPricePerUnit";
  //   const slabPrice = {
  //     1: 5,
  //     2: 4.5,
  //     5: 4,
  //     15: 3.8,
  //     20: 3.5,
  //   };
  //   const slabKeys = Object.keys(slabPrice);
  //   const slabValues = Object.values(slabPrice);

  //   return (
  //     <div style={{ paddingTop: "20px", border: "1px solid red" }}>
  //       {slabKeys.map((item, index) => {
  //         return (
  //           <div style={{ display: "flex" }}>
  //             <Image src="./Images/edit.svg" alt="edit-icon"></Image>
  //             <input
  //               type="number"
  //               defaultValue={parseInt(item)}
  //               style={{ width: "40px", textAlign: "center", border: "none" }}
  //               disabled
  //             />
  //             -
  //             <input
  //               type="number"
  //               defaultValue={parseInt(slabKeys[index + 1] - 1)}
  //               style={{ width: "40px", textAlign: "center", border: "none" }}
  //               disabled
  //             />
  //             =
  //             <input
  //               type="number"
  //               defaultValue={slabValues[index]}
  //               style={{ width: "40px", textAlign: "center", border: "none" }}
  //               disabled
  //             />
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // };

  const ItemStockQuantityRow = ({ index, style }) => {
    const name = "itemStockQuantity";
    const [itemInput, setItemInput] = useState({
      itemStockQuantity: items[index][name],
    });

    return (
      <>
        <TableRow
          index={index}
          style={{ width: "100px" }}
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
          style={{ width: "100px", textAlign: "center" }}
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
          <SoftDeleteButton style={style} index={index} items={items} />
        </td>
      </tr>
    );
  };

  const downloadFile = async () => {
    const fileName = "items.csv";
    const fields = [
      "_id",
      "itemName",
      "itemDiscountPerUnit",
      "itemPerUnitDiscountPercentage",
      "itemBarcode",
      "itemMRPperUnit",
      "itemCostPricePerUnit",
      "itemSellingPricePerUnit",
      "itemStockQuantity",
      "minimumStockQuantity",
      "isDeleted",
    ];
    const blob = new Blob([parse(items, { fields })], { type: "text/csv" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    return document.body.removeChild(link);
  };

  const rows = ({ index, style }) => {
    const minimumStock =
      itemsList[index].minimumStockQuantity >=
      itemsList[index].itemStockQuantity;
    return (
      <tr
        style={{
          ...style,
          height: "60px",
          display: "flex",
          border: `${minimumStock ? "1px solid #F4877A" : ""}`,
          borderRadius: "8px",
        }}
      >
        <td style={{ padding: "10" }}>
          <BarcodeRow style={style} index={index} />
        </td>
        <td style={{ padding: "0" }}>
          <ItemNameRow style={style} index={index} />
        </td>
        <td style={{ padding: "0" }}>
          <ItemMRPRow style={style} index={index} />
        </td>
        <td style={{ padding: "0" }}>
          <ItemCostPriceRow style={style} index={index} />
        </td>
        <td style={{ padding: "0" }}>
          <ItemSellingPriceRow style={style} index={index} />
        </td>
        <td style={{ padding: "0" }}>
          <ItemStockQuantityRow style={style} index={index} />
        </td>
        {/* <td style={{ padding: '0', width: '220px' }}>
          <ItemSlabPriceRow style={style} index={index} />
        </td> */}
        <td style={{ padding: "0" }}>
          <ItemMinimumStockQuantityRow style={style} index={index} />
        </td>
        <td>
          <ItemUpdateButtonRow index={index} />
        </td>
        <td>
          <ItemSoftDeleteButtonRow index={index} />
        </td>
      </tr>
    );
  };

  return (
    <>
      <Button
        disabled={!items.length}
        style={{ background: "#0da20a", margin: "5px", float: "right" }}
        onClick={downloadFile}
      >
        Download CSV
      </Button>
      <div style={{ width: "1360px", margin: "30px auto 0" }}>
        <h4>Total Items : {items.length}</h4>
        <Table
          style={{ width: "auto" }}
          striped
          highlightOnHover
          verticalSpacing="xl"
        >
          <thead className="heading">
            <tr>
              <th style={{ width: "160px", textAlign: "center" }}>
                <Text>Bar Code</Text>
                <div style={{ marginTop: "1rem" }}>
                  <input
                    type="checkbox"
                    checked={filterItems === "itemBarcode"}
                    label="Filter Barcode"
                    value="Filter Barcode"
                    onClick={() => handleCheckboxFilter("itemBarcode")}
                  />
                </div>
              </th>
              <th style={{ width: "250px", textAlign: "center" }}>
                <Text>
                  Item Name
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
                <div style={{ marginTop: "1rem" }}>
                  <input
                    type="checkbox"
                    checked={filterItems === "itemName"}
                    label="Filter Name"
                    value="Filter Name"
                    onClick={() => handleCheckboxFilter("itemName")}
                  />
                </div>
              </th>
              <th style={{ width: "100px", textAlign: "center" }}>
                <Text>
                  MRP/Unit
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
                <div style={{ marginTop: "1rem" }}>
                  <input
                    type="checkbox"
                    label="Filter MRP/Unit"
                    value="Filter  MRP/Unit"
                    checked={filterItems === "itemMRPperUnit"}
                    onClick={() => handleCheckboxFilter("itemMRPperUnit")}
                  />
                </div>
              </th>
              <th style={{ width: "100px", textAlign: "center" }}>
                <Text>
                  Cost/Unit
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                  <div style={{ marginTop: "1rem" }}>
                    <input
                      type="checkbox"
                      label="Filter With Cost Price"
                      value="Filter With Cost Price"
                      checked={filterItems === "itemCostPricePerUnit"}
                      onClick={() =>
                        handleCheckboxFilter("itemCostPricePerUnit")
                      }
                    />
                  </div>
                </Text>
              </th>
              <th style={{ width: "100px", textAlign: "center" }}>
                <Text>
                  Selling Price/Unit
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
                <div style={{ marginTop: "1rem" }}>
                  <input
                    type="checkbox"
                    label="Filter With Selling Price"
                    value="Filter With Selling Price"
                    checked={filterItems === "itemSellingPricePerUnit"}
                    onClick={() =>
                      handleCheckboxFilter("itemSellingPricePerUnit")
                    }
                  />
                </div>
              </th>
              {/* <th style={{width: '250px', textAlign: 'center'}}>
              <Text>
                Slab Pricing
                <span style={{ color: "red", display: "inline-block" }}>*</span>
              </Text>
            </th> */}
              <th style={{ width: "100px", textAlign: "center" }}>
                <Text>
                  Total Stock
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
                <div style={{ marginTop: "1rem" }}>
                  <input
                    type="checkbox"
                    label="Filter With Total Stock"
                    value="Filter With Total Stock"
                    checked={filterItems === "itemStockQuantity"}
                    onClick={() => handleCheckboxFilter("itemStockQuantity")}
                  />
                </div>
              </th>
              <th style={{ width: "100px", textAlign: "center" }}>
                <Text>
                  Minimum Stock
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
                <div style={{ marginTop: "1rem" }}>
                  <input
                    type="checkbox"
                    checked={filterItems === "minimumStockQuantity"}
                    label="Filter With Minimum Stock"
                    value="Filter With Minimum Stock"
                    onClick={() => handleCheckboxFilter("minimumStockQuantity")}
                  />
                </div>
              </th>
              <th style={{ width: "150px", textAlign: "center" }}>
                <Text>Update Button</Text>
              </th>
            </tr>
          </thead>
          <tbody className="body">
            <tr className="bill-row">
              <td>
                <Input
                  style={{ width: "160px" }}
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
                  style={{ width: "250px" }}
                  value={newItemInput["itemName"]}
                  onChange={handleNewItemInput}
                  name="itemName"
                  autoComplete="off"
                />
              </td>
              <td>
                <Input
                  style={{ width: "100px" }}
                  value={newItemInput["itemMRPperUnit"]}
                  onChange={handleNewItemInput}
                  name="itemMRPperUnit"
                  type="number"
                  autoComplete="off"
                />
              </td>
              <td>
                <Input
                  style={{ width: "100px" }}
                  value={newItemInput["itemCostPricePerUnit"]}
                  onChange={handleNewItemInput}
                  name="itemCostPricePerUnit"
                  type="number"
                  autoComplete="off"
                />
              </td>
              <td>
                <Input
                  style={{ width: "100px" }}
                  value={newItemInput["itemSellingPricePerUnit"]}
                  onChange={handleNewItemInput}
                  name="itemSellingPricePerUnit"
                  type="number"
                  autoComplete="off"
                />
              </td>
              {/* <td>
              <Input
                style={{ width: "250px" }}
                value={newItemInput["itemSellingPricePerUnit"]}
                onChange={handleNewItemInput}
                name="itemSellingPricePerUnit"
                type="number"
                placeholder="hello"
                autoComplete="off"
              />
            </td> */}
              <td>
                <Input
                  style={{ width: "100px" }}
                  value={newItemInput["itemStockQuantity"]}
                  onChange={handleNewItemInput}
                  name="itemStockQuantity"
                  type="number"
                  autoComplete="off"
                />
              </td>
              <td>
                <Input
                  style={{ width: "100px" }}
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
          </tbody>
        </Table>
        <Table style={{ width: "auto", margin: "0 auto" }}>
          <tbody>
            <List
              className="list-it"
              height={window.innerHeight - 250}
              itemCount={items.length}
              itemSize={() => 70}
              width={1360}
              // style={{ border: '2px solid black' }}
            >
              {rows}
            </List>
          </tbody>
        </Table>
      </div>
    </>
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
  const Component = name === "itemName" ? Textarea : Input;
  return (
    <tr className="bill-row">
      <td>
        <Component
          style={{ ...style }}
          variant="unstyled"
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
    <Button
      loading={apiLoading}
      onClick={handleAddItem}
      style={{ ...style, margin: "0 15px" }}
    >
      <Text>Update</Text>
    </Button>
  );
};
