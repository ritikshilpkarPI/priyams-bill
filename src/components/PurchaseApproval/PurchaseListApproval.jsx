import { Button, Table } from '@mantine/core';
import React from 'react'
import { Link } from 'react-router-dom';
const PurchaseListApproval = ({list,index}) => {
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
            <td>{index+1}</td>
            <td>{list.dealerName}</td>
            <td>{list.phoneNumber}</td>
            <td>{list.payment}</td>
            <td>{list.billAmount}</td>
            <td>{list.totalPaidAmount}</td>
            <td>{list.procurementSource}</td>
            <td>{list.remark}</td>
            <td><Link style={{backgroundColor:'#1098AD',textDecoration:'none',height:'5vmin',padding:'1vmin 2vmin',color:'white',borderRadius:'0.5vmin'}} to={{pathname:"/purchase",state:{isEditedByAdmin:true,id:list._id}}}>Edit</Link></td>
            <td><Button style={{backgroundColor:'#40C057'}}>Approve</Button></td>
            <td><Button style={{backgroundColor:'#F03E3E'}}>Reject</Button></td>
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
