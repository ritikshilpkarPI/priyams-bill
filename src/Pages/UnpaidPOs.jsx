import '../CSS/unpaidPOs.css';
import React, { useEffect, useRef, useState } from 'react';
import { API_METHODS } from '../utils/constants/apiMethods';
import { API_PATHS } from '../utils/constants/apiPaths';
import { genericAxios } from '../utils/genericAxiosMethod';
import { useNavigate } from 'react-router-dom';
import { WhatsappShareButton, WhatsappIcon } from 'react-share';
import { LoadingOverlay } from '@mantine/core';
const UnpaidPOs = () => {
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [unpaidStatusList, setUnpaidStatusList] = useState([]);
  const query = { isApproved: false, isDraft: false };
  const baseUrl = "https://priyams.netlify.app";

  const getOrders = async () => {
    try {
      setLoading(true)
      const response = await genericAxios({
        method: API_METHODS.POST,
        url: '/api/purchaseOrder/getOrdersByQuery/',
        data: {
          query:{
            isApproved: true,
          }
        },
      });

      const result = response.data;
      setUnpaidStatusList(result.orders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const handleOnClickOfSharePurchaseOrder = async ({ event, paidStatus }) => {
    event.stopPropagation();
    event.preventDefault();
  };
  return (



    <div className="unpaidPOs-container">
      <LoadingOverlay
        className="purchase-loader"
        visible={Loading}
        overlayBlur={1}
      />
      <h1>Unpaid POs</h1>
      <table className="unpaidPOs-table">
        <thead className="unpaidPOs-table-thead">
          <tr className="unpaidPOs-table-thead-tr">
            <th className="unpaidPOs-table-thead-tr-th">S.No</th>
            <th className="unpaidPOs-table-thead-tr-th">Dealer Name</th>
            <th className="unpaidPOs-table-thead-tr-th">Phone Number</th>
            <th className="unpaidPOs-table-thead-tr-th">Payment</th>
            <th className="unpaidPOs-table-thead-tr-th">Bill Amount</th>
            <th className="unpaidPOs-table-thead-tr-th">Paid Amount</th>
            <th className="unpaidPOs-table-thead-tr-th">Procurement Source</th>
            <th className="unpaidPOs-table-thead-tr-th">Created At</th>
            <th className="unpaidPOs-table-thead-tr-th">Remark</th>
            <th className="unpaidPOs-table-thead-tr-th">Status</th>
          </tr>
        </thead>
        <tbody className="unpaidPOs-table-tbody">
          {unpaidStatusList.map((unpaidStatus, index) => (
            <tr
              className={
                index % 2 === 0
                  ? 'unpaidPOs-table-tbody-tr-even'
                  : 'unpaidPOs-table-tbody-tr-odd'
              }
              key={index}
              onClick={() => {
                navigate(`/purchaseOrderBill/${unpaidStatus._id}`);
              }}
            >
              <td className="unpaidPOs-table-tbody-tr-td" >{index + 1}</td>
              <td className="unpaidPOs-table-tbody-tr-td" >{unpaidStatus?.dealerName}</td>
              <td className="unpaidPOs-table-tbody-tr-td" >{unpaidStatus?.phoneNumber}</td>
              <td className="unpaidPOs-table-tbody-tr-td" >{unpaidStatus?.payment}</td>
              <td className="unpaidPOs-table-tbody-tr-td" >{unpaidStatus?.billAmount}</td>
              <td className="unpaidPOs-table-tbody-tr-td" >{unpaidStatus?.totalPaidAmount}</td>
              <td className="unpaidPOs-table-tbody-tr-td" >{unpaidStatus?.procurementSource}</td>
              <td className="unpaidPOs-table-tbody-tr-td" >{new Date(unpaidStatus?.createdAt).toLocaleDateString('en-US')}</td>
              <td className="unpaidPOs-table-tbody-tr-td" >{unpaidStatus?.remark ? unpaidStatus?.remark : '...'}</td>
              <td className="unpaidPOs-table-tbody-tr-td" id="td-button">
                <div className=".unpaidPOs-table-tbody-tr-td-div">
                  <p>{unpaidStatus?.isPaid ? 'Paid' : 'Unpaid'}</p>
                  <button
                    className=".unpaidPOs-table-tbody-tr-td-cover-button"
                    onClick={(e) =>
                      handleOnClickOfSharePurchaseOrder({
                        event: e,
                        unpaidStatus,
                      })
                    }
                  >
                    <WhatsappShareButton
                      url={`\n${baseUrl}/purchaseOrderBill/${unpaidStatus?._id
                        }\n${unpaidStatus?.billPhotos[0]?.secure_url
                          ? `Pay purchase Order Bill:- \n${unpaidStatus.billPhotos[0].secure_url}`
                          : ''
                        }`}
                      title={'Pay purchase Order Bill:- '}
                    >
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                  </button>
                </div>
              </td>

            </tr>
          ))}
          {/* {unpaidStatusList.orders.map((paidStatus, index) => (
            <tr
              className={
                index % 2 === 0
                  ? 'unpaidPOs-table-tbody-tr-even'
                  : 'unpaidPOs-table-tbody-tr-odd'
              }
              key={index}
              onClick={() => {
                navigate(`/purchaseOrderBill/${paidStatus._id}`);
              }}
            >
              <td className="unpaidPOs-table-tbody-tr-td">{index + 1}</td>
              <td className="unpaidPOs-table-tbody-tr-td">
                {paidStatus?.dealerName}
              </td>
              <td className="unpaidPOs-table-tbody-tr-td">
                {paidStatus?.phoneNumber}
              </td>
              <td className="unpaidPOs-table-tbody-tr-td">
                {paidStatus?.payment}
              </td>
              <td className="unpaidPOs-table-tbody-tr-td">
                {paidStatus?.billAmount}
              </td>
              <td className="unpaidPOs-table-tbody-tr-td">
                {paidStatus?.totalPaidAmount}
              </td>
              <td className="unpaidPOs-table-tbody-tr-td">
                {paidStatus?.procurementSource}
              </td>
              <td className="unpaidPOs-table-tbody-tr-td">
                {' '}
                {new Date(paidStatus?.createdAt).toUTCString()}
              </td>
              <td className="unpaidPOs-table-tbody-tr-td">
                {paidStatus?.remark ? paidStatus?.remark : '...'}
              </td>
              <td className="unpaidPOs-table-tbody-tr-td" id="td-button">
                <div className=".unpaidPOs-table-tbody-tr-td-div">
                  <p>{paidStatus?.isPaid ? 'Paid' : 'Unpaid'}</p>
                  <button
                    className=".unpaidPOs-table-tbody-tr-td-cover-button"
                    onClick={(e) =>
                      handleOnClickOfSharePurchaseOrder({
                        event: e,
                        paidStatus,
                      })
                    }
                  >
                    <WhatsappShareButton
                      url={`\n${baseUrl}/purchaseOrderBill/${
                        paidStatus?._id
                      }\n${
                        paidStatus?.billPhotos[0]?.secure_url
                          ? `Pay purchase Order Bill:- \n${paidStatus.billPhotos[0].secure_url}`
                          : ''
                      }`}
                      title={'Pay purchase Order Bill:- '}
                    >
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                  </button>
                </div>
              </td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
};
export default UnpaidPOs;
