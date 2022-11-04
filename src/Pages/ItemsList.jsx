import { useContext, useEffect, useState, useRef } from "react";

import { parse } from "json2csv";
import { VariableSizeList as List } from "react-window";

import {
  FileButton,
  Button,
  Input,
  Table,
  Text,
  Loader,
  Image,
  Textarea,
  Select,
  TextInput,
  NumberInput,
} from "@mantine/core";

// import { DatePicker } from '@mantine/dates';

import { AppStateContext } from "../AppState/appState.context";
import { Axios } from "../utils/axios";
import Papa from "papaparse";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
// import ProtectedComponent from "src/components/ProtectedComponent";
// import access from "../access.js";

const ITEM_INITIAL_INPUT = {
  itemBarcode: "",
  itemName: "",
  itemMRPperUnit: "",
  itemCostPricePerUnit: "",
  itemSellingPricePerUnit: "",
  itemStockQuantity: "",
  minimumStockQuantity: "",
  useByDate: [],
};

let itemToBeUpdated = {};

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const { itemsStateAndDispatch } = useContext(AppStateContext);
  const [itemsList, dispatch] = itemsStateAndDispatch;
  const [newItemInput, setNewItemInput] = useState(ITEM_INITIAL_INPUT);
  const [apiLoading, setApiLoading] = useState(false);
  const [csvFile, setCsvFile] = useState();
  const [filterItems, setFilterItems] = useState("");
  const [loaderDisplay, setloaderDisplay] = useState(true);
  const [slabArray, setSlabArray] = useState([]);
  const [stopStream] = useState(false);
  const [openScanner, setOpenScanner] = useState(false);
  const inputTable = useRef();
  const [tableWidth, setTableWidth] = useState();
  // const [useByDate, setUseByDate] = useState();
  // const [dateArray, setDateArray] = useState([]);
  const [useByDateData, setuseByDateData] = useState([]);

  useEffect(() => {
    setItems([...itemsList]);
  }, [itemsList]);

  useEffect(() => {
    if (items.length) {
      setloaderDisplay(false);
    }
  }, [items]);

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

  const handleSelectChange = (value, name) => {
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

  // const setUseDates = (e) => {
  //   const { name, value } = e.target;
  //   let newDates = [...dateArray, value];
  //   setDateArray(newDates.sort());
  //   // setUseByDate();
  //   setNewItemInput({ ...newItemInput, [name]: newDates.sort() });
  //   const filteredItems = itemsList.filter(
  //     (itemObj) =>
  //       itemObj[name] &&
  //       itemObj[name]
  //         .toString()
  //         .toLowerCase()
  //         .includes(value.toString().toLowerCase())
  //   );
  //   setItems([...filteredItems]);
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

    let itemObject;
    if (slabArray.length !== 0) {
      itemObject = {
        ...newItemInput,
        slabPricing: slabArray,
        useByDate: useByDateData,
      };
    } else {
      itemObject = { ...newItemInput, useByDate: useByDateData };
    }

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
      dispatch({ type: "ADD_NEW_ITEM_TO_LIST", payload: newItem.data.message });
    })();
    setApiLoading(false);
    setSlabArray([]);
    setNewItemInput(ITEM_INITIAL_INPUT);
  };

  const handleItemInputChange = (e, itemInput, setItemInput, index) => {
    const { name, value, type } = e.target;
    itemToBeUpdated = {
      [index]: { ...items[index], ...itemToBeUpdated[index] },
    };
    setItemInput({
      ...itemInput,
      [name]: type === "number" ? Number(value) : value,
    });
    itemToBeUpdated[index][name] = value;
  };

  const handleItemSelectChange = (
    value,
    name,
    index,
    itemInput,
    setItemInput
  ) => {
    itemToBeUpdated = {
      [index]: { ...items[index], ...itemToBeUpdated[index] },
    };
    setItemInput({
      ...itemInput,
      [name]: value,
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
      if (deletedItem.status === 200) {
        alert("Item deleted...");
      }
      const newList = deletedItem.data.items;
      dispatch({ type: "NEW_ITEMS_LIST", payload: [...newList] });
      setApiLoading(false);
    };

    return (
      // <Button
      //   color="red"
      //   loading={apiLoading}
      //   onClick={handleDeleteItem}
      //   style={{ ...style }}
      // >
      //   <Text>Delete</Text>
      // </Button>
      <Image
        src="/images/cross.svg"
        width={18}
        style={{ marginLeft: "20px", cursor: "pointer" }}
        loading={apiLoading}
        onClick={handleDeleteItem}
      />
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
          // style={{ width: "140px" }}
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

  const BrandNameRow = ({ index }) => {
    const name = "itemBrandName";
    const [itemInput, setItemInput] = useState({
      itemBrandName: items[index][name],
    });
    return (
      <>
        <TableRow
          index={index}
          // style={{ width: "140px" }}
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
          // style={{ width: "250px" }}
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

  const ItemCategoryRow = ({ index }) => {
    const name = "itemCategory";
    const [itemInput, setItemInput] = useState({
      itemCategory: items[index][name],
    });
    return (
      <>
        <TableRow
          index={index}
          // style={{ width: "100px" }}
          items={items}
          itemsList={itemsList}
          dispatch={dispatch}
          handleItemInputChange={handleItemSelectChange}
          itemInput={itemInput}
          setItemInput={setItemInput}
          name={name}
        />
      </>
    );
  };

  const ItemPerUnitQuantityRow = ({ index }) => {
    const name = "itemPerUnitQuantity";
    const [itemInput, setItemInput] = useState({
      itemPerUnitQuantity: items[index][name],
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

  const ItemQuantityUnitRow = ({ index }) => {
    const name = "quantityUnitName";
    const [itemInput, setItemInput] = useState({
      quantityUnitName: items[index][name],
    });
    return (
      <>
        <TableRow
          index={index}
          style={{ width: "100px" }}
          items={items}
          itemsList={itemsList}
          dispatch={dispatch}
          handleItemInputChange={handleItemSelectChange}
          itemInput={itemInput}
          setItemInput={setItemInput}
          name={name}
        />
      </>
    );
  };

  const ItemUseByDateRow = ({ index }) => {
    const name = "useByDate";
    return <ShowUseByDateElement data={items[index][name]} index={index} />;
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

  // To edit slab on existing item
  const ItemSlabPriceRow = ({ index }) => {
    const [addOldSlab, setAddOldSlab] = useState(false);
    const [newArray, setNewArray] = useState(items[index].slabPricing || []);
    const [slabObjectKey, setSlabObjectKey] = useState();
    const [slabObjectValue, setSlabObjectValue] = useState();
    const [editable, setEditable] = useState(false);

    const addNewSlab = () => {
      if (addOldSlab) {
        if (!slabObjectKey || !slabObjectValue) {
          alert("Fill values...");
        } else {
          setNewArray([
            ...newArray,
            [newArray.length, Number(slabObjectKey), Number(slabObjectValue)],
          ]);
          setSlabObjectKey();
          setSlabObjectValue();
        }
        return;
      }
      setAddOldSlab(true);
    };

    const handleNewInput = (data) => {
      data.name === "key"
        ? setSlabObjectKey(data.value)
        : setSlabObjectValue(data.value);
    };

    const handleOldInput = (data, index, type) => {
      let arry = newArray[index];
      type === "key" ? (arry[1] = data.value) : (arry[2] = data.value);
      newArray.splice(index, 1, arry);
      setNewArray([...newArray]);
    };

    const setSlabPrice = () => {
      if (!slabObjectKey && !slabObjectValue) {
        setEditable(false);
        for (let i = 0; i < newArray.length; i++) {
          if (!newArray[i][1] || !newArray[i][2]) {
            newArray.splice(index, 1);
            setNewArray([...newArray]);
          } else {
          }
        }
        setNewArray([...newArray]);
        itemToBeUpdated = {
          [index]: { ...items[index], slabPricing: [...newArray] },
        };
      } else {
        setEditable(false);
        setNewArray([
          ...newArray,
          [newArray.length, Number(slabObjectKey), Number(slabObjectValue)],
        ]);
        setSlabObjectKey();
        setSlabObjectValue();
        setAddOldSlab(false);
        itemToBeUpdated = {
          [index]: {
            ...items[index],
            slabPricing: [
              ...newArray,
              [newArray.length, Number(slabObjectKey), Number(slabObjectValue)],
            ],
          },
        };
      }
      alert("Slab Added");
    };

    const editSlabPrice = () => {
      setEditable(true);
    };

    return (
      <div style={{ paddingTop: "0px", width: "155px" }}>
        <div
          style={{ display: "flex", justifyContent: "end", margin: "3px 0" }}
        >
          <Image
            onClick={addNewSlab}
            style={{
              display: editable ? "inline-block" : "none",
              margin: "0 2px",
            }}
            width={16}
            height={16}
            src="images/add.svg"
            alt="add-icon"
          />
          <Image
            onClick={editSlabPrice}
            style={{
              display: editable ? "none" : "inline-block",
              margin: "0 2px",
            }}
            width={16}
            height={16}
            src="images/pencil.svg"
            alt="edit-icon"
          />
          <Image
            onClick={setSlabPrice}
            style={{
              display: editable ? "inline-block" : "none",
              margin: "0 2px",
            }}
            width={16}
            height={16}
            src="images/check.svg"
            alt="check-icon"
          />
          <Image
            width={16}
            height={16}
            style={{ margin: "0 2px" }}
            src="images/up.svg"
            alt="up-icon"
          />
        </div>

        {newArray?.map((item, index) => {
          return (
            <div key={index} style={{ display: "flex" }}>
              <input
                type="number"
                style={{
                  width: "40px",
                  textAlign: "center",
                  border: "none",
                  outline: "none",
                  borderBottom: editable ? "1px solid black" : "none",
                }}
                value={item[1]}
                onChange={(e) => handleOldInput(e.target, index, "key")}
                disabled={!editable}
              />{" "}
              -
              <input
                type="number"
                style={{
                  width: "40px",
                  textAlign: "center",
                  border: "none",
                  outline: "none",
                }}
                disabled
                defaultValue={
                  index !== newArray.length - 1
                    ? Number(newArray[index + 1][1]) - 1
                    : ""
                }
              />{" "}
              =
              <input
                type="number"
                style={{
                  width: "40px",
                  textAlign: "center",
                  border: "none",
                  outline: "none",
                  borderBottom: editable ? "1px solid black" : "none",
                }}
                value={item[2]}
                onChange={(e) => handleOldInput(e.target, index, "value")}
                disabled={!editable}
              />
            </div>
          );
        })}
        {addOldSlab ? (
          <div style={{ display: "flex" }}>
            <input
              type="number"
              style={{
                width: "40px",
                textAlign: "center",
                border: "none",
                outline: "none",
                borderBottom: "1px solid black",
              }}
              name="key"
              onChange={(e) => handleNewInput(e.target)}
              value={Number(slabObjectKey)}
            />{" "}
            -
            <input
              type="number"
              style={{
                width: "40px",
                textAlign: "center",
                border: "none",
                outline: "none",
              }}
              disabled
            />{" "}
            =
            <input
              type="number"
              style={{
                width: "40px",
                textAlign: "center",
                border: "none",
                outline: "none",
                borderBottom: "1px solid black",
              }}
              name="value"
              onChange={(e) => handleNewInput(e.target)}
              value={Number(slabObjectValue)}
            />
          </div>
        ) : (
          ""
        )}
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
      // <tr>
      // <td>
      <UpdateItemButton
        style={style}
        dispatch={dispatch}
        index={index}
        items={items}
        setItems={setItems}
      />
      // </td>
      // </tr>
    );
  };
  const ItemSoftDeleteButtonRow = ({ index, style }) => {
    return (
      // <tr>
      // <td>
      <SoftDeleteButton style={style} index={index} items={items} />
      // </td>
      // </tr>
    );
  };

  const downloadFile = async () => {
    const fileName = "items.csv";
    let newArray = [];
    let max = 0;
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

    for (let i = 0; i < items.length; i++) {
      if (items[i].slabPricing.length !== 0) {
        if (max < items[i].slabPricing.length) {
          max = items[i].slabPricing.length;
        }
        let newObj = { ...items[i] };
        for (let j = 0; j < items[i].slabPricing.length; j++) {
          newObj[`tp${j + 1}`] = Number(items[i].slabPricing[j][1]);
          newObj[`sp${j + 1}`] = Number(items[i].slabPricing[j][2]);
        }
        newArray.push(newObj);
      } else {
        newArray.push(items[i]);
      }
    }

    for (let i = 1; i <= max; i++) {
      fields.push(`tp${i}`);
      fields.push(`sp${i}`);
    }

    const blob = new Blob([parse(newArray, { fields })], { type: "text/csv" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    return document.body.removeChild(link);
  };

  // To Add slab price on new adding item
  const AddSlabPrice = () => {
    const [addSlab, setAddSlab] = useState(false);
    const [slabObjectKey, setSlabObjectKey] = useState();
    const [slabObjectValue, setSlabObjectValue] = useState();

    const addNewSlab = () => {
      if (addSlab) {
        if (!slabObjectKey || !slabObjectValue) {
          alert("Fill values...");
        } else {
          setSlabArray([
            ...slabArray,
            [slabArray.length, slabObjectKey, slabObjectValue],
          ]);
          setSlabObjectKey();
          setSlabObjectValue();
        }
        return;
      }
      setAddSlab(true);
    };

    const handleNewInput = (data) => {
      data.name === "key"
        ? setSlabObjectKey(data.value)
        : setSlabObjectValue(data.value);
    };

    const handleOldInput = (data, index, type) => {
      let arry = slabArray[index];
      type === "key" ? (arry[1] = data.value) : (arry[2] = data.value);
      slabArray.splice(index, 1, arry);
      setSlabArray([...slabArray]);
    };

    const createFinalObj = (arry) => {
      let obj = {};
      arry.map((item) => (obj[item[1]] = Number(item[2])));
    };

    const setSlabPrice = () => {
      if (!slabObjectKey && !slabObjectValue) {
        setSlabArray([...slabArray]);
      } else {
        setSlabArray([
          ...slabArray,
          [slabArray.length, Number(slabObjectKey), Number(slabObjectValue)],
        ]);
        setSlabObjectKey();
        setSlabObjectValue();
        setAddSlab(false);
        createFinalObj([
          ...slabArray,
          [slabArray.length, slabObjectKey, slabObjectValue],
        ]);
      }
    };

    return (
      <div style={{ paddingTop: "0px" }}>
        <div
          style={{ display: "flex", justifyContent: "end", margin: "3px 0" }}
        >
          <Image
            onClick={addNewSlab}
            style={{
              width: "20px",
              height: "20px",
              padding: "2px",
              margin: "0 3px",
              cursor: "pointer",
              display: "inline-block",
            }}
            src="images/add.svg"
            alt="add-icon"
          />
          <Image
            onClick={setSlabPrice}
            style={{
              width: "20px",
              height: "20px",
              padding: "2px",
              margin: "0 3px",
              cursor: "pointer",
              display: "inline-block",
            }}
            src="images/check.svg"
            alt="check-icon"
          />
        </div>
        {slabArray.map((item, index) => {
          return (
            <div key={index} style={{ display: "flex" }}>
              <input
                type="number"
                style={{
                  width: "40px",
                  textAlign: "center",
                  border: "none",
                  outline: "none",
                  borderBottom: "1px solid black",
                }}
                value={item[1]}
                onChange={(e) => handleOldInput(e.target, index, "key")}
              />{" "}
              -
              <input
                type="number"
                style={{
                  width: "40px",
                  textAlign: "center",
                  border: "none",
                  outline: "none",
                }}
                disabled
                defaultValue={
                  index !== slabArray.length - 1
                    ? Number(slabArray[index + 1][1]) - 1
                    : ""
                }
              />{" "}
              =
              <input
                type="number"
                style={{
                  width: "40px",
                  textAlign: "center",
                  border: "none",
                  outline: "none",
                  borderBottom: "1px solid black",
                }}
                value={item[2]}
                onChange={(e) => handleOldInput(e.target, index, "value")}
              />
            </div>
          );
        })}
        {addSlab ? (
          <div style={{ display: "flex" }}>
            <input
              type="number"
              style={{
                width: "40px",
                textAlign: "center",
                border: "none",
                outline: "none",
                borderBottom: "1px solid black",
              }}
              name="key"
              onChange={(e) => handleNewInput(e.target)}
              value={Number(slabObjectKey)}
            />{" "}
            -
            <input
              type="number"
              style={{
                width: "40px",
                textAlign: "center",
                border: "none",
                outline: "none",
              }}
              disabled
            />{" "}
            =
            <input
              type="number"
              style={{
                width: "40px",
                textAlign: "center",
                border: "none",
                outline: "none",
                borderBottom: "1px solid black",
              }}
              name="value"
              onChange={(e) => handleNewInput(e.target)}
              value={Number(slabObjectValue)}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  const rows = ({ index, style }) => {
    // const minimumStock =
    //   itemsList[index].minimumStockQuantity >=
    //   itemsList[index].itemStockQuantity;
    return (
      <tr
        style={{
          ...style,
          display: "flex",
          // border: `${minimumStock ? "1px solid #F4877A" : ""}`,
        }}
      >
        <td>
          <BarcodeRow style={style} index={index} />
        </td>
        <td>
          <BrandNameRow style={style} index={index} />
        </td>
        <td>
          <ItemNameRow style={style} index={index} />
        </td>
        <td>
          <ItemCategoryRow style={style} index={index} />
        </td>
        <td>
          <ItemPerUnitQuantityRow style={style} index={index} />
        </td>
        <td>
          <ItemQuantityUnitRow style={style} index={index} />
        </td>
        <td>
          <ItemUseByDateRow style={style} index={index} />
        </td>
        <td>
          <ItemMRPRow style={style} index={index} />
        </td>
        <td>
          <ItemCostPriceRow style={style} index={index} />
        </td>
        <td>
          <ItemSellingPriceRow style={style} index={index} />
        </td>
        <td>
          <ItemSlabPriceRow style={style} index={index} />
        </td>
        <td>
          <ItemStockQuantityRow style={style} index={index} />
        </td>
        <td>
          <ItemMinimumStockQuantityRow style={style} index={index} />
        </td>
        <td style={{ display: "flex" }}>
          <ItemUpdateButtonRow index={index} />
          <ItemSoftDeleteButtonRow index={index} />
        </td>
        {/* <td>
          <ItemSoftDeleteButtonRow index={index} />
        </td> */}
      </tr>
    );
  };

  // To update item data through uploading CSV file
  useEffect(() => {
    if (typeof window != "undefined") {
      setTableWidth(
        window.getComputedStyle(inputTable.current).getPropertyValue("width")
      );
    }

    if (csvFile) {
      Papa.parse(csvFile, {
        complete: async function (results) {
          await Axios.request({
            url: "/api/inventory/addbulkitems",
            method: "post",
            data: results.data,
          });
        },
      });
    }
  }, [csvFile]);

  // To adjust height of the rows
  const itemRowSize = (index) => {
    if (items[index]?.slabPricing.length >= 1) {
      return items[index].slabPricing.length * 21 + 22 + 28;
    } else if (items[index].useByDate.length >= 1) {
      return items[index].useByDate.length * 40 + 90;
    } else {
      return 120;
    }
  };

  const ListComponents = () => {
    return (
      <List
        className="list-it"
        height={window.innerHeight - 320}
        itemCount={items.length}
        itemSize={itemRowSize}
        width={tableWidth}
      >
        {rows}
      </List>
    );
  };

  const UseByDateElement = () => {
    const [selectedDate, setSelectedDate] = useState("");
    // const [savedDates, setSavedDates] = useState(data);
    // To add new date
    const addNewDate = (e) => {
      setSelectedDate(e.target.value);
      const dateSelected = useByDateData.findIndex(
        (item) => item.date === e.target.value
      );
      if (dateSelected !== -1) {
        alert("date already selected!");
        return;
      }
      let dateArray = [...useByDateData, { date: e.target.value, value: 0 }];
      dateArray.sort((a, b) => {
        return a.date > b.date ? 1 : b.date > a.date ? -1 : 0;
      });

      setuseByDateData([...dateArray]);
      // setNewItemInput({...newItemInput, useByDate: [...dateArray]});
    };

    // To change any date item quantity
    const handleAddDateInputChange = (e, index) => {
      let newDateObj = { date: useByDateData[index].date, value: e };
      useByDateData.splice(index, 1, newDateObj);
      setuseByDateData(useByDateData);
      // setNewItemInput({...newItemInput, useByDate: useByDateData})
    };

    // To remove any date
    const deleteDate = (e, index) => {
      useByDateData.splice(index, 1);
      setuseByDateData([...useByDateData]);
      // setNewItemInput({...newItemInput, useByDate: [...useByDateData]});
    };

    return (
      <div className="useby-date-container">
        <input
          type="date"
          name="useByDate"
          id="useByDate"
          value={selectedDate}
          onChange={(e) => addNewDate(e)}
        />
        {useByDateData.map((item, index) => {
          return (
            <div key={index} className="new-date-row">
              <TextInput value={item.date} readOnly></TextInput>
              <NumberInput
                className="per-date-quantity"
                value={item.value}
                style={{ padding: "7px 7px" }}
                onChange={(e) => handleAddDateInputChange(e, index)}
                hideControls
              ></NumberInput>
              <Image
                className="delete-icon"
                src="images/cross.svg"
                width={14}
                onClick={(e) => deleteDate(e, index)}
              ></Image>
            </div>
          );
        })}
      </div>
    );
  };

  const ShowUseByDateElement = ({ data, index }) => {
    const [selectedDate, setSelectedDate] = useState("");
    const [savedDates, setSavedDates] = useState(data);
    // To add new date
    const addNewDate = (e) => {
      setSelectedDate(e.target.value);
      const dateSelected = savedDates.findIndex(
        (item) => item.date === e.target.value
      );
      if (dateSelected !== -1) {
        alert("date already selected!");
        return;
      }
      let dateArray = [...savedDates, { date: e.target.value, value: 0 }];
      dateArray.sort((a, b) => {
        return a.date > b.date ? 1 : b.date > a.date ? -1 : 0;
      });
      setSavedDates([...dateArray]);
      itemToBeUpdated = {
        [index]: {
          ...items[index],
          ...itemToBeUpdated[index],
          useByDate: [...dateArray],
        },
      };
    };

    // To change any date item quantity
    const handleAddDateInputChange = (e, inputIndex) => {
      let newDateObj = { date: savedDates[inputIndex].date, value: e };
      savedDates.splice(inputIndex, 1, newDateObj);
      setSavedDates(savedDates);
      itemToBeUpdated = {
        [index]: {
          ...items[index],
          ...itemToBeUpdated[index],
          useByDate: savedDates,
        },
      };
    };

    // To remove any date
    const deleteDate = (e, inputIndex) => {
      savedDates.splice(inputIndex, 1);
      setSavedDates([...savedDates]);
      itemToBeUpdated = {
        [index]: {
          ...items[index],
          ...itemToBeUpdated[index],
          useByDate: [...savedDates],
        },
      };
    };

    return (
      <div className="useby-date-container">
        <input
          type="date"
          name="useByDate"
          id="useByDate"
          value={selectedDate}
          onChange={(e) => addNewDate(e)}
        />
        {savedDates?.map((item, index) => {
          return (
            <div key={index} className="new-date-row">
              <TextInput value={item.date.slice(0, 10)} readOnly></TextInput>
              <NumberInput
                className="per-date-quantity"
                value={item.value}
                onChange={(e) => handleAddDateInputChange(e, index)}
                hideControls
              ></NumberInput>
              <Image
                className="delete-icon"
                src="images/cross.svg"
                width={14}
                onClick={(e) => deleteDate(e, index)}
              ></Image>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="inventory-items-container">
      <div className="top-buttons">
        {/* <ProtectedComponent role={access.UPLOAD_CSV_BUTTON}> */}
        <FileButton onChange={setCsvFile} className="upload-btn">
          {(props) => <Button {...props}>Upload CSV</Button>}
        </FileButton>
        {/* </ProtectedComponent> */}
        <Button
          disabled={!items.length}
          onClick={downloadFile}
          className="download-btn"
        >
          Download CSV
        </Button>
        <Button onClick={() => setOpenScanner(!openScanner)}>
          Barcode Scanner
        </Button>
      </div>
      <h4 className="total-item-count">Total Items : {items.length}</h4>
      {openScanner && (
        <BarcodeScannerComponent
          width={500}
          height={500}
          stopStream={stopStream}
          onUpdate={(err, result) => {
            if (result) {
              handleNewItemInput({
                target: { name: "itemBarcode", value: result.text },
              });
              // setStopStream(true);
            }
          }}
        />
      )}
      <div>
        <Table
          striped
          highlightOnHover
          verticalSpacing="xl"
          className="item-input-table"
          ref={inputTable}
        >
          <thead className="heading">
            <tr>
              <th>
                <Text>Bar Code</Text>
                <input
                  type="checkbox"
                  checked={filterItems === "itemBarcode"}
                  label="Filter Barcode"
                  value="Filter Barcode"
                  onChange={() => handleCheckboxFilter("itemBarcode")}
                />
              </th>
              <th>
                <Text>Brand Name</Text>
                <input
                  type="checkbox"
                  checked={filterItems === "itemBrandName"}
                  label="Filter Brand Name"
                  value="Filter Brand Name"
                  onChange={() => handleCheckboxFilter("itemBrandName")}
                />
              </th>
              <th>
                <Text>
                  Item Name
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
                <input
                  type="checkbox"
                  checked={filterItems === "itemName"}
                  label="Filter Name"
                  value="Filter Name"
                  onChange={() => handleCheckboxFilter("itemName")}
                />
              </th>
              <th>
                <Text>
                  Category
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
              </th>
              <th>
                <Text>
                  Item Quantity
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
                <input
                  type="checkbox"
                  checked={filterItems === "itemPerUnitQuantity"}
                  label="Filter Item Quantity"
                  value="Filter Item Quantity"
                  onChange={() => handleCheckboxFilter("itemPerUnitQuantity")}
                />
              </th>
              <th>
                <Text>
                  Unit
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
                <input
                  type="checkbox"
                  checked={filterItems === "quantityUnitName"}
                  label="Filter Item Unit"
                  value="Filter Item Unit"
                  onChange={() => handleCheckboxFilter("quantityUnitName")}
                />
              </th>
              <th>
                <Text>
                  Use by date
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
                <input
                  type="checkbox"
                  checked={filterItems === "quantityUnitName"}
                  label="Filter Item Unit"
                  value="Filter Item Unit"
                  onChange={() => handleCheckboxFilter("quantityUnitName")}
                />
              </th>
              <th>
                <Text>
                  MRP/Unit
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
                <input
                  type="checkbox"
                  label="Filter MRP/Unit"
                  value="Filter  MRP/Unit"
                  checked={filterItems === "itemMRPperUnit"}
                  onChange={() => handleCheckboxFilter("itemMRPperUnit")}
                />
              </th>
              <th>
                <Text>
                  Cost/Unit
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
                <input
                  type="checkbox"
                  label="Filter With Cost Price"
                  value="Filter With Cost Price"
                  checked={filterItems === "itemCostPricePerUnit"}
                  onChange={() => handleCheckboxFilter("itemCostPricePerUnit")}
                />
              </th>
              <th>
                <Text>
                  SP/Unit
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
                <input
                  type="checkbox"
                  label="Filter With Selling Price"
                  value="Filter With Selling Price"
                  checked={filterItems === "itemSellingPricePerUnit"}
                  onChange={() =>
                    handleCheckboxFilter("itemSellingPricePerUnit")
                  }
                />
              </th>
              <th>
                <Text>
                  Slabs
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
              </th>
              <th>
                <Text>
                  Total Stock
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
                <input
                  type="checkbox"
                  label="Filter With Total Stock"
                  value="Filter With Total Stock"
                  checked={filterItems === "itemStockQuantity"}
                  onChange={() => handleCheckboxFilter("itemStockQuantity")}
                />
              </th>
              <th>
                <Text>
                  Min Stock
                  <span style={{ color: "red", display: "inline-block" }}>
                    *
                  </span>
                </Text>
                <input
                  type="checkbox"
                  checked={filterItems === "minimumStockQuantity"}
                  label="Filter With Minimum Stock"
                  value="Filter With Minimum Stock"
                  onChange={() => handleCheckboxFilter("minimumStockQuantity")}
                />
              </th>
              <th>
                <Text>Update Button</Text>
              </th>
            </tr>
          </thead>
          <tbody
            style={{ display: loaderDisplay ? "none" : "" }}
            className="body"
          >
            <tr className="bill-row">
              <td>
                <Input
                  value={newItemInput["itemBarcode"]}
                  onChange={handleNewItemInput}
                  name="itemBarcode"
                  type="number"
                  autoComplete="off"
                />
              </td>
              <td>
                <Input
                  value={newItemInput["itemBrandName"]}
                  onChange={handleNewItemInput}
                  name="itemBrandName"
                  type="text"
                  autoComplete="off"
                />
              </td>
              <td>
                <Input
                  type="text"
                  value={newItemInput["itemName"]}
                  onChange={handleNewItemInput}
                  name="itemName"
                  autoComplete="off"
                />
              </td>
              <td>
                <Select
                  placeholder="Category"
                  data={[
                    { value: "Rice", label: "Rice" },
                    { value: "Pulse", label: "Pulse" },
                    { value: "Beverage", label: "Beverage" },
                    { value: "Spice", label: "Spice" },
                  ]}
                  value={newItemInput["itemCategory"]}
                  onChange={(val) => handleSelectChange(val, "itemCategory")}
                />
              </td>
              <td>
                <Input
                  value={newItemInput["itemPerUnitQuantity"]}
                  onChange={handleNewItemInput}
                  name="itemPerUnitQuantity"
                  type="number"
                  autoComplete="off"
                />
              </td>
              <td>
                <Select
                  placeholder="Pick one"
                  data={[
                    { value: "kg", label: "kg" },
                    { value: "grams", label: "grams" },
                    { value: "liter", label: "liter" },
                    { value: "ml", label: "ml" },
                    { value: "Piece", label: "Piece" },
                  ]}
                  value={newItemInput["quantityUnitName"]}
                  onChange={(val) =>
                    handleSelectChange(val, "quantityUnitName")
                  }
                />
              </td>
              <td>
                <UseByDateElement />
              </td>
              <td>
                <Input
                  value={newItemInput["itemMRPperUnit"]}
                  onChange={handleNewItemInput}
                  name="itemMRPperUnit"
                  type="number"
                  autoComplete="off"
                />
              </td>
              <td>
                <Input
                  value={newItemInput["itemCostPricePerUnit"]}
                  onChange={handleNewItemInput}
                  name="itemCostPricePerUnit"
                  type="number"
                  autoComplete="off"
                />
              </td>
              <td>
                <Input
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
                  value={newItemInput["itemStockQuantity"]}
                  onChange={handleNewItemInput}
                  name="itemStockQuantity"
                  type="number"
                  autoComplete="off"
                />
              </td>
              <td>
                <Input
                  value={newItemInput["minimumStockQuantity"]}
                  onChange={handleNewItemInput}
                  name="minimumStockQuantity"
                  type="number"
                  autoComplete="off"
                />
              </td>
              <td>
                <Button loading={apiLoading} onClick={addItemToDb}>
                  ADD NEW ITEM
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
        <div
          style={{
            padding: "30px 0",
            display: loaderDisplay ? "flex" : "none",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
        <Table className="show-items-table">
          <tbody>
            <ListComponents />
          </tbody>
        </Table>
      </div>
    </div>
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
  if (name === "quantityUnitName" || name === "itemCategory") {
    const data =
      name === "quantityUnitName"
        ? [
            { value: "kg", label: "kg" },
            { value: "grams", label: "grams" },
            { value: "liter", label: "liter" },
            { value: "ml", label: "ml" },
            { value: "Piece", label: "Piece" },
          ]
        : [
            { value: "Rice", label: "Rice" },
            { value: "Pulse", label: "Pulse" },
            { value: "Beverage", label: "Beverage" },
            { value: "Spice", label: "Spice" },
          ];

    return (
      <Select
        placeholder="Pick one"
        data={data}
        value={itemInput[name]}
        onChange={(val) =>
          handleItemInputChange(val, name, index, itemInput, setItemInput)
        }
      />
    );
  } else {
    const Component = name === "itemName" ? Textarea : Input;
    return (
      <Component
        variant="unstyled"
        value={itemInput[name]}
        onChange={(e) =>
          handleItemInputChange(e, itemInput, setItemInput, index)
        }
        name={name}
        type="search"
        autoComplete="off"
      />
    );
  }
};

const UpdateItemButton = ({ dispatch, items, index, style, setItems }) => {
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
    if (updatedItem.status === 200) {
      alert("Item updated...");
    }
    itemToBeUpdated = {};
    const newList = [...items];
    newList.splice(index, 1, { ...updatedItem.data.message });
    setItems(newList);
    dispatch({ type: "UPDATE_ITEMS_LIST", payload: [...newList] });
    setApiLoading(false);
  };

  return (
    // <Button
    //   loading={apiLoading}
    //   onClick={handleAddItem}
    // // style={{ ...style, margin: "0 15px" }}
    // >
    //   <Text>Update</Text>
    // </Button>
    <Image
      src="images/check.svg"
      loading={apiLoading}
      onClick={handleAddItem}
      width={22}
      style={{ marginLeft: "15px", cursor: "pointer" }}
    />
  );
};

export default ItemsList;
