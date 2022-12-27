import { Button, Table } from '@mantine/core';
import React from 'react'
import { Link } from 'react-router-dom';
import { Axios } from 'src/utils/axios';
import '../../CSS/purchaseApproval.css'
const PurchaseListApproval = ({list,index,allPurchaseList,setAllPurchaseList}) => {
  const rejectOrder = async(id,index) => {
   const ans =  window.confirm("Are you sure you want to reject this order?");
   if(!ans) return;
    try{
      const res = await Axios({
        method:'POST',
        url:'/api/approval/rejectOrder/'+id,
      })
      const array = [...allPurchaseList];
      array[index] = res.data.order;
      setAllPurchaseList(array);
      window.alert("Order rejected successfully");
    }catch(err){
      console.log(err);
      window.alert('Something went wrong,unable to reject order')
    }
  }
  const approveOrder = async(id) => {
    const ans =  window.confirm("Are you sure you want to approve this order?");
    if(!ans) return;
    try{
      const res = await Axios({
        method:'POST',
        url:'/api/approval/approveOrder/'+id,
      })
      const array = [...allPurchaseList];
      array[index] = res.data.order;
      setAllPurchaseList(array);
      window.alert("Order approved successfully");
    }catch(err){
      console.log(err);
      window.alert('Something went wrong,unable to approve order');
    }
  }
  return (
    <div>
      {list ? (
        <>
        <Table className='purchase-list' withColumnBorders striped withBorder>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Dealer Name</th>
              <th>Phone Number</th>
              <th>Payment</th>
              <th>Bill Amount</th>
              <th>Paid Amount</th>
              <th>Procurement Source</th>
              <th>Remark</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <td>{index+1}</td>
            <td>{list.dealerName}</td>
            <td>{list.phoneNumber}</td>
            <td>{list.payment}</td>
            <td>{list.billAmount}</td>
            <td>{list.totalPaidAmount}</td>
            <td>{list.procurementSource}</td>
            <td>{list.remark}</td>
            {
              list.isRejected || list.isApproved ? (
                list.isRejected ? (<td>rejected</td>) :(<td>approved</td>)
              ): (
                <>
                <td><Link className='purchase-list-edit' to={{pathname:"/purchase",state:{isEditedByAdmin:true,id:list._id}}}>Edit</Link>
                </td>
              <td><Button className='approve-btn' onClick={()=>{approveOrder(list._id,index)}}>Approve</Button></td>
              <td><Button className='reject-btn' onClick={()=>{rejectOrder(list._id,index)}}>Reject</Button></td>
                </>
              )
            }
          </tbody>
        </Table>
        </>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default PurchaseListApproval
