import { Button } from '@mantine/core';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_METHODS } from '../utils/constants/apiMethods';
import { API_PATHS } from '../utils/constants/apiPaths';
import { parseJwt } from '../utils/cookie';
import { genericAxios } from '../utils/genericAxiosMethod';
import '../CSS/purchaseApproval.css';
const PurchaseListApproval = ({
  list,
  index,
  allPurchaseList,
  setIndexDetail,
  getOrders,
  setLoading

}) => {
  const rejectOrder = async (id, index) => {
    if (window.confirm('Are you sure you want to reject this order?')) {
    try {
      setLoading(true)
      await genericAxios({
        method: API_METHODS.POST,
        url: `${API_PATHS.APPROVAL.POST_REJECT_ORDER}/${id}`,
        data: {
          username: parseJwt(Cookies.get('token')).username,
        },
      });
      window.alert('Order rejected successfully');
      getOrders('rejected');
    } catch (err) {
      window.alert('Something went wrong,unable to reject order');
    }finally{
      setLoading(false);
    }
    }
  };
  const approveOrder = async (id, index, list) => {
    if (window.confirm('Are you sure you want to approve this order?')){
    try {
      setLoading(true);
      await genericAxios({
        url: API_PATHS.INVENTORY.POST_SAVE_INVENTORY,
        method: API_METHODS.POST,
        data: {
          new_items: list.purchasedItems,
        },
      });
      await genericAxios({
        method: API_METHODS.POST,
        url: `${API_PATHS.APPROVAL.POST_APPROVE_ORDER}/${id}`,
        data: {
          username: parseJwt(Cookies.get('token')).username,
        },
      });
      window.alert('Order approved successfully');
      await getOrders('draft');
    } catch (err) {
      console.log(err);
      window.alert('Something went wrong,unable to approve order');
    }finally{
      setLoading(false);
    }
    }
  };

  const draftOrder = async(id, index) => {
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
    await saveDraft(id, index);
    getOrders('draft');
  }
  };
  const saveDraft = async (id, index) => {
    try {
      setLoading(true);
      await genericAxios({
        method: API_METHODS.POST,
        url: API_PATHS.PURCHASE_ORDER.POST_DRAFT_ORDER,
        data: { id },
      });
      alert('Order drafted successfully');
    } catch (err) {
      console.log(err);
      alert(`Something went wrong.Unable to draft the order`);
    }finally{
      setLoading(false);
    }
  };
  const time = new Date(list.createdAt);
  let datetext = time.toTimeString();
  datetext = datetext?.split(' ')[0];

  const location = useLocation();
  const [isDetailsButtonEnabled, setIsDetailsButtonEnabled] = useState(false);
  useEffect(() => {
    if (
      (location.search ==='?option=Approved POs' || location.search === '?option=Approved%20POs') &&
      location.pathname === '/approval'
    ) {
      setIsDetailsButtonEnabled(true);
    }else{
      setIsDetailsButtonEnabled(false);
    }
  }, [location]);

  return (
    <>
      {list ? (
        <>
          <td>{allPurchaseList.length - index}</td>
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
                      pathname: `/purchase/${list._id}`,
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
                    disabled={list.isRejected || list.isApproved}
                    className="approve-btn"
                    onClick={() => {
                      approveOrder(list._id, index, list);
                    }}
                  >
                    Approve
                  </Button>
                </td>
              ) : (
                <td>
                  <Button
                    disabled={list.isRejected || list.isApproved}
                    className="approve-btn"
                    onClick={() => {
                      draftOrder(list._id, index);
                    }}
                  >
                    Draft
                  </Button>
                </td>
              )}
              <td>
                <Button
                  disabled={list.isApproved || list.isRejected || !list.isDraft}
                  className="reject-btn"
                  onClick={() => {
                    rejectOrder(list._id, index);
                  }}
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
                  disabled={list.isRejected}
                  className="approve-btn"
                  onClick={() => {
                    draftOrder(list._id, index);
                  }}
                >
                  Draft
                </Button>
              </td>
            </>
          )}
          {isDetailsButtonEnabled &&
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
