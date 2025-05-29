import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Button } from '@mantine/core';
import './NewBillPage.css';
import { saveOrCacheBillAPI } from '../../utils/apiUtils';
import { useBillState } from '../../hooks/useBillState';
import { ItemSearch } from '../../components/ItemSearch/ItemSearch';
import { BillItems } from '../../components/BillItems/BillItems';
import { BillItemsCardView } from '../../components/BillItemsCardView/BillItemsCardView';
import { PaymentSection } from '../../components/PaymentSection/PaymentSection';
import {
  itemsFeedAPILoading,
  selectItemsFeedData,
} from 'src/redux/allItemsFeedData/allItemsFeedDataSelector';
import {ReactBarcode} from 'react-jsbarcode';
import { Reset } from 'src/icons/Reset';
import { fetchBillingLeanItems } from 'src/utils/fetchBillingLeanItems';
import { updateStaffInBill } from 'src/redux/bill/billSlice';
import { useTheme } from '../../theme/ThemeContext';

const NewBillPage = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemsDataCount, setItemsDataCount] = useState(0);
  const [enableTableView, setEnableTableView] = useState(window.innerWidth > 800);

  const { billState, updateBillItems, updatePayment, resetBillState } = useBillState();
  const loading = useSelector(itemsFeedAPILoading);
  const itemsFeedData = useSelector(selectItemsFeedData);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (itemsFeedData) {
      setItemsDataCount(itemsFeedData.totalItemsCount);
    }
  }, [itemsFeedData]);

  useEffect(() => {
    const onResize = () => setEnableTableView(window.innerWidth > 800);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleRemoveItem = (id) =>
    updateBillItems(billState.billItems.filter(i => i.itemDetail._id !== id));

  const saveBillToDatabase = async (billData) => {
    try {
      const res = await saveOrCacheBillAPI(billData);
      if (!res || res.isError) throw new Error(res?.error);
      localStorage.removeItem(`bill-${billData.billId}`);
    } catch (e) {
      console.error('Error saving bill:', e);
    }
  };

  const handlePaymentSubmit = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const totalPay = billState.cashPay + billState.upiPay;
      if (totalPay < billState.billAmountTotal) {
        throw new Error('Payment amount is less than bill total');
      }
      const data = {
        ...billState,
        billCreatedAt: new Date().toISOString(),
      };
      localStorage.setItem(`bill-${data.billId}`, JSON.stringify(data));
      saveBillToDatabase(data);
      dispatch(fetchBillingLeanItems());
      window.print();
      resetBillState();
    } catch (e) {
      console.error('Error submitting bill:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const dt = new Date();
  const currentDateTime = `${dt.toLocaleTimeString('en-IN', { hour12: false })}, ${dt.toLocaleDateString('hi-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })}`;
  const totalSave = (billState.billMRPTotal - billState.billAmountTotal).toFixed(2);

  return (
    <div className="new-bill-page">
      <div className="page-header">
        <button className="toggle-theme-button" onClick={toggleTheme}>
          Toggle {theme.mode === 'light' ? 'Dark' : 'Light'} Mode
        </button>
        <div className="shop-details">
          <h2>Priyam Store</h2>
          <p>{currentDateTime}</p>
          {!!+totalSave && (
            <p className="savings">You Saved: ₹{totalSave} on your purchase!</p>
          )}
        </div>
      </div>

      <div className="main-content">
        <Container size="xl" py="md" className="new-bill-container">
          <h2 className="item-count">
            Bill Items ({itemsDataCount})
            <Button
              className="refresh-bill-button"
              onClick={resetBillState}
              disabled={loading}
            >
              <Reset />
            </Button>
          </h2>

          <Grid className="items-payments-grid">
            <Grid.Col span={8} className="items-payments-grid-section">
              <div className="item-search-wrapper">
                <ItemSearch
                  onItemSelect={item => updateBillItems([item, ...billState.billItems])}
                />
              </div>

              <div className="items-view-wrapper">
                {enableTableView ? (
                  <div className="table-wrapper">
                    <BillItems
                      items={billState.billItems}
                      onRemoveItem={handleRemoveItem}
                      bill={billState}
                      setBill={nb => updateBillItems(nb.billItems)}
                    />
                  </div>
                ) : (
                  <div className="cards-wrapper">
                    <BillItemsCardView
                      items={billState.billItems}
                      onRemoveItem={handleRemoveItem}
                      bill={billState}
                      setBill={nb => updateBillItems(nb.billItems)}
                    />
                  </div>
                )}
              </div>
            </Grid.Col>

            <Grid.Col span={4} className="items-payments-grid-section payment-section-wrapper">
              <h3>Payment Summary</h3>
              <PaymentSection
                cashPay={billState.cashPay}
                upiPay={billState.upiPay}
                staffId={billState.staffId || ''}
                amountReturn={billState.amountReturn}
                totalAmount={billState.billAmountTotal}
                onPaymentChange={updatePayment}
                onSubmit={handlePaymentSubmit}
                isLoading={isSubmitting}
                handleStaffChange={updateStaffInBill}
              />
              {!!billState.billId && (
                <div className="barcode-container">
                  <ReactBarcode
                    value={billState.billId}
                    options={{ height: 20, width: 1.1, margin: 0, padding: 0 }}
                  />
                </div>
              )}
            </Grid.Col>
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default NewBillPage;