import { useEffect, useState, useRef, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Table, Text, Select, Button } from "@mantine/core";
import { AppStateContext } from "../AppState/appState.context";
import { Axios } from "../utils/axios";

const itemsByBarcode = {};
const itemsByName = {};

function EditBill() {
  const { billingID } = useParams();
  const [bill, setBill] = useState({});
  const [inputValue, setInputValue] = useState({
    itemName: "",
    itemMRPperUnit: "",
    OrderQuantity: 1,
    itemSellingPricePerUnit: "",
  });
  const [filteredData, setFilteredData] = useState([]);
  const [barcode, setBarCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [apiLoading, setApiLoading] = useState(false);

  const barRef = useRef("");
  const { itemsStateAndDispatch } = useContext(AppStateContext);
  const [itemsList] = itemsStateAndDispatch;

  useEffect(() => {
    (async () => {
      const editBill = await Axios.request({
        url: `/api/billing/getEditBill/${billingID}`,
        method: "get",
        headers: {
          Cookie: "",
        },
      });
      setBill(editBill.data.message);
    })();
  }, []);
  function handleChange(event) {
    const { name, value } = event.target;
    setInputValue((prevState) => ({ ...prevState, [name]: value }));
  }

  const handleEditItem = (e, index, billItem) => {
    const newItem = { ...billItem };
    newItem.itemDetail[e.target.name] = e.target.value;
    const newbillItems = [...bill.items];
    newbillItems.splice(index, 1, newItem);
    setBill({ ...bill, items: newbillItems });
  };

  useEffect(() => {
    itemsList.forEach((obj) => {
      obj["itemDiscountPerUnit"] =
        obj["itemMRPperUnit"] - obj["itemSellingPricePerUnit"];
      obj["OrderQuantity"] = 1;
      if (obj["itemBarcode"]) {
        itemsByBarcode[obj["itemBarcode"]] = { ...obj };
      }
      if (obj["itemName"]) {
        itemsByName[obj["itemName"]] = { ...obj };
      }
    });
  }, [itemsList]);

  const handleFilter = (event) => {
    // setFilteredData(event.target.value);
    // setItemName(event.target.value);
    const searchWord = event.target.value;

    const filteredData = itemsList.filter((value) => {
      return value.itemName.toLowerCase().includes(searchWord.toLowerCase());
    });
    setFilteredData(filteredData);
  };
  useEffect(() => {
    if (itemsByBarcode[barcode]) {
      setBill((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            itemDetail: itemsByBarcode[barcode],
            itemQuantityInBill: inputValue.OrderQuantity || 1,
            itemMRPtotal:
              inputValue.itemMRPperUnit * inputValue.OrderQuantity || 0,
            itemDiscountTotal: inputValue.itemMRPperUnit
              ? inputValue.itemMRPperUnit - inputValue.itemSellingPricePerUnit
              : 0,
            itemSellingPriceTotal:
              inputValue.itemSellingPricePerUnit * inputValue.OrderQuantity ||
              0,
          },
        ],
      }));
      setBarCode("");
      setItemName("");
    }
    barRef.current.focus();
  }, [barcode]);
  function addItemToBill(event) {
    event.preventDefault();
    const foundItem = itemsList.find(
      (item) => item.itemName.toLowerCase() == inputValue.itemName.toLowerCase()
    );
    if (foundItem) {
      setBill((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            itemDetail: foundItem,
            itemQuantityInBill: inputValue.OrderQuantity || 1,
            itemMRPtotal:
              inputValue.itemMRPperUnit * inputValue.OrderQuantity || 0,
            itemDiscountTotal: inputValue.itemMRPperUnit
              ? inputValue.itemMRPperUnit - inputValue.itemSellingPricePerUnit
              : 0,
            itemSellingPriceTotal:
              inputValue.itemSellingPricePerUnit * inputValue.OrderQuantity ||
              0,
          },
        ],
      }));
    } else {
      alert("Not found the item you are searching for");
    }

    setInputValue({
      itemName: "",
      itemMRPperUnit: "",
      OrderQuantity: "",
      itemSellingPricePerUnit: "",
    });
    setItemName("");
  }

  useEffect(() => {
    let totalSum = 0;
    let mrpTotal = 0;
    let savedAmount = 0;
    bill &&
      bill.items?.forEach((item) => {
        console.log(item);
        totalSum += Number(
          item.itemDetail["itemSellingPricePerUnit"] *
            item["itemQuantityInBill"]
        );
        mrpTotal +=
          Number(item.itemDetail["itemMRPperUnit"]) *
          Number(item["itemQuantityInBill"]);
        savedAmount +=
          Number(item.itemDetail["itemDiscountPerUnit"]) *
          Number(item["itemQuantityInBill"]);
      });
    setBill((prev) => ({
      ...prev,
      billMRPTotal: mrpTotal,
      billAmountTotal: totalSum,
      billDiscountTotal: savedAmount,
    }));
  }, [bill.items]);
  console.log({ bill });
  const saveEditBill = async () => {
    console.log({ bill }, "save");
    try {
      setApiLoading(true);
      await Axios.request({
        url: `/api/billing/editBill`,
        method: "put",
        data: { id: billingID, itemWithChanges: JSON.stringify(bill) },
        headers: {
          Cookie: "",
        },
      });
      setApiLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="edit-bill-container">
      <Table>
        <thead>
          <tr>
            <th>Bar Code</th>
            <th>Item Name</th>
            <th>Quantity </th>
            <th>MRP/Units</th>
            <th>Selling Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Text color="black" weight={700}>
                <input
                  className="bill-input"
                  ref={barRef}
                  type="number"
                  value={barcode}
                  onChange={(e) => setBarCode(e.target.value)}
                />
              </Text>
            </td>
            <td className="search-container">
              <Text color="black" weight={700}>
                <input
                  className="bill-input"
                  type="text"
                  name="itemName"
                  value={inputValue.itemName}
                  placeholder="search here"
                  onChange={(e) => {
                    handleFilter(e);
                    handleChange(e);
                  }}
                />
              </Text>
              {inputValue.itemName && Boolean(filteredData.length) && (
                <div
                  onClick={(e) => {
                    if (itemsByName[e.target.innerText]) {
                      console.log(
                        itemsByName[e.target.innerText],
                        "itembyname"
                      );
                      setBill((prev) => ({
                        ...prev,
                        items: [
                          ...prev.items,
                          {
                            itemDetail: itemsByName[e.target.innerText],
                            itemQuantityInBill: inputValue.OrderQuantity || 1,
                            itemMRPtotal:
                              inputValue.itemMRPperUnit *
                                inputValue.OrderQuantity || 0,
                            itemDiscountTotal: inputValue.itemMRPperUnit
                              ? inputValue.itemMRPperUnit -
                                inputValue.itemSellingPricePerUnit
                              : 0,
                            itemSellingPriceTotal:
                              inputValue.itemSellingPricePerUnit *
                                inputValue.OrderQuantity || 0,
                          },
                        ],
                      }));
                      setBarCode("");
                      setInputValue({
                        itemName: "",
                        itemMRPperUnit: "",
                        OrderQuantity: 1,
                        itemSellingPricePerUnit: "",
                      });
                      setFilteredData([]);
                    }
                  }}
                  className="data-result"
                  style={{ minWidth: "fit-content" }}
                >
                  {filteredData?.map((value, key) => {
                    return (
                      <div
                        key={key}
                        style={{
                          padding: "5px",
                          fontSize: "16px",
                          fontStyle: "bold",
                        }}
                        className="show-data"
                      >
                        {value.itemName}
                      </div>
                    );
                  })}
                </div>
              )}
            </td>
            <td>
              <Text color="black" weight={700}>
                <input
                  className="bill-input"
                  type="number"
                  placeholder="OrderQuantity"
                  name="OrderQuantity"
                  onChange={handleChange}
                  value={inputValue.OrderQuantity}
                />
              </Text>
            </td>
            <td>
              <Text color="black" weight={700}>
                <input
                  className="bill-input"
                  type="number"
                  placeholder="itemMRPperUnit"
                  name="itemMRPperUnit"
                  onChange={handleChange}
                  value={inputValue.itemMRPperUnit}
                />
              </Text>
            </td>
            <td>
              <Text color="black" weight={700}>
                <input
                  className="bill-input"
                  type="number"
                  name="itemSellingPricePerUnit"
                  placeholder="selling price"
                  onChange={handleChange}
                  value={inputValue.itemSellingPricePerUnit}
                />
              </Text>
            </td>
            <td>
              <button onClick={addItemToBill}>ADD ITEM</button>
              {/* <button>ADD ITEM</button> */}
            </td>
          </tr>
          {bill?.items?.map((billItem, index) => {
            return (
              <tr key={index}>
                <td>
                  <Text color="black" weight={700}>
                    <input
                      className="item-edit"
                      type="number"
                      name="itemBarcode"
                      placeholder="bar code"
                      onChange={(e) => {
                        handleEditItem(e, index, billItem);
                      }}
                      value={billItem.itemDetail?.itemBarcode}
                    />
                  </Text>
                </td>
                <td>
                  <Text color="black" weight={700}>
                    <input
                      className="item-edit"
                      type="text"
                      name="itemName"
                      placeholder="Item Name"
                      onChange={(e) => {
                        handleEditItem(e, index, billItem);
                      }}
                      value={billItem?.itemDetail?.itemName}
                    />
                  </Text>
                </td>
                <td>
                  <Text color="black" weight={700}>
                    <input
                      className="item-edit"
                      type="number"
                      name="itemQuantityInBill"
                      placeholder="Item Quantity"
                      onChange={(e) => {
                        const newItem = { ...billItem };
                        newItem[e.target.name] = e.target.value;
                        const newbillItems = [...bill.items];
                        newbillItems.splice(index, 1, newItem);
                        setBill({ ...bill, items: newbillItems });
                      }}
                      value={billItem?.itemQuantityInBill}
                    />
                  </Text>
                </td>
                <td>
                  <Text color="black" weight={700}>
                    <input
                      className="item-edit"
                      type="number"
                      name="itemMRPperUnit"
                      placeholder="Item mrp"
                      onChange={(e) => {
                        handleEditItem(e, index, billItem);
                      }}
                      value={billItem?.itemDetail?.itemMRPperUnit}
                    />
                  </Text>
                </td>
                <td>
                  <Text color="black" weight={700}>
                    <input
                      className="item-edit"
                      type="number"
                      name="itemSellingPricePerUnit"
                      placeholder="Item Selling Price"
                      onChange={(e) => {
                        handleEditItem(e, index, billItem);
                      }}
                      value={billItem?.itemDetail?.itemSellingPricePerUnit}
                    />
                  </Text>
                </td>
                <td>
                  <Button
                    onClick={() => {
                      const newBill = [...bill.items];
                      newBill.splice(index, 1);
                      setBill({ ...bill, items: [...newBill] });
                    }}
                  >
                    Delete Item
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <div className="total">
        <p>MRP Total: {bill.billMRPTotal}</p>
        <p>Bill Total: {bill.billAmountTotal}</p>
        <p>You Saved: {bill.billDiscountTotal}</p>
      </div>

      <div className="operation-button">
        <Link to="/allBill">
          <Button type="danger">Cancel</Button>
        </Link>

        <Button type="primary" onClick={saveEditBill}>
          Submit
        </Button>
      </div>
    </div>
  );
}

export default EditBill;
