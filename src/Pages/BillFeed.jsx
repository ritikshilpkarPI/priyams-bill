import {
  useEffect,
  useState,
} from 'react';

import {
  Button,
  Loader,
  Table,
  Text,
} from '@mantine/core';

import { Axios } from '../utils/axios';

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
                <Text align="center">Items</Text>
              </th>
            </tr>
          </thead>
          <tbody className="body">
            {allBills.map((item, idx) => {
              return <TableRow key={`${item}$${idx}`} item={item} idx={idx} />;
            })}
          </tbody>
        </Table>
      )}
    </>
  );
};

const TableRow = ({ item, idx }) => {
  const [open, setOpen] = useState(false);
  // let history = useHistory();
  // function handleClick(id) {
  //   history.push(`/${id}`);
  // }
  console.log({item});
  const sendCustomerMessage = async (id) => {
    await Axios.request({
      url: "/api/billing/sendMessage",
      method: "post",
      data: {
        id: id
      },
      headers: {
        Cookie: "",
      },
    });
  };
  const sendBill = (customer) => {
    let number = customer.customerPhone;
    let link = `http://localhost:3000/showbill/${customer._id}`;
    let message = `Hello, ${customer.customerName} this is your bill for purchasing in Priyam Stores. 
      You can view your with the link below ${link}
    `;
    // Appending the phone number to the URL
    let url = `https://web.whatsapp.com/send?phone=+91${number}`;

    // Appending the message to the URL by encoding it
    url += `&text=${encodeURI(message)}&app_absent=0`;
    console.log({url});

    // Open our newly created URL in a new tab to send the message
    window.open(url);

    sendCustomerMessage(customer._id)
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
            {item["customerName"]}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["customerPhone"]}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["billAmountTotal"].toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["billMRPTotal"].toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["cashPay"]?.toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["upiPay"]?.toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["amountReturn"]?.toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["totalNumberOfItems"]}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["totalNumberOfUniqueItems"]}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["billDiscountTotal"].toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["totalBillProfit"].toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {new Date(item["createdAt"]).toLocaleString()}
          </Text>
        </td>
        <td>
          <Button
            color={item.messageSend ? "blue" : "green" }
            disabled={item.customerPhone && item.customerName ? false : true}
            onClick={() => sendBill(item)}
          >
            Send Bill
          </Button>
        </td>
        {/* <td>
          <Button onClick={() => handleClick(item["_id"])}>Edit Bill</Button>
        </td> */}
      </tr>
      {/* <tr>
        <Collapse in={open}>
          <Table striped highlightOnHover>
            <thead className="heading">
              <tr>
                <th>
                  <Text>Sl. No.</Text>
                </th>
                <th>
                  <Text>Item name</Text>
                </th>
                <th>
                  <Text>Item Quantity</Text>
                </th>
                <th>
                  <Text>Item Total Amount</Text>
                </th>
              </tr>
            </thead>
            <tbody className="body">
              {item.items.map((itemObj, idx) => {
                const {
                  itemDetail,
                  itemQuantityInBill,
                  itemSellingPriceTotal,
                } = itemObj;
                return (
                  <tr key={idx}>
                    <td>
                      <Text color="black" weight={500}>
                        {idx + 1}
                      </Text>
                    </td>
                    <td>
                      <Text color="black" weight={500}>
                        {itemDetail?.itemName || "Item name not found"}
                      </Text>
                    </td>
                    <td>
                      <Text color="black" weight={500}>
                        {itemQuantityInBill}
                      </Text>
                    </td>
                    <td>
                      <Text color="black" weight={500}>
                        {itemSellingPriceTotal}
                      </Text>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Collapse>
      </tr> */}
    </>
  );
};

export default BillFeed;
