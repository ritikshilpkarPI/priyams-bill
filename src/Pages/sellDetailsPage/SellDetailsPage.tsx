import React, { useEffect, useState } from 'react';
import { SellDetailsTable } from '../../components/sellDetailsTable/SellDetailsTable';
import { useParams } from 'react-router-dom';
import { getCurrentAndPreviousYearDates } from '../../utils/getCurrentAndPreviousYearDates';
import { LoadingOverlay, Text } from '@mantine/core';
import { getItemsSellDetailsByPurchaseOrderIdAPI } from '../../utils/apiUtils';

const SellDetailsPage = () => {
  const { purchaseOrderId } = useParams<{ purchaseOrderId: string }>();
  const [tableData, setTableData] = useState([]);
  const dates = getCurrentAndPreviousYearDates();

  const [startDate] = useState(dates.previousYearDate);
  const [endDate] = useState(dates.currentDate);
  const [timePeriod] = useState('monthly');
  const [loading, setLoading] = useState(false);

  const fetchDetails = async () => {
    if (
      purchaseOrderId?.trim() &&
      startDate?.trim() &&
      endDate?.trim() &&
      timePeriod?.trim()
    ) {
      setLoading(true);
      const response = await getItemsSellDetailsByPurchaseOrderIdAPI(
        purchaseOrderId,
        startDate,
        endDate,
        timePeriod
      );
      if (response?.isError) {
        setLoading(false);
      } else {
        setTableData(response.data);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [purchaseOrderId, startDate, endDate, timePeriod]);

  return (
    <div>
      <h1>Sell Details Page</h1>
      <LoadingOverlay
        className="purchase-loader"
        visible={loading}
        overlayBlur={1}
      />
      {tableData.length > 0 ? (
        <SellDetailsTable tableData={tableData} />
      ) : (
        <Text>Something went wrong.</Text>
      )}
    </div>
  );
};

export default SellDetailsPage;
