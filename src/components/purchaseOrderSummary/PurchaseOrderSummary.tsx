import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Box, Button, Checkbox, Flex, Title } from '@mantine/core';
import { useSelector } from 'react-redux';
import { dealerFormValidation } from '../../utils/validations/dealerFormValidation';
import { selectPurchaseOrder } from '../../redux/purchaseOrder/purchaseOrderSelectors';
import { draftItemFormValidation } from '../../utils/validations/draftItemFormValidation';
import { paymentDetailFormValidation } from '../../utils/validations/paymentDetailFormValidation';
import { draftOrderByIdAPI } from '../../utils/apiUtils';
import { setPurchaseOrder } from '../../redux/purchaseOrder/purchaseOrderSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ShareOnWhatsApp from '../shareOnWhatsApp';

export const PurchaseOrderSummary = () => {
  const dispatch = useDispatch();
  const purchaseOrder = useSelector(selectPurchaseOrder);
  const [isValidDealerDetails, setIsValidDealerDetails] = useState(false);
  const [isValidItemDetails, setIsValidItemDetails] = useState(false);
  const [isValidPaymentDetails, setIsValidPaymentDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateDealerDetails = async (
    purchaseOrder: PurchaseOrderDataType
  ) => {
    try {
      await dealerFormValidation.validate(purchaseOrder);
      setIsValidDealerDetails(true);
      return true;
    } catch (err) {
      return false;
    }
  };

  const validateItemDetails = async (purchaseOrder: PurchaseOrderDataType) => {
    try {
      const purchasedItemsValidation = Yup.array().of(draftItemFormValidation);
      await purchasedItemsValidation.validate(purchaseOrder.purchasedItems);
      setIsValidItemDetails(true);
      return true;
    } catch (err) {
      return false;
    }
  };

  const validatePaymentDetails = async (
    purchaseOrder: PurchaseOrderDataType
  ) => {
    try {
      const paymentDetailsValidation = Yup.array().of(
        paymentDetailFormValidation
      );
      await paymentDetailsValidation.validate(purchaseOrder.purchaseDetails);
      setIsValidPaymentDetails(true);
      return true;
    } catch (err) {
      return false;
    }
  };

  const draftOrder = async () => {
    if (!purchaseOrder?._id) return;
    setLoading(true);
    const response = await draftOrderByIdAPI(purchaseOrder._id);
    setLoading(false);
    if (response.isError)
      return toast.error('Unable to draft order, please try again');
    dispatch(
      setPurchaseOrder({
        ...purchaseOrder,
        isDraft: true,
      })
    );
  };

  useEffect(() => {
    validateItemDetails(purchaseOrder);
    validateDealerDetails(purchaseOrder);
    validatePaymentDetails(purchaseOrder);
  }, [purchaseOrder]);

  const isBillImagesUploaded = Boolean(purchaseOrder?.billPhotos?.length);
  const enableDraftBtn =
    isValidDealerDetails &&
    isValidItemDetails &&
    isValidPaymentDetails &&
    isBillImagesUploaded &&
    !purchaseOrder.isDraft;
  return (
    <>
    <Flex
      align="left"
      gap="16px"
      direction="column"
      sx={{
        border: '1px solid grey',
        padding: '16px',
        borderRadius: '8px',
        textAlign: 'left',
        overflow: 'scroll',
      }}
      mx="sm"
      mt="16px"
    >
      <Title order={4} weight={400} align="left">
        You need to fill all the below forms to draft/approve this purchase
        order
      </Title>

      <Flex direction="column" gap="16px">
        <Checkbox label="Dealer Details" checked={isValidDealerDetails} />
        <Checkbox label="Item Details" checked={isValidItemDetails} />
        <Checkbox label="Payment Details" checked={isValidPaymentDetails} />
        <Checkbox label="Bill Images" checked={isBillImagesUploaded} />
      </Flex>

      {
         purchaseOrder._id && <Button
         mt="xl"
         color="green"
         disabled={!enableDraftBtn}
         sx={{ width: '220px' }}
         onClick={draftOrder}
         loading={loading}
       >
         {purchaseOrder.isDraft ? 'Drafted' : 'Draft'}
       </Button>
      }
      
    </Flex>
    <Box mt="16px">
      <ShareOnWhatsApp />
    </Box>
    </>
  );
};
