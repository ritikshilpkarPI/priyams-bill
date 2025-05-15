import { useState } from 'react';
import { Button, Table, Text, Modal } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import access from '../access';
import { genericAxios } from '../utils/genericAxiosMethod';
import { API_PATHS } from '../utils/constants/apiPaths';
import { API_METHODS } from '../utils/constants/apiMethods';
import DataGrid from './DataTable';
import { formatShortDate } from '../utils/formatDate';
import { parseJwt } from 'src/utils/cookie';
import Cookies from 'js-cookie';
import { formatToISTTime } from '../utils/dateAndTime/formatToISTTime';

const BillFeed = ({
  fromDayWise = false,
  bills = [],
  isLoading = false,
  totalBillCount,
  setPagination,
  pagination,
}) => {
  const [expandDetails, setExpandDetails] = useState();
  const [paginationState, setPaginationState] = useState(
    pagination ?? {
      page: 1,
      pageSize: 10,
    }
  );
  const { role: userRole = '' } = parseJwt(Cookies.get('token'));
  const hasAccess = (role) => role?.includes(userRole);
  let navigate = useNavigate();
  function handleClick(id) {
    navigate(`/edit/${id}`);
  }

  async function handleDeleteBill(id) {
    await genericAxios({
      url: API_PATHS.BILLING.DELETE_BILL,
      method: API_METHODS.DELETE,
      data: {
        id: id,
      },
      headers: {
        Cookie: '',
      },
    });
  }
  const sendCustomerMessage = async (id) => {
    await genericAxios({
      url: API_PATHS.BILLING.POST_SEND_MESSAGE,
      method: API_METHODS.POST,
      data: {
        id: id,
      },
      headers: {
        Cookie: '',
      },
    });
  };
  const sendBill = (bill) => {
    const link = `${window.location.origin}/showbill/${bill._id}`;
    const number = bill.customerPhone;
    const message = `Hello, ${
      bill.customerName
    } this is your bill for your purchase at Priyam Stores on ${new Date(
      bill.createdAt
    ).toLocaleString()}.
    Please view your bill by clicking on the link below:
    ${link}`;
    // Appending the phone number to the URL
    let url = `https://web.whatsapp.com/send?phone=+91${number}`;

    // Appending the message to the URL by encoding it
    url += `&text=${encodeURI(message)}&app_absent=0`;

    // Open our newly created URL in a new tab to send the message
    window.open(url);

    sendCustomerMessage(bill._id);
  };

  const columns = [
    { label: 'Sl.No.', key: 'serialNo', sortable: true },
    { label: 'Customer Name', key: 'customerName', sortable: true },
    { label: 'Customer Phone', key: 'customerPhone', sortable: true },
    { label: 'Total Amount', key: 'billAmountTotal', sortable: true },
    { label: 'MRP Total Amount', key: 'billMRPTotal', sortable: true },
    { label: 'Cash Paid', key: 'cashPay', sortable: true },
    { label: 'UPI Paid', key: 'upiPay', sortable: true },
    { label: 'Amount Return', key: 'amountReturn', sortable: true },
    { label: 'Total Items', key: 'totalNumberOfItems', sortable: true },
    { label: 'Quantity', key: 'totalNumberOfUniqueItems', sortable: true },
    hasAccess(access.BILL_PROFIT_ROW)
      ? { label: 'Profit', key: 'totalBillProfit', sortable: true }
      : null,
    { label: 'Discount', key: 'billDiscountTotal', sortable: true },
    { label: 'Date', key: 'createdAt', sortable: true },
    { label: 'Time', key: 'createdTime', sortable: true },
    { label: 'Created By', key: 'billCreatedBy', sortable: true },
    {
      label: 'Whatsapp Bill',
      key: 'sendBill',
      render: (row) => (
        <Button
          color={row.messageSend ? 'blue' : 'green'}
          disabled={row.customerPhone && row.customerName ? false : true}
          onClick={() => sendBill(row)}
        >
          Send Bill
        </Button>
      ),
      sortable: false,
    },
    {
      label: 'Items',
      key: 'editItem',
      render: (row) => (
        <Button onClick={() => handleClick(row._id)}>Edit Bill</Button>
      ),
      sortable: false,
    },
    hasAccess(access.BILL_PROFIT_ROW)
      ? {
          label: 'Delete Bill',
          key: 'deleteBill',
          render: (row) => (
            <Button onClick={() => handleDeleteBill(row['_id'])}>
              Delete Bill
            </Button>
          ),
          sortable: false,
        }
      : null,
  ].filter(Boolean);

  const rows = bills.map((bill, idx) => ({
    ...bill,
    serialNo: idx + 1,
    createdAt: formatShortDate(bill['createdAt'] || ''),
    createdTime: formatToISTTime(bill['createdAt'] || ''),
    billDiscountTotal: bill['billDiscountTotal']?.toFixed(2),
    totalNumberOfUniqueItems: bill['totalNumberOfUniqueItems'] || 0,
    amountReturn: bill['amountReturn']?.toFixed(2),
    upiPay: bill['upiPay']?.toFixed(2),
    cashPay: bill['cashPay']?.toFixed(2),
    billMRPTotal: bill['billMRPTotal']?.toFixed(2),
    billAmountTotal: bill['billAmountTotal']?.toFixed(2),
    customerPhone: bill['customerPhone'] || '-',
    customerName: bill['customerName'] || '-',
    totalBillProfit: bill['totalBillProfit']?.toFixed(2),
    billCreatedBy:
      bill['staffId']?.name ||
      bill['staffId']?.username ||
      bill['staffInfo']?.name ||
      bill['staffInfo']?.username ||
      'N/A',
  }));

  const handlePageChange = (_, page) => {
    const callBack = (prev) => ({ ...prev, page });
    pagination ? setPagination(callBack) : setPaginationState(callBack);
  };

  const handleRowsPerPageChange = (e) => {
    const callBack = (prev) => ({
      ...prev,
      pageSize: parseInt(e.target.value.toString(), 10),
    });
    pagination ? setPagination(callBack) : setPaginationState(callBack);
  };

  const rowCount = totalBillCount ? totalBillCount : bills.length;

  const onRowClick = (t) => {
    const id = t.id;
    setExpandDetails(id);
  };

  return (
    <>
      <DataGrid
        columns={columns}
        data={rows}
        isLoading={isLoading}
        order={'asc'}
        orderBy={'createdAt'}
        page={paginationState.page}
        rowsPerPage={paginationState.pageSize}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowCount={rowCount}
        paginationMode={fromDayWise ? 'client' : 'server'}
        onRowClick={onRowClick}
      />
      {!fromDayWise && (
        <Modal
          onClose={() => setExpandDetails('')}
          opened={Boolean(expandDetails)}
          centered
        >
          <ItemTable bill={rows.find((r) => r._id === expandDetails)} />
        </Modal>
      )}
    </>
  );
};

const ItemTable = ({ bill }) => {
  return (
    <Table striped highlightOnHover>
      <thead className="heading">
        <tr>
          <th>
            <Text>Sl. No.</Text>
          </th>
          <th>
            <Text>Name</Text>
          </th>
          <th>
            <Text>Quantity</Text>
          </th>
          <th>
            <Text>MRP</Text>
          </th>
          <th>
            <Text>Total Amount</Text>
          </th>
        </tr>
      </thead>
      <tbody className="body">
        {bill?.items?.length &&
          bill?.items.map((billItemObj, idx) => {
            return (
              <tr key={idx}>
                <td>
                  <Text color="black" weight={500}>
                    {idx + 1}
                  </Text>
                </td>
                <td>
                  <Text color="black" weight={500}>
                    {billItemObj?.itemDetail?.itemName || 'Item name not found'}
                  </Text>
                </td>
                <td>
                  <Text color="black" weight={500}>
                    {billItemObj?.itemQuantityInBill}
                  </Text>
                </td>
                <td>
                  <Text color="black" weight={500}>
                    {billItemObj?.itemMRPtotal}
                  </Text>
                </td>
                <td>
                  <Text color="black" weight={500}>
                    {billItemObj?.itemSellingPriceTotal}
                  </Text>
                </td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
};

export default BillFeed;
