import React from "react";
import PurchaseListApproval from "./PurchaseListApproval";
import { Select } from "@mantine/core";

const PurchaseDetailsApproval = ({ allPurchaseList, setAllPurchaseList }) => {
  const filterOrders = (value) => {
    let pendingArray = allPurchaseList.filter(
      (list) => list.isRejected === false && list.isApproved === false
    );
    let approvedArray = allPurchaseList.filter(
      (list) => list.isApproved === true
    );
    let rejectedArray = allPurchaseList.filter(
      (list) => list.isRejected === true
    );
    if (value === "pending") {
      setAllPurchaseList([...pendingArray, ...rejectedArray, ...approvedArray]);
    } else if (value === "approved") {
      setAllPurchaseList([...approvedArray, ...rejectedArray, ...pendingArray]);
    } else if (value === "rejected") {
      setAllPurchaseList([...rejectedArray, ...approvedArray, ...pendingArray]);
    }
  };
  return (
    <div style={{ width: "100%" }}>
      <h3>Purchase Details, approval required</h3>
      <Select style={{width:'200px', margin:'2vmin auto'}}
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
