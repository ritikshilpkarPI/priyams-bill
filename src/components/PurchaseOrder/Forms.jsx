import {
  Box,
  Button,
  Group,
  NumberInput,
  Select,
  TextInput,
} from "@mantine/core";
import React from "react";
import BillUploader from "./BillUploader";
import '../../CSS/orderForm.css'

const Forms = ({ purchaseForm, addDetails, purchaseList, setPurchaseList, cloudBills, deleteCloudBills }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addDetails();
      }}
    >
      <Box sx={{ maxWidth: "80%" }} mx="auto">
        <Group className="payment-form">
          <Group className="constant-payment-options">
            <Select
              label="Payment"
              className="payment-constant-input"
              placeholder="pick one payment option"
              data={[
                { value: "fullypaid", label: "Fully Paid" },
                { value: "partiallypaid", label: "Partially Paid" },
                { value: "credit", label: "Credit" },
              ]}
              {...purchaseForm.getInputProps("payment")}
            />

            <NumberInput
              withAsterisk
              label="Bill Amount"
              className="payment-constant-input"
              placeholder="total bill amount"
              precision={2}
              {...purchaseForm.getInputProps("billAmount")}
            />
            <Select
              label="Procurement Source"
              placeholder="pick one"
              className="payment-constant-input"
              data={[
                { value: "walmart", label: "Walmart" },
                { value: "dmart", label: "D Mart" },
                { value: "city", label: "City" },
                { value: "distributor", label: "Distributor" },
              ]}
              {...purchaseForm.getInputProps("procurementSource")}
            />
            <TextInput
              withAsterisk
              className="payment-constant-input"
              label="Dealer Name"
              placeholder="dealer name"
              {...purchaseForm.getInputProps("dealerName")}
            />
            <NumberInput
              withAsterisk
              label="Mobile Number"
              className="payment-constant-input"
              placeholder="mobile number"
              formatter={(value) =>
                String(value) === "0"
                  ? ""
                  : String(value).length <= 10
                    ? value
                    : String(value).substring(0, 10)
              }
              {...purchaseForm.getInputProps("phoneNumber")}
            />
            <TextInput
              sx={{ width: "20%" }}
              className="payment-constant-input"
              placeholder="remarks"
              label="Your Remarks"
              {...purchaseForm.getInputProps("remark")}
            />
          </Group>
          <Group className="payment-paid-option">

            <Select
              className="payment-paid-input"
              label="Paid by"
              placeholder="pick one"
              data={[
                { value: "cash", label: "cash" },
                { value: "upi", label: "UPI" },
                { value: "cheque", label: "Cheque" },
                { value: "prepaid", label: "Prepaid" },
                { value: "neft", label: "NEFT" },
              ]}
              {...purchaseForm.getInputProps("paidBy")}
            />
            <NumberInput
              withAsterisk
              className="payment-paid-input"
              label="Paid Amount"
              placeholder="total paid amount"
              precision={2}
              {...purchaseForm.getInputProps("paidAmount")}
            />
            {purchaseForm.getInputProps("paidBy").value === "cheque" && (
              <NumberInput
                withAsterisk
                className="payment-constant-input"
                label="Cheque number"
                placeholder="cheque number"
                {...purchaseForm.getInputProps("chequeNumber")}
              />
            )}
            <Button type="submit">Add Details</Button>
          </Group>
        </Group>
        {/* <Textarea
          sx={{ width: "60%", marginTop: "1rem" }}
          placeholder="remarks"
          label="Your Remarks"
          {...purchaseForm.getInputProps("remark")}
        /> */}
        <BillUploader purchaseList={purchaseList} setPurchaseList={setPurchaseList} cloudBills={cloudBills} deleteCloudBills={deleteCloudBills} />
      </Box>
    </form>
  );
};

export default Forms;
