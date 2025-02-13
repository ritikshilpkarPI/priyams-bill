import {
  Paper,
  Text,
  Button,
  Alert,
  Input,
  Input,
} from '@mantine/core';
import './PaymentSection.css'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { isLoading as isloading } from 'src/redux/allItemsFeedData/allItemsFeedDataSelector';

export const PaymentSection = ({
  cashPay,
  upiPay,
  amountReturn,
  totalAmount,
  onPaymentChange,
  onSubmit,
  isLoading
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
  };  const loading = useSelector(isloading);
  useEffect(() => {
    setSaveBillButtonDisabled(totalAmount > (cashPay + upiPay) || totalAmount === 0);
  }, [cashPay, upiPay, totalAmount]);
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
            <span className="amount-label">Total Amount:</span>
            <span className="amount-value">₹{totalAmount}</span>
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {amountReturn > 0 && (
          <Alert color="orange" mb="md">
            Return Amount: ₹{amountReturn}
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