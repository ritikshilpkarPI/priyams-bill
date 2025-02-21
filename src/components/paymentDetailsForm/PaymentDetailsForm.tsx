import { Button, Col, Flex, Grid, Select, TextInput } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import { setPurchaseOrder } from "src/redux/purchaseOrder/purchaseOrderSlice";
import { savePOPaymentAPI, updatePOPaymentAPI } from "src/utils/apiUtils";
import { formatToTwoDecimals } from "src/utils/formatToTwoDecimals";
import { getFloatNumFromStr } from "src/utils/getFloatNumFromStr";
import { getNumberFromStr } from "src/utils/getNumberFromStr";
import * as yup from "yup";
import CustomNumberInput from "../customNumberInput/CustomNumberInput";

export const PaymentDetailsForm = ({
    purchaseOrderId,
    paymentDetailIdx,
}: PaymentDetailFormProps) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const defaultPaymentDetails = {
        paidBy: 'UPI',
        paidAmount: 0,
        chequeNumber: ''
    }
    const [paymentDetails, setPaymentDetails] = useState(defaultPaymentDetails);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const paymentValidation = yup.object({
        paidBy: yup.string().required('Payment method is required'), 
        paidAmount: yup.number()
          .moreThan(0, 'Paid amount must be greater than 0')
          .required('Paid amount is required'),
        chequeNumber: yup.string()
          .notRequired()  
          .nullable()  
      });
    const onChange = (field: string, value: string | number) => {
        setPaymentDetails({ ...paymentDetails, [field]: value });
    }

    const savePayment = async () => {
       const response = await savePOPaymentAPI(paymentDetails);
       if(response.isError) return;
       if(!response.order) return;
       dispatch(setPurchaseOrder(response.order))
       navigate(`${location.pathname}/${response.order._id}?${location.search}`)
    }

    const updatePayment = async () => {
        if(!purchaseOrderId) return;
        const response = await updatePOPaymentAPI(paymentDetails, purchaseOrderId, paymentDetailIdx);
        if(response.isError) return;
        if(!response.order) return;
        dispatch(setPurchaseOrder(response.order));
        setPaymentDetails(defaultPaymentDetails);
     }
 

    const onPaymentAdd = async () => {
        try {
            setLoading(true);
            await paymentValidation.validate(paymentDetails, { abortEarly: false });
            if(purchaseOrderId) await updatePayment();
            else await savePayment();
            setPaymentDetails(defaultPaymentDetails);
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const errorMessages = error.inner.reduce((acc: any, err: yup.ValidationError) => {
                  if (err.path) {
                    acc[err.path] = err.message;
                  }
                  return acc;
                }, {});
          
                setErrors(errorMessages);
            }
        }
        setLoading(false)
    }
    return <Flex align="left" gap="16px" direction="column" sx={{ border: "1px solid grey", padding: "16px", borderRadius: "8px", textAlign: "left", overflow: "scroll" }} mx="sm" mt="16px">
        <Grid gutter="md" sx={{ width: "240px" }}>
            <Col span={12}>
                <Select
                    label="Paid By"
                    required
                    error={errors.paidBy}
                    placeholder="Select Paid By"
                    data={["CASH", "UPI", "CHEQUE", "PREPAID", "NEFT"]}
                    value={paymentDetails.paidBy}
                    onChange={(value)=> onChange('paidBy', value || "")}
                />
            </Col>
            <Col>
                <CustomNumberInput
                    label="Paid Amount"
                    required
                    error={errors.paidAmount}
                    placeholder="Enter Paid Amount"
                    value={paymentDetails.paidAmount}
                    onChange={(e)=> onChange('paidAmount',  Number(e.target.value))}
                />
            </Col>
            <Col>
                    {
                        paymentDetails.paidBy === "CHEQUE" && (<TextInput
                        label="Cheque Number"
                        required
                        error={errors.chequeNumber}
                        placeholder="Enter Cheque Number"
                        value={paymentDetails.chequeNumber}
                        onChange={(event)=> onChange('chequeNumber',  getNumberFromStr(event.currentTarget.value)?.toString())}
                    />)
                    }
            </Col>
            <Col>
            <Button loading={loading} leftIcon={<IconPlus />} onClick={onPaymentAdd}>
                Add
        </Button>
            </Col>
        </Grid>
    </Flex>
}