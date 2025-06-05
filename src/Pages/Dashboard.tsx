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
} from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import { IconChartBar, IconUsers, IconPackage, IconBuildingStore } from '@tabler/icons-react';
import { postAPI } from '../utils/apiMethods';
import { API_PATHS } from '../utils/constants/apiPaths';

interface ReportData {
  success: boolean;
  data: any[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

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
  });
  const [dateRanges, setDateRanges] = useState<Record<string, [Date | null, Date | null] | undefined>>({
    totalSales: [null, null],
    totalItems: [null, null],
    activeDealers: [null, null],
    categories: [null, null],
    topSelling: [null, null],
    topDealers: [null, null],
    categoryWise: [null, null],
    brandWise: [null, null],
  });

  // Separate state variables for each section's specific data needs
  const [summaryTotalSales, setSummaryTotalSales] = useState<ReportData | undefined>(undefined); // highestSellingByAmount
  const [summaryTotalItemsSold, setSummaryTotalItemsSold] = useState<ReportData | undefined>(undefined); // highestSellingByQuantity
  const [summaryActiveDealers, setSummaryActiveDealers] = useState<ReportData | undefined>(undefined); // topDealersByQuantity
  const [summaryCategories, setSummaryCategories] = useState<ReportData | undefined>(undefined); // categoryWiseTopProducts

  const [topSellingItemsData, setTopSellingItemsData] = useState<ReportData | undefined>(undefined); // highestSellingByQuantity for Top Selling section
  const [topDealersData, setTopDealersData] = useState<ReportData | undefined>(undefined); // topDealersByQuantity for Top Dealers section
  const [categoryWiseData, setCategoryWiseData] = useState<ReportData | undefined>(undefined); // categoryWiseTopProducts for Category-wise section
  const [brandWiseData, setBrandWiseData] = useState<ReportData | undefined>(undefined); // brandWiseTopProducts for Brand-wise section

  // Simplified fetch function - now just returns data
  const fetchData = async (reportType: string, startDate: Date, endDate: Date): Promise<ReportData | undefined> => {
     try {
       const response = await postAPI({
         path: API_PATHS.REPORT.POST_SALES_REPORTS + '/reports',
         data: {
           reportType: reportType,
           startDate: startDate.toISOString().split('T')[0],
           endDate: endDate.toISOString().split('T')[0],
         },
       });
       return response as ReportData; // Assuming response matches ReportData structure
     } catch (error) {
       console.error(`Error fetching ${reportType} report:`, error);
       // Return an error data structure or undefined
       return { success: false, data: [], dateRange: { startDate: '', endDate: '' } };
     }
   };

  // Function to handle fetching for a specific section and updating its state
  const fetchSectionData = async (section: string, startDate: Date, endDate: Date) => {
      console.log(`fetchSectionData called for section: ${section}, dates: ${startDate.toISOString()} - ${endDate.toISOString()}`);
      setLoading(prev => ({ ...prev, [section]: true }));
      try {
          switch(section) {
              case 'totalSales':
                  const salesAmount = await fetchData('highestSellingByAmount', startDate, endDate);
                  setSummaryTotalSales(salesAmount);
                  console.log(`Total Sales data fetched and state updated for section: ${section}`);
                  break;
              case 'totalItems':
                  const itemsSold = await fetchData('highestSellingByQuantity', startDate, endDate);
                  setSummaryTotalItemsSold(itemsSold);
                  console.log(`Total Items data fetched and state updated for section: ${section}`);
                  break;
              case 'activeDealers':
                  const activeDealers = await fetchData('topDealersByQuantity', startDate, endDate);
                  setSummaryActiveDealers(activeDealers);
                  console.log(`Active Dealers data fetched and state updated for section: ${section}`);
                  break;
              case 'categories':
                  const categories = await fetchData('categoryWiseTopProducts', startDate, endDate);
                  setSummaryCategories(categories);
                  console.log(`Categories data fetched and state updated for section: ${section}`);
                  break;
              case 'topSelling':
                  const topSelling = await fetchData('highestSellingByQuantity', startDate, endDate);
                  setTopSellingItemsData(topSelling);
                   console.log(`Top Selling data fetched and state updated for section: ${section}`);
                  break;
              case 'topDealers':
                   const topDealers = await fetchData('topDealersByQuantity', startDate, endDate);
                   setTopDealersData(topDealers);
                    console.log(`Top Dealers data fetched and state updated for section: ${section}`);
                   break;
              case 'categoryWise':
                  const categoryWise = await fetchData('categoryWiseTopProducts', startDate, endDate);
                  setCategoryWiseData(categoryWise);
                   console.log(`Category-wise data fetched and state updated for section: ${section}`);
                  break;
              case 'brandWise':
                  const brandWise = await fetchData('brandWiseTopProducts', startDate, endDate);
                  setBrandWiseData(brandWise);
                   console.log(`Brand-wise data fetched and state updated for section: ${section}`);
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

    const initialDateRanges: Record<string, [Date, Date]> = {
        totalSales: [defaultStartDate, defaultEndDate],
        totalItems: [defaultStartDate, defaultEndDate],
        activeDealers: [defaultStartDate, defaultEndDate],
        categories: [defaultStartDate, defaultEndDate],
        topSelling: [defaultStartDate, defaultEndDate],
        topDealers: [defaultStartDate, defaultEndDate],
        categoryWise: [defaultStartDate, defaultEndDate],
        brandWise: [defaultStartDate, defaultEndDate],
    };

    setDateRanges(initialDateRanges);

    // Initial fetches are now handled by the individual useEffect hooks below
    // fetchSectionData('summary', initialDateRanges.summary[0], initialDateRanges.summary[1]);
    // fetchSectionData('topSelling', initialDateRanges.topSelling[0], initialDateRanges.topSelling[1]);
    // fetchSectionData('topDealers', initialDateRanges.topDealers[0], initialDateRanges.topDealers[1]);
    // fetchSectionData('categoryWise', initialDateRanges.categoryWise[0], initialDateRanges.categoryWise[1]);
    // fetchSectionData('brandWise', initialDateRanges.brandWise[0], initialDateRanges.brandWise[1]);

  }, []); // Run only on mount

  const handleDateRangeChange = (section: string, newDateRange: [Date | null, Date | null]) => {
    console.log(`handleDateRangeChange called for section: ${section}, newDateRange:`, newDateRange);
    // Always update date range state immediately
    setDateRanges(prev => {
      console.log(`Updating dateRanges state for section: ${section}`, { ...prev, [section]: newDateRange });
      return { ...prev, [section]: newDateRange };
    });

    // Fetch is now triggered by useEffect when the date range becomes complete
    // if (newDateRange[0] instanceof Date && newDateRange[1] instanceof Date) {
    //     const startDate = newDateRange[0];
    //     const endDate = newDateRange[1];
    //     fetchSectionData(section, startDate, endDate);
    // } else {
    //     setLoading(prev => ({ ...prev, [section]: false }));
    // }
  };

  // useEffect to fetch Total Sales data when its date range changes and is complete
  useEffect(() => {
    console.log('Total Sales useEffect triggered, current dateRange.totalSales:', dateRanges.totalSales);
    const dateRange = dateRanges.totalSales;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
      fetchSectionData('totalSales', dateRange[0], dateRange[1]);
    } else {
      setLoading(prev => ({ ...prev, totalSales: false }));
    }
  }, [dateRanges.totalSales]);

  // useEffect to fetch Total Items data when its date range changes and is complete
  useEffect(() => {
    console.log('Total Items useEffect triggered, current dateRange.totalItems:', dateRanges.totalItems);
    const dateRange = dateRanges.totalItems;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
      fetchSectionData('totalItems', dateRange[0], dateRange[1]);
    } else {
      setLoading(prev => ({ ...prev, totalItems: false }));
    }
  }, [dateRanges.totalItems]);

  // useEffect to fetch Active Dealers data when its date range changes and is complete
  useEffect(() => {
    console.log('Active Dealers useEffect triggered, current dateRange.activeDealers:', dateRanges.activeDealers);
    const dateRange = dateRanges.activeDealers;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
      fetchSectionData('activeDealers', dateRange[0], dateRange[1]);
    } else {
      setLoading(prev => ({ ...prev, activeDealers: false }));
    }
  }, [dateRanges.activeDealers]);

  // useEffect to fetch Categories data when its date range changes and is complete
  useEffect(() => {
    console.log('Categories useEffect triggered, current dateRange.categories:', dateRanges.categories);
    const dateRange = dateRanges.categories;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
      fetchSectionData('categories', dateRange[0], dateRange[1]);
    } else {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  }, [dateRanges.categories]);

  // useEffect to fetch Top Selling Items data when its date range changes and is complete
  useEffect(() => {
    console.log('Top Selling useEffect triggered, current dateRange.topSelling:', dateRanges.topSelling);
    const dateRange = dateRanges.topSelling;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
      fetchSectionData('topSelling', dateRange[0], dateRange[1]);
    } else {
       // Optional: clear top selling items data if date range becomes incomplete
       // setTopSellingItemsData(undefined);
       setLoading(prev => ({ ...prev, topSelling: false }));
    }
  }, [dateRanges.topSelling]); // Dependency array includes only topSelling date range

  // useEffect to fetch Top Dealers data when its date range changes and is complete
  useEffect(() => {
    console.log('Top Dealers useEffect triggered, current dateRange.topDealers:', dateRanges.topDealers);
    const dateRange = dateRanges.topDealers;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
      fetchSectionData('topDealers', dateRange[0], dateRange[1]);
    } else {
       // Optional: clear top dealers data if date range becomes incomplete
       // setTopDealersData(undefined);
       setLoading(prev => ({ ...prev, topDealers: false }));
    }
  }, [dateRanges.topDealers]); // Dependency array includes only topDealers date range

   // useEffect to fetch Category-wise data when its date range changes and is complete
   useEffect(() => {
    console.log('Category-wise useEffect triggered, current dateRange.categoryWise:', dateRanges.categoryWise);
    const dateRange = dateRanges.categoryWise;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
      fetchSectionData('categoryWise', dateRange[0], dateRange[1]);
    } else {
       // Optional: clear category wise data if date range becomes incomplete
       // setCategoryWiseData(undefined);
       setLoading(prev => ({ ...prev, categoryWise: false }));
    }
  }, [dateRanges.categoryWise]); // Dependency array includes only categoryWise date range

  // useEffect to fetch Brand-wise data when its date range changes and is complete
  useEffect(() => {
    console.log('Brand-wise useEffect triggered, current dateRange.brandWise:', dateRanges.brandWise);
    const dateRange = dateRanges.brandWise;
    if (dateRange && dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
      fetchSectionData('brandWise', dateRange[0], dateRange[1]);
    } else {
       // Optional: clear brand wise data if date range becomes incomplete
       // setBrandWiseData(undefined);
       setLoading(prev => ({ ...prev, brandWise: false }));
    }
  }, [dateRanges.brandWise]); // Dependency array includes only brandWise date range

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

  return (
    <Container size="xl" py="xl">
      <Stack spacing="xl">
        <Title order={2}>Sales Dashboard</Title>

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
                  ) : (
                    <Group>
                      <IconChartBar size={32} color="blue" />
                      <div>
                        <Text size="xs" c="dimmed">Total Sales</Text>
                        <Text fw={700} size="xl">
                          ₹{summaryTotalSales?.data.reduce((sum, item) => sum + item.totalAmount, 0).toFixed(2)}
                        </Text>
                      </div>
                    </Group>
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
                  ) : (
                    <Group>
                      <IconPackage size={32} color="green" />
                      <div>
                        <Text size="xs" c="dimmed">Total Items Sold</Text>
                        <Text fw={700} size="xl">
                          {summaryTotalItemsSold?.data.reduce((sum, item) => sum + item.totalQuantity, 0)}
                        </Text>
                      </div>
                    </Group>
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
                  ) : (
                    <Group>
                      <IconUsers size={32} color="orange" />
                      <div>
                        <Text size="xs" c="dimmed">Active Dealers</Text>
                        <Text fw={700} size="xl">
                          {summaryActiveDealers?.data.length}
                        </Text>
                      </div>
                    </Group>
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
                  ) : (
                    <Group>
                      <IconBuildingStore size={32} color="grape" />
                      <div>
                        <Text size="xs" c="dimmed">Categories</Text>
                        <Text fw={700} size="xl">
                          {summaryCategories?.data.length}
                        </Text>
                      </div>
                    </Group>
                  )}
                </Stack>
              </form>
            </Card>
          </Grid.Col>
        </Grid>

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
                ) : (
                  topSellingItemsData?.data && 
                  renderTopSellingItems(topSellingItemsData.data)
                )}
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
                ) : (
                  topDealersData?.data && 
                  renderTopDealers(topDealersData.data)
                )}
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
                ) : (
                  categoryWiseData?.data && 
                  renderCategoryBrandReport(categoryWiseData.data)
                )}
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
                ) : (
                  brandWiseData?.data && 
                  renderCategoryBrandReport(brandWiseData.data)
                )}
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};

export default Dashboard; 