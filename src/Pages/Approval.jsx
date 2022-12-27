import React,{useEffect,useState} from 'react'
import PurchaseDetailsApproval from 'src/components/PurchaseApproval/PurchaseDetailsApproval';

const Approval = () => {
    const [list, setList] = useState([]);
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
        let totalArray = data.message;
        for(let i=0;i<totalArray.length;i++){
          if(totalArray[i].isRejected === true){
            rejectedArray.push(totalArray[i]);
          }else if(totalArray[i].isApproved === true){
            approvedArray.push(totalArray[i]);
          }else{
            pendingArray.push(totalArray[i]);
          }
        }
        setList([...pendingArray,...rejectedArray,...approvedArray]);
       })
    }
  return (
    <div>
      <PurchaseDetailsApproval allPurchaseList={list} setAllPurchaseList={setList}/>
    </div>
  )
}

export default Approval
