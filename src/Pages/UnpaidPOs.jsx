import React, { useEffect, useState } from 'react'
import { API_METHODS } from 'src/utils/constants/apiMethods';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import "../CSS/unpaidPOs.css"
import WhatsApp from '../icons/whatsApp';
const UnpaidPOs = () => {

  const [unpaidStatusList, setUnpaidStatusList] = useState([]);
  const query = { isApproved: false, isDraft: false };

  const getOrders = async () => {
    try {
      const response = await genericAxios({
        method: API_METHODS.POST,
        url: "/api/purchaseOrder/getPurchaseOrderByPaidStatus",
        data: {
          isPaid: false
        },
      })

      const result = response.data;
      setUnpaidStatusList(result);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders()
  }, [])

  return (
    <div className='unpaidPOs-container'>
      <h1>Unpaid POs</h1>
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
          {unpaidStatusList?.map((paidStatus, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{paidStatus?.dealerName}</td>
              <td>{paidStatus?.phoneNumber}</td>
              <td>{paidStatus?.payment}</td>
              <td>{paidStatus?.billAmount}</td>
              <td>{paidStatus?.totalPaidAmount}</td>
              <td>{paidStatus?.procurementSource}</td>
              <td> {new Date(paidStatus?.createdAt).toUTCString()}</td>
              <td>{paidStatus?.remark ? paidStatus?.remark : "..."}</td>
              <td className='td-button'>
                <div>
                  <p>{paidStatus?.isPaid ? "Paid" : "Unpaid"}</p>
                  <button onClick={() => window.open(`https://wa.me/${paidStatus?.phoneNumber}?text= paid due url`)}><WhatsApp /></button>
                </div>
              </td>
            </tr>
          ))
          }

        </tbody>
      </table>
    </div>
  )
}
export default UnpaidPOs