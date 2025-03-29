import {
  Button,
  Flex,
  Grid,
  Select,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { setPurchaseOrder } from '../../redux/purchaseOrder/purchaseOrderSlice';
import { deletePaymentByIdAPI } from '../../utils/apiUtils';
import { paymentDetailFormValidation } from '../../utils/validations/paymentDetailFormValidation';
import CustomNumberInput from '../customNumberInput/CustomNumberInput';
import { getYupValidationErrorMap } from '../../utils/getYupValidationErrorMap';
import { AddCreditForm } from '../addCreditForm/AddCreditForm';
import MakePaymentForm from '../makePaymentForm/MakePaymentForm';
import PaymentDetailsFormCard from '../paymentDetailsFormCard/PaymentDetailsFormCard';
import { useSelector } from 'react-redux';
import {
  selectCreditsState,
  selectPaymentDetailForm,
  selectPaymentFormState,
  selectPaymentsState,
} from 'src/redux/paymentDetailForm/paymentDetailFormSelectors';
import {
  removeCreditRecord,
  removePaymentRecord,
  resetPaymentDetailForm,
  setPaymentDetailForm,
  setPaymentFormState,
} from 'src/redux/paymentDetailForm/paymentDetailFormSlice';
import { CONSTANTS } from 'src/constants/constants';
import { selectPurchaseOrder } from 'src/redux/purchaseOrder/purchaseOrderSelectors';
// import './PaymentDetailsForm.css';
import { useMediaQuery } from '@mantine/hooks';
export const PaymentDetailsForm = ({
  purchaseOrderId,
  paymentDetailIdx,
}: PaymentDetailFormProps) => {

  const dispatch = useDispatch();

  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const purchaseDetails = useSelector(selectPaymentDetailForm) || {};
  const paymentFormState = useSelector(selectPaymentFormState);

  const [errors, setErrors] = useState<YupValidationErrorMapType>({});

  const purchaseOrder = useSelector(selectPurchaseOrder) || {};
  
  const totalItemsCost = parseFloat(purchaseOrder.purchaseDetails?.totalItemsCost?.toFixed(2) ?? '');
  const paymentsList = purchaseOrder.purchaseDetails?.payments || [];
  const creditsList = purchaseOrder.purchaseDetails?.credits || [];

  const setDefaultPurchaseDetails = () => {
    if (!purchaseOrder || !purchaseOrder.purchaseDetails) return;

    const totalBillAmount =
      purchaseOrder.purchaseDetails.totalBillAmount ??
      purchaseDetails?.totalBillAmount;
    const totalPayableAmount =
      purchaseOrder.purchaseDetails.totalPayableAmount ??
      purchaseDetails?.totalPayableAmount;
    const paymentType =
      purchaseOrder.purchaseDetails.paymentType ?? purchaseDetails?.paymentType;
    const remark = purchaseOrder.purchaseDetails.remark;

    dispatch(
      setPaymentDetailForm({
        ...purchaseDetails,
        totalBillAmount,
        totalPayableAmount,
        paymentType,
        remark
      })
    );
  };

  const onChange = (field: string, value: string | number) => {
    dispatch(setPaymentDetailForm({ ...purchaseDetails, [field]: value }));
  };

  const toggleAddCreditForm = async () => {
    try {
      await paymentDetailFormValidation.validate({...purchaseDetails, totalItemsCost}, {
        abortEarly: false,
      });
      dispatch(
        setPaymentFormState({
          ...paymentFormState,
          addCredit: !paymentFormState?.addCredit,
        })
      );
      setErrors({});
    } catch (error) {
      setErrors(getYupValidationErrorMap(error));
    }
  };

  const toggleMakePaymentForm = async () => {
    try {
      await paymentDetailFormValidation.validate({...purchaseDetails, totalItemsCost}, {
        abortEarly: false,
      });
      dispatch(
        setPaymentFormState({
          ...paymentFormState,
          makePayment: !paymentFormState?.makePayment,
        })
      );
      setErrors({});
    } catch (error) {
      setErrors(getYupValidationErrorMap(error));
    }
  };

  const paymentsListhandleDelete = async (paymentId: string): Promise<{ isError: boolean, error?:string }> => {
    if (!purchaseOrderId) return { isError: true, error:"purchaseOrderId not found, please try after some time" };
    const response = await deletePaymentByIdAPI(purchaseOrderId, CONSTANTS.PAYMENT, paymentId);    
    if (response.isError) {
      return { isError: true, error:'unable to delete payment, please try after some time' };
    }
    dispatch(setPurchaseOrder(response.order));
    return { isError: false }; 
  };

  const creditsListhandleDelete = async (paymentId: string): Promise<{ isError: boolean, error?:string }> => {
    if (!purchaseOrderId) return { isError: true, error:"purchaseOrderId not found, please try after some time" };
    const response = await deletePaymentByIdAPI(purchaseOrderId, CONSTANTS.CREDIT, paymentId);    
    if (response.isError) {
      return { isError: true, error:'unable to delete payment, please try after some time' };
    }
    dispatch(setPurchaseOrder(response.order));
    return { isError: false }; 
  };

  useEffect(() => {
    if (purchaseOrderId) {
      setDefaultPurchaseDetails();
    } else {
      dispatch(resetPaymentDetailForm());
    }
  }, [purchaseOrder]);

  const {
    totalBillAmount,
    totalPayableAmount,
  } = purchaseDetails;

  const isRemarkRequired = ((totalBillAmount !== totalItemsCost) || (totalPayableAmount !== totalItemsCost));

  return (
    <Flex
      gap="16px"
      direction="column"
      sx={{
        border: '1px solid grey',
        padding: '16px',
        borderRadius: '8px',
        textAlign: 'left',
        overflow: 'scroll',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
      mx="sm"
      mt="16px"
    >
        <Grid columns={12} sx={{ width: '100%' }}>
          <Grid.Col span={isSmallScreen ? 12 : 4}>
            <CustomNumberInput
              label="Total Bill Amount"
              required
              error={errors.totalBillAmount}
              placeholder="Enter Total Bill Amount"
              value={purchaseDetails.totalBillAmount ?? 0}
              onChange={(e) =>
                onChange('totalBillAmount', Number(e.target.value))
              }
            />
          </Grid.Col>

          <Grid.Col span={isSmallScreen ? 12 : 4}>
            <CustomNumberInput
              label="Total Payable Amount"
              required
              error={errors.totalPayableAmount}
              placeholder="Enter Total Payable Amount"
              value={purchaseDetails.totalPayableAmount ?? 0}
              onChange={(e) =>
                onChange('totalPayableAmount', Number(e.target.value))
              }
            />
          </Grid.Col>

          <Grid.Col span={isSmallScreen ? 12 : 4}>
            <Select
              label="Payment Type"
              error={errors.paymentType}
              data={[
                CONSTANTS.FULLY_PAID,
                CONSTANTS.PARTIALLY_PAID,
                CONSTANTS.CREDIT,
              ]}
              value={purchaseDetails.paymentType}
              onChange={(value) => onChange('paymentType', value!)}
              sx={{ width: '100%' }}
              disabled={true}
            />
          </Grid.Col>
          
        </Grid>
        <Grid columns={12} sx={{ width: '100%' }}>
        <Grid.Col span={isSmallScreen ? 12 : 4}>
            <TextInput
              label="Total Items Cost"
              disabled={true}
              value={(purchaseOrder.purchaseDetails?.totalItemsCost?.toFixed(2)) || 0}
              sx={{ width: '100%' }}
            />
          </Grid.Col>
          {
            isRemarkRequired &&  <Grid.Col span={isSmallScreen ? 12 : 4}>
            <Textarea
              label="Remark"
              value={purchaseDetails.remark ?? ''}
              onChange={(e) => onChange('remark', e.target.value)}
              sx={{ width: '100%' }}
              required={ isRemarkRequired }
              error={ errors.remark }
            />
          </Grid.Col>
          }
        </Grid>
        <Grid columns={12} sx={{ width: '100%' }}>
        <Grid.Col span={isSmallScreen ? 12 : 4}>
              <Button
                w={'100%'}
                variant={paymentFormState?.makePayment ? 'filled' : 'light'}
                onClick={() => toggleMakePaymentForm()}
              >
                Make Payment
              </Button>
          </Grid.Col>
          <Grid.Col span={isSmallScreen ? 12 : 4}>
              <Button
                w={'100%'}
                variant={paymentFormState?.addCredit ? 'filled' : 'light'}
                onClick={() => toggleAddCreditForm()}
              >
                Add Credit
              </Button>
          </Grid.Col>
        </Grid>
        <Grid columns={12} sx={{ width: '100%' }}>
          <Grid.Col span={isSmallScreen ? 12 : 4}>
              {paymentFormState?.makePayment && (
                <MakePaymentForm purchaseOrderId={purchaseOrderId} />
              )}
          </Grid.Col>
          <Grid.Col span={isSmallScreen ? 12 : 4}>
              {paymentFormState?.addCredit && (
                <AddCreditForm purchaseOrderId={purchaseOrderId} />
              )}
          </Grid.Col>
        </Grid>
        <Grid columns={12} sx={{ width: '100%' }}>
          <Grid.Col span={isSmallScreen ? 12 : 4}>
              {paymentsList.length > 0 && (
                <PaymentDetailsFormCard
                  paymentsList={paymentsList}
                  removePaymentRecord={paymentsListhandleDelete}
                  title={CONSTANTS.PAYMENT}
                />
              )}
          </Grid.Col>
          <Grid.Col span={isSmallScreen ? 12 : 4}>
            
              {creditsList.length > 0 && (
                <PaymentDetailsFormCard
                  paymentsList={creditsList}
                  removePaymentRecord={creditsListhandleDelete}
                  title={CONSTANTS.CREDIT}
                />
              )}
          </Grid.Col>
        </Grid>
    </Flex>
  );
};
