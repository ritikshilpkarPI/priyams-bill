import React, { useState } from 'react';
import * as yup from 'yup';
import {
  TextInput,
  NumberInput,
  Select,
  Textarea,
  Button,
  Grid,
  Col,
  Flex,
  Title,
} from '@mantine/core';
import { selectDealerDetailForm } from '../../redux/dealerDetailForm/dealerDetailFormSelectors';
import { useSelector, useDispatch } from 'react-redux';
import { setDealerFormData } from '../../redux/dealerDetailForm/dealerDetailFormSlice';
import { addNewOrderAPI, updateOrderDetailsAPI } from '../../utils/apiUtils';
import { selectPurchaseOrder } from 'src/redux/purchaseOrder/purchaseOrderSelectors';
import { useLocation, useNavigate } from 'react-router';

export const DealerDetailForm: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const dealerFormData = useSelector(selectDealerDetailForm);
  const purchaseOrder = useSelector(selectPurchaseOrder);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [isDealerDetailsSaved, setIsDealerDetailsSaved] = useState(Boolean(purchaseOrder._id));

  const formValidationSchema = yup.object({
    payment: yup.string(),
    billAmount: yup.number()
      .min(1, 'Bill amount must be greater than 0.')
      .required('Bill amount is required.'),
    procurementSource: yup.string(),
    dealerName: yup.string().required('Dealer name is required.'),
    phoneNumber: yup.string()
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits.')
      .required('Phone number is required.'),
    remark: yup.string().optional(),
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
    navigate(`${location.pathname}/${response?.message?._id}?${location.search}`)
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
        },
        id: purchaseOrder._id,
      },
      deleteBills: [],
      uploadedImages: []
    });
    setLoading(false);
    if(response.isError) return;
    setIsDealerDetailsSaved(true);
  }

  const handleSubmit = async () => {
    try {
      await formValidationSchema.validate(dealerFormData, { abortEarly: false });
    } catch (error: any) {
      const errorMessages = error.inner.reduce((acc: any, err: any) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
  
      return setErrors(errorMessages);
    }
  
    if (purchaseOrder._id) return updateOrder(); 
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
              error={errors.phoneNumber}
              placeholder="Enter phone number"
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
