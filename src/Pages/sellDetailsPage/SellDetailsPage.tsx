import React, { useEffect, useRef, useState } from 'react';
import { SellDetailsTable } from '../../components/sellDetailsTable/SellDetailsTable';
import { useParams } from 'react-router-dom';
import { getDateBeforeMonths } from '../../utils/getDateBeforeMonths';
import { LoadingOverlay, Text } from '@mantine/core';
import { getItemsSellDetailsByPurchaseOrderIdAPI } from '../../utils/apiUtils';
import './SellDetailsPage.css';
import { convertDateToISO } from 'src/utils/convertDateToISO';

const SellDetailsPage = () => {
  const { purchaseOrderId } = useParams<{ purchaseOrderId: string }>();
  const [tableData, setTableData] = useState<ItemSoldInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const lastOneMonthDate = getDateBeforeMonths(1);
  const lastThreeMonthDate = getDateBeforeMonths(3);
  const lastYearDate = getDateBeforeMonths(12);
  const currentDate = convertDateToISO(new Date())

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
        .find((interval) => interval.startDate === lastOneMonthDate)
        ?.data?.reduce((sum, data) => sum + data.value, 0);

      const lastThreeMonthData = data.intervals
        .find((interval) => interval.startDate === lastThreeMonthDate)
        ?.data

      const lastYearData = data.intervals
        .find((interval) => interval.startDate === lastYearDate)
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
        startDate: lastYearDate,
        endDate: currentDate,
        timePeriod: 'monthly',
      },
      {
        startDate: lastThreeMonthDate,
        endDate: currentDate,
        timePeriod: 'weekly',
      },
      {
        startDate: lastOneMonthDate,
        endDate: currentDate,
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
          currentDate={currentDate}
          lastThreeMonthDate={lastThreeMonthDate}
          lastYearDate={lastYearDate}
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