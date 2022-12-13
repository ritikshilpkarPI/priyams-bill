import { Button, Table } from '@mantine/core';
import React,{createContext, useState} from 'react'
import { Navigate } from 'react-router';
import { Link } from 'react-router-dom';
// import { useNavigate } from "react-router-dom";
// import { Navigate } from "react-router-dom";
const PurchaseListApproval = ({list,index}) => {
    let total = 0;
        list.purchaseDetails.map((curr)=>{
           total = total + curr.paidAmount
        })
    
  return (
    <div>
      {list.purchaseDetails.length ? (
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
              <th>Paid By</th>
              <th>Cheque Number</th>
              <th>Procurement Source</th>
              <th>Remark</th>
              <th>Status</th>
              {/* <Navigate to="/dashboard" replace={true} /> */}
            </tr>
          </thead>
          <tbody>
            <td>{index+1}</td>
            <td>{list.purchaseDetails[0].dealerName}</td>
            <td>{list.purchaseDetails[0].phoneNumber}</td>
            <td>{list.purchaseDetails[0].payment}</td>
            <td>{list.purchaseDetails[0].billAmount}</td>
            <td>{total}</td>
            <td>{list.purchaseDetails[0].paidBy}</td>
            <td>{list.purchaseDetails[0].chequeNumber}</td>
            <td>{list.purchaseDetails[0].procurementSource}</td>
            <td>{list.purchaseDetails[0].remark}</td>
            <td><Link  to={{pathname:"/purchase",state:{isEditedByAdmin:true,id:list._id}}}>Edit</Link></td>
            <td><Button>Approve</Button></td>
            <td><Button>Reject</Button></td>
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
