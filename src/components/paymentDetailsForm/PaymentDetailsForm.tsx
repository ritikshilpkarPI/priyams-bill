import React, { useState } from 'react';
import {
  TextInput,
  NumberInput,
  Button,
  Group,
  Container,
  Select,
  Stack,
} from '@mantine/core';
// import './PaymentDetailsForm.css';

export const PaymentDetailsForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    paymentMethod: 'Cash',
    cashAmount: 0,
    chequeDetails: '',
    upiId: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData({ ...formData, paymentMethod: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="payment-details-form">
      <Container>
        <form onSubmit={handleSubmit}>
          <Stack spacing="md">
            <TextInput
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <TextInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <TextInput
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <Select
              label="Payment Method"
              value={formData.paymentMethod}
              onChange={handlePaymentMethodChange}
              data={['Cash', 'Cheque', 'UPI']}
              required
            />

            {formData.paymentMethod === 'Cash' && (
              <NumberInput
                label="Cash Amount"
                name="cashAmount"
                value={formData.cashAmount}
                onChange={(val) =>
                  setFormData({ ...formData, cashAmount: val || 0 })
                }
                min={0}
                required
              />
            )}

            {formData.paymentMethod === 'Cheque' && (
              <TextInput
                label="Cheque Details"
                name="chequeDetails"
                value={formData.chequeDetails}
                onChange={handleChange}
                required
              />
            )}

            {formData.paymentMethod === 'UPI' && (
              <TextInput
                label="UPI ID"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                required
              />
            )}
          </Stack>

          <Group position="right" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Container>
    </div>
  );
};
