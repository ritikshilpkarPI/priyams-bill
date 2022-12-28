import React, { useEffect, useState } from 'react'
import PurchaseDetailsApproval from 'src/components/PurchaseApproval/PurchaseDetailsApproval';

const Approval = () => {
    const [list, setList] = useState([]);
    const [filter, setFilter] = useState([]);
    useEffect(() => {
       callAPI();
    }, []);
    const callAPI = () =>{
      fetch("/api/purchaseOrder/orders")
       .then((res)=>res.json())
       .then((data)=>{
        let pendingArray = [];
        let approvedArray = [];
        let rejectedArray = [];
        let draftArray = [];
        let totalArray = data.orders;
        const role = JSON.parse(localStorage.getItem("priyam-store")).role;
        for(let i=0;i<totalArray.length;i++){
          if(role === 'admin'){
              if(totalArray[i].isRejected){
                rejectedArray.push(totalArray[i]);
              }else if(totalArray[i].isApproved){
                approvedArray.push(totalArray[i]);
              }else if(totalArray[i].isDraft){
                draftArray.push(totalArray[i]);
              }else{
                pendingArray.push(totalArray[i]);
              }
          }else{
            if(totalArray[i].isRejected){
              rejectedArray.push(totalArray[i]);
            }else if(!totalArray[i].isApproved){
              pendingArray.push(totalArray[i]);
            }
          }
        }
        setList([...draftArray,...rejectedArray,...approvedArray,...pendingArray]);
        setFilter([...draftArray,...rejectedArray,...approvedArray,...pendingArray]);
       })
    }
   
  return (
    <div>
      <PurchaseDetailsApproval allList={list} allPurchaseList={filter} setAllPurchaseList={setFilter} />
    </div>
  )
}

export default Approval
