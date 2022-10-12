import { useEffect, useState } from "react";
import { Button, Loader, Table, Text, Collapse } from "@mantine/core";
import { Axios } from "../utils/axios";
import { useHistory } from "react-router-dom";

const BillFeed = ({ bills = [] }) => {
  const [allBills, setAllBills] = useState([]);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    setLoader(true);
    const getBillFeed = async () => {
      const fetch = await Axios.request({
        url: "/api/billing/getBillFeed",
        method: "get",
        params: {
          page: 1,
          size: 100,
        },
        headers: {
          Cookie: "",
        },
      });
      setAllBills(fetch.data.message.allBill);
      setLoader(false);
    };
    if (bills.length) {
      setAllBills(bills);
      setLoader(false);
    } else {
      getBillFeed();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {loader ? (
        <div
          style={{
            height: "95vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader color="blue" size="xl" />
        </div>
      ) : (
        <Table striped highlightOnHover>
          <thead className="heading">
            <tr>
              <th>
                <Text align="center">Sl. No.</Text>
              </th>
              <th>
                <Text align="center">Customer Name</Text>
              </th>
              <th>
                <Text align="center">Customer Phone</Text>
              </th>
              <th>
                <Text align="center">Bill Total Amount</Text>
              </th>
              <th>
                <Text align="center">Bill MRP Total Amount</Text>
              </th>
              <th>
                <Text align="center">Cash Paid</Text>
              </th>
              <th>
                <Text align="center">UPI Paid</Text>
              </th>
              <th>
                <Text align="center">Amount Return</Text>
              </th>
              <th>
                <Text align="center">Total Items</Text>
              </th>
              <th>
                <Text align="center">Quantity</Text>
              </th>
              <th>
                <Text align="center">Bill Discount</Text>
              </th>
              <th>
                <Text align="center">Bill Profit</Text>
              </th>
              <th>
                <Text align="center">Bill date</Text>
              </th>
              <th>
                <Text align="center">Whatsapp Bill</Text>
              </th>
              <th>
                <Text align="center">Items</Text>
              </th>
            </tr>
          </thead>
          <tbody className="body">
            {allBills.map((bill, idx) => {
              return <TableRow key={`${bill}$${idx}`} bill={bill} idx={idx} />;
            })}
          </tbody>
        </Table>
      )}
    </>
  );
};

const TableRow = ({ bill, idx }) => {
  const [open, setOpen] = useState(false);
  let history = useHistory();
  function handleClick(id) {
    history.push(`/edit/${id}`);
  }
  const sendCustomerMessage = async (id) => {
    await Axios.request({
      url: "/api/billing/sendMessage",
      method: "post",
      data: {
        id: id,
      },
      headers: {
        Cookie: "",
      },
    });
  };
  const sendBill = (bill) => {
    const link = `${window.location.origin}/showbill/${bill._id}`;
    const number = bill.customerPhone;
    const message = `Hello, ${
      bill.customerName
    } this is your bill for your purchase at Priyam Stores on ${new Date(
      bill.createdAt
    ).toLocaleString()}.
    Please view your bill by clicking on the link below:
    ${link}`;
    // Appending the phone number to the URL
    let url = `https://web.whatsapp.com/send?phone=+91${number}`;

    // Appending the message to the URL by encoding it
    url += `&text=${encodeURI(message)}&app_absent=0`;

    // Open our newly created URL in a new tab to send the message
    window.open(url);

    sendCustomerMessage(bill._id);
  };
  return (
    <>
      <tr
        onClick={() => setOpen(!open)}
        className="bill-row"
        style={{ cursor: "pointer" }}
      >
        <td>
          <Text color="black" weight={500}>
            {idx + 1}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {bill["customerName"]}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {bill["customerPhone"]}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {bill["billAmountTotal"].toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {bill["billMRPTotal"].toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {bill["cashPay"]?.toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {bill["upiPay"]?.toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {bill["amountReturn"]?.toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {bill["totalNumberOfItems"]}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {bill["totalNumberOfUniqueItems"]}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {bill["billDiscountTotal"].toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {bill["totalBillProfit"].toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {new Date(bill["createdAt"]).toLocaleString()}
          </Text>
        </td>
        <td>
          <Button
            color={bill.messageSend ? "blue" : "green"}
            disabled={bill.customerPhone && bill.customerName ? false : true}
            onClick={() => sendBill(bill)}
          >
            Send Bill
          </Button>
        </td>
        <td>
          <Button onClick={() => handleClick(bill["_id"])}>Edit Bill</Button>
        </td>
      </tr>
      <tr>
        <Collapse in={open}>
          <Table striped highlightOnHover>
            <thead className="heading">
              <tr>
                <th>
                  <Text>Sl. No.</Text>
                </th>
                <th>
                  <Text>Name</Text>
                </th>
                <th>
                  <Text>Quantity</Text>
                </th>
                <th>
                  <Text>MRP</Text>
                </th>
                <th>
                  <Text>Total Amount</Text>
                </th>
              </tr>
            </thead>
            <tbody className="body">
              {bill.items.map((billItemObj, idx) => {
                // const itemDetail = (billItemObj && billItemObj.itemDetail) || {};
                // const {
                //   itemDetail,
                //   itemQuantityInBill,
                //   itemSellingPriceTotal,
                // } = billItemObj;
                return (
                  <tr key={idx}>
                    <td>
                      <Text color="black" weight={500}>
                        {idx + 1}
                      </Text>
                    </td>
                    <td>
                      <Text color="black" weight={500}>
                        {billItemObj?.itemDetail?.itemName ||
                          "Item name not found"}
                      </Text>
                    </td>
                    <td>
                      <Text color="black" weight={500}>
                        {billItemObj?.itemQuantityInBill}
                      </Text>
                    </td>
                    <td>
                      <Text color="black" weight={500}>
                        {billItemObj?.itemMRPtotal}
                      </Text>
                    </td>
                    <td>
                      <Text color="black" weight={500}>
                        {billItemObj?.itemSellingPriceTotal}
                      </Text>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Collapse>
      </tr>
    </>
  );
};

export default BillFeed;
