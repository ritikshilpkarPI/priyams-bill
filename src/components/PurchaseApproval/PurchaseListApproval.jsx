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
        data:{
          username:JSON.parse(localStorage.getItem("priyam-store")).username
        }
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
  const approveOrder = async(id,index) => {
    const ans =  window.confirm("Are you sure you want to approve this order?");
    if(!ans) return;
    try{
      const res = await Axios({
        method:'POST',
        url:'/api/approval/approveOrder/'+id,
        data:{
          username:JSON.parse(localStorage.getItem("priyam-store")).username
        }
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
  
  const draftOrder = (id,index) =>{
    const ans = window.confirm("Do you want to draft this order ?")
    if(!ans){
      return;
    }
    const order  = allPurchaseList[index];
    let validate = true;
    let once = true;
    order.purchasedItems.forEach((item)=>{
      if(!item.validate){
        validate = false;
        if(once){
          alert('Cannot draft orders, please validate the orders');
          once=false;
        }
        return;
      }
    })
    if(!validate){
      return;
    }
     saveDraft(id,index);
  }
  const saveDraft = async (id,index)=>{
    
    try{
      const res = await Axios({
        method: "POST",
        url: "/api/purchaseOrder/draftOrder",
        data: { id },
      });
      setAllPurchaseList([...allPurchaseList.filter((item,i) => i !== index)]);
      alert('Order drafted successfully')
    }catch(err){
        console.log(err)
        alert(`Something went wrong.Unable to draft the order`)
    }
  }
  return (
    <>
      {list? (
        <>

            <td>{index+1}</td>
            <td>{list.dealerName}</td>
            <td>{list.phoneNumber}</td>
            <td>{list.payment}</td>
            <td>{list.billAmount}</td>
            <td>{list.totalPaidAmount}</td>
            <td>{list.procurementSource}</td>
            <td>{list.remark}</td>
              {
                JSON.parse(localStorage.getItem("priyam-store")).role === 'admin'
                ? 
                <>
                    {
                      list.isRejected || list.isApproved ? (
                        list.isRejected ? (<><td style={{color:'red'}}>rejected</td></>) :(<><td style={{color:'seagreen'}}>approved</td> </>
                        )
  
                      ):
                      <>
                      <td><Link className='purchase-list-edit' to={{pathname:"/purchase",state:{isEditedByAdmin:true,id:list._id}}}>Edit</Link>
                      </td>
                      </>
                    }
                    <td><Button disabled={list.isRejected|| list.isApproved} className='approve-btn' onClick={()=>{approveOrder(list._id,index)}}>Approve</Button></td>
                    <td><Button disabled={list.isApproved || list.isRejected} className='reject-btn'  onClick={()=>{rejectOrder(list._id,index)}}>Reject</Button></td>   
                </>
                :
                <>
                {
                  list.isRejected
                   ?
                   <td style={{color:'red'}}>rejected</td>
                   :<>
                   <td><Button className='approve-btn' onClick={()=>{draftOrder(list._id,index)}}>Draft</Button></td>
                   </>
                }
                 <td><Link className='purchase-list-edit' to={{pathname:"/purchase",state:{isEditedByAdmin:true,id:list._id}}}>Edit</Link>
                 </td>
                </>
              }
          
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default PurchaseListApproval
