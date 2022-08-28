import { useEffect, useState, useRef, useContext } from "react";
import { Table, Text, Button, Input } from "@mantine/core";
import { AppStateContext } from "../AppState/appState.context";
import { Axios } from "../utils/axios";

const itemsByBarcode = {};
const itemsByName = {};
const BILL_INITIAL_STATE = {
  billItems: [],
  customerName: "",
  customerPhone: 0,
  billMRPTotal: 0,
  billAmountTotal: 0,
  billDiscountTotal: 0,
  totalNumberOfItems: 0,
  totalNumberOfUniqueItems: 0,
  totalBillProfit: 0,
  cashPay: 0,
  upiPay: 0,
  amountReturn: 0,
};

const INPUT_INITIAL_STATE = {
  itemBarcode: "",
  itemName: "",
  itemMRPperUnit: "",
  itemQuantityInBill: 1,
  itemSellingPricePerUnit: "",
};

export const Billing = ({ billID = "" }) => {
  const [inputValue, setInputValue] = useState(INPUT_INITIAL_STATE);
  const [filteredData, setFilteredData] = useState([]);
  const [bill, setBill] = useState(BILL_INITIAL_STATE);
  const [apiLoading, setApiLoading] = useState(false);
  const barRef = useRef("");
  const { itemsStateAndDispatch } = useContext(AppStateContext);
  const [itemsList] = itemsStateAndDispatch;

  useEffect(() => {
    (async () => {
      const editBill = await Axios.request({
        url: `/api/billing/getEditBill/${billID}`,
        method: "get",
        headers: {
          Cookie: "",
        },
      });
      const { items, ...billObject } = editBill.data.message;
      const billObjectWithBillItems = { ...billObject, billItems: items };
      setBill(billObjectWithBillItems);
    })();
  }, [billID]);

  const addNewBill = async () => {
    setApiLoading(true);
    const editApi = {
      url: "/api/billing/editBill",
      method: "put",
      data: { id: billID, itemWithChanges: { ...bill } },
    };
    const createApi = {
      url: "/api/billing/newBill",
      method: "post",
      data: { ...bill },
    };
    const objectOfInterest = billID ? editApi : createApi;

    await Axios.request({
      ...objectOfInterest,
      headers: {
        Cookie: "",
      },
    });
    window.print();
    setApiLoading(false);
    setBill(BILL_INITIAL_STATE);
    // setCashPay("");
    // setUpiPay("");
    // setAmountReturn(0);
  };
  function handleChange(event) {
    const { name, value } = event.target;
    setInputValue((prevState) => ({ ...prevState, [name]: value }));
  }

  function addItemToBill(event) {
    event.preventDefault();
    const itemDetail = {
      ...inputValue,
      itemDiscountPerUnit: inputValue.itemMRPperUnit
        ? inputValue.itemMRPperUnit - inputValue.itemSellingPricePerUnit
        : 0,
    };

    itemsByName[inputValue.itemName] = { ...itemDetail };
    setBill((prev) => ({
      ...prev,
      billItems: [itemDetail, ...prev.billItems],
    }));
    setInputValue(INPUT_INITIAL_STATE);
  }

  const handleFilter = (event) => {
    setInputValue((prev) => ({ ...prev, itemName: event.target.value }));
    const searchWord = event.target.value;
    const filteredData = itemsList.filter((value) => {
      return value.itemName.toLowerCase().includes(searchWord.toLowerCase());
    });
    setFilteredData(filteredData);
  };

  useEffect(() => {
    itemsList.forEach((obj) => {
      obj["itemDiscountPerUnit"] =
        obj["itemMRPperUnit"] - obj["itemSellingPricePerUnit"];
      obj["itemQuantityInBill"] = 1;
      if (obj["itemBarcode"]) {
        itemsByBarcode[obj["itemBarcode"]] = { ...obj };
      }
      if (obj["itemName"]) {
        itemsByName[obj["itemName"]] = { ...obj };
      }
    });
  }, [itemsList]);

  useEffect(() => {
    if (itemsByBarcode[inputValue.itemBarcode]) {
      setBill((prev) => ({
        ...prev,
        billItems: [itemsByBarcode[inputValue.itemBarcode], ...prev.billItems],
      }));
      setInputValue(INPUT_INITIAL_STATE);
    }
    barRef.current.focus();
  }, [inputValue.itemBarcode]);

  useEffect(() => {
    let totalSum = 0;
    let mrpTotal = 0;
    let savedAmount = 0;
    let profitAmount = 0;
    let numOfItems = 0;
    bill.billItems.forEach((item) => {
      totalSum += Math.ceil(
        item.itemDetail["itemSellingPricePerUnit"] * item["itemQuantityInBill"]
      );
      mrpTotal +=
        item.itemDetail["itemMRPperUnit"] * item["itemQuantityInBill"];
      savedAmount = mrpTotal - totalSum;
      numOfItems += item["itemQuantityInBill"];
      profitAmount +=
        (item.itemDetail["itemSellingPricePerUnit"] -
          item.itemDetail["itemCostPricePerUnit"]) *
        item["itemQuantityInBill"];
    });

    setBill((prev) => ({
      ...prev,
      totalNumberOfUniqueItems: bill.billItems.length,
      totalNumberOfItems: numOfItems,
      billMRPTotal: mrpTotal,
      billAmountTotal: totalSum,
      billDiscountTotal: savedAmount,
      totalBillProfit: profitAmount,
    }));
  }, [bill.billItems]);

  useEffect(() => {
    setBill((prev) => ({
      ...prev,
      amountReturn: bill?.cashPay + bill?.upiPay - bill?.billAmountTotal,
    }));
  }, [bill.cashPay, bill.upiPay, bill.billAmountTotal]);

  return (
    <div className="billing-container">
      <div className="header">
        <h1>PRIYAM STORES</h1>
        <h3>112-C, Indrapuri, Bhopal - 462022</h3>
        <h3>Date: {new Date().toDateString()}</h3>
        <h3>Time: {new Date().toLocaleTimeString()}</h3>
      </div>
      <div className="bill-btns">
        <Button className="print-btn" onClick={() => window.print()}>
          Print
        </Button>
        <Button
          disabled={!bill.billItems.length}
          className="print-btn"
          onClick={addNewBill}
          loading={apiLoading}
        >
          Save and Print
        </Button>
      </div>

      <Table
        horizontalSpacing="sm"
        striped
        highlightOnHover
        className="bill-table"
      >
        <thead className="table-heading">
          <tr>
            <th>
              <Text weight={700} color="black" size="lg">
                Sl. No.
              </Text>
            </th>
            <th>
              <Text weight={700} color="black" size="lg">
                Bar Code
              </Text>
            </th>
            <th>
              <Text weight={700} color="black" size="lg">
                Item Name
              </Text>
            </th>
            <th>
              <Text
                style={{ width: "100px" }}
                weight={700}
                color="black"
                size="lg"
              >
                Quantity
              </Text>
            </th>
            <th>
              <Text
                style={{ width: "100px" }}
                weight={700}
                color="black"
                size="lg"
              >
                MRP/Unit
              </Text>
            </th>
            <th>
              <Text
                style={{ width: "100px" }}
                weight={700}
                color="black"
                size="lg"
              >
                Selling Price/Unit
              </Text>
            </th>
            <th>
              <Text
                style={{ width: "100px" }}
                weight={700}
                color="black"
                size="lg"
              >
                Item Total
              </Text>
            </th>
          </tr>
        </thead>
        <tbody className="body">
          <tr>
            <td>
              <Text color="black" weight={700}>
                {bill.billItems.length + 1}
              </Text>
            </td>
            <td>
              <Text color="black" weight={700}>
                <Input
                  className="bill-input"
                  ref={barRef}
                  type="number"
                  name="itemBarcode"
                  value={inputValue.itemBarcode}
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => handleChange(e)}
                />
              </Text>
            </td>
            <td>
              <Text color="black" weight={700}>
                <Input
                  className="bill-input"
                  type="text"
                  value={inputValue.itemName}
                  name="itemName"
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
                      let itemDetail = itemsByName[e.target.innerText];
                      setBill((prev) => ({
                        ...prev,
                        billItems: [
                          {
                            itemDetail,
                            itemQuantityInBill: itemDetail.itemQuantityInBill,
                            itemMRPtotal: Number(itemDetail.itemMRPperUnit),
                            itemDiscountTotal: itemDetail.itemDiscountPerUnit,
                            itemSellingPriceTotal: Number(
                              itemDetail.itemSellingPricePerUnit
                            ),
                            _id: itemDetail._id,
                          },
                          ...prev.billItems,
                        ],
                      }));
                      setInputValue(INPUT_INITIAL_STATE);
                      setFilteredData([]);
                    }
                  }}
                  className="data-result"
                  style={{ minWidth: "fit-content" }}
                >
                  <Table>
                    <thead>
                      <td>Name</td>
                      <td>MRP</td>
                    </thead>
                    <tbody>
                      {filteredData.map((value, key) => {
                        return (
                          <tr
                            key={key}
                            style={{
                              padding: "5px",
                              fontSize: "16px",
                              fontStyle: "bold",
                              cursor: "pointer",
                            }}
                            className="show-data"
                          >
                            <td>{value.itemName}</td>
                            <td>{value.itemMRPperUnit}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}
            </td>
            <td>
              <Text color="black" weight={700}>
                <Input
                  style={{ width: "90px" }}
                  className="bill-input"
                  type="number"
                  placeholder="itemQuantityInBill"
                  name="itemQuantityInBill"
                  onChange={handleChange}
                  onWheel={(e) => e.target.blur()}
                  value={inputValue.itemQuantityInBill}
                />
              </Text>
            </td>
            <td>
              <Text color="black" weight={700}>
                <Input
                  style={{ width: "90px" }}
                  className="bill-input"
                  type="number"
                  placeholder="itemMRPperUnit"
                  name="itemMRPperUnit"
                  onWheel={(e) => e.target.blur()}
                  onChange={handleChange}
                  value={inputValue.itemMRPperUnit}
                />
              </Text>
            </td>
            <td>
              <Text color="black" weight={700}>
                <Input
                  style={{ width: "90px" }}
                  className="bill-input"
                  type="number"
                  name="itemSellingPricePerUnit"
                  placeholder="selling price"
                  onChange={handleChange}
                  onWheel={(e) => e.target.blur()}
                  value={inputValue.itemSellingPricePerUnit}
                />
              </Text>
            </td>
            <td>
              <Button
                disabled={
                  !(inputValue.itemName && inputValue.itemSellingPricePerUnit)
                }
                onClick={addItemToBill}
              >
                ADD ITEM
              </Button>
            </td>
          </tr>
          {bill.billItems.map((item, idx) => {
            const itemObj = { ...item, ...item.itemDetail };
            return (
              <tr
                className="bill-item-row"
                key={`${idx}${itemObj["itemName"]}`}
              >
                <td className="idx">
                  <Text color="black" weight={700} size="lg">
                    {idx + 1}
                  </Text>
                </td>
                <td className="itemBarcode">
                  {itemObj["itemBarcode"] && (
                    <Text color="black" weight={700} size="lg">
                      {itemObj["itemBarcode"]}
                    </Text>
                  )}
                </td>
                <td className="itemName">
                  <Text color="black" weight={700} size="lg">
                    {itemObj["itemName"]}
                  </Text>
                </td>
                <td className="itemQuantityInBill">
                  <QuantBtn
                    itemObj={itemObj}
                    idx={idx}
                    bill={bill}
                    setBill={setBill}
                  />
                </td>
                <td className="itemMRPperUnit">
                  <Text
                    className="print-text"
                    color="black"
                    weight={800}
                    size="xl"
                  >
                    {itemObj["itemMRPperUnit"]}
                  </Text>
                </td>
                <td className="itemSellingPricePerUnit">
                  <Text
                    className="print-text"
                    color="black"
                    weight={800}
                    size="xl"
                  >
                    {itemObj["itemSellingPricePerUnit"]}
                  </Text>
                </td>
                <td className="itemTotal">
                  <Text
                    className="print-text"
                    color="black"
                    weight={800}
                    size="xl"
                  >
                    {Math.ceil(
                      itemObj["itemSellingPricePerUnit"] *
                        itemObj["itemQuantityInBill"]
                    )}
                  </Text>
                </td>
                <td className="last-clmn">
                  <Button
                    className="delete-btn"
                    onClick={() => {
                      const newBill = [...bill.billItems];
                      newBill.splice(idx, 1);
                      setBill({ ...bill, billItems: [...newBill] });
                    }}
                  >
                    X
                  </Button>
                </td>
              </tr>
            );
          })}
          <tr className="final-bill">
            <td className="empty-slots"></td>
            <td className="empty-slots"></td>
            <td className="empty-slots"></td>
            <td className="empty-slots"></td>
            <td>
              <Text
                color="black"
                size="xl"
                weight={800}
                className="final-bill-text print-text"
              >
                MRP Total: {bill?.billMRPTotal?.toFixed(2)}
              </Text>
            </td>
            <td>
              <Text
                color="black"
                size="xl"
                weight={800}
                className="final-bill-text print-text"
              >
                Bill Total: {bill?.billAmountTotal?.toFixed(2)}
              </Text>
            </td>
            <td>
              <Text
                color="black"
                size="xl"
                weight={800}
                className="final-bill-text print-text"
              >
                You saved: {bill?.billDiscountTotal?.toFixed(2)}
              </Text>
            </td>
          </tr>
          <tr className="final-bill">
            <td className="empty-slots"></td>
            <td className="empty-slots"></td>
            <td className="empty-slots"></td>
            <td className="empty-slots"></td>
            <td>
              <Text
                color="black"
                size="xl"
                weight={800}
                className="final-bill-text print-text"
              >
                CashPaid: {bill.cashPay}
              </Text>
              <Input
                style={{ width: "90px" }}
                type="number"
                value={bill.cashPay}
                onChange={(e) =>
                  setBill((prev) => ({
                    ...prev,
                    cashPay: Number(e.target.value),
                  }))
                }
                className="quantity-input"
                onWheel={(e) => e.target.blur()}
              />
            </td>
            <td>
              <Text
                color="black"
                size="xl"
                weight={800}
                className="final-bill-text print-text"
              >
                UpiPaid: {bill.upiPay}
              </Text>
              <Input
                style={{ width: "90px" }}
                type="number"
                value={bill.upiPay}
                onChange={(e) =>
                  setBill((prev) => ({
                    ...prev,
                    upiPay: Number(e.target.value),
                  }))
                }
                className="quantity-input"
                onWheel={(e) => e.target.blur()}
              />
            </td>
            <td>
              <Text
                color="black"
                size="xl"
                weight={800}
                className="final-bill-text print-text"
              >
                Amount Return: {Number(bill.amountReturn || 0)}
              </Text>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

const QuantBtn = ({ itemObj, idx, bill, setBill }) => {
  const handleQuantityChange = (e) => {
    if (e.target.value < 0) return;
    const itemCopy = itemsByBarcode[itemObj["itemBarcode"]]
      ? {
          itemDetail: { ...itemsByBarcode[itemObj["itemBarcode"]] },
          ...bill.billItems[idx],
        }
      : {
          itemDetail: { ...itemsByName[itemObj["itemName"]] },
          ...bill.billItems[idx],
        };

    itemCopy.itemDetail["itemQuantityInBill"] = Number(e.target.value);
    itemCopy["itemQuantityInBill"] = Number(e.target.value);
    const newBill = [...bill.billItems];
    newBill.splice(idx, 1, itemCopy);
    setBill({ ...bill, billItems: [...newBill] });
  };

  return (
    <>
      <Text
        color="black"
        size="xl"
        weight={800}
        className="quantity-text print-text"
      >
        {itemObj["itemQuantityInBill"] || 0}
      </Text>
      <Input
        style={{ width: "90px" }}
        className="quantity-input"
        type="number"
        value={itemObj["itemQuantityInBill"]}
        onChange={handleQuantityChange}
        onWheel={(e) => e.target.blur()}
      />
    </>
  );
};
