import React, { useState } from 'react';
import {
  TextInput,
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
import { selectPurchaseOrder } from '../../redux/purchaseOrder/purchaseOrderSelectors';
import { useLocation, useNavigate } from 'react-router';
import { dealerFormValidation } from '../../utils/validations/dealerFormValidation';
import { toast } from 'react-toastify';
import { getYupValidationErrorMap } from '../../utils/getYupValidationErrorMap';
import CustomNumberInput from '../customNumberInput/CustomNumberInput';
import ShareOnWhatsApp from 'src/components/shareOnWhatsApp';

export const DealerDetailForm: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const dealerFormData = useSelector(selectDealerDetailForm);
  const purchaseOrder = useSelector(selectPurchaseOrder);
  const [errors, setErrors] = useState<YupValidationErrorMapType>({});
  const [loading, setLoading] = useState(false);

  const onChange = (field: string, value: string | number) => {
    dispatch(
      setDealerFormData({
        [field]: value,
      })
    );
  };

  const addNewOrder = async () => {
    setLoading(true);
    const response = await addNewOrderAPI({
      new_order: {
        purchaseObj: {
          ...purchaseOrder,
          ...dealerFormData,
          orders: purchaseOrder.purchasedItems,
        },
      },
    });
    setLoading(false);
    if (response.isError)
      return toast.error(
        'unable to save dealer details, please try after some time'
      );
    toast.success('dealer details saved successfully');
    navigate(`${location.pathname}/${response?.message?._id}?tab=itemDetails`);
  };

  const updateOrder = async () => {
    if(!purchaseOrder._id) return;
    setLoading(true);
    const response = await updateOrderDetailsAPI({
      new_order: {
        purchaseObj: {
          details: [],
          bills: [],
          orders: purchaseOrder.purchasedItems,
          ...purchaseOrder,
          ...dealerFormData,
        },
        id: purchaseOrder._id,
      },
      deleteBills: [],
      uploadedImages: [],
    });
    setLoading(false);
    if (response.isError)
      return toast.error(
        'unable to save dealer details, please try after some time'
      );
    toast.success('dealer details saved successfully');
    navigate(`${location.pathname}?tab=itemDetails`);
  };

  const handleSubmit = async () => {
    try {
      await dealerFormValidation.validate(dealerFormData, {
        abortEarly: false,
      });
      if (purchaseOrder._id) return updateOrder();
      return addNewOrder();
    } catch (error) {
      setErrors(getYupValidationErrorMap(error));
    }
  };
  const currentUrl = window.location.href;
  const match = currentUrl.match(/\/new-purchase-order\/([a-f0-9]{24})/);
  return (
    <Flex
      mt="lg"
      mx="sm"
      align="center"
      justify="center"
      gap="16px"
      direction="column"
    >
      <Flex
        direction="column"
        gap="16px"
        sx={{
          border: '1px solid grey',
          padding: '16px',
          borderRadius: '8px',
          textAlign: 'left',
          width: 'fit-content',
        }}
      >
        <Title order={3}>Dealer Details Form</Title>
        <Grid gutter="md" sx={{ maxWidth: '480px' }}>
          <Col span={12}>
            <TextInput
              label="Dealer Name"
              value={dealerFormData.dealerName}
              onChange={(event) =>
                onChange('dealerName', event.currentTarget.value)
              }
              required
              error={errors.dealerName}
              placeholder="Enter dealer name"
            />
          </Col>

          <Col span={12}>
            <TextInput
              label="Phone Number"
              value={dealerFormData.phoneNumber}
              onChange={(event) =>
                onChange(
                  'phoneNumber',
                  event.currentTarget.value.replace(/[^0-9]/g, '')
                )
              }
              required
              error={errors.phoneNumber}
              placeholder="Enter phone number"
              maxLength={10}
            />
          </Col>

          <Col span={12}>
            <CustomNumberInput
              label="Bill Amount"
              value={dealerFormData.billAmount}
              onChange={(e) => onChange('billAmount', e.currentTarget.value)}
              required
              placeholder="Enter bill amount"
              error={errors.billAmount}
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
              onChange={(event) =>
                onChange('remark', event.currentTarget.value)
              }
              placeholder="Enter any remarks"
            />
          </Col>

          <Col span={12}>
            <Button
              loading={loading}
              onClick={handleSubmit}
              type="submit"
              fullWidth
              mt="lg"
            >
              Save & Next
            </Button>
          </Col>
        </Grid>
      </Flex>
      {
        match && <ShareOnWhatsApp message={currentUrl}/>
      }
      

    </Flex>
  );
};
