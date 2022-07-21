import { useEffect, useState } from "react";
import { Table, Text } from "@mantine/core";
import { Axios } from "../utils/axios";

export const BillFeed = () => {
  const [allBills, setAllBills] = useState([]);
  useEffect(() => {
    const getBillFeed = async () => {
      const fetch = await Axios.request({
        url: "/api/billing/getBillFeed",
        method: "get",
        headers: {
          Cookie: "",
        },
      });
      setAllBills(fetch.data.message.allBill);
      //   dispatch({ type: "ADD_ITEM", payload: fetch.data.message.items });
      console.log({ bill: fetch.data.message.allBill });
    };
    getBillFeed();
  }, []);

  return (
    <Table>
      <thead className="heading">
        <tr>
          <th>
            <Text>Sl. No.</Text>
          </th>
          <th>
            <Text>Bill Total Amount</Text>
          </th>
          <th>
            <Text>Bill MRP Total Amount</Text>
          </th>
          <th>
            <Text>Total Items</Text>
          </th>
          <th>
            <Text>Quantity</Text>
          </th>
          <th>
            <Text>Bill date</Text>
          </th>
          <th>
            <Text>Items</Text>
          </th>
        </tr>
      </thead>
      <tbody className="body">
        {allBills.map((item, idx) => {
          return (
            <tr className="bill-row" key={`${item}$${idx}`}>
              <td>
                <Text color="black" weight={500}>
                  {idx + 1}
                </Text>
              </td>
              <td>
                <Text color="black" weight={500}>
                  {item["billAmountTotal"]}
                </Text>
              </td>
              <td>
                <Text color="black" weight={500}>
                  {item["billMRPTotal"]}
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
                  {new Date(item["createdAt"]).toLocaleString()}
                </Text>
              </td>
              <td>
                <Table>
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
                        itemDetail: { itemName } = {},
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
                              {itemName}
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
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
