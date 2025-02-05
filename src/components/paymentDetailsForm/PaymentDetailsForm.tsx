import React from 'react';
import {
  Autocomplete,
  Container,
  Paper,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import './PaymentDetailsForm.css';
const PaymentDetailsForm = () => {
  const form = useForm({
    initialValues: {
      totalAmount: '',
      paymentType: '',
      paidAmount: '',
      paidBy: '',
      pendingAmount: '',
      nextPaymentDate: null,
    },
    validate: {
      totalAmount: (value: string): string | null =>
        value &&
        Number(value) ===
          Number(form.values.paidAmount) + Number(form.values.pendingAmount)
          ? null
          : 'Total Amount must be equal to Paid Amount + Pending Amount',
      paymentType: (value) => (value ? null : 'Payment Type is required'),
      paidAmount: (value) => (value ? null : 'Paid Amount is required'),
      paidBy: (value) => (value ? null : 'Payment Method is required'),
      pendingAmount: (value) => (value ? null : 'Pending Amount is required'),
    },
  });
  return (
    <div>
      <Container className="payment-details-form-container" size="xs" p="xs">
        <Paper shadow="sm" p="md" radius="md">
          <Title order={3} align="center" mb="md">
            Payment Details
          </Title>
          <form action="">
            <Stack spacing="md">
              <TextInput
                required
                className="payment-details-form-input"
                label="Total Amount"
                placeholder="Enter total amount"
                {...form.getInputProps('totalAmount')}
              />
              <Autocomplete
                required
                label="Payment Type"
                className="payment-details-form-input"
                placeholder="Pick payment type"
                data={['Fully Paid', 'Partially Paid', 'Credit']}
                {...form.getInputProps('paymentType')}
              />
              <TextInput
                required={form.values.paymentType !== 'Credit'}
                className="payment-details-form-input"
                label="Paid Amount"
                placeholder="Enter paid amount"
                {...form.getInputProps('paidAmount')}
              />
              <Autocomplete
                required={form.values.paymentType !== 'Credit'}
                disabled={form.values.paymentType === 'Credit'}
                label="Paid by"
                className="payment-details-form-input"
                placeholder="Pick paid method"
                data={['Cash', 'UPI', 'NEFT']}
                {...form.getInputProps('paidBy')}
              />
              <TextInput
                className="payment-details-form-input"
                label="Pending Amount"
                placeholder="Enter pending amount"
                value={
                  form.values.totalAmount && form.values.paidAmount
                    ? (
                        Number(form.values.totalAmount) -
                        Number(form.values.paidAmount)
                      ).toString()
                    : ''
                }
                readOnly
              />
              <DatePicker
                disabled={
                  Number(form.values.totalAmount) ===
                  Number(form.values.paidAmount) +
                    Number(form.values.pendingAmount)
                }
                className="payment-details-form-input"
                label="Next Payment Date"
                placeholder="Pick date"
                minDate={new Date()}
                {...form.getInputProps('nextPaymentDate')}
              />
            </Stack>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default PaymentDetailsForm;
