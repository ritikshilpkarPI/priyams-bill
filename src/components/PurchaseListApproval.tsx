import React, { useEffect, useState } from 'react';
import { PaidChip } from './paidChip';
import { useNavigate } from 'react-router-dom';
import ShareOnWhatsApp from 'src/components/shareOnWhatsApp';
import DataTable from 'src/Pages/DataTable';
import { isAdmin } from 'src/utils/isAdmin';
import { useQueryParam } from 'src/utils/getQuery';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLoadingState,
  setOrder,
  setOrderBy,
  setPage,
  setRowsPerPage,
  setIsAdminUser,
} from 'src/redux/purchaseListApproval/purchaseListApprovalSlice';
import { RootState } from 'src/redux/store';
import { purchaseOrderTableConstants } from 'src/utils/constants/purchaseOrderTableConstants';
import renderPurchaseOrderActions from './renderPOActions';
import { getPODashboardMetrics } from 'src/utils/getPODashboardMetrics';
import {
  approvePurchaseOrder,
  draftPurchaseOrder,
  rejectPurchaseOrder,
} from 'src/utils/apiUtils';
import { formatDateTime } from 'src/utils/formatDate';

const PurchaseListApproval: React.FC<PurchaseListApprovalProps> = ({
  allPurchaseList,
  loading,
  getOrders = () => {},
}) => {
  const { loadingState, order, orderBy, page, rowsPerPage, isAdminUser } =
    useSelector((state: RootState) => state.purchaseListApproval);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const setLoading = (id: string, stateVal: boolean, buttonName: string) => {
    dispatch(
      setLoadingState({ id, value: { state: stateVal, btnName: buttonName } })
    );
  };

  const option = useQueryParam('option')?.split(' ')[0];
  useEffect(() => {
    dispatch(setIsAdminUser(isAdmin()));
  }, [dispatch]);

  const isSavedApprovedPage = !['approved', 'saved'].includes(
    option.trim().toLowerCase()
  );
  const isApprovedPO = option.trim().toLowerCase() === 'approved';

  const approveOrder = (id: string, index: number, list: any) =>
    approvePurchaseOrder(id, index, list, getOrders, setLoading);

  const rejectOrder = (id: string, index: number) =>
    rejectPurchaseOrder(id, index, getOrders, setLoading);

  const draftOrder = (id: string, index: number) =>
    draftPurchaseOrder(id, index, allPurchaseList, getOrders, setLoading);

  const handlePageChange = (_: unknown, newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleRowsPerPageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(setRowsPerPage(parseInt(e.target.value, 10)));
  };

  const handleSort = (columnKey: string) => {
    const isAsc = orderBy === columnKey && order === 'asc';
    dispatch(setOrder(isAsc ? 'desc' : 'asc'));
    dispatch(setOrderBy(columnKey));
  };

  const columns = purchaseOrderTableConstants.COLUMNS.map((col) => {
    if (col.key === purchaseOrderTableConstants.IS_PAID) {
      return {
        ...col,
        render: (row: any) => (row.isPaid ? <PaidChip /> : ''),
      };
    }

    if (col.key === purchaseOrderTableConstants.SHARE) {
      return {
        ...col,
        render: (row: any) => {
          const message = `${window.location.origin}/new-purchase-order/${row._id}`;
          return <ShareOnWhatsApp message={message} />;
        },
      };
    }

    if (col.key === purchaseOrderTableConstants.ACTIONS) {
      return {
        ...col,
        render: (row: any) =>
          renderPurchaseOrderActions({
            list: row,
            index: row.index,
            isAdminUser,
            isApprovedPO,
            isSavedApprovedPage,
            loadingState,
            draftOrder,
            approveOrder,
            rejectOrder,
            navigate,
          }),
      };
    }

    return col;
  });

  console.log({ allPurchaseList });

  return (
    <div style={{ padding: '20px' }}>
      <DataTable
        columns={columns}
        data={allPurchaseList.map((row, idx) => {
          const metrics = getPODashboardMetrics(row.purchasedItems || []);

          return {
            ...row,

            index: idx,
            serial: idx + 1,
            createdAt: row.createdAt ? formatDateTime(row.createdAt) : '',
            totalBillAmount: row?.purchaseDetails?.totalBillAmount,
            isPaid:
              row.purchaseDetails?.totalPayableAmount === row.totalPaidAmount
                ? 'paid'
                : '',
            averageProfitMargin: parseFloat(metrics.averageProfitMargin),
            uniqueItemsCount: metrics.uniqueItemsCount,
            existingItemsCount: metrics.existingItemsCount,
            newItemsCount: metrics.newItemsCount,
            itemsWithManuAndExpiry: metrics.itemsWithManuAndExpiry,
            itemsWithShortExpiry: metrics.itemsWithShortExpiry,
          };
        })}
        isLoading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowCount={allPurchaseList.length}
        order={order}
        orderBy={orderBy}
        onSort={handleSort}
      />
    </div>
  );
};

export default PurchaseListApproval;
