import { useEffect, useState } from 'react';
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
import { selectBillingItems } from 'src/redux/billing/billingSelectors';


const NewBillPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemsDataCount, setItemsDataCount] = useState(0);
  const {
    billState,
    updateBillItems,
    updatePayment,
    resetBillState,
  } = useBillState(); 

  const handleRemoveItem = (itemId) => {
    const updatedItems = billState.billItems.filter(
      (item) => item.itemDetail._id !== itemId
    );
    updateBillItems(updatedItems);
  };
  const items = useSelector(selectBillingItems);
    
  useEffect(() => {
    if (items) {
      setItemsDataCount(items.totalItemsCount); 
    }
     }, []);
  const saveBillToDatabase = async (billData) => {
    try {
      const response = await saveOrCacheBillAPI(billData);

      if (!response || response.isError) {
        console.error('Error saving bill to database:', response?.error);
        return;
      }

      localStorage.removeItem(`bill-${billData.billId}`);
    } catch (error) {
      console.error('Error saving bill to database:', error);
    }
  };

  const handlePaymentSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const totalPayment = billState.cashPay + billState.upiPay;
      if (totalPayment < billState.billAmountTotal) {
        throw new Error('Payment amount is less than bill amount');
      }

      const billData = { ...billState };
      localStorage.setItem(`bill-${billData.billId}`, JSON.stringify(billData));
      saveBillToDatabase(billData);
      window.print()

      resetBillState();
    } catch (error) {
      console.error('Error submitting bill:', error);
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
        <h2>Shop Name</h2>
        <p>Shop Address, City, State</p>
        <p>Phone: 123-456-7890</p>
        <p>{currentDateTime}</p>
      </div>

      {totalSaveOnBill > 0 ? <p className="savings">
        You Saved: ₹
        {totalSaveOnBill} on your purchase!
      </p> : <></>}
      
      <Container size="xl" py="md">
        <h2>
          Total items: {itemsDataCount}
        </h2>
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
              amountReturn={billState.amountReturn}
              totalAmount={billState.billAmountTotal}
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