import React from "react";
import PurchaseListApproval from "./PurchaseListApproval";
import { Select, Table } from "@mantine/core";
import '../../CSS/purchaseApproval.css'
import { Axios } from "src/utils/axios";
const PurchaseDetailsApproval = ({ allPurchaseList, setAllPurchaseList }) => {
  const filterOrders = (value) => {
    let filter = []
    if (value === "draft") {
      for (let i = 0; i < allList.length; i++) {
        if (allList[i].isDraft && !allList[i].isApproved) {
          filter.push(allList[i]);
        } 
      }
    } else if (value === "approved") {
      for (let i = 0; i < allList.length; i++) {
        if (allList[i].isApproved === true) {
          filter.push(allList[i]);
        } 
      }
    } else if (value === "rejected") {
      for (let i = 0; i < allList.length; i++) {
        if (allList[i].isRejected === true) {
          filter.push(allList[i]);
        } 
      }
    } else if (value === "saved") {
      for (let i = 0; i < allList.length; i++) {
         if(!allList[i].isDraft && !allList[i].isApproved && !allList.isRejected){
          filter.push(allList[i]);
        }
      }
    }else{
      filter = [...allList]
    }
    setAllPurchaseList([...filter])
  };
  const saveDraft = async (id, index) => {

    try {
      const {order}  = await Axios({
        method: "POST",
        url: "/api/purchaseOrder/draftOrder",
        data: { id },
      });
      if(JSON.parse(localStorage.getItem("priyam-store")).role === 'admin'){
        setAllPurchaseList([...allPurchaseList.filter((item, i) => i !== index),order]);
      }
      else{
        setAllPurchaseList([...allPurchaseList.filter((item, i) => i !== index)]);
      }
      alert('Order drafted successfully')
    } catch (err) {
      console.log(err)
      alert(`Something went wrong.Unable to draft the order`)
    }
  }
  return (
    <div className="purchase-approval">
      <h3>Purchase Details, approval required</h3>
      <Select
        style={{ width: "200px", margin: "2vmin auto" }}
        label="Sort By"
        placeholder="All orders"
        data={[
          {value:"all",label:"All orders"},
          { value: "draft", label: "Draft orders" },
          { value: "rejected", label: "Rejected orders" },
          { value: "approved", label: "Approved orders" },
          { value: "saved", label: "Saved orders" },
        ]}
        onChange={filterOrders}
      />

          {allPurchaseList.length === 0
          ?
          <div className="message">
            No Orders
          </div>
          :
          <Table className="purchase-list" withColumnBorders striped withBorder>
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
          }
    </div>
  );
};

export default PurchaseDetailsApproval;
