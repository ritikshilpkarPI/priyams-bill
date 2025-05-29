import React, { useEffect, useState } from 'react';
import {
  Paper,
  Text,
  Button,
  Alert,
  Input,
  Box,
} from '@mantine/core';
import './PaymentSection.css';
import { useSelector } from 'react-redux';
import { itemsFeedAPILoading } from 'src/redux/allItemsFeedData/allItemsFeedDataSelector';
import StaffSelectDropdown from '../staffSelectDropdown/StaffSelectDropdown';

export const PaymentSection = ({
  cashPay,
  upiPay,
  amountReturn,
  totalAmount,
  onPaymentChange,
  onSubmit,
  isLoading,
  refundAmount = 0,
  handleStaffChange,
  staffId,
}) => {
  const [saveBillButtonDisabled, setSaveBillButtonDisabled] = useState(false);
  const loading = useSelector(itemsFeedAPILoading);
  const handlePaymentInputChange = (e, field) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      onPaymentChange(field, Number(value));
    }
  };
  const handleKeyDown = (e) => {
    if (['e', 'E', '-', '+', '.'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const { displayLabel, displayValue, amountClass } = (() => {
    if (totalAmount < refundAmount) {
      return {
        displayLabel: 'Refund Amount',
        displayValue: refundAmount - totalAmount,
        amountClass: 'text-error',
      };
    } else {
      return {
        displayLabel: 'Total Amount',
        displayValue: totalAmount - refundAmount,
        amountClass: 'text-primary',
      };
    }
  })();

  useEffect(() => {
    const isRefund = refundAmount > 0;
    const isUnderpaid = totalAmount > cashPay + upiPay;
    const isZeroTotal = totalAmount === 0;
    const staffSelected = Boolean(staffId);

    const disable = !isRefund && (isUnderpaid || isZeroTotal || !staffSelected);
    setSaveBillButtonDisabled(disable);
  }, [cashPay, upiPay, totalAmount, refundAmount, staffId]);

  const amountToReturn = cashPay + upiPay - totalAmount + refundAmount;

  return (
    <div className="payment-section">
      <Paper p="md" radius="md" withBorder className="payment-paper">
        <Text size="lg" weight={500} mb="md" className="payment-details-text">
          Payment Details
        </Text>

        <div className="amount-display">
          <Text size="xl" weight={700} className="amount-display-text">
            <span className={`amount-label ${amountClass}`}>
              {displayLabel}:
            </span>
            <span className={`amount-value ${amountClass}`}>
              ₹{displayValue}
            </span>
          </Text>
        </div>

        <div className="payment-inputs">
          <div className="payment-field">
            <Text size="md" weight={600} className="field-label">
              Cash Paid
            </Text>
            <div className="payment-input-wrapper">
              <img
                src="/images/cash.svg"
                alt="Cash"
                className="payment-input-icon"
              />
              <Input
                type="number"
                value={cashPay === 0 ? '' : cashPay}
                onChange={(e) => handlePaymentInputChange(e, 'cashPay')}
                onKeyDown={handleKeyDown}
                placeholder="0"
                className="payment-input-with-icon"
                disabled={
                  loading || totalAmount <= refundAmount || totalAmount === 0
                }
              />
            </div>
          </div>

          <div className="payment-field">
            <Text size="md" weight={600} className="field-label">
              UPI Paid
            </Text>
            <div className="payment-input-wrapper">
              <img
                src="/images/upi.svg"
                alt="UPI"
                className="payment-input-icon"
              />
              <Input
                type="number"
                value={upiPay === 0 ? '' : upiPay}
                onChange={(e) => handlePaymentInputChange(e, 'upiPay')}
                onKeyDown={handleKeyDown}
                placeholder="0"
                className="payment-input-with-icon"
                disabled={
                  loading || totalAmount <= refundAmount || totalAmount === 0
                }
              />
            </div>
          </div>

          <Box className="payment-field staff-field">
            <Text size="md" weight={600} className="field-label">
              Staff Name
            </Text>
            <StaffSelectDropdown
              onChange={handleStaffChange}
              selectedStaffId={staffId}
              disabled={
                loading || totalAmount <= refundAmount || totalAmount === 0
              }
            />
          </Box>
        </div>

        {amountToReturn > 0 && (
          <Alert mb="md" className="return-alert">
            Return Amount: ₹{amountToReturn}
          </Alert>
        )}

        <Button
          fullWidth
          className="pay-print-button"
          onClick={onSubmit}
          loading={isLoading}
          disabled={saveBillButtonDisabled}
        >
          Save and Print
        </Button>
      </Paper>
    </div>
  );
};