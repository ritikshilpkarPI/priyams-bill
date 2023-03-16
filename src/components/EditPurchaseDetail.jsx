import { Drawer, Button, Group, Box, NumberInput, Select } from '@mantine/core';
import '../CSS/editPurchaseDetail.css';
const EditPurchaseDetail = ({
  setPurchaseDrawer,
  openPurchaseDrawer,
  updateDetails,
  purchaseForm,
}) => {
  return (
    <Drawer
      opened={openPurchaseDrawer}
      onClose={() => {
        purchaseForm.values.paidBy = '';
        purchaseForm.values.paidAmount = 0;
        setPurchaseDrawer(false);
      }}
      title="Paid Details"
      position="left"
      padding="xl"
      size={300}
    >
      <Box
        sx={{ maxWidth: 400 }}
        className="edit-purchase-box"
        mx="auto"
        my={'lg'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateDetails(e);
            setPurchaseDrawer(false);
          }}
        >
          <Group>
            <Select
              label="Paid by"
              placeholder="pick one"
              data={[
                { value: 'cash', label: 'cash' },
                { value: 'upi', label: 'UPI' },
                { value: 'cheque', label: 'Cheque' },
                { value: 'prepaid', label: 'Prepaid' },
                { value: 'neft', label: 'NEFT' },
              ]}
              {...purchaseForm.getInputProps('paidBy')}
            />
            <NumberInput
              withAsterisk
              label="Paid Amount"
              placeholder="total paid amount"
              precision={2}
              {...purchaseForm.getInputProps('paidAmount')}
            />
            {purchaseForm.getInputProps('paidBy').value === 'cheque' && (
              <NumberInput
                withAsterisk
                required
                label="Cheque number"
                placeholder="cheque number"
                {...purchaseForm.getInputProps('chequeNumber')}
              />
            )}
          </Group>
          <Group position="left" style={{ marginTop: '3vmin' }}>
            <Button type="submit">Update Details</Button>
          </Group>
        </form>
      </Box>
    </Drawer>
  );
};
export default EditPurchaseDetail;
