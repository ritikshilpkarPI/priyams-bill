import React from "react";
import PurchaseListApproval from "./PurchaseListApproval";
import { Select, Table } from "@mantine/core";
import '../../CSS/purchaseApproval.css'
const PurchaseDetailsApproval = ({ allPurchaseList, setAllPurchaseList }) => {
  const filterOrders = (value) => {
    let pendingArray = [];
    let approvedArray = [];
    let rejectedArray = [];
    for (let i = 0; i < allPurchaseList.length; i++) {
      if (allPurchaseList[i].isRejected === true) {
        rejectedArray.push(allPurchaseList[i]);
      } else if (allPurchaseList[i].isApproved === true) {
        approvedArray.push(allPurchaseList[i]);
      } else {
        pendingArray.push(allPurchaseList[i]);
      }
    }
    if (value === "pending") {
      setAllPurchaseList([...pendingArray, ...rejectedArray, ...approvedArray]);
    } else if (value === "approved") {
      setAllPurchaseList([...approvedArray, ...rejectedArray, ...pendingArray]);
    } else if (value === "rejected") {
      setAllPurchaseList([...rejectedArray, ...approvedArray, ...pendingArray]);
    }
  };

  return (
    <div className="purchase-approval">
      <h3>Purchase Details, approval required</h3>
      <Select
        style={{ width: "200px", margin: "2vmin auto" }}
        label="Sort By"
        placeholder="Pending orders"
        data={[
          { value: "pending", label: "Pending orders" },
          { value: "rejected", label: "Rejected orders" },
          { value: "approved", label: "Approved orders" },
        ]}
        onChange={filterOrders}
      />
      <Table className='purchase-list' withColumnBorders striped withBorder>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Dealer Name</th>
            <th>Phone Number</th>
            <th>Payment</th>
            <th>Bill Amount</th>
            <th>Paid Amount</th>
            <th>Procurement Source</th>
            <th>Remark</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {allPurchaseList.map((list, index) => {
            return (
              <tr key={index}>
                <PurchaseListApproval
                  allPurchaseList={allPurchaseList}
                  setAllPurchaseList={setAllPurchaseList}
                  list={list}
                  index={index}
                />
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default PurchaseDetailsApproval;
