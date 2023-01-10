import { Select, Table } from "@mantine/core";
import React, { useState, useEffect } from "react";
import { Axios } from "src/utils/axios";

const ExpiredItems = () => {
  const [expiredItems, setExpiredItems] = useState([]);

  const getExpiredData = async () => {
    try {
      const { data } = await Axios.request({
        url: "/api/inventory/filterExpiryDates",
        method: "POST",
        data: {
          startDate: "11/16/2022",
          endDate: "1/7/2023",
        },
        headers: {
          Cookie: "",
        },
      });
      console.log({ data });
      setExpiredItems(data.message);
    } catch (err) {
      console.log({ err });
    }
  };
  const handleFilter = (val) => {
    let startDate = new Date();
    let day = 0;
    switch (val) {
      case "day":
        day = startDate.getDay() + Number(val);
        return;
      case "one":
        day = startDate.getDay() + Number(val);
        return;
      case "two":
        day = startDate.getDay() + Number(val);
        return;
      case "three":
        day = startDate.getDay() + Number(val);
        return;
      case "four":
        day = startDate.getDay() + Number(val);
        return;
    }
    // let endDate = new Date(startDate.getM)

  };
  useEffect(() => {
    getExpiredData();
  }, []);
  return (
    <div>
      <div>ExpiredItems</div>
      <Select
        label="Filter"
        placeholder="Pick one"
        onChange={(val) => handleFilter(val)}
        data={[
          { value: "day", label: "1 day" },
          { value: "one", label: "1 week" },
          { value: "two", label: "2 week" },
          { value: "three", label: "3 week" },
          { value: "four", label: "4 week" },
        ]}
      />
      <Table withBorder withColumnBorders>
        <thead>
          <td>Item Barcode</td>
          <td>Item Name</td>
          <td>Expiry Date</td>
          <td>Total Item Quantity</td>
        </thead>
        <tbody>
          {expiredItems &&
            expiredItems.map((item) => {
              return (
                <tr>
                  <td>{item._doc.itemBarcode}</td>
                  <td>{item._doc.itemName}</td>
                  <Table withBorder withColumnBorders>
                    <tbody>
                      {item.useByDate.map((expiry) => {
                        return (
                          <tr>
                            <td style={{ width: "40%" }}>{`${new Date(
                              expiry.date
                            ).getDay()}/${
                              new Date(expiry.date).getMonth() + 1
                            }/${new Date(expiry.date).getFullYear()}`}</td>
                            <td>{expiry.value}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  <td>{item.totalItems}</td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </div>
  );
};

export default ExpiredItems;
