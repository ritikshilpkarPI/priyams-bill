import { useContext, useEffect, useState, useRef } from "react";

import { VariableSizeList as List } from "react-window";

import { parse } from "json2csv";

import { Button, Input, Table, Text, Textarea, Loader, Image } from "@mantine/core";

import { AppStateContext } from "../AppState/appState.context";

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

let itemToBeUpdated = {};

export const ItemsList = () => {
  const [items, setItems] = useState([]);
  const { itemsStateAndDispatch } = useContext(AppStateContext);
  const [itemsList, dispatch] = itemsStateAndDispatch;
  const [newItemInput, setNewItemInput] = useState(ITEM_INITIAL_INPUT);
  const [apiLoading, setApiLoading] = useState(false);
  const [loaderDisplay, setloaderDisplay] = useState(true);
  const [slabArray, setSlabArray] = useState([]);
  const [updateSlabArray, setUpdateSlabArray] = useState([]);
  const [openRows, setOpenRows] = useState([1, 2, 6]);

  useEffect(() => {
    if (items.length) {
      setloaderDisplay(false)
    }
    console.log(items);
    itemRowSize();
  }, [items]);

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

    let itemObject;
    if (slabArray.length !== 0) {
      itemObject = { ...newItemInput, slabPricing: slabArray }
    } else {
      itemObject = { ...newItemInput }
    }

    // console.log(slabArray, Object.keys(slabPricesObj));
    // if (slabArray.length !== Object.keys(slabPricesObj).length) {
    //   alert('Click on tick button to add slab prices');
    //   return;
    // }
    console.log(itemObject);
    setApiLoading(true);
    (async () => {
      const newItem = await Axios.request({
        url: "/api/inventory/addNewItem",
        method: "post",
        data: { ...itemObject },
        headers: {
          Cookie: "",
        },
      });
      console.log(newItem);
      dispatch({ type: "ADD_NEW_ITEM_TO_LIST", payload: newItem.data.message });
    })();
    setApiLoading(false);
    setSlabArray([]);
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

  const ItemSlabPriceRow = ({ index }) => {
    const [addOldSlab, setAddOldSlab] = useState(false);
    const [newArray, setNewArray] = useState(items[index].slabPricing || []);
    const [slabObjectKey, setSlabObjectKey] = useState();
    const [slabObjectValue, setSlabObjectValue] = useState();
    const [editable, setEditable] = useState(false);

    const addNewSlab = () => {
      console.log('row added')
      if (addOldSlab) {
        if (!slabObjectKey || !slabObjectValue) {
          alert('Fill values...');
        } else {
          setNewArray([...newArray, [newArray.length, slabObjectKey, slabObjectValue]]);
          setSlabObjectKey();
          setSlabObjectValue();
          // setAddOldSlab(true);
        }
        return;
      }
      setAddOldSlab(true);
    }

    const handleNewInput = (data) => {
      data.name === 'key' ? setSlabObjectKey(data.value) : setSlabObjectValue(data.value);
    }

    const handleOldInput = (data, index, type) => {
      let arry = newArray[index];
      console.log(arry);
      type === 'key' ? arry[1] = data.value : arry[2] = data.value;
      console.log(arry);
      newArray.splice(index, 1, arry);
      setNewArray([...newArray]);
    }

    const setSlabPrice = () => {
      console.log('final object', newArray);
      if (!slabObjectKey && !slabObjectValue) {
        // setUpdateSlabArray([...newArray]);
        setNewArray([...newArray]);
        itemToBeUpdated = { [index]: { ...items[index], slabPricing: [...newArray] } };
      } else {
        setNewArray([...newArray, [newArray.length, slabObjectKey, slabObjectValue]]);
        // setUpdateSlabArray([...newArray, [newArray.length, slabObjectKey, slabObjectValue]]);
        setSlabObjectKey();
        setSlabObjectValue();
        setAddOldSlab(false);
        setEditable(false);
        itemToBeUpdated = { [index]: { ...items[index], slabPricing: [...newArray, [newArray.length, slabObjectKey, slabObjectValue]] } };
      }
    }

    // console.log(newArray);

    const editSlabPrice = () => {
      setEditable(true);
    }

    return (
      <div style={{ paddingTop: "0px", width: '155px' }}>
        <div style={{ display: 'flex', justifyContent: 'end', margin: '3px 0' }}>
          <Image onClick={addNewSlab} style={{ display: editable ? 'inline-block' : 'none', margin: '0 2px' }} width={16} height={16} src="images/add.svg" alt="add-icon" />
          <Image onClick={editSlabPrice} style={{ display: editable ? 'none' : 'inline-block', margin: '0 2px' }} width={16} height={16} src="images/pencil.svg" alt="edit-icon" />
          <Image onClick={setSlabPrice} style={{ display: editable ? 'inline-block' : 'none', margin: '0 2px' }} width={16} height={16} src="images/check.svg" alt="check-icon" />
          <Image width={16} height={16} style={{ margin: '0 2px' }} src="images/up.svg" alt="up-icon" />
        </div>

        {newArray?.map((item, index) => {
          return (
            <div key={index} style={{ display: "flex" }}>
              <input type="number" style={{ width: "40px", textAlign: "center", border: 'none', outline: 'none', borderBottom: editable ? '1px solid black' : 'none' }} value={item[1]} onChange={(e) => handleOldInput(e.target, index, 'key')} disabled={!editable} /> -
              <input type="number" style={{ width: "40px", textAlign: "center", border: 'none', outline: 'none' }} disabled defaultValue={index !== newArray.length - 1 ? Number(newArray[index + 1][1]) - 1 : ''} /> =
              <input type="number" style={{ width: "40px", textAlign: "center", border: 'none', outline: 'none', borderBottom: editable ? '1px solid black' : 'none' }} value={item[2]} onChange={(e) => handleOldInput(e.target, index, 'value')} disabled={!editable} />
            </div>
          )
        })}
        {
          addOldSlab ?
            <div style={{ display: "flex" }}>
              <input type="number" style={{ width: "40px", textAlign: "center", border: 'none', outline: 'none', borderBottom: '1px solid black' }} name="key" onChange={(e) => handleNewInput(e.target)} value={Number(slabObjectKey)} /> -
              <input type="number" style={{ width: "40px", textAlign: "center", border: 'none', outline: 'none' }} disabled /> =
              <input type="number" style={{ width: "40px", textAlign: "center", border: 'none', outline: 'none', borderBottom: '1px solid black' }} name="value" onChange={(e) => handleNewInput(e.target)} value={Number(slabObjectValue)} />
            </div> : ''
        }
      </div>
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
            state={[updateSlabArray, setUpdateSlabArray]}
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

  const AddSlabPrice = () => {
    const [addSlab, setAddSlab] = useState(false);
    // const [slabArray, setSlabArray] = useState([]);
    const [newArray, setNewArray] = useState([]);
    const [slabObjectKey, setSlabObjectKey] = useState();
    const [slabObjectValue, setSlabObjectValue] = useState();

    const addNewSlab = () => {
      if (addSlab) {
        if (!slabObjectKey || !slabObjectValue) {
          alert('Fill values...');
        } else {
          setSlabArray([...slabArray, [slabArray.length, slabObjectKey, slabObjectValue]]);
          setSlabObjectKey();
          setSlabObjectValue();
          // setAddSlab(true);
        }
        return;
      }
      setAddSlab(true);
    }

    console.log(addSlab);

    const handleNewInput = (data) => {
      data.name === 'key' ? setSlabObjectKey(data.value) : setSlabObjectValue(data.value);
      setNewArray([slabArray.length, slabObjectKey, slabObjectValue]);
    }

    const handleOldInput = (data, index, type) => {
      let arry = slabArray[index];
      console.log(arry);
      type === 'key' ? arry[1] = data.value : arry[2] = data.value;
      console.log(arry);
      slabArray.splice(index, 1, arry);
      setSlabArray([...slabArray]);
    }

    const createFinalObj = (arry) => {
      console.log(arry);
      let obj = {};
      arry.map((item) => (
        obj[item[1]] = Number(item[2])
      ))
      console.log(obj);
    }

    const setSlabPrice = () => {
      if (!slabObjectKey && !slabObjectValue) {
        setSlabArray([...slabArray]);
      } else {
        setSlabArray([...slabArray, [slabArray.length, slabObjectKey, slabObjectValue]]);
        setSlabObjectKey();
        setSlabObjectValue();
        setAddSlab(false);
        createFinalObj([...slabArray, [slabArray.length, slabObjectKey, slabObjectValue]]);
      }
    }

    return (
      <div style={{ paddingTop: "0px" }}>
        <div style={{ display: 'flex', justifyContent: 'end', margin: '3px 0' }}>
          <Image onClick={addNewSlab} style={{ width: '20px', height: '20px', padding: '2px', margin: '0 3px', cursor: 'pointer', display: 'inline-block' }} src="images/add.svg" alt="add-icon" />
          <Image onClick={setSlabPrice} style={{ width: '20px', height: '20px', padding: '2px', margin: '0 3px', cursor: 'pointer', display: 'inline-block' }} src="images/check.svg" alt="check-icon" />
        </div>
        {slabArray.map((item, index) => {
          return (
            <div key={index} style={{ display: "flex" }}>
              <input type="number" style={{ width: "40px", textAlign: "center", border: 'none', outline: 'none', borderBottom: '1px solid black' }} value={item[1]} onChange={(e) => handleOldInput(e.target, index, 'key')} /> -
              <input type="number" style={{ width: "40px", textAlign: "center", border: 'none', outline: 'none' }} disabled defaultValue={index !== slabArray.length - 1 ? Number(slabArray[index + 1][1]) - 1 : ''} /> =
              <input type="number" style={{ width: "40px", textAlign: "center", border: 'none', outline: 'none', borderBottom: '1px solid black' }} value={item[2]} onChange={(e) => handleOldInput(e.target, index, 'value')} />
            </div>
          )
        })}
        {
          addSlab ?
            <div style={{ display: "flex" }}>
              <input type="number" style={{ width: "40px", textAlign: "center", border: 'none', outline: 'none', borderBottom: '1px solid black' }} name="key" onChange={(e) => handleNewInput(e.target)} value={Number(slabObjectKey)} /> -
              <input type="number" style={{ width: "40px", textAlign: "center", border: 'none', outline: 'none' }} disabled /> =
              <input type="number" style={{ width: "40px", textAlign: "center", border: 'none', outline: 'none', borderBottom: '1px solid black' }} name="value" onChange={(e) => handleNewInput(e.target)} value={Number(slabObjectValue)} />
            </div> : ''
        }
      </div>
    )
  }

  const rows = ({ index, style }) => {
    return (
      <tr style={{ ...style, display: "flex", overflow: 'hidden' }}>
        <td style={{ padding: "0" }}>
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
        <td style={{ padding: '0', width: '220px' }}>
          <ItemSlabPriceRow style={style} index={index} />
        </td>
        <td style={{ padding: "0" }}>
          <ItemStockQuantityRow style={style} index={index} />
        </td>
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


  const itemRowSize = (index) => {
    if (items[index]?.slabPricing.length > 1) {
      return (items[index].slabPricing.length * 21 + 22) + 28;
    } else {
      return 50;
    }
  }

  const ListComponents = () => {
    return (
      <List
        className="list-it"
        height={window.innerHeight - 250}
        itemCount={items.length}
        itemSize={itemRowSize}
        width={1360}
      >
        {rows}
      </List>
    )
  }

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
        <Table style={{ width: "auto" }} striped highlightOnHover>
          <thead className="heading">
            <tr>
              <th style={{ width: "160px", textAlign: "center" }}>
                <Text>Bar Code</Text>
              </th>
              <th style={{ width: "250px", textAlign: "center" }}>
                <Text>
                  Item Name
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
              </th>
              <th style={{ width: "100px", textAlign: "center" }}>
                <Text>
                  MRP/Unit
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
              </th>
              <th style={{ width: "100px", textAlign: "center" }}>
                <Text>
                  Cost/Unit
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
              </th>
              <th style={{ width: "100px", textAlign: "center" }}>
                <Text>
                  Selling Price/Unit
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
              </th>
              <th style={{ width: '250px', textAlign: 'center' }}>
                <Text>
                  Slab Pricing
                  <span style={{ color: "red", display: "inline-block" }}>*</span>
                </Text>
              </th>
              <th style={{ width: "100px", textAlign: "center" }}>
                <Text>
                  Total Stock
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
              </th>
              <th style={{ width: "100px", textAlign: "center" }}>
                <Text>
                  Minimum Stock
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
              </th>
              <th style={{ width: "150px", textAlign: "center" }}>
                <Text>Update Button</Text>
              </th>
            </tr>
          </thead>
          <tbody style={{ display: loaderDisplay ? 'none' : '' }} className="body">
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
              <td>
                <AddSlabPrice />
              </td>
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
        <div style={{ padding: '30px 0', display: loaderDisplay ? 'flex' : 'none', justifyContent: 'center' }}>
          <Loader />
        </div>
        <Table style={{ width: "auto", margin: "0 auto" }}>
          <tbody>
            <ListComponents />
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

const UpdateItemButton = ({ dispatch, items, index, style, state }) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [updateSlabArray, setUpdateSlabArray] = useState(state);
  const handleAddItem = async () => {
    console.log(itemToBeUpdated);
    const { _id } = itemToBeUpdated[index];
    setApiLoading(true);

    console.log(updateSlabArray);

    console.log(itemToBeUpdated);
    const updatedItem = await Axios.request({
      url: "/api/inventory/editItemById",
      method: "put",
      data: { id: _id, itemToBeUpdated: itemToBeUpdated[index] },
      headers: {
        Cookie: "some_cookie",
      },
    });
    itemToBeUpdated = {};
    const newList = [...items];
    console.log(updatedItem);
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
