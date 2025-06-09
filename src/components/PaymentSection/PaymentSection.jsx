import {
  Paper,
  Text,
  Button,
  Alert,
  Input,
  Box,
} from '@mantine/core';
import './PaymentSection.css'
import { useEffect, useState } from 'react';
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
  const loading = useSelector(itemsFeedAPILoading);

    // Determine display label and value based on refund and total amount:
  const { displayLabel, displayValue, className } = (() => {
    if (totalAmount < refundAmount) {
      return { displayLabel: "Refund Amount", displayValue: refundAmount - totalAmount, className: "text-red" };
    } else {
      return { displayLabel: "Total Amount", displayValue: totalAmount - refundAmount , className: "text-blue"};
    }
  })();

  useEffect(() => {
    // If a refund is provided, always enable the save button.
    const isRefund = refundAmount > 0;
    const isTotalNotPaid = totalAmount > (cashPay + upiPay);
    const isTotalNotValid = totalAmount === 0;
    const isStaffSelected = Boolean(staffId);
    const shouldDisableButton = isTotalNotPaid || isTotalNotValid || !isStaffSelected
    if ( isRefund ) {
      setSaveBillButtonDisabled(false);
    } else {
      setSaveBillButtonDisabled(shouldDisableButton);
    }
  }, [cashPay, upiPay, totalAmount, refundAmount, staffId]);

  
  const amountTobeReturned = (refundAmount + upiPay + cashPay) - totalAmount;
  
  return (
    <div className="payment-section">
      <Paper p="md" radius="md" withBorder>
        <Text size="lg" weight={500} mb="md" className="payment-details-text">
          Payment Details
        </Text>

        <div className="amount-display">
          <Text
            size="xl"
            weight={700}
            color="blue"
            className="amount-display-text"
          >
            <span className={`amount-label ${className}`}>{displayLabel}:</span>
            <span className={`amount-value ${className}`}>₹{displayValue}</span>
          </Text>
        </div>

        <div className="payment-inputs">
          <div className="cash-input">
            <Text size="lg" weight={700} mb="md" className="cash-paid-text">
              Cash Paid
            </Text>
            <div className="payment-input-wrapper">
              <img
                src="/images/cash.svg"
                alt="Cash Icon"
                className="payment-input-icon"
                height={20}
                width={20}
              />
              <Input
                label="Cash Payment"
                type="number"
                value={cashPay === 0 ? '' : cashPay}
                onChange={(e) => handlePaymentInputChange(e, "cashPay")}
                onKeyDown={handleKeyDown}
                mb="sm"
                min={0}
                placeholder="0"
                className="payment-input-with-icon"
                disabled={loading || totalAmount <= refundAmount || totalAmount === 0}
              />
            </div>
          </div>

          <div className="upi-input">
            <Text size="lg" weight={700} mb="md" className="upi-paid-text">
              UPI Paid
            </Text>
            <div className="payment-input-wrapper">
              <img
                src="/images/upi.svg"
                alt="Upi Icon"
                className="payment-input-icon"
                height={20}
                width={25}
              />
              <Input
                label="Upi Payment"
                type="number"
                value={upiPay === 0 ? '' : upiPay}
                onChange={(e) => handlePaymentInputChange(e, "upiPay")}
                onKeyDown={handleKeyDown}
                mb="sm"
                min={0}
                placeholder="0"
                className="payment-input-with-icon"
                disabled={loading || totalAmount <= refundAmount || totalAmount === 0}
              />
            </div>
          </div>
          <Box mb="sm" className='staff-input'>
            <Text size="lg" weight={700} mb="md" className="staff-paid-text">
              Staff Name
            </Text>
            <StaffSelectDropdown 
              onChange={(value) => handleStaffChange(value)}
              selectedStaffId={staffId}
              disabled={loading || totalAmount <= refundAmount || totalAmount === 0}
            />
          </Box>
        </div>

        {amountTobeReturned > 0 && (
          <Alert color="orange" mb="md">
            Return Amount: ₹{amountTobeReturned}
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