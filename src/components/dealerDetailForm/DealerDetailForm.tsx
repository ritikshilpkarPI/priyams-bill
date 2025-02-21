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
  Flex,
  Title,
} from '@mantine/core';
import { selectDealerDetailForm } from '../../redux/dealerDetailForm/dealerDetailFormSelectors';
import { useSelector, useDispatch } from 'react-redux';
import { setDealerFormData } from '../../redux/dealerDetailForm/dealerDetailFormSlice';
import { addNewOrderAPI, updateOrderDetailsAPI } from '../../utils/apiUtils';
import { selectPurchaseOrder } from 'src/redux/purchaseOrder/purchaseOrderSelectors';

export const DealerDetailForm: React.FC = () => {
  const dispatch = useDispatch();
  const dealerFormData = useSelector(selectDealerDetailForm);
  const purchaseOrder = useSelector(selectPurchaseOrder);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [isDealerDetailsSaved, setIsDealerDetailsSaved] = useState(Boolean(purchaseOrder._id));

  const formValidationSchema = Joi.object({
    payment: Joi.string().valid('Fully Paid', 'Partially Paid', 'Credit'),
    billAmount: Joi.number().min(1).required().messages({
      'any.required': 'Bill amount is required.',
      'number.min': 'Bill amount must be greater than 0.',
    }),
    procurementSource: Joi.string().valid('Walmart', 'D Mart', 'City', 'Distributor'),
    dealerName: Joi.string().required().messages({
      'string.empty': 'Dealer name is required.',
    }),
    phoneNumber: Joi.string().pattern(/^\d{10}$/, 'Phone number').required().messages({
      'string.empty': 'Phone number is required.',
      'string.pattern.name': 'Phone number must be exactly 10 digits.',
    }),
    remark: Joi.string().optional(),
  });

  const onChange = (field: string, value: string | number) => {
    setIsDealerDetailsSaved(false);
    dispatch(setDealerFormData({
      [field]: value,
    }));
  }

  const addNewOrder = async () => {
    setLoading(true);
    const response = await addNewOrderAPI({
      new_order: { 
        purchaseObj: { 
          ...purchaseOrder, 
          ...dealerFormData, 
          orders: purchaseOrder.purchasedItems,
      } },
    })
    setLoading(false);
    if(response.isError) return;
    setIsDealerDetailsSaved(true);
  }

  const updateOrder = async () => {
    setLoading(true);
    const response = await updateOrderDetailsAPI({
      new_order: { 
        purchaseObj: {
          details: [],
          bills: [],
          orders: purchaseOrder.purchasedItems,
          ...purchaseOrder,
          ...dealerFormData,
          id: purchaseOrder._id
        } 
      },
      deleteBills: [],
      uploadedImages: []
    });
    setLoading(false);
    if(response.isError) return;
    setIsDealerDetailsSaved(true);
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
    if(purchaseOrder._id) return updateOrder();
    return addNewOrder();
  }

  return (
    <Flex mt="lg" mx="sm" align="center" justify="center" gap="16px" direction="column">
      <Flex direction="column" gap="16px" sx={{ border: "1px solid grey", padding: "16px", borderRadius: "8px", textAlign: "left", width: "fit-content" }}>
        <Title order={3}>
           Dealer Details Form
        </Title>
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
              label="Phone Number"
              value={dealerFormData.phoneNumber}
              onChange={(event) => onChange('phoneNumber', event.currentTarget.value.replace(/[^0-9]/g
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
                value={dealerFormData.payment}
                onChange={(value) => onChange('payment', value!)}
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
              value={dealerFormData.remark}
              onChange={(event) => onChange('remark', event.currentTarget.value)}
              placeholder="Enter any remarks"
            />
          </Col>

          <Col span={12}>
            <Button disabled={isDealerDetailsSaved} loading={loading} onClick={handleSubmit} type="submit" fullWidth mt="lg">
              {isDealerDetailsSaved ? "Saved" : "Save"}
            </Button>
          </Col>
        </Grid>
      </Flex>
    </Flex>
  );
};
