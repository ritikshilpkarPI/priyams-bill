import { DateRangePicker, TimeRangeInput } from "@mantine/dates";
import { useState } from "react";
import { Button, Input, Select, Table, Text, Title } from "@mantine/core";
import { Axios } from "../utils/axios";

const Report = () => {
  const [dateRange, setDateRange] = useState();
  const [timeRange, setTimeRange] = useState();
  const [selectedFilter, setSelectedFilter] = useState("");
  const [reportResult, setReportResult] = useState({});
  const [showItemInput, setShowItemInput] = useState(false);
  const [itemName, setItemName] = useState("");

  const filterNameObj = {
    totalProfit: "totalProfitSum",
    totalAmount: "totalAmountSum",
    totalMRP: "totalMRPSum",
    totalDiscount: "totalDiscountSum",
    itemBillingTrend: "itemBillingTrend",
  };

  const findResult = async () => {
    let day = 60 * 60 * 24 * 1000;
    let increasedLastDate = new Date(dateRange[1].getTime() + day);
    const result = await Axios.request({
      url: `/api/report/getDateRangeReport/${selectedFilter}`,
      method: "post",
      data: {
        startDate: dateRange[0].toLocaleDateString(),
        lastDate: increasedLastDate.toLocaleDateString(),
        startTime: timeRange[0].toUTCString(),
        lastTime: timeRange[1].toUTCString(),
        itemName: itemName,
      },
      headers: {
        Cookie: "",
      },
    });
    setReportResult(result.data);
  };

  const handleFilterOption = (e) => {
    setSelectedFilter(e);
    e === "itemBillingTrend" ? setShowItemInput(true) : setShowItemInput(false);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "50px" }}>
        <DateRangePicker
          style={{ width: "350px" }}
          label="Date Range"
          placeholder="Pick dates range"
          value={dateRange}
          onChange={setDateRange}
        />
        <TimeRangeInput
          style={{ width: "350px" }}
          format="12"
          label="Time Range"
          value={timeRange}
          onChange={setTimeRange}
          clearable
        />
      </div>
      <div style={{ display: "flex", gap: "50px", paddingBottom: "10px" }}>
        <Select
          style={{ width: "350px" }}
          label="Choose Filter"
          placeholder="Pick one"
          data={[
            { value: "itemBillingTrend", label: "Item Billing Trend" },
            { value: "totalProfit", label: "Total Profit sum" },
            { value: "totalAmount", label: "Total Amount sum" },
            { value: "totalMRP", label: "Total MRP sum" },
            { value: "totalDiscount", label: "Total Discount sum" },
          ]}
          value={selectedFilter}
          onChange={(e) => handleFilterOption(e)}
        />
        {showItemInput ? (
          <Input.Wrapper style={{ width: "200px" }} label="Enter Item Name">
            <Input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Input item name"
            />
          </Input.Wrapper>
        ) : (
          <></>
        )}
      </div>
      <Button onClick={findResult}>Show Result</Button>
      <div>
        {reportResult?.report?.length !== 0 ? (
          JSON.stringify(reportResult) !== "{}" ? (
            reportResult?.filterType !== "itemBillingTrend" ? (
              <>
                <Title>
                  {reportResult?.report[0][filterNameObj[selectedFilter]]
                    ? selectedFilter.toLocaleUpperCase()
                    : ""}
                </Title>
                <Text>
                  {reportResult?.report[0][
                    filterNameObj[selectedFilter]
                  ]?.toFixed(2)}
                </Text>
              </>
            ) : (
              showBillTable(reportResult.report)
            )
          ) : (
            ""
          )
        ) : (
          "No Report available for this date range"
        )}
      </div>
    </div>
  );
};

const showBillTable = (reportResult) => (
  <Table striped highlightOnHover>
    <thead className="heading">
      <tr>
        <th>
          <Text align="center">Sl. No.</Text>
        </th>
        <th>
          <Text align="center">Item Name</Text>
        </th>
        <th>
          <Text align="center">Quantity</Text>
        </th>
        <th>
          <Text align="center">Item MRP per unit</Text>
        </th>
        <th>
          <Text align="center">Bill Total Amount</Text>
        </th>
        <th>
          <Text align="center">Bill MRP Total Amount</Text>
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
      </tr>
    </thead>
    <tbody className="body">
      {reportResult?.map((item, idx) => {
        return <TableRow key={`${item}$${idx}`} item={item} idx={idx} />;
      })}
    </tbody>
  </Table>
);

const TableRow = ({ item, idx }) => {
  return (
    <>
      <tr className="bill-row" style={{ cursor: "pointer" }}>
        <td>
          <Text color="black" weight={500}>
            {idx + 1}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item.items.itemDetail?.itemName}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["totalNumberOfItems"]}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item.items.itemDetail?.itemMRPperUnit}
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
      </tr>
    </>
  );
};

export default Report;
