import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Title,
  Text,
  Select,
  Table,
  Card,
  Group,
  Stack,
  Center,
  Loader,
  Button,
} from '@mantine/core';
import { DateRangePicker, TimeRangeInput } from '@mantine/dates';
import { IconChartBar, IconUsers, IconPackage, IconBuildingStore } from '@tabler/icons-react';
import { postAPI } from '../utils/apiMethods';
import { API_PATHS } from '../utils/constants/apiPaths';

interface ReportData {
  success: boolean;
  data: any[]; // Data field for report content (backend now sends in 'data')
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

// Helper function to format date for CSV filename
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  })
    .replace(/,/g, '')  // Remove commas
    .replace(/ /g, '-'); // 30-Dec-23 format
};

const Dashboard = () => {
  const [loading, setLoading] = useState<Record<string, boolean>>({
    totalSales: false,
    totalItems: false,
    activeDealers: false,
    categories: false,
    topSelling: false,
    topDealers: false,
    categoryWise: false,
    brandWise: false,
    // Add loading states for new reports
    totalProfit: false,
    totalDiscount: false,
    totalMRP: false,
    allItemsBillingTrend: false,
    purchasedItems: false,
  });

  const [dateRanges, setDateRanges] = useState<Record<string, [Date | null, Date | null]>>({
    totalSales: [null, null],
    totalItems: [null, null],
    activeDealers: [null, null],
    categories: [null, null],
    topSelling: [null, null],
    topDealers: [null, null],
    categoryWise: [null, null],
    brandWise: [null, null],
    // Add date ranges for new reports
    totalProfit: [null, null],
    totalDiscount: [null, null],
    totalMRP: [null, null],
    allItemsBillingTrend: [null, null],
    purchasedItems: [null, null],
  });

  // Add timeRanges state back for reports that need it (e.g., purchasedItems)
  const [timeRanges, setTimeRanges] = useState<Record<string, [Date, Date]>>({
    purchasedItems: [new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 999))],
    allItemsBillingTrend: [new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 999))],
    // Initialize other time ranges if needed, or remove if not used
     totalSales: [new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 999))],
     totalItems: [new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 999))],
     activeDealers: [new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 999))],
     categories: [new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 999))],
     topSelling: [new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 999))],
     topDealers: [new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 999))],
     categoryWise: [new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 999))],
     brandWise: [new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 999))],
     totalProfit: [new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 999))],
     totalDiscount: [new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 999))],
     totalMRP: [new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 999))],
  });

  // Separate state variables for each section's specific data needs
  const [summaryTotalSales, setSummaryTotalSales] = useState<any[] | undefined>(undefined); // highestSellingByAmount
  const [summaryTotalItemsSold, setSummaryTotalItemsSold] = useState<any[] | undefined>(undefined); // highestSellingByQuantity
  const [summaryActiveDealers, setSummaryActiveDealers] = useState<any[] | undefined>(undefined); // topDealersByQuantity
  const [summaryCategories, setSummaryCategories] = useState<any[] | undefined>(undefined); // categoryWiseTopProducts

  const [topSellingItemsData, setTopSellingItemsData] = useState<any[] | undefined>(undefined); // highestSellingByQuantity for Top Selling section
  const [topDealersData, setTopDealersData] = useState<any[] | undefined>(undefined); // topDealersByQuantity for Top Dealers section
  const [categoryWiseData, setCategoryWiseData] = useState<any[] | undefined>(undefined); // categoryWiseTopProducts for Category-wise section
  const [brandWiseData, setBrandWiseData] = useState<any[] | undefined>(undefined); // brandWiseTopProducts for Brand-wise section

  // State variables for new reports
  const [totalProfitData, setTotalProfitData] = useState<any[] | undefined>(undefined);
  const [totalDiscountData, setTotalDiscountData] = useState<any[] | undefined>(undefined);
  const [totalMRPData, setTotalMRPData] = useState<any[] | undefined>(undefined);
  const [allItemsBillingTrendData, setAllItemsBillingTrendData] = useState<any[] | undefined>(undefined);
  const [purchasedItemsData, setPurchasedItemsData] = useState<any[] | undefined>(undefined);

  // Updated fetch function to use postAPI and handle consolidated backend response
  const fetchData = async (reportType: string, startDate: Date, endDate: Date, itemName?: string): Promise<any[] | undefined> => {
     try {
       console.log(`Fetching ${reportType} data with:`, {
         startDate, endDate, itemName
       });

       const response = await postAPI({
         path: API_PATHS.REPORT.POST_SALES_REPORTS + '/reports', // Single endpoint
         data: {
           reportType: reportType,
           startDate: startDate.toISOString().split('T')[0],
           endDate: endDate.toISOString().split('T')[0],
           ...(itemName && { itemName: itemName }), // Include itemName if provided
         },
       });

       console.log(`${reportType} API Response:`, response);

       // Backend now sends the report data in the 'data' field
       if (response.success && response.data) {
           return response.data; // Return the data array
       } else {
           console.error(`Failed to fetch ${reportType} report or unexpected response structure:`, response);
           return undefined; // Return undefined on failure or unexpected structure
       }

     } catch (error) {
       console.error(`Error fetching ${reportType} report:`, error);
       return undefined; // Return undefined on error
     }
   };

  // Function to handle CSV download - Updated to use data directly
  const handleDownloadCSV = (reportType: string, data: any[]) => {
    let csvContent;
    const dateRange = dateRanges[reportType];
    const startDate = dateRange && dateRange[0] ?
      formatDate(dateRange[0]) :
      'start-date';
    const fileName = `${startDate}_${reportType}.csv`
      .replace(/ /g, '-')
      .toLowerCase();

    // Implement CSV generation based on reportType and data structure
    if (reportType === 'purchasedItems') {
      const csvRows = [
        ['Barcode', 'Item Name', 'Total Stock', 'MRP', 'Cost Price', 'Last Purchase Date', 'Total Orders', 'Suppliers'],
        ...data.map(item => [
          item.barcode ?? 'N/A',
          item.itemName ?? 'N/A',
          item.totalStock ?? 0,
          item.mrp?.toFixed(2) ?? '0.00',
          item.costPrice?.toFixed(2) ?? '0.00',
          item.lastPurchaseDate ? formatDate(new Date(item.lastPurchaseDate)) : 'N/A',
          item.totalOrders ?? 0,
          item.suppliers?.join(', ') ?? 'N/A',
        ])
      ];
       csvContent = csvRows.map(row => row.join(',')).join('\n');
    } else if (reportType === 'allItemsBillingTrend') {
       const csvRows = [
        ['Item Name', 'Barcode', 'Quantity', 'Amount', 'MRP', 'Discount'],
         ...data.map(item => [
          item?.items?.[0]?.itemDetail?.itemName ?? 'N/A',
          item.itemBarcode ?? 'N/A',
          item.totalQuantitysum ?? 0,
          item.totalAmountSum?.toFixed(2) ?? '0.00',
          item.totalMRPsum?.toFixed(2) ?? '0.00',
          item.totalDiscountSum?.toFixed(2) ?? '0.00',
         ])
       ];
      csvContent = csvRows.map(row => row.join(',')).join('\n');
    } else {
      // Generic CSV generation for reports with SKU, Barcode, Quantity, MRP, Total Amount, Discount
      const csvRows = [
        ['SKU', 'Barcode', 'Quantity', 'MRP', 'Total Amount', 'Discount'],
        ...data.map(item => ([ // Assuming a structure similar to old reports for generic case
          item.sku ?? 'N/A',
          item.barcode ?? 'N/A',
          item.totalQuantity ?? 0,
          item.totalMRP?.toFixed(2) ?? '0.00',
          item.totalAmount?.toFixed(2) ?? '0.00',
          item.totalDiscount?.toFixed(2) ?? '0.00',
        ]))
      ];
      csvContent = csvRows.map(row => row.join(',')).join('\n');
    }

    const blob = new Blob([csvContent ?? ''], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Function to handle fetching for a specific section and updating its state
  const fetchSectionData = async (section: string, startDate: Date, endDate: Date, itemName?: string) => {
      console.log(`fetchSectionData called for section: ${section}, dates: ${startDate.toISOString()} - ${endDate.toISOString()}`);
      setLoading(prev => ({ ...prev, [section]: true }));
      try {
          let data;
          switch(section) {
              case 'totalSales':
                  data = await fetchData('highestSellingByAmount', startDate, endDate);
                  setSummaryTotalSales(data);
                  break;
              case 'totalItems':
                  data = await fetchData('highestSellingByQuantity', startDate, endDate);
                  setSummaryTotalItemsSold(data);
                  break;
              case 'activeDealers':
                  data = await fetchData('topDealersByQuantity', startDate, endDate);
                  setSummaryActiveDealers(data);
                  break;
              case 'categories':
                  data = await fetchData('categoryWiseTopProducts', startDate, endDate);
                  setSummaryCategories(data);
                  break;
              case 'topSelling':
                  data = await fetchData('highestSellingByQuantity', startDate, endDate);
                  setTopSellingItemsData(data);
                  break;
              case 'topDealers':
                   data = await fetchData('topDealersByQuantity', startDate, endDate);
                   setTopDealersData(data);
                   break;
              case 'categoryWise':
                  data = await fetchData('categoryWiseTopProducts', startDate, endDate);
                  setCategoryWiseData(data);
                  break;
              case 'brandWise':
                  data = await fetchData('brandWiseTopProducts', startDate, endDate);
                  setBrandWiseData(data);
                  break;
              // Add cases for new report types and update their respective states
              case 'totalProfit':
                  data = await fetchData('totalProfit', startDate, endDate);
                  setTotalProfitData(data);
                  break;
              case 'totalDiscount':
                  data = await fetchData('totalDiscount', startDate, endDate);
                  setTotalDiscountData(data);
                  break;
              case 'totalMRP':
                  data = await fetchData('totalMRP', startDate, endDate);
                  setTotalMRPData(data);
                  break;
              case 'allItemsBillingTrend':
                  data = await fetchData('allItemsBillingTrend', startDate, endDate);
                  setAllItemsBillingTrendData(data);
                  break;
              case 'purchasedItems':
                  data = await fetchData('purchasedItems', startDate, endDate);
                  setPurchasedItemsData(data);
                  break;
               case 'itemBillingTrend': // Handle itemBillingTrend if needed in the UI
                  // You might need a way to select the item name for this report
                  // For now, it's not rendered in the provided JSX, but included for completeness
                  console.warn('Item Billing Trend report fetching triggered, but no UI to display it.');
                  // data = await fetchData('itemBillingTrend', startDate, endDate, 'SomeItemName'); // Replace with actual item name logic
                  // setItemBillingTrendData(data); // Assuming a state variable for this
                  break;
          }
      } finally {
          setLoading(prev => ({ ...prev, [section]: false }));
           console.log(`Loading state set to false for section: ${section}`);
      }
  }

  // Initial data fetch with default date range on mount
  useEffect(() => {
    const defaultStartDate = new Date(new Date().setDate(new Date().getDate() - 15));
    const defaultEndDate = new Date();

    // Include all report types in initial date ranges
    const initialDateRanges: Record<string, [Date, Date]> = {
        totalSales: [defaultStartDate, defaultEndDate],
        totalItems: [defaultStartDate, defaultEndDate],
        activeDealers: [defaultStartDate, defaultEndDate],
        categories: [defaultStartDate, defaultEndDate],
        topSelling: [defaultStartDate, defaultEndDate],
        topDealers: [defaultStartDate, defaultEndDate],
        categoryWise: [defaultStartDate, defaultEndDate],
        brandWise: [defaultStartDate, defaultEndDate],
        // Add initial ranges for new reports
        totalProfit: [defaultStartDate, defaultEndDate],
        totalDiscount: [defaultStartDate, defaultEndDate],
        totalMRP: [defaultStartDate, defaultEndDate],
        allItemsBillingTrend: [defaultStartDate, defaultEndDate],
        purchasedItems: [defaultStartDate, defaultEndDate],
         // itemBillingTrend: [defaultStartDate, defaultEndDate], // Include if adding UI for this
    };

    // Set the initial date ranges state
    // setDateRanges(initialDateRanges); // Removed: setting individual ranges in the loop is better

    // Trigger initial fetches for all sections and set their initial date ranges
     Object.entries(initialDateRanges).forEach(([section, [startDate, endDate]]) => {
       if (startDate && endDate) {
         // Set the initial date range for the section
         setDateRanges(prev => ({
             ...prev,
             [section]: [startDate, endDate]
         }));
         // Trigger data fetch
         console.log(`Initial fetch triggered for ${section} with dates:`, { startDate, endDate });
         // For itemBillingTrend, you might need to pass an initial itemName
         // fetchSectionData(section, startDate, endDate, section === 'itemBillingTrend' ? 'InitialItem' : undefined);
         fetchSectionData(section, startDate, endDate);
       } else {
            // If for some reason initial dates are null, set loading to false
            setLoading(prev => ({ ...prev, [section]: false }));
       }
     });

  }, []); // Run only on mount

  const handleDateRangeChange = (section: string, newDateRange: [Date | null, Date | null]) => {
    console.log(`handleDateRangeChange called for section: ${section}, newDateRange:`, newDateRange);
    // Always update date range state immediately
    setDateRanges(prev => {
      console.log(`Updating dateRanges state for section: ${section}`, { ...prev, [section]: newDateRange });
      return { ...prev, [section]: newDateRange };
    });

    // Fetch when the date range becomes complete
    if (newDateRange[0] instanceof Date && newDateRange[1] instanceof Date) {
        const startDate = newDateRange[0];
        const endDate = newDateRange[1];
        // For itemBillingTrend, you might need a way to get the selected item name
        // fetchSectionData(section, startDate, endDate, section === 'itemBillingTrend' ? 'SelectedItemName' : undefined);
        fetchSectionData(section, startDate, endDate);
    } else {
        // Clear data and set loading to false if date range is incomplete
        switch(section) {
            case 'totalSales': setSummaryTotalSales(undefined); break;
            case 'totalItems': setSummaryTotalItemsSold(undefined); break;
            case 'activeDealers': setSummaryActiveDealers(undefined); break;
            case 'categories': setSummaryCategories(undefined); break;
            case 'topSelling': setTopSellingItemsData(undefined); break;
            case 'topDealers': setTopDealersData(undefined); break;
            case 'categoryWise': setCategoryWiseData(undefined); break;
            case 'brandWise': setBrandWiseData(undefined); break;
            case 'totalProfit': setTotalProfitData(undefined); break;
            case 'totalDiscount': setTotalDiscountData(undefined); break;
            case 'totalMRP': setTotalMRPData(undefined); break;
            case 'allItemsBillingTrend': setAllItemsBillingTrendData(undefined); break;
            case 'purchasedItems': setPurchasedItemsData(undefined); break;
             // case 'itemBillingTrend': setItemBillingTrendData(undefined); break;
        }
        setLoading(prev => ({ ...prev, [section]: false }));
    }
  };

  // useEffect to fetch data when their date ranges change and are complete for all sections
  // Consolidating these useEffects is possible but might make dependencies complex.
  // Keeping separate for clarity and independent triggering based on each date range.

  useEffect(() => {
    const dateRange = dateRanges.totalSales;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
      fetchSectionData('totalSales', dateRange[0], dateRange[1]);
    } else {
      setLoading(prev => ({ ...prev, totalSales: false }));
    }
  }, [dateRanges.totalSales]);

  useEffect(() => {
    const dateRange = dateRanges.totalItems;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
      fetchSectionData('totalItems', dateRange[0], dateRange[1]);
    } else {
      setLoading(prev => ({ ...prev, totalItems: false }));
    }
  }, [dateRanges.totalItems]);

  useEffect(() => {
    const dateRange = dateRanges.activeDealers;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
      fetchSectionData('activeDealers', dateRange[0], dateRange[1]);
    } else {
      setLoading(prev => ({ ...prev, activeDealers: false }));
    }
  }, [dateRanges.activeDealers]);

  useEffect(() => {
    const dateRange = dateRanges.categories;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
      fetchSectionData('categories', dateRange[0], dateRange[1]);
    } else {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  }, [dateRanges.categories]);

  useEffect(() => {
    const dateRange = dateRanges.topSelling;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
      fetchSectionData('topSelling', dateRange[0], dateRange[1]);
    } else {
       setLoading(prev => ({ ...prev, topSelling: false }));
    }
  }, [dateRanges.topSelling]);

  useEffect(() => {
    const dateRange = dateRanges.topDealers;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
      fetchSectionData('topDealers', dateRange[0], dateRange[1]);
    } else {
       setLoading(prev => ({ ...prev, topDealers: false }));
    }
  }, [dateRanges.topDealers]);

   useEffect(() => {
    const dateRange = dateRanges.categoryWise;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
      fetchSectionData('categoryWise', dateRange[0], dateRange[1]);
    } else {
       setLoading(prev => ({ ...prev, categoryWise: false }));
    }
  }, [dateRanges.categoryWise]);

  useEffect(() => {
    const dateRange = dateRanges.brandWise;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
      fetchSectionData('brandWise', dateRange[0], dateRange[1]);
    } else {
       setLoading(prev => ({ ...prev, brandWise: false }));
    }
  }, [dateRanges.brandWise]);

  // useEffect for new report types
  useEffect(() => {
    const dateRange = dateRanges.totalProfit;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
      fetchSectionData('totalProfit', dateRange[0], dateRange[1]);
    } else {
      setLoading(prev => ({ ...prev, totalProfit: false }));
    }
  }, [dateRanges.totalProfit]);

  useEffect(() => {
    const dateRange = dateRanges.totalDiscount;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
      fetchSectionData('totalDiscount', dateRange[0], dateRange[1]);
    } else {
      setLoading(prev => ({ ...prev, totalDiscount: false }));
    }
  }, [dateRanges.totalDiscount]);

  useEffect(() => {
    const dateRange = dateRanges.totalMRP;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
      fetchSectionData('totalMRP', dateRange[0], dateRange[1]);
    } else {
      setLoading(prev => ({ ...prev, totalMRP: false }));
    }
  }, [dateRanges.totalMRP]);

  useEffect(() => {
    const dateRange = dateRanges.allItemsBillingTrend;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
       // Note: timeRanges for allItemsBillingTrend is not used in fetch, only for display/CSV if re-added
      fetchSectionData('allItemsBillingTrend', dateRange[0], dateRange[1]);
    } else {
      setLoading(prev => ({ ...prev, allItemsBillingTrend: false }));
    }
  }, [dateRanges.allItemsBillingTrend]);

  useEffect(() => {
    const dateRange = dateRanges.purchasedItems;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
       // Note: timeRanges for purchasedItems is not used in fetch, only for display/CSV if re-added
      fetchSectionData('purchasedItems', dateRange[0], dateRange[1]);
    } else {
      setLoading(prev => ({ ...prev, purchasedItems: false }));
    }
  }, [dateRanges.purchasedItems]);


  // Rendering functions for existing tables (using data field)
  const renderTopSellingItems = (data: any[]) => (
    <Table>
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Barcode</th>
          <th>Quantity</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.sku}</td>
            <td>{item.barcode}</td>
            <td>{item.totalQuantity}</td>
            <td>₹{item.totalAmount.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderCategoryBrandReport = (data: any[]) => (
    <Table>
      <thead>
        <tr>
          <th>Category/Brand</th>
          <th>Top Products</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.category || item.brand}</td>
            <td>
              <Stack spacing="xs">
                {item.topProducts.map((product: any, idx: number) => (
                  <Text key={idx} size="sm">
                    {product.sku} - Qty: {product.totalQuantity} (₹{product.totalAmount.toFixed(2)})
                  </Text>
                ))}
              </Stack>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderTopDealers = (data: any[]) => (
    <Table>
      <thead>
        <tr>
          <th>Dealer Name</th>
          <th>Quantity</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.map((dealer, index) => (
          <tr key={index}>
            <td>{dealer.dealerName}</td>
            <td>{dealer.totalQuantity}</td>
            <td>₹{dealer.totalAmount.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  // Rendering function for All Items Billing Trend (from new API - using data field)
  const renderAllItemsBillingTrend = (data: any[]) => (
    <Table>
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Barcode</th>
          <th>Quantity</th>
          <th>Amount</th>
          <th>MRP</th>
          <th>Discount</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item?.items?.[0]?.itemDetail?.itemName ?? 'N/A'}</td>
            <td>{item.itemBarcode ?? 'N/A'}</td>
            <td>{item.totalQuantitysum ?? 0}</td>
            <td>₹{item.totalAmountSum?.toFixed(2) ?? '0.00'}</td>
            <td>₹{item.totalMRPsum?.toFixed(2) ?? '0.00'}</td>
            <td>₹{item.totalDiscountSum?.toFixed(2) ?? '0.00'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  // Rendering function for Purchased Items (from new API - using data field)
  const renderPurchasedItems = (data: any[]) => (
    <Table>
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Barcode</th>
          <th>Total Stock</th>
          <th>MRP</th>
          <th>Cost Price</th>
          <th>Last Purchase Date</th>
          <th>Total Orders</th>
          <th>Suppliers</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.itemName ?? 'N/A'}</td>
            <td>{item.barcode ?? 'N/A'}</td>
            <td>{item.totalStock ?? 0}</td>
            <td>₹{item.mrp?.toFixed(2) ?? '0.00'}</td>
            <td>₹{item.costPrice?.toFixed(2) ?? '0.00'}</td>
            <td>{item.lastPurchaseDate ? new Date(item.lastPurchaseDate).toLocaleDateString() : 'N/A'}</td>
            <td>{item.totalOrders ?? 0}</td>
            <td>{item.suppliers?.join(', ') ?? 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );


  return (
    <Container size="xl" py="xl">
      <Stack spacing="xl">
        <Title order={2}>Sales Dashboard</Title>

        {/* Existing Summary Cards */}
        <Grid>
          <Grid.Col span={3}>
            <Card withBorder p="md" radius="md">
              <form onSubmit={(e) => e.preventDefault()}>
                <Stack spacing="xs">
                  <DateRangePicker
                    label="Total Sales Date Range"
                    value={dateRanges.totalSales}
                    onChange={(value: [Date | null, Date | null]) => handleDateRangeChange('totalSales', value)}
                    clearable
                    size="xs"
                    w="100%"
                    styles={{ dropdown: { zIndex: 1000 } }}
                    withinPortal={true}
                  />
                  {loading.totalSales ? (
                    <Center p="xs">
                      <Loader size="sm" />
                    </Center>
                  ) : (summaryTotalSales && summaryTotalSales.length > 0 ? (
                    <Group>
                      <IconChartBar size={32} color="blue" />
                      <div>
                        <Text size="xs" c="dimmed">Total Sales</Text>
                        <Text fw={700} size="xl">
                          ₹{summaryTotalSales.reduce((sum, item) => sum + item.totalAmount, 0).toFixed(2)}
                        </Text>
                      </div>
                    </Group>
                   ) : (
                       <Text size="xs" c="dimmed">No Total Sales data</Text>
                   )
                  )}
                </Stack>
              </form>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
            <Card withBorder p="md" radius="md">
              <form onSubmit={(e) => e.preventDefault()}>
                <Stack spacing="xs">
                  <DateRangePicker
                    label="Total Items Date Range"
                    value={dateRanges.totalItems}
                    onChange={(value: [Date | null, Date | null]) => handleDateRangeChange('totalItems', value)}
                    clearable
                    size="xs"
                    w="100%"
                    styles={{ dropdown: { zIndex: 1000 } }}
                    withinPortal={true}
                  />
                  {loading.totalItems ? (
                    <Center p="xs">
                      <Loader size="sm" />
                    </Center>
                  ) : (summaryTotalItemsSold && summaryTotalItemsSold.length > 0 ? (
                    <Group>
                      <IconPackage size={32} color="green" />
                      <div>
                        <Text size="xs" c="dimmed">Total Items Sold</Text>
                        <Text fw={700} size="xl">
                          {summaryTotalItemsSold.reduce((sum, item) => sum + item.totalQuantity, 0)}
                        </Text>
                      </div>
                    </Group>
                   ) : (
                       <Text size="xs" c="dimmed">No Total Items data</Text>
                   )
                  )}
                </Stack>
              </form>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
            <Card withBorder p="md" radius="md">
              <form onSubmit={(e) => e.preventDefault()}>
                <Stack spacing="xs">
                  <DateRangePicker
                    label="Active Dealers Date Range"
                    value={dateRanges.activeDealers}
                    onChange={(value: [Date | null, Date | null]) => handleDateRangeChange('activeDealers', value)}
                    clearable
                    size="xs"
                    w="100%"
                    styles={{ dropdown: { zIndex: 1000 } }}
                    withinPortal={true}
                  />
                  {loading.activeDealers ? (
                    <Center p="xs">
                      <Loader size="sm" />
                    </Center>
                  ) : (summaryActiveDealers && summaryActiveDealers.length > 0 ? (
                    <Group>
                      <IconUsers size={32} color="orange" />
                      <div>
                        <Text size="xs" c="dimmed">Active Dealers</Text>
                        <Text fw={700} size="xl">
                          {summaryActiveDealers.length}
                        </Text>
                      </div>
                    </Group>
                   ) : (
                       <Text size="xs" c="dimmed">No Active Dealers data</Text>
                   )
                  )}
                </Stack>
              </form>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
            <Card withBorder p="md" radius="md">
              <form onSubmit={(e) => e.preventDefault()}>
                <Stack spacing="xs">
                  <DateRangePicker
                    label="Categories Date Range"
                    value={dateRanges.categories}
                    onChange={(value: [Date | null, Date | null]) => handleDateRangeChange('categories', value)}
                    clearable
                    size="xs"
                    w="100%"
                    styles={{ dropdown: { zIndex: 1000 } }}
                    withinPortal={true}
                  />
                  {loading.categories ? (
                    <Center p="xs">
                      <Loader size="sm" />
                    </Center>
                  ) : (summaryCategories && summaryCategories.length > 0 ? (
                    <Group>
                      <IconBuildingStore size={32} color="grape" />
                      <div>
                        <Text size="xs" c="dimmed">Categories</Text>
                        <Text fw={700} size="xl">
                          {summaryCategories.length}
                        </Text>
                      </div>
                    </Group>
                   ) : (
                       <Text size="xs" c="dimmed">No Categories data</Text>
                   )
                  )}
                </Stack>
              </form>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Existing Report Tables */}
        <Grid>
          <Grid.Col span={6}>
            <Paper withBorder p="md" radius="md">
              <Stack spacing="xs">
                <Group position="apart" align="flex-start">
                  <Title order={3}>Top Selling Items</Title>
                  <DateRangePicker
                    label="Date Range"
                    value={dateRanges.topSelling}
                    onChange={(value: [Date | null, Date | null]) => handleDateRangeChange('topSelling', value)}
                    clearable
                    size="xs"
                    w={300}
                    styles={{ dropdown: { zIndex: 1000 } }}
                    withinPortal={true}
                  />
                </Group>
                {loading.topSelling ? (
                  <Center p="xl">
                    <Loader size="sm" />
                  </Center>
                ) : (topSellingItemsData && topSellingItemsData.length > 0 ? (
                  renderTopSellingItems(topSellingItemsData)
                ) : (
                  <Text align="center">No data available for the selected date range.</Text>
                ))}
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={6}>
            <Paper withBorder p="md" radius="md">
              <Stack spacing="xs">
                <Group position="apart" align="flex-start">
                  <Title order={3}>Top Dealers</Title>
                  <DateRangePicker
                    label="Date Range"
                    value={dateRanges.topDealers}
                    onChange={(value: [Date | null, Date | null]) => handleDateRangeChange('topDealers', value)}
                    clearable
                    size="xs"
                    w={300}
                    styles={{ dropdown: { zIndex: 1000 } }}
                    withinPortal={true}
                  />
                </Group>
                {loading.topDealers ? (
                  <Center p="xl">
                    <Loader size="sm" />
                  </Center>
                ) : (topDealersData && topDealersData.length > 0 ? (
                  renderTopDealers(topDealersData)
                ) : (
                  <Text align="center">No data available for the selected date range.</Text>
                ))}
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper withBorder p="md" radius="md">
              <Stack spacing="xs">
                <Group position="apart" align="flex-start">
                  <Title order={3}>Category-wise Performance</Title>
                  <DateRangePicker
                    label="Date Range"
                    value={dateRanges.categoryWise}
                    onChange={(value: [Date | null, Date | null]) => handleDateRangeChange('categoryWise', value)}
                    clearable
                    size="xs"
                    w={300}
                    styles={{ dropdown: { zIndex: 1000 } }}
                    withinPortal={true}
                  />
                </Group>
                {loading.categoryWise ? (
                  <Center p="xl">
                    <Loader size="sm" />
                  </Center>
                ) : (categoryWiseData && categoryWiseData.length > 0 ? (
                  renderCategoryBrandReport(categoryWiseData)
                ) : (
                  <Text align="center">No data available for the selected date range.</Text>
                ))}
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper withBorder p="md" radius="md">
              <Stack spacing="xs">
                <Group position="apart" align="flex-start">
                  <Title order={3}>Brand-wise Performance</Title>
                  <DateRangePicker
                    label="Date Range"
                    value={dateRanges.brandWise}
                    onChange={(value: [Date | null, Date | null]) => handleDateRangeChange('brandWise', value)}
                    clearable
                    size="xs"
                    w={300}
                    styles={{ dropdown: { zIndex: 1000 } }}
                    withinPortal={true}
                  />
                </Group>
                {loading.brandWise ? (
                  <Center p="xl">
                    <Loader size="sm" />
                  </Center>
                ) : (brandWiseData && brandWiseData.length > 0 ? (
                  renderCategoryBrandReport(brandWiseData)
                ) : (
                  <Text align="center">No data available for the selected date range.</Text>
                ))}
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* New Reports Section */}
        <Title order={2} mt="xl">Date Range Reports</Title>

        {/* New Summary Cards */}
        <Grid gutter="xl" mb="xl">
          <Grid.Col span={3}>
            <Card withBorder p="md" radius="md">
              <form onSubmit={(e) => e.preventDefault()}>
                <Stack spacing="xs">
                  <DateRangePicker
                    label="Total Profit Date Range"
                    value={dateRanges.totalProfit}
                    onChange={(value: [Date | null, Date | null]) => handleDateRangeChange('totalProfit', value)}
                    clearable
                    size="xs"
                    w="100%"
                    styles={{ dropdown: { zIndex: 1000 } }}
                    withinPortal={true}
                  />
                  {loading.totalProfit ? (
                    <Center p="xs">
                      <Loader size="sm" />
                    </Center>
                  ) : (totalProfitData && totalProfitData.length > 0 ? (
                    <Group>
                       <IconChartBar size={32} color="teal" />
                      <div>
                        <Text size="xs" c="dimmed">Total Profit</Text>
                        <Text fw={700} size="xl">
                          रु {totalProfitData[0].totalProfitSum?.toFixed(2) ?? '0.00'}
                        </Text>
                      </div>
                    </Group>
                   ) : (
                       <Text size="xs" c="dimmed">No Total Profit data</Text>
                   )
                  )}
                </Stack>
              </form>
            </Card>
          </Grid.Col>

           <Grid.Col span={3}>
            <Card withBorder p="md" radius="md">
              <form onSubmit={(e) => e.preventDefault()}>
                <Stack spacing="xs">
                  <DateRangePicker
                    label="Total Discount Date Range"
                    value={dateRanges.totalDiscount}
                    onChange={(value: [Date | null, Date | null]) => handleDateRangeChange('totalDiscount', value)}
                    clearable
                    size="xs"
                    w="100%"
                    styles={{ dropdown: { zIndex: 1000 } }}
                    withinPortal={true}
                  />
                  {loading.totalDiscount ? (
                    <Center p="xs">
                      <Loader size="sm" />
                    </Center>
                  ) : (totalDiscountData && totalDiscountData.length > 0 ? (
                     <Group>
                       <IconChartBar size={32} color="red" />
                      <div>
                        <Text size="xs" c="dimmed">Total Discount</Text>
                        <Text fw={700} size="xl">
                           रु {totalDiscountData[0].totalDiscountSum?.toFixed(2) ?? '0.00'}
                        </Text>
                      </div>
                    </Group>
                   ) : (
                       <Text size="xs" c="dimmed">No Total Discount data</Text>
                   )
                  )}
                </Stack>
              </form>
            </Card>
          </Grid.Col>

           <Grid.Col span={3}>
            <Card withBorder p="md" radius="md">
              <form onSubmit={(e) => e.preventDefault()}>
                <Stack spacing="xs">
                  <DateRangePicker
                    label="Total MRP Date Range"
                    value={dateRanges.totalMRP}
                    onChange={(value: [Date | null, Date | null]) => handleDateRangeChange('totalMRP', value)}
                    clearable
                    size="xs"
                    w="100%"
                    styles={{ dropdown: { zIndex: 1000 } }}
                    withinPortal={true}
                  />
                  {loading.totalMRP ? (
                    <Center p="xs">
                      <Loader size="sm" />
                    </Center>
                  ) : (totalMRPData && totalMRPData.length > 0 ? (
                     <Group>
                        <IconChartBar size={32} color="violet" />
                       <div>
                         <Text size="xs" c="dimmed">Total MRP</Text>
                         <Text fw={700} size="xl">
                            रु {totalMRPData[0].totalMRPSum?.toFixed(2) ?? '0.00'}
                         </Text>
                       </div>
                     </Group>
                   ) : (
                       <Text size="xs" c="dimmed">No Total MRP data</Text>
                   )
                  )}
                </Stack>
              </form>
            </Card>
          </Grid.Col>
        </Grid>

        {/* New Report Tables */}
        <Grid>
           <Grid.Col span={12}>
            <Paper withBorder p="md" radius="md">
              <Stack spacing="xs">
                <Group position="apart" align="flex-start">
                  <Title order={3}>All Items Billing Trend</Title>
                  <Group>
                    <DateRangePicker
                      label="Date Range"
                      value={dateRanges.allItemsBillingTrend}
                      onChange={(value: [Date | null, Date | null]) => handleDateRangeChange('allItemsBillingTrend', value)}
                      clearable
                      size="xs"
                      w={300}
                      styles={{ dropdown: { zIndex: 1000 } }}
                      withinPortal={true}
                    />
                     {/* Add TimeRangeInput back */}
                     <TimeRangeInput
                      label="Time Range"
                      value={timeRanges.allItemsBillingTrend}
                      onChange={(value) => setTimeRanges(prev => ({ ...prev, allItemsBillingTrend: value }))}
                      clearable
                      size="xs"
                      w={300}
                    />
                    {/* Add Download CSV button back */}
                     <Button
                      onClick={() => allItemsBillingTrendData && handleDownloadCSV('allItemsBillingTrend', allItemsBillingTrendData)}
                      disabled={!allItemsBillingTrendData || allItemsBillingTrendData.length === 0}
                    >
                      Download CSV
                    </Button>
                  </Group>
                </Group>
                {loading.allItemsBillingTrend ? (
                  <Center p="xl">
                    <Loader size="sm" />
                  </Center>
                ) : (allItemsBillingTrendData && allItemsBillingTrendData.length > 0 ? (
                  renderAllItemsBillingTrend(allItemsBillingTrendData)
                ) : (
                  <Text align="center">No data available for the selected date range.</Text>
                ))}
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper withBorder p="md" radius="md">
              <Stack spacing="xs">
                <Group position="apart" align="flex-start">
                  <Title order={3}>Purchased Items Report</Title>
                  <Group>
                    <DateRangePicker
                      label="Date Range"
                      value={dateRanges.purchasedItems}
                      onChange={(value: [Date | null, Date | null]) => handleDateRangeChange('purchasedItems', value)}
                      clearable
                      size="xs"
                      w={300}
                      styles={{ dropdown: { zIndex: 1000 } }}
                      withinPortal={true}
                    />
                     {/* Add TimeRangeInput back */}
                     <TimeRangeInput
                      label="Time Range"
                      value={timeRanges.purchasedItems}
                      onChange={(value) => setTimeRanges(prev => ({ ...prev, purchasedItems: value }))}
                      clearable
                      size="xs"
                      w={300}
                    />
                    {/* Add Download CSV button back */}
                     <Button
                      onClick={() => purchasedItemsData && handleDownloadCSV('purchasedItems', purchasedItemsData)}
                      disabled={!purchasedItemsData || purchasedItemsData.length === 0}
                    >
                      Download CSV
                    </Button>
                  </Group>
                </Group>
                {loading.purchasedItems ? (
                  <Center p="xl">
                    <Loader size="sm" />
                  </Center>
                ) : (purchasedItemsData && purchasedItemsData.length > 0 ? (
                  renderPurchasedItems(purchasedItemsData)
                ) : (
                  <Text align="center">No data available for the selected date range.</Text>
                ))}
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};

export default Dashboard; 