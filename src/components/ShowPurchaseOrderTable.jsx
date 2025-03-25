import React from 'react';
import { Flex, Image, Table } from '@mantine/core';
import { convertDateToISO } from 'src/utils/convertDateToISO';
import { CONSTANTS } from 'src/constants/constants';
const ShowPurchaseOrderTable = ({ purchaseList }) => {

  return (
    <Table withColumnBorders striped withBorder>
      <thead>
        <tr>
          <th>Total Bill Amount</th>
          <th>Total Payable Amount</th>
          <th>Payment Type</th>
          <th>Credits</th>
          <th>Payments</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{purchaseList?.purchaseDetails?.totalBillAmount || 'N/A'}</td>
          <td>{purchaseList?.purchaseDetails?.totalPayableAmount || 'N/A'}</td>
          <td>{purchaseList?.purchaseDetails?.paymentType || 'N/A'}</td>
          <td>
            {purchaseList?.purchaseDetails?.credits?.length ? (
              <Table withColumnBorders striped withBorder>
                <thead>
                  <tr>
                    <th>Created At</th>
                    <th>Credit Amount</th>
                    <th>Credit Limit In Days</th>
                    <th>Pay Date</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseList.purchaseDetails.credits.map((credit, index) => (
                    <tr key={index}>
                      <td>{convertDateToISO(credit.createdAt)}</td>
                      <td>{credit.creditAmount || 'N/A'}</td>
                      <td>{credit.creditLimitInDays || 'N/A'}</td>
                      <td>{credit.payDate || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              `${CONSTANTS.NO_CREDITS_AVAILABLE}`
            )}
          </td>
          <td>
            {purchaseList?.purchaseDetails?.payments?.length ? (
              <Table withColumnBorders striped withBorder>
                <thead>
                  <tr>
                    <th>Created At</th>
                    <th>Paid Amount</th>
                    <th>Paid By</th>
                    <th>Payment Date</th>
                    <th>Payment Image</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseList.purchaseDetails.payments.map(
                    (payment, index) => (
                      <tr key={index}>
                        <td>{convertDateToISO(payment.createdAt)}</td>
                        <td>{payment.paidAmount || 'N/A'}</td>
                        <td>{payment.paidBy || 'N/A'}</td>
                        <td>{convertDateToISO(payment.paymentDate) || 'N/A'}</td>
                        <td>
                          <Flex gap={10}>
                            {payment.paymentImgURL?.length
                              ? payment.paymentImgURL.map((img, imgIndex) => (
                                  <Image
                                    key={imgIndex}
                                    src={img.secure_url}
                                    alt={`Payment Image ${imgIndex + 1}`}
                                    width={100}
                                    height={100}
                                    radius="sm"
                                  />
                                ))
                              : `${CONSTANTS.NO_IMAGE_AVAILABLE}`}
                          </Flex>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
            ) : (
              `${CONSTANTS.NO_PAYMENTS_AVAILABLE}`
            )}
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default ShowPurchaseOrderTable;
