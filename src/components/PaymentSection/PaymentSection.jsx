import {
  Paper,
  Text,
  Button,
  NumberInput,
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
              <NumberInput
                value={cashPay === 0 ? null : cashPay} 
                placeholder="0"
                onChange={(value) => onPaymentChange('cashPay', value ?? 0)}
                min={0}
                mb="sm"
                className="payment-input-with-icon"
                allowDecimal={false} 
                allowNegative={false} 
                parser={(value) => value.replace(/\D/g, '')} 
                formatter={(value) => value.replace(/\D/g, '')} 
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
              <NumberInput
                value={upiPay === 0 ? null : upiPay}
                placeholder="0"
                onChange={(value) => onPaymentChange("upiPay", value ?? 0)}
                min={0}
                mb="sm"
                className="payment-input-with-icon"
                allowDecimal={false} 
                allowNegative={false} 
                parser={(value) => value.replace(/\D/g, '')} 
                formatter={(value) => value.replace(/\D/g, '')} 
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