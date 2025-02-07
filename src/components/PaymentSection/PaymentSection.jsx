import {
  Paper,
  Text,
  Input,
  Button,
  Alert,
} from '@mantine/core';
import './PaymentSection.css'

export const PaymentSection = ({
  cashPay,
  upiPay,
  amountReturn,
  totalAmount,
  onPaymentChange,
  onSubmit,
  isLoading
}) => {
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
            <Input
              label="Cash Payment"
              type="number"
              value={cashPay}
              onChange={(e) => onPaymentChange('cashPay', e.target.value)}
              mb="sm"
              min={0}
            />
          </div>
          <div className="upi-input">
            <Text size="lg" weight={700} mb="md" className="upi-paid-text">
              UPI Paid
            </Text>
            <Input
              label="UPI Payment"
              type="number"
              value={upiPay}
              onChange={(e) => onPaymentChange('upiPay', e.target.value)}
              mb="sm"
              min={0}
            />
          </div>
        </div>

        {amountReturn > 0 && (
          <Alert color="orange" mb="md">
            Return Amount: ₹{amountReturn}
          </Alert>
        )}


        <Button
          fullWidth
          className='pay-print-button'
          onClick={onSubmit}
          loading={isLoading}
          disabled={totalAmount > (cashPay + upiPay) || totalAmount === 0}
        >
          Save and print
        </Button>
      </Paper>
    </div>
  );
};