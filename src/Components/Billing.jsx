import { useEffect, useState, useRef, useContext } from "react";
import { Table, Text, Button } from "@mantine/core";
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
  const [cashPay, setCashPay] = useState(0);
  const [upiPay, setUpiPay] = useState(0);
  const [amountReturn,setAmountReturn] = useState(0)
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
  };
  function handleChange(event) {
    const { name, value } = event.target;
    setInputValue((prevState) => ({ ...prevState,[name]: value }));
    
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
      billItems: [...prev.billItems, itemDetail]
      
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
    // setFilteredData(event.target.value);
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
        billItems: [...prev.billItems, itemsByBarcode[barcode]],
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
  
   useEffect(()=>{
    console.log({cashPay,upiPay})
    setAmountReturn((cashPay + upiPay)-(bill.billAmountTotal));
   
   },[cashPay,upiPay,bill.billAmountTotal])
  
  return (
    <div className="billing-container">
      <div className="header">
        <h1>PRIYAM STORES</h1>
        <h3>112-C, Indrapuri, Bhopal - 462022</h3>
      </div>
      <div className="bill-btns">
        <Button className="print-btn" onClick={() => window.print()}>
          Print
        </Button>
        <Button className="print-btn" onClick={addNewBill} loading={apiLoading}>
          Save and Print
        </Button>
      </div>

      <Table>
        <thead className="table-heading">
          <tr>
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
                <input
                  className="bill-input"
                  ref={barRef}
                  type="number"
                  value={barcode}
                  onChange={(e) => setBarCode(e.target.value)}
                />
              </Text>
            </td>
            <td>
              <Text color="black" weight={700}>
                <input
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
                          ...prev.billItems,
                          itemsByName[e.target.innerText],
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
            </td>
          </tr>
          {bill.billItems.map((itemObj, idx) => {
            return (
              <tr key={`${idx}${itemObj["itemName"]}`}>
                <td>
                  {itemObj["itemBarcode"] && (
                    <Text color="black" weight={700} size="lg">
                      {itemObj["itemBarcode"]}
                    </Text>
                  )}
                </td>
                <td>
                  <Text color="black" weight={700} size="lg">
                    {itemObj["itemName"]}
                  </Text>
                </td>
                <td>
                  <QuantBtn
                    itemObj={itemObj}
                    idx={idx}
                    bill={bill}
                    setBill={setBill}
                  />
                </td>
                <td>
                  <Text
                    className="print-text"
                    color="black"
                    weight={800}
                    size="xl"
                  >
                    {itemObj["itemMRPperUnit"]}
                  </Text>
                </td>
                <td>
                  <Text
                    className="print-text"
                    color="black"
                    weight={800}
                    size="xl"
                  >
                    {itemObj["itemSellingPricePerUnit"]}
                  </Text>
                </td>
                <td>
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
        <h2>MRP Total: {bill.billMRPTotal.toFixed(2)}</h2>
        <h2>Bill Total: {bill.billAmountTotal.toFixed(2)}</h2>
        <h2>You saved: {bill.billDiscountTotal.toFixed(2)}</h2>
        <h2>CashPaid:<input type="number" value={cashPay} onChange={(e) => setCashPay(Number(e.target.value))}  /></h2>
        <h2>UpiPaid:<input type="number" value={upiPay} onChange={(e) => setUpiPay(Number(e.target.value))} /></h2>
         <h2>Amount Return:{Number(amountReturn)} </h2>
      </div>
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
    console.log(newBill)
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
      <input
        className="quantity-input"
        type="number"
        value={itemObj["OrderQuantity"]}
        onChange={handleQuantityChange}
      />
    </>
  );
};
