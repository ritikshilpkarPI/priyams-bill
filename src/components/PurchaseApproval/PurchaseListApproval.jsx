import { Button, Table } from '@mantine/core';
import React from 'react'
import { Link } from 'react-router-dom';
import { Axios } from 'src/utils/axios';

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

    order.purchasedItems.forEach((item)=>{
      if(item.barcode.length <= 0 || item.inputName.length <= 0 || item.stockQuantity <= 0 || item.sellingPrice <= 0 || item.minimumQuantity <= 0 || item.mrp <= 0 || item.costPrice <= 0){
        alert('Cannot draft orders, some fields are missing,please fill all the fields');
        validate = false;
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
    <div>
      {list ? (
        <>
        <Table style={{width:'90%',margin:'auto'}} withColumnBorders striped withBorder>
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
            <tr>
            <td>{index+1}</td>
            <td>{list.dealerName}</td>
            <td>{list.phoneNumber}</td>
            <td>{list.payment}</td>
            <td>{list.billAmount}</td>
            <td>{list.totalPaidAmount}</td>
            <td>{list.procurementSource}</td>
            <td>{list.remark}</td>
            {
              JSON.parse(localStorage.getItem("priyam-store")).role === 'admin'?
              list.isRejected || list.isApproved ? (
                list.isRejected ? (<td style={{color:'red'}}>rejected</td>) :(<td style={{color:'seagreen'}}>approved</td>)
              ):
              <>
               <td><Button style={{backgroundColor:'#40C057'}} onClick={()=>{approveOrder(list._id,index)}}>Approve</Button></td>
               <td><Button style={{backgroundColor:'#F03E3E'}} onClick={()=>{rejectOrder(list._id,index)}}>Reject</Button></td>   
              </>
              :
              <>
               {
                !list.isRejected ?
               <td><Button style={{backgroundColor:'#40C057'}} onClick={()=>{draftOrder(list._id,index)}}>Draft</Button></td>
                :
                <>
                <td style={{color:'red'}}>rejected</td>
                </>
               }
                <td><Link style={{backgroundColor:'#1098AD',textDecoration:'none',height:'5vmin',padding:'1vmin 2vmin',color:'white',borderRadius:'0.5vmin'}} to={{pathname:"/purchase",state:{isEditedByAdmin:true,id:list._id}}}>Edit</Link>
                </td>
              </>
            }
            </tr>
          </tbody>
        </Table>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default PurchaseListApproval
