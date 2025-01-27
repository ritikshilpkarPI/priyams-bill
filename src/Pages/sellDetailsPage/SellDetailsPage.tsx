import React, { useEffect, useState } from 'react';
import { SellDetailsTable } from '../../components/sellDetailsTable/SellDetailsTable';
import { useParams } from 'react-router-dom';
import { getCurrentAndPreviousYearDates } from '../../utils/getCurrentAndPreviousYearDates';
import { LoadingOverlay, Text } from '@mantine/core';
import { getItemsSellDetailsByPurchaseOrderIdAPI } from '../../utils/apiUtils';
import './SellDetailsPage.css';

const SellDetailsPage = () => {
  const { purchaseOrderId } = useParams<{ purchaseOrderId: string }>();
  const [tableData, setTableData] = useState([]);
  const dates = getCurrentAndPreviousYearDates();

  const [startDate] = useState(dates.previousYearDate);
  const [endDate] = useState(dates.currentDate);
  const [timePeriod] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

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
        setIsError(true);
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
      {isError ? (
        <div className="error-text-container">
          <Text size="lg">No data found.</Text>
        </div>
      ) : tableData.length > 0 ? (
        <SellDetailsTable tableData={tableData} />
      ) : (
        <div className="error-text-container">
          <Text size="lg">No data found.</Text>
        </div>
      )}
    </div>
  );
};

export default SellDetailsPage;
