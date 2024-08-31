import "../CSS/unpaidPOs.css"
import React, { useEffect, useRef, useState } from 'react'
import { API_METHODS } from 'src/utils/constants/apiMethods';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import WhatsApp from '../icons/whatsApp';
import { useHistory } from "react-router-dom";
const UnpaidPOs = () => {
  const linkRef = useRef(null);
  const history = useHistory();

  const [unpaidStatusList, setUnpaidStatusList] = useState([]);
  const query = { isApproved: false, isDraft: false };

  const getOrders = async () => {
    try {
      const response = await genericAxios({
        method: API_METHODS.POST,
        url: '/api/purchaseOrder/getPurchaseOrderByPaidStatus',
        data: {
          isPaid: false,
        },
      });

      const result = response.data;
      setUnpaidStatusList(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);
  const handleOnClickOfSharePurchaseOrder = async ({ paidStatus }) => {
    const senderMobile = 7258072625;
    console.log({ paidStatus });
    const payPruchaseUrl = `http://localhost:3000/payPurchaseOrderBill?poId=${paidStatus?._id}`;
    const message = `Pay purchase Order Bill:- \n${payPruchaseUrl}\nBill:- ${paidStatus.billPhotos[0].secure_url}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${senderMobile}?text=${encodedMessage}`);
  };
  return (
    <div className="unpaidPOs-container">
      <h1>Unpaid POs</h1>
      <table className='unpaidPOs-table'>
        <thead className='unpaidPOs-table-thead'>
          <tr className='unpaidPOs-table-thead-tr'>
            <th className='unpaidPOs-table-thead-tr-th'>S.No</th>
            <th className='unpaidPOs-table-thead-tr-th'>Dealer Name</th>
            <th className='unpaidPOs-table-thead-tr-th'>Phone Number</th>
            <th className='unpaidPOs-table-thead-tr-th'>Payment</th>
            <th className='unpaidPOs-table-thead-tr-th'>Bill Amount</th>
            <th className='unpaidPOs-table-thead-tr-th'>Paid Amount</th>
            <th className='unpaidPOs-table-thead-tr-th'>Procurement Source</th>
            <th className='unpaidPOs-table-thead-tr-th'>Created At</th>
            <th className='unpaidPOs-table-thead-tr-th'>Remark</th>
            <th className='unpaidPOs-table-thead-tr-th'>Status</th>
          </tr>
        </thead>
        <tbody>
          {unpaidStatusList?.map((paidStatus, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{paidStatus?.dealerName}</td>
              <td>{paidStatus?.phoneNumber}</td>
              <td>{paidStatus?.payment}</td>
              <td>{paidStatus?.billAmount}</td>
              <td>{paidStatus?.totalPaidAmount}</td>
              <td>{paidStatus?.procurementSource}</td>
              <td> {new Date(paidStatus?.createdAt).toUTCString()}</td>
              <td>{paidStatus?.remark ? paidStatus?.remark : '...'}</td>
              <td className="td-button">
                <div>
                  <p>{paidStatus?.isPaid ? 'Paid' : 'Unpaid'}</p>
                  <button
                    onClick={() =>
                      handleOnClickOfSharePurchaseOrder({ paidStatus })
                    }
                  >
                    <WhatsApp />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default UnpaidPOs