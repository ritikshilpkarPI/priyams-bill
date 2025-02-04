import React, { useEffect, useRef, useState } from 'react';
import { SellDetailsTable } from '../../components/sellDetailsTable/SellDetailsTable';
import { useParams } from 'react-router-dom';
import { generateDatePair } from '../../utils/generateDatePair';
import { LoadingOverlay, Text } from '@mantine/core';
import { getItemsSellDetailsByPurchaseOrderIdAPI } from '../../utils/apiUtils';
import './SellDetailsPage.css';

const SellDetailsPage = () => {
  const { purchaseOrderId } = useParams<{ purchaseOrderId: string }>();
  const [tableData, setTableData] = useState<ItemSoldInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const oneYearDates = generateDatePair(12);
  const threeMonthDates = generateDatePair(3);
  const oneMonthDates = generateDatePair(1);

  const convertMonthDates = (data: soldItemsByDateInterface[]): soldItemsByDateInterface[] => {
    return data.map(({ date, value }) => {
      const dateObj = new Date(`${date}`);
      const formattedDate = `${dateObj.getFullYear()}-${dateObj.toLocaleString('en-US', { month: 'short' })}`;
      return { date: formattedDate, value };
    });
  };
 
  const formatDate = (dateString: string) => {
    const formattedDate = new Date(dateString);
    const month = formattedDate.toLocaleString('en-US', { month: 'short' });
    const day = formattedDate.getDate().toString().padStart(2, '0');
    return `${month}-${day}`;
  };

  const formatSoldItemsByDate = (soldItems: soldItemsByDateInterface[]) => {
    return soldItems.map((item) => ({
      ...item,
      date: formatDate(item.date),
    }));
  };

  const updateTableData = (
    tableDatas: ItemSoldInterface[]
  ): ItemSoldInterface[] => {
    return tableDatas.map((data) => {
      
      const lastMonthData = data.intervals
        .find((interval) => interval.startDate === oneMonthDates.previousDate)
        ?.data?.reduce((sum, data) => sum + data.value, 0);

      const lastThreeMonthData = data.intervals
        .find((interval) => interval.startDate === threeMonthDates.previousDate)
        ?.data

      const lastYearData = data.intervals
        .find((interval) => interval.startDate === oneYearDates.previousDate)
        ?.data;

      return {
        ...data,
        lastMonthSold: lastMonthData,
        lastYearSold: lastYearData ? convertMonthDates(lastYearData):[],
        lastThreeMonthSold: lastThreeMonthData
          ? formatSoldItemsByDate(lastThreeMonthData)
          : [],
      };
    });
  };

  const fetchSellDetails = async (
    intervals: IntervalPropInterface[],
    purchaseOrderId: string
  ) => {
    try {
      const response = await getItemsSellDetailsByPurchaseOrderIdAPI(
        purchaseOrderId,
        intervals
      );
      return response?.isError ? null : response.data;
    } catch (error) {
      return null;
    }
  };

  const fetchTableDetails = async () => {
    const intervals: IntervalPropInterface[] = [
      {
        startDate: oneYearDates.previousDate,
        endDate: oneYearDates.currentDate,
        timePeriod: 'monthly',
      },
      {
        startDate: threeMonthDates.previousDate,
        endDate: threeMonthDates.currentDate,
        timePeriod: 'weekly',
      },
      {
        startDate: oneMonthDates.previousDate,
        endDate: oneMonthDates.currentDate,
        timePeriod: 'monthly',
      },
    ];
    setLoading(true);
    if (!purchaseOrderId?.trim()) return;
    try {
      const response = await fetchSellDetails(intervals, purchaseOrderId);
      const updatedResponse = updateTableData(response);
      setTableData(updatedResponse);      
    } catch (error) {
      setIsError(true);
    }finally{
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
          threeMonthDates={threeMonthDates}
          oneYearDates={oneYearDates}
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