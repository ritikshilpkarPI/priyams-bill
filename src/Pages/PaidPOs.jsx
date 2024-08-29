import React, { useEffect, useState } from 'react'
import { API_METHODS } from 'src/utils/constants/apiMethods';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { genericAxios } from 'src/utils/genericAxiosMethod';

const PaidPOs = () => {
  const [paidStatusList, setPaidStatusList] = useState([]);
  const query = { isApproved: false, isDraft: false };

  const getOrders = async () => {
    try {
      const response = await genericAxios({
        method: API_METHODS.POST,
        url: "/api/purchaseOrder/getPurchaseOrderByPaidStatus",
        data: {
          isPaid: true
        },
      })
      
      const result = response.data;
      setPaidStatusList(result);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders()
  }, [])

  return (
    <div className='paid-container'>
      <h1>Paid POs</h1>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Dealer Name</th>
            <th>Phone Number</th>
            <th>Payment</th>
            <th>Bill Amount</th>
            <th>Paid Amount</th>
            <th>Procurement Source</th>
            <th>Created At</th>
            <th>Remark</th>
            <th>Status</th>
          </tr>

        </thead>
        <tbody>
          {paidStatusList?.map((paidStatus, index)=>(
            <tr key={index}>
              <td>{index}</td>
              <td>{paidStatus?.dealerName}</td>
              <td>{paidStatus?.phoneNumber}</td>
              <td>{paidStatus?.payment}</td>
              <td>{paidStatus?.billAmount}</td>
              <td>{paidStatus?.totalPaidAmount}</td>
              <td>{paidStatus?.procurementSource}</td>
              <td>{paidStatus?.createdAt}</td>
              <td>{paidStatus?.remark ? paidStatus?.remark : "..." }</td>
              <td>{paidStatus?.isPaid ? "Paid":"Unpaid"}</td>
            </tr>
            ))
          }

        </tbody>
      </table>
    </div>
  )
}

export default PaidPOs 
