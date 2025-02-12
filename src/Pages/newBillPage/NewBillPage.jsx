import { useState } from 'react';
import {
  Container,
  Grid,
  Title,
} from '@mantine/core';
import "./NewBillPage.css"
import {
  saveOrCacheBillAPI
} from '../../utils/apiUtils';
import { useBillState } from '../../hooks/useBillState';
import { ItemSearch } from '../../components/ItemSearch';
import { BillItems } from '../../components/BillItems/BillItems';
import { PaymentSection } from '../../components/PaymentSection/PaymentSection';
import { useSelector } from "react-redux";
import { selectItemsFeedData } from 'src/redux/allItemsFeedData/allItemsFeedDataSelector';
import { trimToTwoDecimals } from 'src/utils/trimToTwoDecimals';


const NewBillPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    billState,
    updateBillItems,
    updatePayment,
    resetBillState,
  } = useBillState(); // Assume this hook is imported

  const handleRemoveItem = (itemId) => {
    const updatedItems = billState.billItems.filter(
      (item) => item.itemDetail._id !== itemId
    );
    updateBillItems(updatedItems);
  };
  const itemsFeedData = useSelector(selectItemsFeedData);
    
  useEffect(() => {
    if (itemsFeedData) {
      setItemsDataCount(itemsFeedData.totalItemsCount); 
    }
     }, [itemsFeedData]);
  const saveBillToDatabase = async (billData) => {
    try {
      const response = await saveOrCacheBillAPI(billData);

      if (!response || response.isError) {
        console.error('Error saving bill to database:', response?.error);
        // Show error notification
        return;
      }

      // Remove the bill from localStorage once saved successfully
      localStorage.removeItem(`bill-${billData.billId}`);
    } catch (error) {
      console.error('Error saving bill to database:', error);
      // Show error notification
    }
  };

  const handlePaymentSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Validate payment
      const totalPayment = billState.cashPay + billState.upiPay;
      if (totalPayment < billState.billAmountTotal) {
        throw new Error('Payment amount is less than bill amount');
      }

      // Save bill to localStorage
      const billData = { ...billState };
      localStorage.setItem(`bill-${billData.billId}`, JSON.stringify(billData));
      // Save bill to database
      saveBillToDatabase(billData);
      window.print()

      // Clear bill state for the new bill
      resetBillState();
    } catch (error) {
      console.error('Error submitting bill:', error);
      // Show error notification
    } finally {
      setIsSubmitting(false);
    }
  };
  const currentDateTime = `${new Date().toLocaleTimeString("en-IN", {
    hour12: false
  })}, ${new Date().toLocaleDateString("hi-IN", {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })}`

  const totalSaveOnBill = (billState.billMRPTotal - billState.billAmountTotal).toFixed(2)
  return (
    <div className="new-bill-page">
      <div className="shop-details">
        <h2>Priyam Store</h2>
        <p>Shop No 2, Plot No 2, Indrapuri, Bhopal, M.P.</p>
        <p>Phone: 123-456-7890</p>
        <p>{currentDateTime}</p>
      </div>

      {/* Savings Section */}
      {totalSaveOnBill > 0 ? <p className="savings">
        You Saved: ₹
        {totalSaveOnBill} on your purchase!
      </p> : <></>}
      <Container size="xl" py="md">
        <Title order={2} mb="lg">
          New Bill
        </Title>
        <Grid className='items-payments-grid'>
          <Grid.Col span={8}>
            <ItemSearch
              onItemSelect={(item) => {
                updateBillItems([item, ...billState.billItems]);
              }}
            />
            <BillItems
              items={billState.billItems}
              onRemoveItem={handleRemoveItem}
              bill={billState}
              setBill={(newBill) => {
                updateBillItems(newBill.billItems);
              }}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <PaymentSection
              cashPay={billState.cashPay}
              upiPay={billState.upiPay}
              amountReturn={trimToTwoDecimals(billState.amountReturn)}
              totalAmount={trimToTwoDecimals(billState.billAmountTotal)}
              onPaymentChange={updatePayment}
              onSubmit={handlePaymentSubmit}
              isLoading={isSubmitting}
            />
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
};

export default NewBillPage;