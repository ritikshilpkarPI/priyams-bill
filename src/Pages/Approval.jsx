import { LoadingOverlay } from '@mantine/core';
import React, { useEffect, useState } from 'react'
import PurchaseDetailsApproval from 'src/components/PurchaseApproval/PurchaseDetailsApproval';
import { Axios } from 'src/utils/axios';

const Approval = () => {
    const [list, setList] = useState([]);
    const [filter, setFilter] = useState([]);
    const [Loading, setLoading] = useState(false);
    useEffect(() => {
       callAPI();
    }, []);
    const callAPI = async() =>{
      setLoading(true)
     try{
      const {data} = await Axios({
        url:'/api/purchaseOrder/orders'
      })
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
        setLoading(false)
     }catch(err){
       console.log(err);
       setLoading(false)
     }
    }
   
  return (
    <div>
       <LoadingOverlay className='purchase-loader' visible={Loading} overlayBlur={1} />
      <PurchaseDetailsApproval callAPI={callAPI} allList={list} allPurchaseList={filter} setAllPurchaseList={setFilter} />
    </div>
  )
}

export default Approval
