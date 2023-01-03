import React, { useState } from "react";
import PurchaseListApproval from "./PurchaseListApproval";
import { Button, Select, Table } from "@mantine/core";
import '../../CSS/purchaseApproval.css'

import ShowPurchaseOrderTable from "./ShowPurchaseOrderTable";
import ShowOrderDetailTable from "./ShowOrderDetailTable";
import BillUploaderDetails from "./BillUploaderDetails";

const manageList = [
  { value: "all", label: "All orders" },
  { value: "rejected", label: "Rejected orders" },
  { value: "saved", label: "Saved orders" },
]
const adminList = [
  { value: "all", label: "All orders" },
  { value: "draft", label: "Draft orders" },
  { value: "rejected", label: "Rejected orders" },
  { value: "approved", label: "Approved orders" },
  { value: "saved", label: "Saved orders" },
] 
const PurchaseDetailsApproval = ({ allPurchaseList, setAllPurchaseList, getOrders}) => {
  const [indexDetail, setIndexDetail] = useState(-1);
  const role = JSON.parse(localStorage.getItem("priyam-store")).role
 
  return (
    <div className="purchase-approval">
      <h3>Purchase Details, approval required</h3>
      <Select
        style={{ width: "200px", margin: "2vmin auto" }}
        label="Sort By"
        placeholder="All orders"
        data={role === "admin" ? adminList : manageList}
        onChange={getOrders}
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
                        getOrders={getOrders}

                      />
                    </tr>
                    : <div key={index}></div>
                  : <tr key={index}>
                    <PurchaseListApproval
                      allPurchaseList={allPurchaseList}
                      setAllPurchaseList={setAllPurchaseList}
                      list={list}
                      index={index}
                      setIndexDetail={setIndexDetail}
                      getOrders={getOrders}
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
