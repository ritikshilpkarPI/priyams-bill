import React, { useState } from 'react';
import './DealerDetailsForm.css';
import { Button, Container, Group, Stack, TextInput } from '@mantine/core';

export const DealerDetailsForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle the form submission (e.g., send data to the server)
    console.log('Form Data Submitted:', formData);
    // Reset the form after submission (optional)
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      company: '',
    });
  };

  return (
    <div className="dealer-details-form-container">
      <Container>
        <form className="dealer-details-form" onSubmit={handleSubmit}>
          <Stack spacing="md">
            <TextInput
              label="Dealer Name"
              name="name"
              value={formData.name}
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

            <TextInput
              label="Company Name"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </Stack>

          <Group position="right" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Container>
    </div>
  );
};
