import React, { useEffect, useState } from 'react';
import { LineGraph } from '../../components/lineGraph/LineGraph';
import { SellDetailsTable } from '../../components/sellDetailsTable/SellDetailsTable';
import { sampleData } from './sampleData';
import { useParams } from 'react-router-dom';
import { getCurrentAndPreviousYearDates } from 'utils/getCurrentAndPreviousYearDates';
import { genericAxios } from 'utils/genericAxiosMethod';
import { API_METHODS } from 'utils/constants/apiMethods';
import { API_PATHS } from 'utils/constants/apiPaths';
import { LoadingOverlay, Text } from '@mantine/core';

const SellDetailsPage = () => {

  const { purchaseOrderId } = useParams<{ purchaseOrderId: string }>();
  console.log('purchaseOrderId:', purchaseOrderId);
  const [data, setData] = useState([]);
  const dates = getCurrentAndPreviousYearDates();

  const [startDate] = useState(dates.previousYearDate);
  const [endDate] = useState(dates.currentDate);
  const [timePeriod] = useState('monthly');
  const [loading, setLoading] = useState(false);



  const getItemsSellDetailsByPurchaseOrderId = async (
    purchaseOrderId: string,
    startDate: string,
    endDate: string,
    timePeriod: string
  ) => {
    try {
      setLoading(true);
      const response: any = await genericAxios({
        method: API_METHODS.POST,
        url: `${API_PATHS.PURCHASE_ORDER.GET_ITEM_SOLD}/${purchaseOrderId}?startDate=${startDate}&endDate=${endDate}&timePeriod=${timePeriod}`,
      });
      setData(response.data.data);     
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("hit");
    
    if (purchaseOrderId && startDate && endDate && timePeriod) {
      getItemsSellDetailsByPurchaseOrderId(
        purchaseOrderId,
        startDate,
        endDate,
        timePeriod
      );
    }
  },[purchaseOrderId, startDate, endDate, timePeriod]);
  if (data && data) {
    console.log(data);
  }

  return (
    <div>
      <h1>Sell Details Page</h1>
      <LoadingOverlay
        className="purchase-loader"
        visible={loading}
        overlayBlur={1}
      />     
      <SellDetailsTable tableData={data} />   
    </div>
  );
};

export default SellDetailsPage;