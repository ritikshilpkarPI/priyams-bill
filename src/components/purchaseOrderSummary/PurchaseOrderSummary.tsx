import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Box, Button, Checkbox, Flex, Textarea, Title } from '@mantine/core';
import { useSelector } from 'react-redux';
import { selectPurchaseOrder } from '../../redux/purchaseOrder/purchaseOrderSelectors';
import { draftOrderByIdAPI } from '../../utils/apiUtils';
import { setPurchaseOrder } from '../../redux/purchaseOrder/purchaseOrderSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ShareOnWhatsApp from '../shareOnWhatsApp';
import { genericAxios } from 'src/utils/genericAxiosMethod';
import { API_PATHS } from 'src/utils/constants/apiPaths';
import { API_METHODS } from 'src/utils/constants/apiMethods';
import { getUserDetails } from 'src/utils/getUserDeviceInfo';
import { parseJwt } from '../../utils/cookie';
import Cookies from 'js-cookie';
import ProtectedComponent from '../ProtectedComponent';
import access from 'src/access';
import {
  validateDealerDetails,
  validateItemDetails,
  validatePaymentDetails,
} from 'src/utils/purchaseOrderValidations';

export const PurchaseOrderSummary = () => {
  const dispatch = useDispatch();
  const purchaseOrder = useSelector(selectPurchaseOrder);
  const [isValidDealerDetails, setIsValidDealerDetails] = useState(false);
  const [isValidItemDetails, setIsValidItemDetails] = useState(false);
  const [isValidPaymentDetails, setIsValidPaymentDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectMessage, setRejectMessage] = useState('');
  const [showRejectMessage, setShowRejectMessage] = useState(false);

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
    const validateForms = async () => {
      setIsValidDealerDetails(await validateDealerDetails(purchaseOrder));
      setIsValidItemDetails(await validateItemDetails(purchaseOrder));
      setIsValidPaymentDetails(await validatePaymentDetails(purchaseOrder));
    };

    validateForms();
  }, [purchaseOrder]);

  const isBillImagesUploaded = Boolean(purchaseOrder?.billPhotos?.length && purchaseOrder.dateOnBill);
  const enableDraftBtn =
    isValidDealerDetails &&
    isValidItemDetails &&
    isValidPaymentDetails &&
    isBillImagesUploaded &&
    !purchaseOrder.isDraft;
  const currentUrl = window.location.href;
  const match = currentUrl.match(/\/new-purchase-order\/([a-f0-9]{24})/);
  const approveOrder = async (id: string, list: PurchaseOrderDataType) => {
    try {
      setApproveLoading(true);
      const response = await genericAxios({
        url: API_PATHS.INVENTORY.POST_SAVE_INVENTORY,
        method: API_METHODS.POST,
        data: {
          newItems: list.purchasedItems,
          purchaseOrderId: id,
          userDetail: await getUserDetails(),
        },
      });
      setApproveLoading(false);
      if ('status' in response && response.status === 200) {
        dispatch(setPurchaseOrder({ ...purchaseOrder, isApproved: true }));
        toast.success('Order approved successfully');
      } else {
        toast.error('Something went wrong, unable to approve order');
      }
    } catch (error) {
      console.error('Approval Error:', error);
      toast.error('Something went wrong, unable to approve order');
    }
  };

  const onRejectOrder = async (id: string) => {
    setRejectLoading(true);

    try {
      await genericAxios({
        method: API_METHODS.POST,
        url: `${API_PATHS.APPROVAL.POST_REJECT_ORDER}/${id}`,
        data: {
          username: parseJwt(Cookies.get('token')).username,
          userDetail: await getUserDetails(),
          rejectMessage: rejectMessage,
        },
      });
      dispatch(setPurchaseOrder({ ...purchaseOrder, isDraft: false }));
      setRejectLoading(false);
      setShowRejectMessage(false);
      setRejectMessage('');
      toast.success('Order rejected successfully');
    } catch (error) {
      console.error('Rejection Error:', error);
      toast.error('Something went wrong, unable to reject order');
    }
  };

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

        <Flex gap="16px" mt="xl">
          {purchaseOrder._id && (
            <Button
              color="green"
              disabled={!enableDraftBtn}
              sx={{ width: '220px' }}
              onClick={draftOrder}
              loading={loading}
            >
              {purchaseOrder.isDraft ? 'Drafted' : 'Draft'}
            </Button>
          )}

          {purchaseOrder.isDraft && (
            <ProtectedComponent role={access.APPROVED_PURCHASE_ORDER}>
              <Button
                disabled={purchaseOrder.isApproved}
                className="approve-btn"
                loading={approveLoading}
                onClick={() => approveOrder(purchaseOrder._id!, purchaseOrder)}
                sx={{ width: '220px' }}
              >
                Approve
              </Button>
            </ProtectedComponent>
          )}

          {purchaseOrder.isDraft && !purchaseOrder.isApproved && (
            <ProtectedComponent role={access.REJECTED_PURCHASE_ORDER}>
              <Button
                className="reject-btn"
                loading={rejectLoading}
                onClick={() => setShowRejectMessage(true)}
                sx={{ width: '220px' }}
                color="red"
              >
                Reject
              </Button>
            </ProtectedComponent>
          )}

          {showRejectMessage && (
            <ProtectedComponent role={access.REJECTED_PURCHASE_ORDER}>
              <Box>
                <Textarea
                  label="Reason for Rejection"
                  value={rejectMessage}
                  onChange={(e: any) => setRejectMessage(e.target.value)}
                  disabled={rejectLoading}
                />
              </Box>
            </ProtectedComponent>
          )}

          {rejectMessage && (
            <ProtectedComponent role={access.REJECTED_PURCHASE_ORDER}>
              <Box>
                <Button loading={rejectLoading} onClick={()=> onRejectOrder(purchaseOrder._id!)}>
                  Submit
                </Button>
              </Box>
            </ProtectedComponent>
          )}
        </Flex>
      </Flex>
      <Box mt="16px">{match && <ShareOnWhatsApp message={currentUrl} />}</Box>
    </>
  );
};
