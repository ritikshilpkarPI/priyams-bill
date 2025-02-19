import React, { useState } from 'react';
import Joi from 'joi';
import {
  TextInput,
  NumberInput,
  Select,
  Textarea,
  Button,
  Grid,
  Col,
  Container,
  Box,
} from '@mantine/core';
import { selectDealerDetailForm } from 'src/redux/dealerDetailForm/dealerDetailFormSelectors';
import { useSelector, useDispatch } from 'react-redux';
import { setDealerFormData } from 'src/redux/dealerDetailForm/dealerDetailFormSlice';

export const DealerDetailForm: React.FC<DealerDetailsFormProps> = ({
  onSubmit
}) => {
  const dispatch = useDispatch();
  const dealerFormData = useSelector(selectDealerDetailForm);
  const [errors, setErrors] = useState<any>({});

  const formValidationSchema = Joi.object({
    paymentType: Joi.string().valid('Fully Paid', 'Partially Paid', 'Credit'),
    billAmount: Joi.number().min(1).required().messages({
      'any.required': 'Bill amount is required.',
      'number.min': 'Bill amount must be greater than 0.',
    }),
    procurementSource: Joi.string().valid('Walmart', 'D Mart', 'City', 'Distributor'),
    dealerName: Joi.string().required().messages({
      'string.empty': 'Dealer name is required.',
    }),
    mobileNumber: Joi.string().pattern(/^\d{10}$/, 'Mobile number').required().messages({
      'string.empty': 'Mobile number is required.',
      'string.pattern.name': 'Mobile number must be exactly 10 digits.',
    }),
    remarks: Joi.string().optional(),
  });

  const onChange = (field: string, value: string | number) => {
    dispatch(setDealerFormData({
      [field]: value,
    }));
  }

  const handleSubmit = () => {
    const { error } = formValidationSchema.validate(dealerFormData, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.reduce((acc: any, err: any) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});

      return setErrors(errorMessages);
    }
    onSubmit(dealerFormData);
  }

  return (
    <Container size="xs" mt="lg">
      <Box>
        <Grid gutter="md">

          <Col span={12}>
            <TextInput
              label="Dealer Name"
              value={dealerFormData.dealerName}
              onChange={(event) => onChange('dealerName', event.currentTarget.value)}
              required
              error={errors.dealerName}
              placeholder="Enter dealer name"
            />
          </Col>

          <Col span={12}>
            <TextInput
              label="Mobile Number"
              value={dealerFormData.mobileNumber}
              onChange={(event) => onChange('mobileNumber', event.currentTarget.value.replace(/[^0-9]/g
, ""))}
              required
              error={errors.mobileNumber}
              placeholder="Enter mobile number"
              maxLength={10}
            />
          </Col>

          <Col span={12}>
            <NumberInput
              label="Bill Amount"
              value={dealerFormData.billAmount}
              onChange={(value) => onChange('billAmount', value || 0)}
              required
              min={1}
              placeholder="Enter bill amount"
              error={errors.billAmount}
            />
          </Col>

          <Col span={12}>
            <Select
                label="Payment Type"
                data={['Fully Paid', 'Partially Paid', 'Credit']}
                value={dealerFormData.paymentType}
                onChange={(value) => onChange('paymentType', value!)}
              />
          </Col>

          <Col span={12}>
            <Select
              label="Procurement Source"
              data={['Walmart', 'D Mart', 'City', 'Distributor']}
              value={dealerFormData.procurementSource}
              onChange={(value) => onChange('procurementSource', value!)}
            />
          </Col>
          <Col span={12}>
            <Textarea
              label="Remarks"
              value={dealerFormData.remarks}
              onChange={(event) => onChange('remarks', event.currentTarget.value)}
              placeholder="Enter any remarks"
            />
          </Col>

          <Col span={12}>
            <Button onClick={handleSubmit} type="submit" fullWidth mt="lg">
              Save
            </Button>
          </Col>
        </Grid>
      </Box>
    </Container>
  );
};
