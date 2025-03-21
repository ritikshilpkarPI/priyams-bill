import React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@mantine/core';
import styles from './PODashboard.module.css';
import { selectPurchasedItems } from '../../redux/purchaseOrder/purchaseOrderSelectors';
import { isShelfExpired } from 'src/utils/isShelfExpired';
import MetricCard from '../metricCard/MetricCard';


const PurchaseOrderDashboard: React.FC = () => {
  const purchasedItems = useSelector(selectPurchasedItems);

  let totalBillAmount = 0;
  let totalProfitMargin = 0;
  const uniqueItemsSet = new Set<string>();
  let existingItemsCount = 0;
  let newItemsCount = 0;
  let itemsWithManuAndExpiry = 0;
  let itemsWithShortExpiry = 0;

  purchasedItems?.forEach((item) => {
    const quantity = item.itemQuantity || 0;
    const cp = item.costPrice || 0;
    const sp = item.sellingPrice || 0;

    totalBillAmount += cp * quantity;

    if (cp > 0) {
      const profitMargin = ((sp - cp) / cp) * 100;
      totalProfitMargin += profitMargin;
    }

    uniqueItemsSet.add(item._id ?? '');

    if (item.item_id) {
      existingItemsCount++;
    } else {
      newItemsCount++;
    }

    if (item.expiryDates && item.expiryDates.length > 0) {
      const hasManuAndExpiry = item.expiryDates.some(
        (dateObj) => dateObj.mfgDate && dateObj.date
      );
      if (hasManuAndExpiry) {
        itemsWithManuAndExpiry++;
      }

      const hasShortExpiry = item.expiryDates.some((dateObj) => {
        if (dateObj.mfgDate && dateObj.date) {
          return isShelfExpired(dateObj.mfgDate, dateObj.date);
        }
        return false;
      });
      if (hasShortExpiry) {
        itemsWithShortExpiry++;
      }
    }
  });

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.dashboardTitle}>Items Dashboard</h1>
      <Grid>
        <Grid.Col span={4}>
          <MetricCard
            title="Total Bill Amount"
            value={totalBillAmount.toFixed(2)}
            prefix="Rs:"
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <MetricCard
            title="Total Profit Margin (%)"
            value={totalProfitMargin.toFixed(2)}
            suffix="%"
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <MetricCard
            title="Unique Items"
            value={uniqueItemsSet.size}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <MetricCard
            title="Existing Items"
            value={existingItemsCount}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <MetricCard
            title="New Items"
            value={newItemsCount}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <MetricCard
            title="Items with Manu & Expiry"
            value={itemsWithManuAndExpiry}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <MetricCard
            title="Items with Short Expiry"
            value={itemsWithShortExpiry}
          />
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default PurchaseOrderDashboard;
