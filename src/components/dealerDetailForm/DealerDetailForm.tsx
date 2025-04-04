import React, { useEffect, useState } from 'react';
import {
  TextInput,
  Select,
  Textarea,
  Button,
  Grid,
  Col,
  Flex,
  Title,
  Autocomplete,
} from '@mantine/core';
import { selectDealerDetailForm } from '../../redux/dealerDetailForm/dealerDetailFormSelectors';
import { useSelector, useDispatch } from 'react-redux';
import { setDealerFormData } from '../../redux/dealerDetailForm/dealerDetailFormSlice';
import { addNewOrderAPI, getAllDealersAPI, updateOrderDetailsAPI } from '../../utils/apiUtils';
import { selectPurchaseOrder } from '../../redux/purchaseOrder/purchaseOrderSelectors';
import { useLocation, useNavigate } from 'react-router';
import { dealerFormValidation } from '../../utils/validations/dealerFormValidation';
import { toast } from 'react-toastify';
import { getYupValidationErrorMap } from '../../utils/getYupValidationErrorMap';
import CustomNumberInput from '../customNumberInput/CustomNumberInput';
import ShareOnWhatsApp from 'src/components/shareOnWhatsApp';
import { setDealers, setDealerId, setDealersLoading } from 'src/redux/dealerlist/dealerSlice';
import { selectDealerLoading, selectDealers } from 'src/redux/dealerlist/dealerSelectors';

export const DealerDetailForm: React.FC<PurchaseOrderProps> = ({isApprovedPO}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const dealerFormData = useSelector(selectDealerDetailForm);
  const purchaseOrder = useSelector(selectPurchaseOrder);
  const [errors, setErrors] = useState<YupValidationErrorMapType>({});
  const [loading, setLoading] = useState(false);
  const [isExistingDealer, setIsExistingDealer] = useState(false)

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

  const getDealers = async ()=>{
    try {
      dispatch(setDealersLoading(true))
      const response = await getAllDealersAPI()
      dispatch(setDealers(response?.dealers))
      dispatch(setDealersLoading(false))
    } catch (error) {
      dispatch(setDealersLoading(false))
    }
  }

  const dealers = useSelector(selectDealers);    
  const dealersLoading = useSelector(selectDealerLoading);    
  
  useEffect(()=>{
    getDealers()
  },[])

  useEffect(()=>{
    const foundDealer = dealers.find((dealer) => dealer.dealerName === dealerFormData.dealerName.trim().replace(/\s+/g, ' '));
    if(foundDealer && foundDealer._id){
      dispatch(setDealerId(foundDealer._id))
      setIsExistingDealer(true)
      onChange('phoneNumber', foundDealer.dealerNumber)
    }else{
      setIsExistingDealer(false)
      dispatch(setDealerId(""))
      onChange('phoneNumber', "")
    }
  },[dealerFormData])

  const updateOrder = async () => {
    if(!purchaseOrder._id) return;
    setLoading(true);
    const response = await updateOrderDetailsAPI({
      new_order: {
        purchaseObj: {
          details: purchaseOrder.purchaseDetails || {},
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
            <Autocomplete
              label="Dealer Name"
              value={dealerFormData.dealerName}
              onChange={(value) =>
                onChange('dealerName', value)  
              }
              required
              error={errors.dealerName}
              placeholder="Enter dealer name"
              data={dealers
                .filter((dealer) => dealer.dealerName?.length)
                .map((dealer) => dealer.dealerName)} 
              disabled={isApprovedPO || dealersLoading}
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
              required = {!isExistingDealer}
              error={errors.phoneNumber}
              placeholder="Enter phone number"
              maxLength={10}
              disabled={isApprovedPO || isExistingDealer}
            />
          </Col>


          <Col span={12}>
            <Select
              label="Procurement Source"
              data={['Walmart', 'D Mart', 'City', 'Distributor']}
              value={dealerFormData.procurementSource}
              onChange={(value) => onChange('procurementSource', value!)}
              disabled={isApprovedPO}
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
              disabled={isApprovedPO}
            />
          </Col>

          <Col span={12}>
            <Button
              loading={loading}
              onClick={handleSubmit}
              type="submit"
              fullWidth
              mt="lg"
              disabled={isApprovedPO}
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
