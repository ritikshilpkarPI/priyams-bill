import React from "react";
import PurchaseListApproval from "./PurchaseListApproval";


const PurchaseDetailsApproval = ({allPurchaseList}) => {
  
  return (
    <div>
        <h3>Purchase Details, approval required</h3>
         {
          allPurchaseList.map((list,index)=>{
            return <PurchaseListApproval key={index} list={list} index={index} />
          })
         }
     </div>
  );
};

export default PurchaseDetailsApproval;
