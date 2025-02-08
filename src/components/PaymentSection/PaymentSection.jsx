import {
  Paper,
  Text,
  Input,
  Button,
  Alert,
} from '@mantine/core';
import './PaymentSection.css'
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    setSaveBillButtonDisabled(totalAmount > (cashPay + upiPay) || totalAmount === 0);
  }, [cashPay, upiPay, totalAmount]);
  return (
    <div className="payment-section">
      <Paper p="md" radius="md" withBorder>
        <Text size="lg" weight={500} mb="md">Payment Details</Text>

        <div className="amount-display">
          <Text size="xl" weight={700} color="blue">
            Total Amount: ₹{totalAmount}
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
                value={cashPay}
                onChange={(e) => onPaymentChange('cashPay', e.target.value)}
                mb="sm"
                min={0}
                className="payment-input-with-icon"
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
                label="UPI Payment"
                type="number"
                value={upiPay}
                onChange={(e) => onPaymentChange('upiPay', e.target.value)}
                mb="sm"
                min={0}
                className="payment-input-with-icon"
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
          Complete Payment
        </Button>
      </Paper>
    </div>
  );
};