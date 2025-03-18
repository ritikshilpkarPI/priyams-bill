import { Badge, Button, Col, Flex, Grid, Input, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import CustomNumberInput from '../customNumberInput/CustomNumberInput';
import { useSelector } from 'react-redux';
import { selectPaymentDetails } from 'src/redux/purchaseOrder/purchaseOrderSelectors';
// import { setCreditDetails, setPurchaseOrder } from 'src/redux/purchaseOrder/purchaseOrderSlice';
import { setPurchaseOrder } from '../../redux/purchaseOrder/purchaseOrderSlice';

import { updatePOPaymentAPI } from 'src/utils/apiUtils';
import { getYupValidationErrorMap } from '../../utils/getYupValidationErrorMap';
import { CONSTANTS } from 'src/constants/constants';
import {
  resetAddCreditForm,
  setAddCredit,
  setAddCreditForm,
} from 'src/redux/paymentDetailForm/paymentDetailFormSlice';
import {
  selectAddCreditFormState,
  selectCreditsState,
  selectPaymentDetailForm,
} from 'src/redux/paymentDetailForm/paymentDetailFormSelectors';
import { addCreditDetailValidation } from 'src/utils/validations/paymentDetailFormValidation';

export const AddCreditForm = ({ purchaseOrderId }: PaymentDetailFormProps) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const creditDetail = useSelector(selectAddCreditFormState) || {};
  const creditsList = useSelector(selectCreditsState) || [];
  const purchaseDetails = useSelector(selectPaymentDetailForm) || [];
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<YupValidationErrorMapType>({});

  const currentDate = new Date().toISOString().split('T')[0];

  const onChange = (field: string, value: string | number) => {
    dispatch(setAddCreditForm({ ...creditDetail, [field]: value }));
  };

  const updateCredit = async () => {
    if (!purchaseOrderId) return;
    setLoading(true);
    const paymentDetails = {
      totalPayableAmount: purchaseDetails.totalPayableAmount,
      totalBillAmount: purchaseDetails.totalBillAmount,
      paymentType: purchaseDetails.paymentType,
      creditAmount: creditDetail.creditAmount,
      payDate: creditDetail.payDate,
    };

    const response = await updatePOPaymentAPI(
      paymentDetails,
      CONSTANTS.CREDIT,
      purchaseOrderId
    );
    if (response.isError || !response.order)
      return toast.error(
        'unable to save credit details, please try again some time'
      );
    dispatch(resetAddCreditForm());
    dispatch(setPurchaseOrder(response.order));
    setLoading(false);
    toast.success('credit details saved successfully');
  };

  const onSubmit = async () => {
    try {
      await addCreditDetailValidation.validate(creditDetail, {
        abortEarly: false,
      });
      if (purchaseOrderId) return updateCredit();
      setErrors({});
    } catch (error) {
      setErrors(getYupValidationErrorMap(error));
    }
  };

  return (
    <Flex
      direction="column"
      // gap="16px"
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
            You are adding new credit
          </Badge>
        </Col>
        {(purchaseDetails.paymentType === CONSTANTS.PARTIALLY_PAID ||
          purchaseDetails.paymentType === CONSTANTS.CREDIT) && (
          <Col>
            <Badge color="red" size="xs" mt={'10px'}>
              Required
            </Badge>
          </Col>
        )}
        <Col>
          <Input.Wrapper error={errors.payDate} label="Pay Date" required>
            <Input
              type="date"
              min={currentDate}
              onChange={(e) => onChange('payDate', e.target.value)}
            />
          </Input.Wrapper>
        </Col>
        <Col>
          <CustomNumberInput
            label="Credit Amount"
            required
            error={errors.creditAmount}
            placeholder="Enter Paid Amount"
            value={creditDetail.creditAmount ?? 0}
            onChange={(e) => onChange('creditAmount', Number(e.target.value))}
          />
        </Col>
        <Col>
          <Button w={'100%'} loading={loading} onClick={onSubmit}>
            Save
          </Button>
        </Col>
      </Grid>
    </Flex>
  );
};
