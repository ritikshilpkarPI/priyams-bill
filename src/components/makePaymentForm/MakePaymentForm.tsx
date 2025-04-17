import {
  Button,
  Col,
  Flex,
  Grid,
  Select,
  FileInput,
  Badge,
  Image,
} from '@mantine/core';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
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
import { selectPurchaseOrder } from 'src/redux/purchaseOrder/purchaseOrderSelectors';
import PasteableFileInput from './PasteableFileInput';
const MakePaymentForm = ({ purchaseOrderId }: PaymentDetailFormProps) => {

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<YupValidationErrorMapType>({});
  const paymentDetail = useSelector(selectMakePaymentFormState) || {};
  const purchaseDetails = useSelector(selectPaymentDetailForm) || [];
  const purchaseOrder = useSelector(selectPurchaseOrder) || {};

  const { paidBy } = paymentDetail;
  const takeImages = paidBy === CONSTANTS.UPI || paidBy === CONSTANTS.NEFT;

  const paymentsList = purchaseOrder.purchaseDetails?.payments || [];
    
  const onChange = (field: string, value: string | number | File[]) => {
    console.log({field, value});
    dispatch(setMakePaymentForm({ ...paymentDetail, [field]: value }));
  };

  const updatePayment = async () => {
    if (!purchaseOrderId) return;
    setLoading(true);
    const paymentDetails = {
      totalPayableAmount: purchaseDetails.totalPayableAmount,
      totalBillAmount: purchaseDetails.totalBillAmount,
      paymentType: purchaseDetails.paymentType,
      remark:purchaseDetails.remark,
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
    if (response.isError){
      setLoading(false);
      return toast.error(
        'unable to save payment details, please try after some time'
      );
    }
    dispatch(resetMakePaymentForm());
    dispatch(setPurchaseOrder(response.order));
    setLoading(false);
    toast.success('payment details saved successfully');
  };

  const onSubmit = async () => {
    try {
      console.log({paymentDetail, paymentsList});
      
      await addPaymentDetailValidation.validate({...paymentDetail, totalPayableAmount: purchaseDetails.totalPayableAmount, paymentsList}, {
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
      gap="16px"
      direction="column"
      sx={{
        border: '0.5px solid #D4D4D4',
        padding: '16px',
        borderRadius: '4px',
        overflow: 'hidden',
        textAlign: 'left',
      }}
    >
      <Grid columns={12}>
        <Col>
          <Badge color="green" size="lg">
            You are adding new payment
          </Badge>
        </Col>
        {(purchaseDetails.paymentType === CONSTANTS.PARTIALLY_PAID ||
          purchaseDetails.paymentType === CONSTANTS.FULLY_PAID) && (
          <Col>
            <Badge color="red" size="xs">
              Required
            </Badge>
          </Col>
        )}
        <Col span={12}>
          <strong>Date: {new Date().toDateString()}</strong>
        </Col>
        <Col>
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
      
    <PasteableFileInput
  onDrop={(files: any) => onChange('paymentImages', files || [])}
  onPasteFile={(files: any) => onChange('paymentImages', files || [])}
  multiple
/>
        {(paymentDetail.paymentImages?.length ?? 0) > 0 && (
          <Col>
            <Flex
              sx={{
                overflowX: 'scroll',
                gap: '8px',
                padding: '8px',
                '&::-webkit-scrollbar': {
            display: 'none',
          },
              }}
            >
              {(paymentDetail.paymentImages || []).map((file, index) => {
                const imageUrl = URL.createObjectURL(file);
                return (
                  <Image
                    key={index}
                    src={imageUrl}
                    width={50}
                    height={50}
                    radius="sm"
                  />
                );
              })}
            </Flex>
          </Col>
        )}
        <Col>
          <Button loading={loading} onClick={onSubmit} w={'100%'}>
            Save
          </Button>
        </Col>
      </Grid>
    </Flex>
  );
};

export default MakePaymentForm;
