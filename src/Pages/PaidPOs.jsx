import React, { useEffect, useState } from 'react'
import { API_METHODS } from '../utils/constants/apiMethods';
import { API_PATHS } from '../utils/constants/apiPaths';
import { genericAxios } from '../utils/genericAxiosMethod';
import "../CSS/paidPOs.css"
import { useHistory } from 'react-router-dom';
import { LoadingOverlay } from '@mantine/core';
const PaidPOs = () => {
  const [Loading, setLoading] = useState(false);
  const [paidStatusList, setPaidStatusList] = useState([]);
  const query = { isApproved: false, isDraft: false };
  const history = useHistory();

  const getOrders = async () => {
    try {
      setLoading(true)
      const response = await genericAxios({
        method: API_METHODS.POST,
        url: '/api/purchaseOrder/getOrdersByQuery',
        data: {
          query:{
            isPaid:true
          }
        },
      })

      const result = response.data;
      setPaidStatusList(result.orders);

    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    getOrders()
  }, [])

  return (
    <div className='paidPOs-container'>
       <LoadingOverlay
       className="purchase-loader"
       visible={Loading}
       overlayBlur={1}
     />
      <h1>Paid POs</h1>
      <table className='paidPOs-table'>
        <thead className='paidPOs-table-thead'>
          <tr className='paidPOs-table-thead-tr'>
            <th className='paidPOs-table-thead-tr-th'>S.No</th>
            <th className='paidPOs-table-thead-tr-th'>Dealer Name</th>
            <th className='paidPOs-table-thead-tr-th'>Phone Number</th>
            <th className='paidPOs-table-thead-tr-th'>Payment</th>
            <th className='paidPOs-table-thead-tr-th'>Bill Amount</th>
            <th className='paidPOs-table-thead-tr-th'>Paid Amount</th>
            <th className='paidPOs-table-thead-tr-th'>Procurement Source</th>
            <th className='paidPOs-table-thead-tr-th'>Created At</th>
            <th className='paidPOs-table-thead-tr-th'>Remark</th>
            <th className='paidPOs-table-thead-tr-th'>Status</th>
          </tr>
        </thead>
        <tbody className='paidPOs-table-tbody'
        >
          {paidStatusList?.map((paidStatus, index) => (
            (paidStatus?.isPaid) &&
            <tr className='paidPOs-table-tbody-tr' key={index}
              onClick={() => history.push(`/purchaseOrderBill/${paidStatus._id}`)
              }
            >
              <td className='paidPOs-table-tbody-tr-td'>{index + 1}</td>
              <td className='paidPOs-table-tbody-tr-td'>{paidStatus?.dealerName}</td>
              <td className='paidPOs-table-tbody-tr-td'>{paidStatus?.phoneNumber}</td>
              <td className='paidPOs-table-tbody-tr-td'>{paidStatus?.payment}</td>
              <td className='paidPOs-table-tbody-tr-td'>{paidStatus?.billAmount}</td>
              <td className='paidPOs-table-tbody-tr-td'>{paidStatus?.totalPaidAmount}</td>
              <td className='paidPOs-table-tbody-tr-td'>{paidStatus?.procurementSource}</td>
              <td className='paidPOs-table-tbody-tr-td'>{new Date(paidStatus?.createdAt).toUTCString()}</td>
              <td className='paidPOs-table-tbody-tr-td'>{paidStatus?.remark ? paidStatus?.remark : "..."}</td>
              <td className='paidPOs-table-tbody-tr-td'>{paidStatus?.isPaid ? "Paid" : "Unpaid"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PaidPOs 
