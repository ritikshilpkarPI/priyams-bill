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
};

export const Billing = () => {
  const [inputValue, setInputValue] = useState({
    itemName: "",
    itemMRPperUnit: "",
    OrderQuantity: 1,
    itemSellingPricePerUnit: "",
  });
  const [filteredData, setFilteredData] = useState([]);
  const [barcode, setBarCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [bill, setBill] = useState(BILL_INITIAL_STATE);
  const [apiLoading, setApiLoading] = useState(false);
  const [cashPay, setCashPay] = useState("");
  const [upiPay, setUpiPay] = useState("");
  const [amountReturn, setAmountReturn] = useState(0);
  const barRef = useRef("");
  const { itemsStateAndDispatch } = useContext(AppStateContext);
  const [itemsList] = itemsStateAndDispatch;

  const addNewBill = async () => {
    setApiLoading(true);
    await Axios.request({
      url: "/api/billing/newBill",
      method: "post",
      data: { ...bill },
      headers: {
        Cookie: "",
      },
    });
    window.print();
    setApiLoading(false);
    setBill(BILL_INITIAL_STATE);
    setCashPay("");
    setUpiPay("");
    setAmountReturn(0);
  };
  function handleChange(event) {
    const { name, value } = event.target;
    setInputValue((prevState) => ({ ...prevState, [name]: value }));
  }

  function addItemToBill(event) {
    event.preventDefault();
    const itemDetail = {
      ...inputValue,
      itemName,
      itemDiscountPerUnit: inputValue.itemMRPperUnit
        ? inputValue.itemMRPperUnit - inputValue.itemSellingPricePerUnit
        : 0,
    };

    itemsByName[itemName] = { ...itemDetail };
    setBill((prev) => ({
      ...prev,
      billItems: [itemDetail, ...prev.billItems],
    }));
    setInputValue({
      itemName: "",
      itemMRPperUnit: "",
      OrderQuantity: "",
      itemSellingPricePerUnit: "",
    });
    setItemName("");
  }

  const handleFilter = (event) => {
    setItemName(event.target.value);
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
      obj["OrderQuantity"] = 1;
      if (obj["itemBarcode"]) {
        itemsByBarcode[obj["itemBarcode"]] = { ...obj };
      }
      if (obj["itemName"]) {
        itemsByName[obj["itemName"]] = { ...obj };
      }
    });
  }, [itemsList]);

  useEffect(() => {
    if (itemsByBarcode[barcode]) {
      setBill((prev) => ({
        ...prev,
        billItems: [itemsByBarcode[barcode], ...prev.billItems],
      }));
      setBarCode("");
      setItemName("");
    }
    barRef.current.focus();
  }, [barcode]);

  useEffect(() => {
    let totalSum = 0;
    let mrpTotal = 0;
    let savedAmount = 0;
    bill.billItems.forEach((item) => {
      totalSum += item["itemSellingPricePerUnit"] * item["OrderQuantity"];
      mrpTotal += item["itemMRPperUnit"] * item["OrderQuantity"];
      savedAmount += item["itemDiscountPerUnit"] * item["OrderQuantity"];
    });
    setBill((prev) => ({
      ...prev,
      billMRPTotal: mrpTotal,
      billAmountTotal: totalSum,
      billDiscountTotal: savedAmount,
    }));
  }, [bill.billItems]);

  useEffect(() => {
    setAmountReturn(cashPay + upiPay - bill.billAmountTotal);
  }, [cashPay, upiPay, bill.billAmountTotal]);

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

      <Table striped highlightOnHover>
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
              <Text weight={700} color="black" size="lg">
                Quantity
              </Text>
            </th>
            <th>
              <Text weight={700} color="black" size="lg">
                MRP/Unit
              </Text>
            </th>
            <th>
              <Text weight={700} color="black" size="lg">
                Selling Price/Unit
              </Text>
            </th>
            <th>
              <Text weight={700} color="black" size="lg">
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
                  value={barcode}
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => setBarCode(e.target.value)}
                />
              </Text>
            </td>
            <td>
              <Text color="black" weight={700}>
                <Input
                  className="bill-input"
                  type="text"
                  value={itemName}
                  placeholder="search here"
                  onChange={(e) => {
                    handleFilter(e);
                    handleChange(e);
                  }}
                />
              </Text>
              {itemName && Boolean(filteredData.length) && (
                <div
                  onClick={(e) => {
                    if (itemsByName[e.target.innerText]) {
                      setBill((prev) => ({
                        ...prev,
                        billItems: [
                          itemsByName[e.target.innerText],
                          ...prev.billItems,
                        ],
                      }));
                      setBarCode("");
                      setItemName("");
                      setFilteredData([]);
                    }
                  }}
                  className="data-result"
                  style={{ minWidth: "fit-content" }}
                >
                  {filteredData.map((value, key) => {
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
                <Input
                  className="bill-input"
                  type="number"
                  placeholder="OrderQuantity"
                  name="OrderQuantity"
                  onChange={handleChange}
                  onWheel={(e) => e.target.blur()}
                  value={inputValue.OrderQuantity}
                />
              </Text>
            </td>
            <td>
              <Text color="black" weight={700}>
                <Input
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
                disabled={!(itemName && inputValue.itemSellingPricePerUnit)}
                onClick={addItemToBill}
              >
                ADD ITEM
              </Button>
            </td>
          </tr>
          {bill.billItems.map((itemObj, idx) => {
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
                <td className="OrderQuantity">
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
                <td className="itemDiscountPerUnit">
                  <Text
                    className="print-text"
                    color="black"
                    weight={800}
                    size="xl"
                  >
                    {(
                      itemObj["itemSellingPricePerUnit"] *
                      itemObj["OrderQuantity"]
                    ).toFixed(2)}
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
        </tbody>
        <tr className="final-bill">
          <td scope="row" className="empty-slots"></td>
          <td scope="row" className="empty-slots"></td>
          <td scope="row" className="empty-slots"></td>
          <td scope="row" className="empty-slots"></td>
          <td>
            <Text
              color="black"
              size="xl"
              weight={800}
              className="final-bill-text print-text"
            >
              MRP Total: {bill.billMRPTotal.toFixed(2)}
            </Text>
          </td>
          <td>
            <Text
              color="black"
              size="xl"
              weight={800}
              className="final-bill-text print-text"
            >
              Bill Total: {bill.billAmountTotal.toFixed(2)}
            </Text>
          </td>

          <td>
            <Text
              color="black"
              size="xl"
              weight={800}
              className="final-bill-text print-text"
            >
              You saved: {bill.billDiscountTotal.toFixed(2)}
            </Text>
          </td>
        </tr>
        <br />
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
              CashPaid: {cashPay}
            </Text>
            <Input
              type="number"
              value={cashPay}
              onChange={(e) => setCashPay(Number(e.target.value))}
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
              UpiPaid: {upiPay}
            </Text>
            <Input
              type="number"
              value={upiPay}
              onChange={(e) => setUpiPay(Number(e.target.value))}
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
              Amount Return: {Number(amountReturn)}
            </Text>
          </td>
        </tr>
        <br />
      </Table>
    </div>
  );
};

const QuantBtn = ({ itemObj, idx, bill, setBill }) => {
  const handleQuantityChange = (e) => {
    if (e.target.value < 0) return;
    const itemCopy = itemsByBarcode[itemObj["itemBarcode"]]
      ? { ...itemsByBarcode[itemObj["itemBarcode"]] }
      : itemsByName[itemObj["itemName"]];
    itemCopy["OrderQuantity"] = e.target.value;
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
        {itemObj["OrderQuantity"] || 0}
      </Text>
      <Input
        className="quantity-input"
        type="number"
        value={itemObj["OrderQuantity"]}
        onChange={handleQuantityChange}
        onWheel={(e) => e.target.blur()}
      />
    </>
  );
};
