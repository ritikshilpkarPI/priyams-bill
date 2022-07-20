import { useEffect, useState, useRef, useContext } from "react";
import { Table, Text, Button } from "@mantine/core";
import { AppStateContext } from "../AppState/appState.context";
import Axios from "axios";

const itemsByBarcode = {};
const itemsByName = {};

export const Billing = () => {
  const [barcode, setBarCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [bill, setBill] = useState({
    billItems: [],
    customerName: "",
    customerPhone: 0,
    billMRPTotal: 0,
    billAmountTotal: 0,
    billDiscountTotal: 0,
  });

  const barRef = useRef("");
  const { itemsStateAndDispatch } = useContext(AppStateContext);
  const [itemsList] = itemsStateAndDispatch;

  // useEffect(() => {
  const addNewBill = async () => {
    await Axios.request({
      url: "/api/billing/newBill",
      method: "post",
      data: { ...bill },
      headers: {
        Cookie: "",
      },
    });
    //   dispatch({ type: "ADD_ITEM", payload: fetch.data.message.items });
  };
  // addNewBill();
  // }, [bill]);

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
  // console.log({ itemsList, itemsByBarcode });

  useEffect(() => {
    if (itemsByBarcode[barcode]) {
      setBill((prev) => ({
        ...prev,
        billItems: [...prev.billItems, itemsByBarcode[barcode]],
      }));
      setBarCode("");
      setItemName("");
    }
    // if (itemsByName[itemName]) {
    //   newBill.push(itemsByName[itemName]);
    //   setBill(newBill);
    //   setBarCode("");
    //   setItemName("");
    // }
    barRef.current.focus();
  }, [
    barcode,
    //   itemName
  ]);

  useEffect(() => {
    let totalSum = 0;
    let mrpTotal = 0;
    let savedAmount = 0;
    bill.billItems.forEach((item) => {
      totalSum += item["itemSellingPricePerUnit"] * item["OrderQuantity"];
      mrpTotal += item["itemMRPperUnit"] * item["OrderQuantity"];
      savedAmount +=
        item["itemMRPperUnit"] * item["OrderQuantity"] -
        item["itemSellingPricePerUnit"] * item["OrderQuantity"];
    });
    setBill((prev) => ({
      ...prev,
      billMRPTotal: mrpTotal,
      billAmountTotal: totalSum,
      billDiscountTotal: savedAmount,
    }));
  }, [bill.billItems]);
  return (
    <div className="billing-container">
      <div className="header">
        <h1>PRIYAM STORES</h1>
        <h4>112-C, Indrapuri, Bhopal - 462022</h4>
      </div>
      <div className="bill-btns">
        <Button className="print-btn" onClick={() => window.print()}>
          Print
        </Button>
        <Button className="print-btn" onClick={() => addNewBill}>
          Save
        </Button>
      </div>

      <Table>
        <thead className="table-heading">
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
              <Text>Quantity</Text>
            </th>
            <th>
              <Text>Selling Price/Unit</Text>
            </th>
            <th>
              <Text>Item Total</Text>
            </th>
          </tr>
        </thead>
        <tbody className="body">
          <tr>
            <td>
              <Text color="black" weight={500}>
                <input
                  ref={barRef}
                  type="number"
                  value={barcode}
                  onChange={(e) => setBarCode(e.target.value)}
                />
              </Text>
            </td>
            <td>
              <Text color="black" weight={500}>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </Text>
            </td>
          </tr>
          {bill.billItems.map((itemObj, idx) => {
            return (
              <tr key={`${idx}${itemObj["itemName"]}`}>
                <td>
                  {itemObj["itemBarcode"] && (
                    <Text color="black" weight={500}>
                      {itemObj["itemBarcode"]}
                    </Text>
                  )}
                </td>
                <td>
                  <Text color="black" weight={500}>
                    {itemObj["itemName"]}
                  </Text>
                </td>
                <td>
                  <Text color="black" weight={500}>
                    {itemObj["itemMRPperUnit"]}
                  </Text>
                </td>
                {/* <td>
                   <Text color="black" weight={500}>
                     {itemObj["Quantity"]}
                   </Text>
                 </td> */}
                <td>
                  <QuantBtn
                    itemObj={itemObj}
                    idx={idx}
                    bill={bill}
                    setBill={setBill}
                  />
                </td>
                {/* <td>
                   <Text color="black" weight={500}>
                     {itemObj["itemDiscountPerUnit"]}
                   </Text>
                 </td> */}
                <td>
                  <Text color="black" weight={500}>
                    {itemObj["itemSellingPricePerUnit"]}
                  </Text>
                </td>
                <td>
                  <Text color="black" weight={500}>
                    {itemObj["itemSellingPricePerUnit"] *
                      itemObj["OrderQuantity"]}
                  </Text>
                </td>
                <td className="last-clmn">
                  <button
                    className="delete-btn"
                    onClick={() => {
                      const newBill = [...bill.billItems];
                      newBill.splice(idx, 1);
                      setBill({ ...bill, billItems: [...newBill] });
                    }}
                  >
                    X
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="final-bill">
        <div>MRP Total: {bill.billMRPTotal}</div>
        <div>Bill Total: {bill.billAmountTotal}</div>
        <div>You saved: {bill.billDiscountTotal}</div>
      </div>
    </div>
  );
};

const QuantBtn = ({ itemObj, idx, bill, setBill }) => {
  const handleQuantityChange = (e) => {
    if (e.target.value < 1) return;
    const itemCopy = { ...itemsByBarcode[itemObj["itemBarcode"]] };
    itemCopy["OrderQuantity"] = e.target.value;
    const newBill = [...bill.billItems];
    newBill.splice(idx, 1, itemCopy);
    setBill({ ...bill, billItems: [...newBill] });
  };
  return (
    <input
      className="quantity-input"
      type="number"
      value={itemObj["OrderQuantity"]}
      onChange={handleQuantityChange}
    />
  );
};
