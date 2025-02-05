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
      paidMethod: '',
      pendingAmount: '',
      nextPaymentDate: null,
      paymentTypes: ["Fully Paid", "Partially Paid", "Credit"],
      paidmethods: ["Cash", "UPI", "NEFT"],
    },
    validate: {
      totalAmount: (value, values) =>
        value && Number(value) === Number(values.paidAmount) + Number(values.pendingAmount)
          ? null
          : "Total Amount must be equal to Paid Amount + Pending Amount",
      paymentType: (value) => (value ? null : "Payment Type is required"),
      paidAmount: (value, values) => (values.paymentType === "Credit" || value ? null : "Paid Amount is required"),
      paidMethod: (value) => (value ? null : "Payment Method is required"),
      pendingAmount: (value) => (value ? null : "Pending Amount is required"),
    },
  });
  return (
    <div>
      <Container className="payment-details-form-container" size="xs" p="xs">
        <Paper shadow="sm" p="md" radius="md">
          <Title order={3} align="center" mb="md">
            Payment Details
          </Title>
          <form>
            <Stack spacing="md">
              <TextInput
                label="Total Amount"
                placeholder="Enter total amount"
                withAsterisk
                {...form.getInputProps("totalAmount")}
                className="payment-details-form-input"
              />

              <Autocomplete
                label="Payment Type"
                placeholder="Pick payment type"
                withAsterisk
                data={form.values.paymentTypes}
                {...form.getInputProps("paymentType")}
                className="payment-details-form-input"
              />

              <TextInput
                label="Paid Amount"
                placeholder="Enter paid amount"
                withAsterisk={form.values.paymentType !== "Credit"}
                {...form.getInputProps("paidAmount")}
                className="payment-details-form-input"
              />

              <Autocomplete
                label="Paid method"
                placeholder="Pick payment method"
                data={form.values.paidmethods}
                disabled={form.values.paymentType === "Credit"}
                {...form.getInputProps("paidMethod")}
                className="payment-details-form-input"
                withAsterisk = {form.values.paymentType !== "Credit"}
              />

              <TextInput
                label="Pending Amount"
                placeholder="Auto calculated"
                readOnly
                value={
                  form.values.totalAmount
                    ? (Number(form.values.totalAmount) - Number(form.values.paidAmount)).toString()
                    : ""
                }
                className="payment-details-form-input"
              />

              <DatePicker
                label="Next Payment Date"
                placeholder="Pick date"
                disabled={
                  Number(form.values.totalAmount) ===
                  Number(form.values.paidAmount) + Number(form.values.pendingAmount)
                }
                minDate={new Date()}
                {...form.getInputProps("nextPaymentDate")}
                className="payment-details-form-input"
                withAsterisk = {form.values.paymentType !== "Fully Paid"}
              />
            </Stack>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default PaymentDetailsForm;
