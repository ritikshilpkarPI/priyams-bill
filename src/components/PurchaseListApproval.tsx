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
import {
  Drawer,
  Button,
  ScrollArea,
  Table,
  Badge,
  Chip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { any } from 'joi';
import {
  Card,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';

import {
  IconCaretDownFilled,
  IconCaretUpFilled,
} from '@tabler/icons-react';
import { ItemExpiryTable } from './ItemExpiryTable/ItemExpiryTable';

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

    if (col.key === purchaseOrderTableConstants.VIEW) {
      return {
        ...col,
        render: (row: any) => {
          return (
            <Button
              onClick={() => {
                findPurchaseOrderById(row._id);
                open();
              }}
              variant="light"
              color="grape"
            >
              View
            </Button>
          );
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

    if (col.key === purchaseOrderTableConstants.BRAND_NAME) {
      return {
        ...col,
        render: (row: any) => (
          <div>
            {row.brandCompanyNames.map(({ brand}: any, index: number) => (
              <div key={index}>
                <strong>{brand}</strong>
              </div>
            ))}
          </div>
        ),
      };
    }

    if (col.key === purchaseOrderTableConstants.COMPANY_NAME) {
      return {
        ...col,
        render: (row: any) => (
          <div>
            {row.brandCompanyNames.map(({ company }: any, index: number) => (
              <div key={index}>
                <strong>{company}</strong>
              </div>
            ))}
          </div>
        ),
      };
    }


    return col;
  });

  console.log({ allPurchaseList });

  const content = Array(100)
    .fill(0)
    .map((_, index) => <p key={index}>Drawer with scroll</p>);

  const [opened, { open, close }] = useDisclosure(false);

  const [selectedOrder, setSelectedOrder] =
    useState<PurchaseOrderDataType | null>(null);

  const findPurchaseOrderById = (_id: string) => {
    const result = allPurchaseList.find((order) => order._id === _id);
    setSelectedOrder(result || null); // Handle case when result is undefined
  };

  const [openDealer, setOpenDealer] = React.useState(true);
  const [openItems, setOpenItems] = React.useState(true);
  const [openDetails, setOpenDetails] = React.useState(true);

  return (
    <div style={{ padding: '20px' }}>
      <Drawer
        opened={opened}
        position="right"
        padding="sm"
        size="70vw"
        onClose={close}
        title={<Badge color="grape">ID: {selectedOrder?._id}</Badge>}
      >
        <ScrollArea h={'90vh'}>
          <List
            sx={{ width: '67vw', bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton onClick={() => setOpenDealer(!openDealer)}>
              <ListItemText primary="Dealer Details" />
              {openDealer ? (
                <IconCaretUpFilled color="#6082B6" stroke={2} />
              ) : (
                <IconCaretDownFilled color="#6082B6" stroke={2} />
              )}
            </ListItemButton>
            <Collapse
              sx={{ padding: '10px' }}
              in={openDealer}
              timeout="auto"
              unmountOnExit
            >
              <Card sx={{ padding: '10px' }}>
                <ScrollArea>
                  <Table withBorder withColumnBorders striped highlightOnHover>
                    <thead>
                      <tr>
                        <th>Dealer Name</th>
                        <th>Phone Number</th>
                        <th>Procurement Source</th>
                        <th>Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[selectedOrder].map((Order: any) => (
                        <tr>
                          <td>{Order?.dealerName}</td>
                          <td>{Order?.phoneNumber}</td>
                          <td>{Order?.procurementSource}</td>
                          <td>{Order?.remark}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </ScrollArea>
              </Card>
            </Collapse>
            <ListItemButton onClick={() => setOpenItems(!openItems)}>
              <ListItemText primary="Purchased Items" />
              {openItems ? (
                <IconCaretUpFilled color="#6082B6" stroke={2} />
              ) : (
                <IconCaretDownFilled color="#6082B6" stroke={2} />
              )}
            </ListItemButton>
            <Collapse
              sx={{ padding: '10px' }}
              in={openItems}
              timeout="auto"
              unmountOnExit
            >
              <Card sx={{ padding: '10px' }}>
                <ScrollArea>
                  <Table withBorder withColumnBorders striped highlightOnHover>
                    <thead>
                      <tr>
                        <th>SKU</th>
                        <th>Barcode</th>
                        <th>Item Name</th>
                        <th>Brand</th>
                        <th>Company</th>
                        <th>Category</th>
                        <th>Sub Category</th>
                        <th>New Item</th>
                        <th>Unit</th>
                        <th>Qty</th>
                        <th>Stock</th>
                        <th>Cost Price</th>
                        <th>Selling Price</th>
                        <th>MRP</th>
                        <th>Profit %</th>
                        <th>Expiry</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder?.purchasedItems?.map((item: any) => (
                        <tr key={item._id}>
                          <td>{item.sku}</td>
                          <td>{item.barcode}</td>
                          <td>{item.inputName}</td>
                          <td>{item.brand}</td>
                          <td>{item.companyName}</td>
                          <td>{item.category}</td>
                          <td>{item.subCategory}</td>
                          <td>
                            {item.newItem ? (
                              <Chip defaultChecked>New</Chip>
                            ) : (
                              '---'
                            )}
                          </td>
                          <td>{item.unit}</td>
                          <td>{item.itemQuantity}</td>
                          <td>{item.stockQuantity}</td>
                          <td>{item.costPrice}</td>
                          <td>{item.sellingPrice}</td>
                          <td>{item.mrp}</td>
                          <td>{item.profitPercentage}</td>
                          <td>
                            {' '}
                            <ItemExpiryTable
                              expiryDates={item.expiryDates}
                              onRemove={() =>
                                console.log('Function not implemented yet')
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </ScrollArea>
              </Card>
            </Collapse>
            <ListItemButton onClick={() => setOpenDetails(!openDetails)}>
              <ListItemText primary="Purchase Details" />
              {openDetails ? (
                <IconCaretUpFilled color="#6082B6" stroke={2} />
              ) : (
                <IconCaretDownFilled color="#6082B6" stroke={2} />
              )}
            </ListItemButton>
            <Collapse
              sx={{ padding: '10px' }}
              in={openDetails}
              timeout="auto"
              unmountOnExit
            >
              <Card sx={{ padding: '10px' }}>
                <ScrollArea>
                  <Table withBorder withColumnBorders striped highlightOnHover>
                    <thead>
                      <tr>
                        <th>Payment Type</th>
                        <th>Total Items Cost</th>
                        <th>Total Bill Amount</th>
                        <th>Total Payable Amount</th>
                        <th>Remark</th>
                        <th>Credits</th>
                        <th>Payments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[selectedOrder?.purchaseDetails].map((detail: any) => (
                        <tr>
                          <td>{detail?.paymentType}</td>
                          <td>{detail?.totalItemsCost}</td>
                          <td>{detail?.totalBillAmount}</td>
                          <td>{detail?.totalPayableAmount}</td>
                          <td>{detail?.remark}</td>
                          <td>
                            {' '}
                            <Table
                              withBorder
                              withColumnBorders
                              striped
                              highlightOnHover
                            >
                              <thead>
                                <tr>
                                  <th>Credit Amount</th>
                                  <th>Pay Date </th>
                                  <th>Credit Limit In Days</th>
                                  <th>Created At</th>
                                </tr>
                              </thead>
                              <tbody>
                                {detail?.credits.map((credit: any) => (
                                  <tr key={credit?._id}>
                                    <td>{credit?.creditAmount}</td>
                                    <td>{credit?.payDate}</td>
                                    <td>{credit?.creditLimitInDays}</td>
                                    <td>
                                      {new Date(
                                        credit.createdAt
                                      ).toLocaleDateString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </td>
                          <td>
                            {' '}
                            <Table
                              withBorder
                              withColumnBorders
                              striped
                              highlightOnHover
                            >
                              <thead>
                                <tr>
                                  <th>Payment Date</th>
                                  <th>PaidBy </th>
                                  <th>Paid Amount</th>
                                  <th>created At</th>
                                </tr>
                              </thead>
                              <tbody>
                                {detail?.payments.map((payment: any) => (
                                  <tr key={payment?._id}>
                                    <td>
                                      {new Date(
                                        payment?.paymentDate
                                      ).toLocaleDateString()}
                                    </td>
                                    <td>{payment?.paidBy}</td>
                                    <td>{payment?.paidAmount}</td>
                                    <td>
                                      {new Date(
                                        payment?.createdAt
                                      ).toLocaleDateString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </ScrollArea>
              </Card>
            </Collapse>
          </List>
        </ScrollArea>
      </Drawer>
      <DataTable
        columns={columns}
        data={allPurchaseList.map((row, idx) => {
          const metrics = getPODashboardMetrics(row.purchasedItems || []);

          const brandCompanyNames = [
            ...new Map(
              (row.purchasedItems || []).map((item: { brandId: { brandName: string; }; companyId: { companyName: string; }; }) => {
                const brand = item.brandId?.brandName || '';
                const company = item.companyId?.companyName || '';
                const key = `${brand}-${company}`;
                console.log({ key });
                
                return [key, { brand, company }];
              })
            ).values()
          ];
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
            brandCompanyNames,
            draftedAt: row.draftTime ? formatDateTime(row.draftTime) : 'N/A',
            approvedAt: row.approveTime ? formatDateTime(row.approveTime) : 'N/A',
            dateOnBill: row.dateOnBill
              ? formatDateTime(row.dateOnBill)
              : 'N/A',

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
