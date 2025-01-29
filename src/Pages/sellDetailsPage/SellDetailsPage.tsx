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

  const fetchTableDetails = async () => {
    if (purchaseOrderId?.trim()) {
      const startDate = monthlyDates.previousDate;
      const endDate = monthlyDates.currentDate;
      setLoading(true);
      const monthlyResponse = await getItemsSellDetailsByPurchaseOrderIdAPI(
        purchaseOrderId,
        startDate,
        endDate,
        'monthly'
      );
      if (monthlyResponse?.isError) {
        setLoading(false);
        setIsError(true);
      } else {
        const monthlyfetchedData = monthlyResponse.data;
        const updatedData = updateOneMonthAndYearTableData(monthlyfetchedData);

        const weeklystartDate = weeklyDates.previousDate;
        const weeklyendDate = weeklyDates.currentDate;

        const weeklyResponse = await getItemsSellDetailsByPurchaseOrderIdAPI(
          purchaseOrderId,
          weeklystartDate,
          weeklyendDate,
          'weekly'
        );
        if (weeklyResponse?.isError) {
          setLoading(false);
          setIsError(true);
        } else {
          const weeklyFetchedData = weeklyResponse.data;
          const newUpdatedData = updatedData.map((Data) => {
            const matchedData = weeklyFetchedData.find(
              (weeklyData: ItemSoldInterface) =>
                weeklyData.itemId === Data.itemId
            );
            if (matchedData) {
              const lastThreeMonthSoldData = matchedData.soldItemsByDate;

              return {
                ...Data,
                lastThreeMonthSold: lastThreeMonthSoldData.map(
                  (item: soldItemsByDateInterface) => {
                    const formattedDate = new Date(item.date);
                    const month = formattedDate.toLocaleString('en-US', {
                      month: 'short',
                    });
                    const day = formattedDate
                      .getDate()
                      .toString()
                      .padStart(2, '0');
                    const newDateFormat = `${month}-${day}`;
                    return { ...item, date: newDateFormat };
                  }
                ),
              };
            } else {
              return {
                ...Data,
                lastThreeMonthSold: [],
              };
            }
          });
          setTableData(newUpdatedData);
          setIsError(false);
          setLoading(false);
        }
      }
    }
  };

  console.log(tableData);

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
