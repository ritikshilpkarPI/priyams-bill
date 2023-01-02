import React, { useState } from "react";
import PurchaseListApproval from "./PurchaseListApproval";
import { Button, Select, Table } from "@mantine/core";
import '../../CSS/purchaseApproval.css'

import ShowPurchaseOrderTable from "./ShowPurchaseOrderTable";
import ShowOrderDetailTable from "./ShowOrderDetailTable";
import BillUploaderDetails from "./BillUploaderDetails";
const PurchaseDetailsApproval = ({ allPurchaseList, setAllPurchaseList, allList , callAPI}) => {
  const [indexDetail, setIndexDetail] = useState(-1);
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
        if (!(allList[i].isDraft || allList[i].isRejected || allList[i].isApproved)) {
          filter.push(allList[i]);
        }
      }
    } else {
      filter = [...allList]
    }
    setAllPurchaseList([...filter])
    setIndexDetail(-1)
  };
 
  return (
    <div className="purchase-approval">
      <h3>Purchase Details, approval required</h3>
      <Select
        style={{ width: "200px", margin: "2vmin auto" }}
        label="Sort By"
        placeholder="All orders"
        data={[
          { value: "all", label: "All orders" },
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
              <th>Created At</th>
              <th>Remark</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allPurchaseList.map((list, index) => {
              return (
                indexDetail >= 0 ?
                  index === indexDetail
                    ?
                    <tr key={index}>
                      <PurchaseListApproval
                        allPurchaseList={allPurchaseList}
                        setAllPurchaseList={setAllPurchaseList}
                        list={list}
                        index={index}
                        setIndexDetail={setIndexDetail}
                        callAPI={callAPI}

                      />
                    </tr>
                    : <></>
                  : <tr key={index}>
                    <PurchaseListApproval
                      allPurchaseList={allPurchaseList}
                      setAllPurchaseList={setAllPurchaseList}
                      list={list}
                      index={index}
                      setIndexDetail={setIndexDetail}
                      callAPI={callAPI}
                    />
                  </tr>
              );
            }).reverse()}
          </tbody>
        </Table>
          }
       {indexDetail >= 0 ?
         <> 
         <div className="closebtn"><Button onClick={()=> setIndexDetail(-1)}>Close</Button></div>
         <ShowPurchaseOrderTable purchaseList={allPurchaseList[indexDetail]} />
         <ShowOrderDetailTable purchaseList={allPurchaseList[indexDetail]} />
         <BillUploaderDetails cloudBills={allPurchaseList[indexDetail]['billPhotos']}/>
         </>
          :<></>
       }
    </div>
  );
};

export default PurchaseDetailsApproval;
