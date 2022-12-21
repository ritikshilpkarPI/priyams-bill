import React,{useEffect,useState} from 'react'
import PurchaseDetailsApproval from 'src/components/PurchaseApproval/PurchaseDetailsApproval';

const Approval = () => {
    const [list, setList] = useState([]);
    useEffect(() => {
       fetch("/api/purchaseOrder/orders")
       .then((res)=>res.json())
       .then((data)=>{
        let pendingArray = data.message.filter(
          (list) => list.isRejected === false && list.isApproved === false
        );
        let approvedArray = data.message.filter(
          (list) => list.isApproved === true
        );
        let rejectedArray = data.message.filter(
          (list) => list.isRejected === true
        );
        setList([...pendingArray,...rejectedArray,...approvedArray]);
       })
    }, []);
  return (
    <div>
      <PurchaseDetailsApproval allPurchaseList={list} setAllPurchaseList={setList}/>
    </div>
  )
}

export default Approval
