import React from "react";
import PurchaseListApproval from "./PurchaseListApproval";


const PurchaseDetailsApproval = ({allPurchaseList,setAllPurchaseList}) => {
  
  return (
    <div style={{width:"100%"}}>
        <h3>Purchase Details, approval required</h3>
         {
          allPurchaseList.map((list,index)=>{
            return <PurchaseListApproval allPurchaseList={allPurchaseList} setAllPurchaseList={setAllPurchaseList} key={index} list={list} index={index} />
          })
         }
     </div>
  );
};

export default PurchaseDetailsApproval;
