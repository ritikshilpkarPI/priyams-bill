import {
  Group,
  TextInput,
  Box,
  Text,
  Code,
  Button,
  Select,
  Center,
  NumberInput,
  Textarea,
} from "@mantine/core";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Forms({ PurchaseList, orderDetails , setOrderDetails}) {

  const fields = PurchaseList.values.details.map((_, index) => (
    <Draggable key={index} index={index} draggableId={index.toString()}>
      {(provided) => (
        <Group ref={provided.innerRef} mt="xs" {...provided.draggableProps}>
          <Select
            label="Payment"
            placeholder="pick one payment option"
            data={[
              { value: "fullypaid", label: "Fully Paid" },
              { value: "partiallypaid", label: "Partially Paid" },
              { value: "credit", label: "Credit" },
            ]}
            value={
                PurchaseList.getInputProps(`details.${index}.payment`).value === 'credit'?'credit':
                PurchaseList.getInputProps(`details.${index}.billAmount`).value > PurchaseList.getInputProps(`details.${index}.paidAmount`).value ?
                'partiallypaid':'fullypaid'
            }
            {...PurchaseList.getInputProps(`details.${index}.payment`)}
          />
          <NumberInput
            withAsterisk
            label="Bill Amount"
            placeholder="total bill amount"
            value={orderDetails.billAmount}
            {...PurchaseList.getInputProps(`details.${index}.billAmount`)}
          />
          <Select
            label="Paid by"
            placeholder="pick one"
            data={[
              { value: "cash", label: "cash" },
              { value: "upi", label: "UPI" },
              { value: "cheque", label: "Cheque" },
              { value: "prepaid", label: "Prepaid" },
              { value: "neft", label: "NEFT" },
            ]}
            value={orderDetails.paidAmount}
            {...PurchaseList.getInputProps(`details.${index}.paidBy`)}

          />
          <NumberInput
            withAsterisk
            label="Paid Amount"
            placeholder="total paid amount"
            value={orderDetails.paidAmount}
            {...PurchaseList.getInputProps(`details.${index}.paidAmount`)}
          />
          <Select
            label="Procurement Source"
            placeholder="pick one"
            required
            data={[
              { value: "walmart", label: "Walmart" },
              { value: "dmart", label: "D Mart" },
              { value: "city", label: "City" },
              { value: "distributor", label: "Distributor" },
            ]}
            {...PurchaseList.getInputProps(`details.${index}.procurementSource`)}
          />
          <TextInput
            withAsterisk
            required
            label="Dealer Name"
            placeholder="dealer name"
            {...PurchaseList.getInputProps(`details.${index}.dealerName`)}
          />
          <NumberInput
            withAsterisk
            label="Mobile Number"
            placeholder="mobile number"
            formatter={(value) =>
              String(value).length <= 10
                ? value
                : String(value).substring(0, 10)
            }
            {...PurchaseList.getInputProps(`details.${index}.phoneNumber`)}
          />
          {orderDetails.paidBy === "cheque" && (
            <NumberInput
              withAsterisk
              required
              label="Cheque number"
              placeholder="checque number"
            {...PurchaseList.getInputProps(`details.${index}.chequeNumber`)}
            />
          )}
          <Textarea
            sx={{ width: "60%", marginTop: "1rem" }}
            placeholder="remarks"
            label="Your Remarks"
            value={orderDetails.remark}
            {...PurchaseList.getInputProps(`details.${index}.remark`)}
          />
        </Group>
      )}
    </Draggable>
  ));

  return (
    <Box sx={{ maxWidth: 1000 }} mx="auto">
      <DragDropContext
        onDragEnd={({ destination, source }) =>
          PurchaseList.reorderListItem("details", {
            from: source.index,
            to: destination.index,
          })
        }
      >
        <Droppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {fields}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Group position="center" mt="md">
        <Button
          onClick={() =>
            PurchaseList.insertListItem("details", { ...orderDetails })
          }
        >
          +
        </Button>
      </Group>
    </Box>
  );
}
export default Forms;
