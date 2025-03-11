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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<YupValidationErrorMapType>({});

  const onChange = (field: string, value: string | number) => {
    dispatch(setAddCreditForm({ ...creditDetail, [field]: value }));
  };

  const addCreditHandler = async () => {
    try {
      await addCreditDetailValidation.validate(creditDetail, {
        abortEarly: false,
      });
      const index = (creditsList?.length ?? 0) + 1;
      dispatch(setAddCredit({ ...creditDetail, idx: index }));
      dispatch(resetAddCreditForm());
      setErrors({});
    } catch (error) {
      setErrors(getYupValidationErrorMap(error));
    }
  };

  const onSubmit = () => {};

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
        <Badge color="green">You are adding new cradit</Badge>
      </Flex>
      <Grid gutter="md" sx={{ width: '240px' }}>
        <Col span={12}>
          <Input.Wrapper error={errors.payDate} label="Pay Date" required>
            <Input
              type="date"
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div>
              <Button loading={loading} onClick={onSubmit}>
                Save
              </Button>
            </div>
            <div>
              <Button
                leftIcon={<IconPlus />}
                loading={loading}
                onClick={addCreditHandler}
              >
                add
              </Button>
            </div>
          </div>
        </Col>
      </Grid>
    </Flex>
  );
};
