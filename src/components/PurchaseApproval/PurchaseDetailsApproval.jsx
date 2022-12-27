import React from "react";
import PurchaseListApproval from "./PurchaseListApproval";
import { Select } from "@mantine/core";
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
      {allPurchaseList.map((list, index) => {
        return (
          <PurchaseListApproval
            allPurchaseList={allPurchaseList}
            setAllPurchaseList={setAllPurchaseList}
            key={index}
            list={list}
            index={index}
          />
        );
      })}
    </div>
  );
};

export default PurchaseDetailsApproval;
