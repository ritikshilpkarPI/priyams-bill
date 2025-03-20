import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card, Grid, Text } from '@mantine/core';
import styles from './Dashboard.module.css';
import { selectPurchasedItems } from '../../redux/purchaseOrder/purchaseOrderSelectors';

const Dashboard: React.FC = () => {
  const purchasedItems = useSelector(selectPurchasedItems);

  const metrics = useMemo(() => {
    let totalBillAmount = 0;
    let totalProfitMargin = 0;
    const uniqueItemsSet = new Set<string>();
    let existingItemsCount = 0;
    let newItemsCount = 0;
    let itemsWithManuAndExpiry = 0;
    let itemsWithShortExpiry = 0;

    const now = new Date();
    const shortExpiryThreshold = new Date();
    shortExpiryThreshold.setDate(now.getDate() + 30);

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

        // 6) Items with short expiry (within next 30 days)
        const hasShortExpiry = item.expiryDates.some((dateObj) => {
          if (dateObj.date) {
            const expiry = new Date(dateObj.date);
            return expiry <= shortExpiryThreshold;
          }
          return false;
        });
        if (hasShortExpiry) {
          itemsWithShortExpiry++;
        }
      }
    });

    return {
      totalBillAmount,
      totalProfitMargin,
      totalUniqueItems: uniqueItemsSet.size,
      existingItemsCount,
      newItemsCount,
      itemsWithManuAndExpiry,
      itemsWithShortExpiry,
    };
  }, [purchasedItems]);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.dashboardTitle}>Items Dashboard</h1>
      <Grid>
        <Grid.Col span={4}>
          <Card shadow="lg" p="lg" className={styles.metricCard}>
            <Text weight={500}>Total Bill Amount</Text>
            <Text size="xl">Rs: {metrics.totalBillAmount.toFixed(2)}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow="lg" p="lg" className={styles.metricCard}>
            <Text weight={500}>Total Profit Margin (%)</Text>
            <Text size="xl">{metrics.totalProfitMargin.toFixed(2)}%</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow="lg" p="lg" className={styles.metricCard}>
            <Text weight={500}>Unique Items</Text>
            <Text size="xl">{metrics.totalUniqueItems}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow="lg" p="lg" className={styles.metricCard}>
            <Text weight={500}>Existing Items</Text>
            <Text size="xl">{metrics.existingItemsCount}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow="lg" p="lg" className={styles.metricCard}>
            <Text weight={500}>New Items</Text>
            <Text size="xl">{metrics.newItemsCount}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow="lg" p="lg" className={styles.metricCard}>
            <Text weight={500}>Items with Manu &amp; Expiry</Text>
            <Text size="xl">{metrics.itemsWithManuAndExpiry}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow="lg" p="lg" className={styles.metricCard}>
            <Text weight={500}>Items with Short Expiry</Text>
            <Text size="xl">{metrics.itemsWithShortExpiry}</Text>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default Dashboard;
