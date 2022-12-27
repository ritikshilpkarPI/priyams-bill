import axios from 'axios';
import React, { useEffect, useState } from 'react'
import PurchaseDetailsApproval from 'src/components/PurchaseApproval/PurchaseDetailsApproval';

const Approval = () => {
  const [list, setList] = useState([]);
  useEffect(() => {
    callAPI();
  }, []);
  const callAPI = async () => {

    try {
      const { data } = await axios.get("/api/purchaseOrder/orders")
      console.log({ data });

      let pendingArray = [];
      let approvedArray = [];
      let rejectedArray = [];
      let totalArray = data.orders;
      const role = JSON.parse(localStorage.getItem("priyam-store")).role;
      for (let i = 0; i < totalArray.length; i++) {
        if (role === 'admin') {
          if (totalArray[i].isRejected) {
            rejectedArray.push(totalArray[i]);
          } else if (totalArray[i].isApproved) {
            approvedArray.push(totalArray[i]);
          } else if (totalArray[i].isDraft) {
            pendingArray.push(totalArray[i]);
          }
        } else {
          if (totalArray[i].isRejected) {
            rejectedArray.push(totalArray[i]);
          } else if (!totalArray[i].isApproved) {
            pendingArray.push(totalArray[i]);
          }
        }
      }
      console.log({ pendingArray, approvedArray, rejectedArray });
      setList([...pendingArray, ...rejectedArray, ...approvedArray]);

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <PurchaseDetailsApproval allPurchaseList={list} setAllPurchaseList={setList} />
    </div>
  )
}

export default Approval
