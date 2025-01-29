import React, { useEffect, useState } from 'react';
import { SellDetailsTable } from '../../components/sellDetailsTable/SellDetailsTable';
import { useParams } from 'react-router-dom';
import { getCurrentAndPreviousDates } from '../../utils/getCurrentAndPreviousDates';
import { LoadingOverlay, Text } from '@mantine/core';
import { getItemsSellDetailsByPurchaseOrderIdAPI } from '../../utils/apiUtils';
import './SellDetailsPage.css';

const SellDetailsPage = () => {
  const { purchaseOrderId } = useParams<{ purchaseOrderId: string }>();
  const [tableData, setTableData] = useState<ItemSoldInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const monthlyDates = getCurrentAndPreviousDates(12);
  const weeklyDates = getCurrentAndPreviousDates(3);


  const updateOneMonthAndYearTableData = (
    tableDatas: ItemSoldInterface[]
  ): ItemSoldInterface[] => {
    return tableDatas.map((data) => {
      const lastMonthData = data.soldItemsByDate
        .slice(-1)
        .reduce((sum, data) => sum + data.value, 0);
      const lastYearSoldData = data.soldItemsByDate;
      return {
        ...data,
        lastMonthSold: lastMonthData,
        lastYearSold: lastYearSoldData,
      };
    });
  };

  const fetchSellDetails = async (
    type: 'monthly' | 'weekly',
    dates: { previousDate: string; currentDate: string },
    purchaseOrderId: string
  ) => {
    try {
      const response = await getItemsSellDetailsByPurchaseOrderIdAPI(
        purchaseOrderId,
        dates.previousDate,
        dates.currentDate,
        type
      );
      return response?.isError ? null : response.data;
    } catch (error) {
      return null;
    }
  };

  const mergeWeeklyData = (
    updatedData: any[],
    weeklyFetchedData: ItemSoldInterface[]
  ) => {
    return updatedData.map((dataItem) => {
      const matchedData = weeklyFetchedData.find(
        (weeklyData) => weeklyData.itemId === dataItem.itemId
      );

      return {
        ...dataItem,
        lastThreeMonthSold: matchedData
          ? formatSoldItemsByDate(matchedData.soldItemsByDate)
          : [],
      };
    });
  };

  const formatSoldItemsByDate = (soldItems: soldItemsByDateInterface[]) => {
    return soldItems.map((item) => ({
      ...item,
      date: formatDate(item.date),
    }));
  };

  const formatDate = (dateString: string) => {
    const formattedDate = new Date(dateString);
    const month = formattedDate.toLocaleString('en-US', { month: 'short' });
    const day = formattedDate.getDate().toString().padStart(2, '0');
    return `${month}-${day}`;
  };

  const fetchTableDetails = async () => {
    if (!purchaseOrderId?.trim()) return;

    setLoading(true);

    try {
      const monthlyData = await fetchSellDetails(
        'monthly',
        monthlyDates,
        purchaseOrderId
      );
      if (!monthlyData) {
        setIsError(true);
        setLoading(false);
        return;
      }
      const updatedData = updateOneMonthAndYearTableData(monthlyData);

      const weeklyData = await fetchSellDetails(
        'weekly',
        weeklyDates,
        purchaseOrderId
      );
      if (!weeklyData) {
        setIsError(true);
        setLoading(false);
        return;
      }

      const finalData = mergeWeeklyData(updatedData, weeklyData);
      setTableData(finalData);
      setIsError(false);
    } catch (error) {
      setIsError(true);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableDetails();
  }, [purchaseOrderId]);

  return (
    <div>
      <Text size="xl">Sell Details Page</Text>
      <LoadingOverlay
        className="purchase-loader"
        visible={loading}
        overlayBlur={1}
      />
      {isError ? (
        <div className="error-text-container">
          <Text size="lg">No data found.</Text>
        </div>
      ) : tableData.length > 0 ? (
        <SellDetailsTable
          tableData={tableData}
          threeMonthDates={weeklyDates}
          oneYearDates={monthlyDates}
        />
      ) : (
        <div className="error-text-container">
          <Text size="lg">No data found.</Text>
        </div>
      )}
    </div>
  );
};

export default SellDetailsPage;
