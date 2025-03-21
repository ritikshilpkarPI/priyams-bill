import { Button } from '@mantine/core';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_METHODS } from '../utils/constants/apiMethods';
import { API_PATHS } from '../utils/constants/apiPaths';
import { parseJwt } from '../utils/cookie';
import { genericAxios } from '../utils/genericAxiosMethod';
import '../CSS/purchaseApproval.css';
import { isAdmin } from '../utils/isAdmin';
import { getUserDetails, getUserDeviceInfo } from '../utils/getUserDeviceInfo';
import ShareOnWhatsApp from './shareOnWhatsApp';
const PurchaseListApproval = ({
  list,
  index,
  allPurchaseList,
  setIndexDetail,
  getOrders,
}) => {
  const [loadingState, setLoadingState] = useState({});
  const [isAdminUser, setIsAdminUser] = useState(false)

  const setLoading = (id, state, buttonName) => {
    setLoadingState({ [id]: state, btnName: buttonName });
  };

  const handleApiCall = async (apiCall, id, index, successMessage, errorMessage, callback, buttonName) => {
    setLoading(id, true, buttonName);
    const apiResponse = await apiCall();
    setLoading(id, false, buttonName);
    if (apiResponse.hasOwnProperty('error')) {
      console.error(apiResponse.error);
      window.alert(errorMessage);
    } else {
      window.alert(successMessage);
      if (callback) callback();
    }
  };
 

  const rejectOrder = async (id, index) => {
    await handleApiCall(
      async () => await genericAxios({
        method: API_METHODS.POST,
        url: `${API_PATHS.APPROVAL.POST_REJECT_ORDER}/${id}`,
        data: {
          username: parseJwt(Cookies.get('token')).username,
          userDetail: await getUserDetails(),
        },
      }),
      id,
      index,
      'Order rejected successfully',
      'Something went wrong, unable to reject order',
      () => getOrders('rejected'),
      "reject"
    );
  };
  const approveOrder = async (id, index, list) => {
    await handleApiCall(
      async () => await genericAxios({
        url: API_PATHS.INVENTORY.POST_SAVE_INVENTORY,
        method: API_METHODS.POST,
        data: {
          newItems: list.purchasedItems,
          purchaseOrderId: id,
          userDetail: await getUserDetails(),
        },
      }),
      id,
      index,
      'Order approved successfully',
      'Something went wrong, unable to approve order',
      () => getOrders('draft'),
      "approve"
    );
  };

  const draftOrder = async (id, index) => {
    if (window.confirm('Do you want to draft this order ?')) {
      const order = allPurchaseList[index];
      let validate = true;
      let once = true;
      if (!order.billAmount || !order.dealerName?.length) {
        alert('please fill payment details information');
        return;
      }
      order.purchasedItems.forEach((item) => {
        if (!item.validate) {
          validate = false;
          if (once) {
            alert('Cannot draft orders, please validate the orders');
            once = false;
          }
          return;
        }
      });
      if (!validate) {
        return;
      }
      await handleApiCall(
        async () => await genericAxios({
          method: API_METHODS.POST,
          url: API_PATHS.PURCHASE_ORDER.POST_DRAFT_ORDER,
          data: { 
            id,
            userDetail: await getUserDetails(),
           },
        }),
        id,
        index,
        'Order drafted successfully',
        'Something went wrong, unable to draft the order',
        () => getOrders('draft'),
        "draft"
      );
    }
  };
  const time = new Date(list.createdAt);
  let datetext = time.toTimeString();
  datetext = datetext?.split(' ')[0];

  useEffect(() => {
    const isUserAdmin = isAdmin();
    setIsAdminUser(isUserAdmin)
  }, [])
  const baseUrl = window.location.origin;
  const message = `${baseUrl}/new-purchase-order/${list._id}`

  return (
    <>
      {list ? (
        <>
          <td>{ index + 1}</td>
          <td>{list.dealerName}</td>
          <td>{list.phoneNumber}</td>
          <td>{list.payment}</td>
          <td>{list.billAmount}</td>
          <td>{list.totalPaidAmount}</td>
          <td>{list.procurementSource}</td>
          <td>
            {new Date(list.createdAt)?.toLocaleDateString('en-US')} {datetext}
          </td>
          <td>{list.remark}</td>
          <td>
             <ShareOnWhatsApp message={message}/>
           
          </td>
          <td>
            {list.isDraft
              ? list.isApproved
                ? 'Approved'
                : 'Drafted'
              : list.isRejected
                ? 'Rejected'
                : 'Saved'}
          </td>
          {parseJwt(Cookies.get('token')).role === 'admin' ? (
            <>
              {list.isApproved ? (
                <td>
                  <Button onClick={() => setIndexDetail(index)}>Details</Button>
                </td>
              ) : (
                <td>
                  <Link
                    disabled={list.isApproved}
                    className="purchase-list-edit"
                    to={{
                      pathname: `/new-purchase-order/${list._id}`,
                      state: { isEditedByAdmin: true, id: list._id },
                    }}
                  >
                    Edit
                  </Link>
                </td>
              )}
              {list.isDraft ? (
                <td>
                  <Button
                    disabled={loadingState[list._id] || list.isRejected || list.isApproved}
                    className="approve-btn"
                    loading={loadingState[list._id] && loadingState.btnName === 'approve'}
                    onClick={() => approveOrder(list._id, index, list)}
                  >
                    Approve
                  </Button>
                </td>
              ) : (
                <td>
                  <Button
                    disabled={loadingState[list._id] || list.isRejected || list.isApproved}
                    className="approve-btn"
                    loading={loadingState[list._id] && loadingState.btnName === 'draft'}
                    onClick={() => draftOrder(list._id, index)}
                  >
                    Draft
                  </Button>
                </td>
              )}
              <td>
                <Button
                  disabled={loadingState[list._id] || list.isApproved || list.isRejected || !list.isDraft}
                  className="reject-btn"
                  loading={loadingState[list._id] && loadingState.btnName === 'reject'}
                  onClick={() => rejectOrder(list._id, index)}
                >
                  Reject
                </Button>
              </td>
            </>
          ) : (
            <>
              <td>
                <Link
                  className="purchase-list-edit"
                  to={{
                    pathname: `/purchase/${list._id}`,
                    state: { isEditedByAdmin: true, id: list._id },
                  }}
                >
                  Edit
                </Link>
              </td>
              <td>
                <Button
                  disabled={loadingState[list._id] || list.isRejected}
                  className="approve-btn"
                  loading={loadingState[list._id] && loadingState.btnName === 'draft'}
                  onClick={() => draftOrder(list._id, index)}
                >
                  Draft
                </Button>
              </td>
            </>
          )}
          {isAdminUser && list.isDraft &&
            <td>
              <Link
                className="purchase-list-details-button"
                to={{
                  pathname: `/sellDetailsPage/${list._id}`,
                }}
              >
                Sell details
              </Link>
            </td>
          }
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default PurchaseListApproval;
