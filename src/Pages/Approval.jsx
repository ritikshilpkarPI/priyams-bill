import React,{useEffect,useState} from 'react'
import PurchaseDetailsApproval from 'src/components/PurchaseApproval/PurchaseDetailsApproval';

const Approval = () => {
    const [list, setList] = useState([]);
    useEffect(() => {
       fetch("/api/purchaseOrder/orders")
       .then((res)=>res.json())
       .then((data)=>{
        const role = JSON.parse(localStorage.getItem("priyam-store")).role;
        let pendingArray = data.orders.filter(
          (list) => list.isRejected === false && list.isApproved === false && (role === 'admin' ? list.isDraft === true:true)
        );
        let approvedArray = [];

        if(role === 'admin'){
          approvedArray = data.orders.filter(
            (list) => list.isApproved === true 
          );
        }
        let rejectedArray = data.orders.filter(
          (list) => list.isRejected === true && list.isDraft === false
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
