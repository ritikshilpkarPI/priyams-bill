import { Button } from '@mantine/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import '../../CSS/purchaseApproval.css';
const PurchaseListApproval = ({
  list,
  index,
  allPurchaseList,
  setIndexDetail,
  getOrders,
}) => {
  const rejectOrder = async (id, index) => {
    const ans = window.confirm('Are you sure you want to reject this order?');
    if (!ans) return;
    try {
      await genericAxios({
        method: 'POST',
        url: '/api/approval/rejectOrder/' + id,
        data: {
          username: JSON.parse(localStorage.getItem('priyam-store')).username,
        },
      });
      window.alert('Order rejected successfully');
      getOrders('rejected');
    } catch (err) {
      window.alert('Something went wrong,unable to reject order');
    }
  };
  const approveOrder = async (id, index, list) => {
    const ans = window.confirm('Are you sure you want to approve this order?');
    if (!ans) return;
    try {
      await genericAxios({
        url: '/api/inventory/saveInventory',
        method: 'POST',
        data: {
          new_items: list.purchasedItems,
        },
      });
      await genericAxios({
        method: 'POST',
        url: '/api/approval/approveOrder/' + id,
        data: {
          username: JSON.parse(localStorage.getItem('priyam-store')).username,
        },
      });
      window.alert('Order approved successfully');
      getOrders('approved');
    } catch (err) {
      console.log(err);
      window.alert('Something went wrong,unable to approve order');
    }
  };

  const draftOrder = (id, index) => {
    const ans = window.confirm('Do you want to draft this order ?');
    if (!ans) {
      return;
    }
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
    saveDraft(id, index);
    getOrders('draft');
  };
  const saveDraft = async (id, index) => {
    try {
      await genericAxios({
        method: 'POST',
        url: '/api/purchaseOrder/draftOrder',
        data: { id },
      });
      alert('Order drafted successfully');
    } catch (err) {
      console.log(err);
      alert(`Something went wrong.Unable to draft the order`);
    }
  };
  const time = new Date(list.createdAt);
  let datetext = time.toTimeString();
  datetext = datetext.split(' ')[0];

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
          {JSON.parse(localStorage.getItem('priyam-store')).role === 'admin' ? (
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
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default PurchaseListApproval;
