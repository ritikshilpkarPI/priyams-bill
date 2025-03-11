import {
  Badge,
  Box,
  Button,
  Col,
  Flex,
  Grid,
  Select,
  Text,
  TextInput,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { setPurchaseOrder } from '../../redux/purchaseOrder/purchaseOrderSlice';
import { savePOPaymentAPI, updatePOPaymentAPI } from '../../utils/apiUtils';
import { getNumberFromStr } from '../../utils/getNumberFromStr';
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
  setPaymentDetailForm,
  setPaymentFormState,
} from 'src/redux/paymentDetailForm/paymentDetailFormSlice';
import { CONSTANTS } from 'src/constants/constants';
// import './PaymentDetailsForm.css';
export const PaymentDetailsForm = ({
  purchaseOrderId,
  paymentDetailIdx,
}: PaymentDetailFormProps) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const purchaseDetails = useSelector(selectPaymentDetailForm) || {};
  const paymentFormState = useSelector(selectPaymentFormState);
  const paymentsList = useSelector(selectPaymentsState) || [];
  const creditsList = useSelector(selectCreditsState) || [];
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<YupValidationErrorMapType>({});

  const onChange = (field: string, value: string | number) => {
    dispatch(setPaymentDetailForm({ ...purchaseDetails, [field]: value }));
  };
  console.log(purchaseDetails);

  const toggleAddCreditForm = async () => {
    try {
      await paymentDetailFormValidation.validate(purchaseDetails, {
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
      await paymentDetailFormValidation.validate(purchaseDetails, {
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

  const paymentsListhandleDelete = (index: number) => {
    dispatch(removePaymentRecord(index));
  };

  const creditsListhandleDelete = (index: number) => {
    dispatch(removeCreditRecord(index));
  };
  console.log(creditsList);
  console.log(paymentsList);

  return (
    <Flex
      align="left"
      gap="16px"
      direction="column"
      justify="space-around"
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
      <Flex
        // justify="left"
        sx={{ flexWrap: 'wrap' }}
        gap="20px"
        mx="sm"
      >
        <CustomNumberInput
          label="Total Bill Amount"
          required
          error={errors.totalBillAmount}
          placeholder="Enter Total Bill Amount"
          value={purchaseDetails.totalBillAmount ?? 0}
          onChange={(e) => onChange('totalBillAmount', Number(e.target.value))}
        />

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
        />
      </Flex>
      <Flex display="row" sx={{ width: '100%', flexWrap: 'wrap' }} gap="16px">
        {purchaseDetails.paymentType?.toLowerCase() !== 'credit' && (
          <Box mx="sm" sx={{ width: '350px' }}>
            <div>
              <Button
                variant={paymentFormState?.makePayment ? 'filled' : 'light'}
                onClick={() => toggleMakePaymentForm()}
              >
                Make Payment
              </Button>
            </div>
          </Box>
        )}
        {purchaseDetails.paymentType?.toLowerCase() !== 'fully paid' && (
          <Box mx="sm" sx={{ width: '350px' }}>
            <div>
              <Button
                variant={paymentFormState?.addCredit ? 'filled' : 'light'}
                onClick={() => toggleAddCreditForm()}
              >
                Add Credit
              </Button>
            </div>
          </Box>
        )}
      </Flex>
      <Flex display="row" sx={{ width: '100%', flexWrap: 'wrap' }} gap="10px">
        {paymentFormState?.makePayment && (
          <Box>
            <MakePaymentForm />
            {paymentsList.length > 0 && (
              <PaymentDetailsFormCard
                paymentsList={paymentsList}
                removePaymentRecord={paymentsListhandleDelete}
              />
            )}
          </Box>
        )}
        {paymentFormState?.addCredit &&
          purchaseDetails.paymentType?.toLowerCase() !== 'fully paid' && (
            <Box>
              <AddCreditForm />
              {creditsList.length > 0 && (
                <PaymentDetailsFormCard
                  paymentsList={creditsList}
                  removePaymentRecord={creditsListhandleDelete}
                />
              )}
            </Box>
          )}
      </Flex>
    </Flex>
  );
};
