import React,{useEffect,useState} from 'react'
import PurchaseDetailsApproval from 'src/components/PurchaseApproval/PurchaseDetailsApproval';

const Approval = () => {
    const [list, setList] = useState([]);
    useEffect(() => {
       fetch("/api/purchaseOrder/orders")
       .then((res)=>res.json())
       .then((data)=>{
        console.log(data.message)
        setList(data.message);
       })
    }, [list]);
  return (
    <div>
      <PurchaseDetailsApproval allPurchaseList={list}/>
    </div>
  )
}

export default Approval
