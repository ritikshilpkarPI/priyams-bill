import {
  Button,
  Col,
  Flex,
  Grid,
  Select,
  TextInput,
  Text,
  FileInput,
  Badge,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import {
  resetMakePaymentForm,
  setAddPayment,
  setMakePaymentForm,
} from '../../redux/paymentDetailForm/paymentDetailFormSlice';
import { updatePOPaymentAPI } from '../../utils/apiUtils';
import { getNumberFromStr } from '../../utils/getNumberFromStr';
import CustomNumberInput from '../customNumberInput/CustomNumberInput';
import { getYupValidationErrorMap } from '../../utils/getYupValidationErrorMap';
import { useSelector } from 'react-redux';
import { CONSTANTS } from 'src/constants/constants';
import {
  selectMakePaymentFormState,
  selectPaymentDetailForm,
  selectPaymentsState,
} from 'src/redux/paymentDetailForm/paymentDetailFormSelectors';
import { addPaymentDetailValidation } from 'src/utils/validations/paymentDetailFormValidation';
import { setPurchaseOrder } from 'src/redux/purchaseOrder/purchaseOrderSlice';
const MakePaymentForm = ({ purchaseOrderId }: PaymentDetailFormProps) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<YupValidationErrorMapType>({});
  const paymentDetail = useSelector(selectMakePaymentFormState) || {};
  const paymentsList = useSelector(selectPaymentsState) || [];
  const purchaseDetails = useSelector(selectPaymentDetailForm) || [];
  const { paidBy } = paymentDetail;
  const takeImages = paidBy === CONSTANTS.UPI || paidBy === CONSTANTS.NEFT;

  const onChange = (field: string, value: string | number | File[]) => {
    dispatch(setMakePaymentForm({ ...paymentDetail, [field]: value }));
  };

  const updatePayment = async () => {
    if (!purchaseOrderId) return;
    setLoading(true);
    const paymentDetails = {
      totalPayableAmount: purchaseDetails.totalPayableAmount,
      totalBillAmount: purchaseDetails.totalBillAmount,
      paymentType: purchaseDetails.paymentType,
      paidBy: purchaseDetails.addPaymentDetail?.paidBy || '',
      paidAmount: purchaseDetails.addPaymentDetail?.paidAmount || 0,
    };
    const paymentImages = paymentDetail.paymentImages;
    const response = await updatePOPaymentAPI(
      paymentDetails,
      CONSTANTS.PAYMENT,
      purchaseOrderId,
      paymentImages
    );
    if (response.isError)
      return toast.error(
        'unable to save payment details, please try after some time'
      );
    dispatch(setPurchaseOrder(response.order));
    dispatch(resetMakePaymentForm());
    setLoading(false);
    toast.success('payment details saved successfully');
  };

  const onSubmit = async () => {
    try {
      await addPaymentDetailValidation.validate(paymentDetail, {
        abortEarly: false,
      });
      if (purchaseOrderId) return updatePayment();
      setErrors({});
    } catch (error) {
      setErrors(getYupValidationErrorMap(error));
    }
  };

  return (
    <Flex
      align="left"
      gap="16px"
      direction="column"
      sx={{
        width: '350px',
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
      <Flex align="center" gap="10px">
        <Text>Form</Text>
        <Badge color="green">You are adding new payment</Badge>
      </Flex>
      <Grid gutter="md" sx={{ width: '240px' }}>
        <Col span={12}>
          <strong>Date: {new Date().toDateString()}</strong>
        </Col>
        <Col span={12}>
          <Select
            label="Paid By"
            required
            error={errors.paidBy}
            placeholder="Select Paid By"
            data={[
              CONSTANTS.CASH,
              CONSTANTS.UPI,
              CONSTANTS.PREPAID,
              CONSTANTS.NEFT,
            ]}
            value={paymentDetail.paidBy}
            onChange={(value) => onChange('paidBy', value || '')}
          />
        </Col>
        <Col>
          <CustomNumberInput
            label="Paid Amount"
            required
            error={errors.paidAmount}
            placeholder="Enter Paid Amount"
            value={paymentDetail.paidAmount ?? 0}
            onChange={(e) => onChange('paidAmount', Number(e.target.value))}
          />
        </Col>
        {takeImages && (
          <Col>
            <FileInput
              label="Choose Image/s"
              accept="image"
              required
              error={errors.paymentImages}
              onChange={(files) => onChange('paymentImages', files || [])}
              multiple
            />
          </Col>
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ padding: '8px' }}>
            <Button loading={loading} onClick={onSubmit}>
              Save
            </Button>
          </div>
          {/* <div style={{ padding: '8px' }}>
            <Button
              leftIcon={<IconPlus />}
              loading={loading}
              onClick={addPaymentHandler}
            >
              add
            </Button>
          </div> */}
        </div>
      </Grid>
    </Flex>
  );
};

export default MakePaymentForm;
