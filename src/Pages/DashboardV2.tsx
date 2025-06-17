// Dashboard.tsx

import React, { useEffect, useCallback, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  Text,
  Title,
  Group,
  Stack,
  Center,
  Loader,
  Button,
  Table,
  Select,
  Pagination,
  Badge,
  ThemeIcon,
  Skeleton,
  UnstyledButton,
  Collapse,
  TextInput,
} from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import {
  IconChartBar,
  IconTrendingUp,
  IconDiscountCheck,
  IconBuildingStore,
  IconPackage,
  IconUsers,
  IconTruckDelivery,
  IconReceiptOff,
  IconChevronDown,
  IconChevronRight,
  IconSearch,
} from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { postAPI } from '../utils/apiMethods';
import { API_PATHS } from '../utils/constants/apiPaths';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { TableSection } from '../components/dashboard/TableSection';
import {
  renderTopQtyRow,
  renderTopAmountRow,
  renderCategoryRow,
  renderBrandRow,
  renderDealerQtyRow,
  renderDealerAmountRow,
  renderPurchasedRow,
  renderItemTrendRow,
  renderOverallBillingRow,
} from '../components/dashboard/TableRowRenderers';
import {
  formatDateForAPI,
  isDateRangeComplete,
  filterTableData,
} from '../components/dashboard/utils';
import { REPORT_TYPES, ITEMS_PER_PAGE } from '../components/dashboard/constants';
import { DateRange, ReportResponse, LoadingState, TableRowData } from '../components/dashboard/types';
import {
  setSummaryDateRange,
  setTopQtyDateRange,
  setTopAmountDateRange,
  setCategoryDateRange,
  setBrandDateRange,
  setDealerDateRange,
  setPurchasedDateRange,
  setTrendDateRange,
  setLoading,
  setTotalSales,
  setTotalProfit,
  setTotalDiscount,
  setTotalMRP,
  setTopByQty,
  setTopByAmount,
  setCategoryWiseData,
  setBrandWiseData,
  setDealersByQty,
  setDealersByAmount,
  setPurchasedItems,
  setItemBillingTrend,
  setOverallItemBilling,
  setTopQtySearch,
  setTopAmountSearch,
  setCategorySearch,
  setBrandSearch,
  setDealerSearch,
  setPurchasedSearch,
  setTrendSearch,
  setSelectedItem,
  setExpandedCategories,
  setExpandedBrands,
  setPage,
  setRowsPerPage,
  setAllItemsTrendData,
  setTotalCount,
  setDateColumns,
} from '../redux/dashboard/dashboardSlice';
import { RootState } from '../redux/store';
import DataTable from './DataTable';
import { calculateWeeklyAverage } from '../utils/calculations';

const fetchReport = async <T extends Record<string, any>>(
  reportType: string,
  startDate: Date,
  endDate: Date,
  itemName?: string
): Promise<T[] | undefined> => {
  try {
   

    const response: ReportResponse<T> = await postAPI({
      path: `${API_PATHS.REPORT.POST_SALES_REPORTS}/reports`,
      data: {
        reportType,
        startDate: formatDateForAPI(startDate),
        endDate: formatDateForAPI(endDate),
        ...(itemName && { itemName }),
      },
    });


    
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return undefined;
  } catch (err) {
    console.error(`Error fetching ${reportType}:`, err);
    return undefined;
  }
};

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const {
    // Date ranges
    summaryDateRange,
    topQtyDateRange,
    topAmountDateRange,
    categoryDateRange,
    brandDateRange,
    dealerDateRange,
    purchasedDateRange,
    trendDateRange,

    // Loading states
    loading,

    // Summary data
    totalSales,
    totalProfit,
    totalDiscount,
    totalMRP,

    // Table data
    topByQty,
    topByAmount,
    categoryWiseData,
    brandWiseData,
    dealersByQty,
    dealersByAmount,
    purchasedItems,
    itemBillingTrend,
    overallItemBilling,

    // Search states
    topQtySearch,
    topAmountSearch,
    categorySearch,
    brandSearch,
    dealerSearch,
    purchasedSearch,
    trendSearch,

    // Selected item for trend
    selectedItem,

    // Expanded sections
    expandedCategories,
    expandedBrands,

    // Pagination and trend data
    page,
    rowsPerPage,
    allItemsTrendData,
    totalCount,
    dateColumns,
  } = useSelector((state: RootState) => state.dashboard);

  const generateDateColumns = useCallback((start: Date, end: Date) => {
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const columns = Array.from({ length: daysDiff + 1 }, (_, index) => {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + index);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      return {
        key: dateStr,
        label: currentDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: '2-digit'
        }),
        minWidth: 100,
        render: (row: any) => {
          const trend = row.itemBillingTrend || [];
          const dateData = trend.find((t: any) => 
            new Date(t.date).toISOString().split('T')[0] === dateStr
          );
          return dateData ? dateData.quantity : (
            <Text size="sm" color="dimmed">0</Text>
          );
        }
      };
    });
    
    dispatch(setDateColumns(columns));
  }, [dispatch]);

  // Individual fetch functions for each section
  const fetchSummaryData = useCallback(async (start: Date, end: Date) => {
    dispatch(setLoading({ totalSales: true, totalProfit: true, totalDiscount: true, totalMRP: true }));
    
    try {
      const [salesData, profitData, discountData, mrpData] = await Promise.all([
        fetchReport<any>(REPORT_TYPES.TOTAL_SALES, start, end),
        fetchReport<any>(REPORT_TYPES.TOTAL_PROFIT, start, end),
        fetchReport<any>(REPORT_TYPES.TOTAL_DISCOUNT, start, end),
        fetchReport<any>(REPORT_TYPES.TOTAL_MRP, start, end),
      ]);

      if (salesData && salesData.length > 0) {
        dispatch(setTotalSales(salesData[0].totalAmountSum ?? 0));
      }
      if (profitData && profitData.length > 0) {
        dispatch(setTotalProfit(profitData[0].totalProfitSum ?? null));
      }
      if (discountData && discountData.length > 0) {
        dispatch(setTotalDiscount(discountData[0].totalDiscountSum ?? null));
      }
      if (mrpData && mrpData.length > 0) {
        dispatch(setTotalMRP(mrpData[0].totalMRPsum ?? null));
      }
    } finally {
      dispatch(setLoading({ totalSales: false, totalProfit: false, totalDiscount: false, totalMRP: false }));
    }
  }, [dispatch]);

  const fetchTopQtyData = useCallback(async (start: Date, end: Date) => {
    dispatch(setLoading({ topQty: true }));
    try {
      const topQtyData = await fetchReport<any>(REPORT_TYPES.TOP_ITEMS_BY_QTY, start, end);
      dispatch(setTopByQty(topQtyData));
    } finally {
      dispatch(setLoading({ topQty: false }));
    }
  }, [dispatch]);

  const fetchTopAmountData = useCallback(async (start: Date, end: Date) => {
    dispatch(setLoading({ topAmount: true }));
    try {
      const topAmountData = await fetchReport<any>(REPORT_TYPES.TOP_ITEMS_BY_AMOUNT, start, end);
      dispatch(setTopByAmount(topAmountData));
    } finally {
      dispatch(setLoading({ topAmount: false }));
    }
  }, [dispatch]);

  const fetchCategoryData = useCallback(async (start: Date, end: Date) => {
    dispatch(setLoading({ categoryWise: true }));
    
    try {
      const categoryData = await fetchReport<any>(REPORT_TYPES.CATEGORY_WISE, start, end);
      dispatch(setCategoryWiseData(categoryData));
    } finally {
      dispatch(setLoading({ categoryWise: false }));
    }
  }, [dispatch]);

  const fetchBrandData = useCallback(async (start: Date, end: Date) => {
    dispatch(setLoading({ brandWise: true }));
    
    try {
      const brandData = await fetchReport<any>(REPORT_TYPES.BRAND_WISE, start, end);
      dispatch(setBrandWiseData(brandData));
    } finally {
      dispatch(setLoading({ brandWise: false }));
    }
  }, [dispatch]);

  const fetchDealerData = useCallback(async (start: Date, end: Date) => {
    dispatch(setLoading({ dealersQty: true, dealersAmount: true }));
    
    try {
      const [dealersQtyData, dealersAmountData] = await Promise.all([
        fetchReport<any>(REPORT_TYPES.TOP_DEALERS_QTY, start, end),
        fetchReport<any>(REPORT_TYPES.TOP_DEALERS_AMOUNT, start, end),
      ]);
      
      dispatch(setDealersByQty(dealersQtyData));
      dispatch(setDealersByAmount(dealersAmountData));
    } finally {
      dispatch(setLoading({ dealersQty: false, dealersAmount: false }));
    }
  }, [dispatch]);

  const fetchPurchasedData = useCallback(async (start: Date, end: Date) => {
    dispatch(setLoading({ purchased: true }));
    
    try {
      const purchasedData = await fetchReport<any>(REPORT_TYPES.PURCHASED_ITEMS, start, end);
      dispatch(setPurchasedItems(purchasedData));
    } finally {
      dispatch(setLoading({ purchased: false }));
    }
  }, [dispatch]);

  const fetchTrendData = useCallback(async (start: Date, end: Date) => {
    dispatch(setLoading({ itemTrend: true, overallTrend: true }));
    
    try {
      const [overallBillingData, itemTrendData] = await Promise.all([
        fetchReport<any>(REPORT_TYPES.OVERALL_ITEM_BILLING, start, end),
        selectedItem ? fetchReport<any>(REPORT_TYPES.ITEM_BILLING_TREND, start, end, selectedItem) : undefined,
      ]);
      
      dispatch(setOverallItemBilling(overallBillingData));
      dispatch(setItemBillingTrend(itemTrendData));
    } finally {
      dispatch(setLoading({ itemTrend: false, overallTrend: false }));
    }
  }, [dispatch, selectedItem]);

  const fetchAllItemsTrend = useCallback(async (start: Date, end: Date, page: number = 1, limit: number = 10) => {
    dispatch(setLoading({ itemTrend: true }));
    try {
      const response = await postAPI({
        path: `${API_PATHS.REPORT.POST_SALES_REPORTS}/reports`,
        data: {
          reportType: 'allItemsBillingTrendList',
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0],
          page,
          limit
        }
      });

      if (response.success) {
        const dataWithIds = (response.data.data || []).map((item: any, index: number) => ({
          _id: item._id || `row-${index}`,
          itemDetail: item.itemDetail || {},
          itemBillingTrend: item.itemBillingTrend || []
        }));

        dispatch(setAllItemsTrendData(dataWithIds));
        dispatch(setTotalCount(response.data.total || 0));
      }
    } catch (error) {
      console.error('Error fetching all items trend:', error);
      dispatch(setAllItemsTrendData([]));
      dispatch(setTotalCount(0));
    } finally {
      dispatch(setLoading({ itemTrend: false }));
    }
  }, [dispatch]);

  // Effect hooks for each section
  useEffect(() => {
    if (isDateRangeComplete(summaryDateRange)) {
      fetchSummaryData(summaryDateRange[0], summaryDateRange[1]);
    }
  }, [summaryDateRange, fetchSummaryData]);

  useEffect(() => {
    if (isDateRangeComplete(topQtyDateRange)) {
      fetchTopQtyData(topQtyDateRange[0], topQtyDateRange[1]);
    }
  }, [topQtyDateRange, fetchTopQtyData]);

  useEffect(() => {
    if (isDateRangeComplete(topAmountDateRange)) {
      fetchTopAmountData(topAmountDateRange[0], topAmountDateRange[1]);
    }
  }, [topAmountDateRange, fetchTopAmountData]);

  useEffect(() => {
    if (isDateRangeComplete(categoryDateRange)) {
      fetchCategoryData(categoryDateRange[0], categoryDateRange[1]);
    }
  }, [categoryDateRange, fetchCategoryData]);

  useEffect(() => {
    if (isDateRangeComplete(brandDateRange)) {
      fetchBrandData(brandDateRange[0], brandDateRange[1]);
    }
  }, [brandDateRange, fetchBrandData]);

  useEffect(() => {
    if (isDateRangeComplete(dealerDateRange)) {
      fetchDealerData(dealerDateRange[0], dealerDateRange[1]);
    }
  }, [dealerDateRange, fetchDealerData]);

  useEffect(() => {
    if (isDateRangeComplete(purchasedDateRange)) {
      fetchPurchasedData(purchasedDateRange[0], purchasedDateRange[1]);
    }
  }, [purchasedDateRange, fetchPurchasedData]);

  useEffect(() => {
    if (isDateRangeComplete(trendDateRange)) {
      setPage(1); 
      generateDateColumns(trendDateRange[0], trendDateRange[1]);
      fetchAllItemsTrend(trendDateRange[0], trendDateRange[1], 1, rowsPerPage);
    }
  }, [trendDateRange, fetchAllItemsTrend, rowsPerPage, generateDateColumns]);

  useEffect(() => {
    if (isDateRangeComplete(trendDateRange)) {
      fetchAllItemsTrend(trendDateRange[0], trendDateRange[1], page, rowsPerPage);
    }
  }, [page, rowsPerPage, trendDateRange, fetchAllItemsTrend]);

  // Build Select options for "Item Billing Trend"
  const itemOptions = (topByQty || [])
    .filter(item => item.sku || item.itemName)
    .map((item) => ({
      value: item.sku || item.itemName || '',
      label: item.sku || item.itemName || '',
    }));

  // CSV mapping functions
  const mapTopQtyToCSV = (item: TableRowData) => [
    item.sku || '-',
    item.barcode || '-',
    item.itemName || '-',
    item.totalQuantity?.toString() || '0',
  ];

  const mapTopAmountToCSV = (item: TableRowData) => [
    item.sku || '-',
    item.barcode || '-',
    item.itemName || '-',
    item.totalAmount?.toFixed(2) || '0.00',
  ];

  const mapDealerQtyToCSV = (item: TableRowData) => [
    item.dealerName || '-',
    item.totalOrders?.toString() || '0',
    item.totalQuantity?.toString() || '0',
    item.totalAmount?.toFixed(2) || '0.00',
  ];

  const mapDealerAmountToCSV = (item: TableRowData) => [
    item.dealerName || '-',
    item.totalAmount?.toFixed(2) || '0.00',
    item.totalQuantity?.toString() || '0',
  ];

  const mapPurchasedToCSV = (item: TableRowData) => [
    item.sku || '-',
    item.itemName || '-',
    item.totalStock?.toString() || '0',
    item.mrp?.toFixed(2) || '0.00',
    item.costPrice?.toFixed(2) || '0.00',
    item.lastPurchaseDate
      ? new Date(item.lastPurchaseDate).toLocaleDateString()
      : 'N/A',
    item.totalOrders?.toString() || '0',
    item.suppliers?.join(', ') || 'N/A',
  ];

  const mapItemTrendToCSV = (item: TableRowData) => [
    item.billNo || '-',
    item.billDate ? new Date(item.billDate).toLocaleDateString() : 'N/A',
    item.staffName || '-',
    item.itemQuantity?.toString() || '0',
    item.sellingPriceTotal?.toFixed(2) || '0.00',
    item.discountTotal?.toFixed(2) || '0.00',
  ];

  const mapOverallBillingToCSV = (item: TableRowData) => [
    item.itemName || '-',
    item.barcode || '-',
    item.totalQuantity?.toString() || '0',
    item.totalAmount?.toFixed(2) || '0.00',
    item.totalDiscount?.toFixed(2) || '0.00',
    item.totalMRPsum?.toFixed(2) || '0.00',
    item.firstSale ? new Date(item.firstSale).toLocaleDateString() : 'N/A',
    item.lastSale ? new Date(item.lastSale).toLocaleDateString() : 'N/A',
    item.staffName || '-',
  ];

  const handlePageChange = (_: unknown, newPage: number) => {
    console.log('Page changed to:', newPage);
    dispatch(setPage(newPage));
  };

  const handleRowsPerPageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newRowsPerPage = parseInt(e.target.value.toString(), 10);
    console.log('Rows per page changed to:', newRowsPerPage);
    dispatch(setRowsPerPage(newRowsPerPage));
  };

  return (
    <Container size="xl" py="xl">
      <Stack spacing="xl">
        <Title order={2}>Sales &amp; Inventory Dashboard</Title>

        {/* Summary Cards Section */}
        <Card withBorder p="md" radius="md">
          <Stack spacing="md">
            <Group position="apart">
              <Title order={3}>Summary</Title>
              <DateRangePicker
                placeholder="Select date range"
                label="Date Range"
                value={summaryDateRange}
                onChange={(value) => dispatch(setSummaryDateRange(value))}
                clearable
                w={400}
                withinPortal
              />
            </Group>
            <Grid>
              <Grid.Col xs={6} md={3}>
                <SummaryCard
                  label="Total Sales"
                  value={totalSales !== null ? `₹${totalSales.toFixed(2)}` : null}
                  icon={<IconChartBar size={32} color="#228be6" />}
                  loading={loading.totalSales}
                />
              </Grid.Col>
              <Grid.Col xs={6} md={3}>
                <SummaryCard
                  label="Total Profit"
                  value={totalProfit !== null ? `₹${totalProfit.toFixed(2)}` : null}
                  icon={<IconTrendingUp size={32} color="#20c997" />}
                  loading={loading.totalProfit}
                />
              </Grid.Col>
              <Grid.Col xs={6} md={3}>
                <SummaryCard
                  label="Total Discount"
                  value={
                    totalDiscount !== null
                      ? `₹${totalDiscount.toFixed(2)}`
                      : null
                  }
                  icon={<IconDiscountCheck size={32} color="#fa5252" />}
                  loading={loading.totalDiscount}
                />
              </Grid.Col>
              <Grid.Col xs={6} md={3}>
                <SummaryCard
                  label="Total MRP"
                  value={totalMRP !== null ? `₹${totalMRP.toFixed(2)}` : null}
                  icon={<IconBuildingStore size={32} color="#7950f2" />}
                  loading={loading.totalMRP}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* Top Items Section */}
        <Grid gutter="xl">
          <Grid.Col md={6}>
            <Card withBorder p="md" radius="md">
              <Stack spacing="md">
                <Group position="apart" align="flex-start">
                  <Title order={3}>Top Items by Quantity Sold</Title>
                  <Stack spacing="xs" align="flex-end">
                    <DateRangePicker
                      placeholder="Select date range"
                      label="Date Range"
                      value={topQtyDateRange}
                      onChange={(value) => dispatch(setTopQtyDateRange(value))}
                      clearable
                      w={300}
                      withinPortal
                    />
                    <TextInput
                      placeholder="Search by SKU or Barcode"
                      value={topQtySearch}
                      onChange={(e) => dispatch(setTopQtySearch(e.currentTarget.value))}
                      icon={<IconSearch size={14} />}
                      size="sm"
                      w={300}
                      styles={{
                        input: {
                          '&::placeholder': {
                            color: 'var(--mantine-color-gray-5)',
                          },
                        },
                      }}
                    />
                  </Stack>
                </Group>
                <TableSection
                  title=""
                  columns={['SKU', 'Barcode', 'Item Name', 'Quantity']}
                  data={filterTableData(topByQty, topQtySearch)}
                  loading={loading.topQty}
                  renderRow={renderTopQtyRow}
                  csvHeaders={['SKU', 'Barcode', 'Item Name', 'Quantity']}
                  mapRowToCSV={mapTopQtyToCSV}
                />
              </Stack>
            </Card>
          </Grid.Col>
          <Grid.Col md={6}>
            <Card withBorder p="md" radius="md">
              <Stack spacing="md">
                <Group position="apart" align="flex-start">
                  <Title order={3}>Top Items by Sales Volume</Title>
                  <Stack spacing="xs" align="flex-end">
                    <DateRangePicker
                      placeholder="Select date range"
                      label="Date Range"
                      value={topAmountDateRange}
                      onChange={(value) => dispatch(setTopAmountDateRange(value))}
                      clearable
                      w={300}
                      withinPortal
                    />
                    <TextInput
                      placeholder="Search by SKU or Barcode"
                      value={topAmountSearch}
                      onChange={(e) => dispatch(setTopAmountSearch(e.currentTarget.value))}
                      icon={<IconSearch size={14} />}
                      size="sm"
                      w={300}
                      styles={{
                        input: {
                          '&::placeholder': {
                            color: 'var(--mantine-color-gray-5)',
                          },
                        },
                      }}
                    />
                  </Stack>
                </Group>
                <TableSection
                  title=""
                  columns={['SKU', 'Barcode', 'Item Name', 'Amount']}
                  data={filterTableData(topByAmount, topAmountSearch)}
                  loading={loading.topAmount}
                  renderRow={renderTopAmountRow}
                  csvHeaders={['SKU', 'Barcode', 'Item Name', 'Amount']}
                  mapRowToCSV={mapTopAmountToCSV}
                />
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Category Section */}
        <Card withBorder p="md" radius="md">
          <Stack spacing="md">
            <Group position="apart" align="flex-start">
              <Title order={3}>Category-wise Top Products</Title>
              <Stack spacing="xs" align="flex-end">
                <DateRangePicker
                  placeholder="Select date range"
                  label="Date Range"
                  value={categoryDateRange}
                  onChange={(value) => dispatch(setCategoryDateRange(value))}
                  clearable
                  w={300}
                  withinPortal
                />
                <TextInput
                  placeholder="Search by SKU or Barcode"
                  value={categorySearch}
                  onChange={(e) => dispatch(setCategorySearch(e.currentTarget.value))}
                  icon={<IconSearch size={14} />}
                  size="sm"
                  w={300}
                  styles={{
                    input: {
                      '&::placeholder': {
                        color: 'var(--mantine-color-gray-5)',
                      },
                    },
                  }}
                />
              </Stack>
            </Group>
            <TableSection
              title=""
              columns={['Category', 'SKU', 'Barcode', 'Qty / Amount']}
              data={filterTableData(categoryWiseData, categorySearch, true)}
              loading={loading.categoryWise}
              renderRow={(item, idx) => renderCategoryRow(item, idx, expandedCategories, (value: Record<string, boolean>) => dispatch(setExpandedCategories(value)), categorySearch)}
              csvHeaders={['Category', 'SKU', 'Barcode', 'Quantity', 'Amount']}
              mapRowToCSV={(item: any) => {
                const firstProduct = item.topProducts[0];
                return [
                  item.category,
                  firstProduct.sku,
                  firstProduct.barcode,
                  firstProduct.totalQuantity,
                  firstProduct.totalAmount.toFixed(2),
                ];
              }}
            />
          </Stack>
        </Card>

        {/* Brand Section */}
        <Card withBorder p="md" radius="md">
          <Stack spacing="md">
            <Group position="apart" align="flex-start">
              <Title order={3}>Brand-wise Top Products</Title>
              <Stack spacing="xs" align="flex-end">
                <DateRangePicker
                  placeholder="Select date range"
                  label="Date Range"
                  value={brandDateRange}
                  onChange={(value) => dispatch(setBrandDateRange(value))}
                  clearable
                  w={300}
                  withinPortal
                />
                <TextInput
                  placeholder="Search by SKU or Barcode"
                  value={brandSearch}
                  onChange={(e) => dispatch(setBrandSearch(e.currentTarget.value))}
                  icon={<IconSearch size={14} />}
                  size="sm"
                  w={300}
                  styles={{
                    input: {
                      '&::placeholder': {
                        color: 'var(--mantine-color-gray-5)',
                      },
                    },
                  }}
                />
              </Stack>
            </Group>
            <TableSection
              title=""
              columns={['Brand', 'SKU', 'Barcode', 'Qty / Amount']}
              data={filterTableData(brandWiseData, brandSearch, true)}
              loading={loading.brandWise}
              renderRow={(item, idx) => renderBrandRow(item, idx, expandedBrands, (value: Record<string, boolean>) => dispatch(setExpandedBrands(value)), brandSearch)}
              csvHeaders={['Brand', 'SKU', 'Barcode', 'Quantity', 'Amount']}
              mapRowToCSV={(item: any) => {
                const firstProduct = item.topProducts[0];
                return [
                  item.brand,
                  firstProduct.sku,
                  firstProduct.barcode,
                  firstProduct.totalQuantity,
                  firstProduct.totalAmount.toFixed(2),
                ];
              }}
            />
          </Stack>
        </Card>

        {/* Dealer Section */}
        <Card withBorder p="md" radius="md">
          <Stack spacing="md">
            <Group position="apart">
              <Title order={3}>Top Dealers</Title>
              <DateRangePicker
                placeholder="Select date range"
                label="Date Range"
                value={dealerDateRange}
                onChange={(value) => dispatch(setDealerDateRange(value))}
                clearable
                w={400}
                withinPortal
              />
            </Group>
            <Grid gutter="xl">
              <Grid.Col md={6}>
                <TableSection
                  title="Top Dealers by Quantity"
                  columns={['Dealer Name', 'Total Orders', 'Quantity', 'Amount']}
                  data={dealersByQty}
                  loading={loading.dealersQty}
                  renderRow={renderDealerQtyRow}
                  csvHeaders={['Dealer Name', 'Total Orders', 'Quantity', 'Amount']}
                  mapRowToCSV={mapDealerQtyToCSV}
                />
              </Grid.Col>
              <Grid.Col md={6}>
                <TableSection
                  title="Top Dealers by Sales Amount"
                  columns={['Dealer Name', 'Amount', 'Quantity']}
                  data={dealersByAmount}
                  loading={loading.dealersAmount}
                  renderRow={renderDealerAmountRow}
                  csvHeaders={['Dealer Name', 'Amount', 'Quantity']}
                  mapRowToCSV={mapDealerAmountToCSV}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* Purchased Items Section */}
        <Card withBorder p="md" radius="md">
          <Stack spacing="md">
            <Group position="apart" align="flex-start">
              <Title order={3}>Purchased Items Inventory</Title>
              <Stack spacing="xs" align="flex-end">
                <DateRangePicker
                  placeholder="Select date range"
                  label="Date Range"
                  value={purchasedDateRange}
                  onChange={(value) => dispatch(setPurchasedDateRange(value))}
                  clearable
                  w={300}
                  withinPortal
                />
                <TextInput
                  placeholder="Search by SKU or Item Name"
                  value={purchasedSearch}
                  onChange={(e) => dispatch(setPurchasedSearch(e.currentTarget.value))}
                  icon={<IconSearch size={14} />}
                  size="sm"
                  w={300}
                  styles={{
                    input: {
                      '&::placeholder': {
                        color: 'var(--mantine-color-gray-5)',
                      },
                    },
                  }}
                />
              </Stack>
            </Group>
            <TableSection
              title=""
              columns={[
                'SKU',
                'Item Name',
                'Total Stock',
                'MRP',
                'Cost Price',
                'Last Purchase Date',
                'Total Orders',
                'Suppliers',
              ]}
              data={filterTableData(purchasedItems, purchasedSearch)}
              loading={loading.purchased}
              renderRow={renderPurchasedRow}
              csvHeaders={[
                'SKU',
                'Item Name',
                'Total Stock',
                'MRP',
                'Cost Price',
                'Last Purchase Date',
                'Total Orders',
                'Suppliers',
              ]}
              mapRowToCSV={mapPurchasedToCSV}
            />
          </Stack>
        </Card>

        {/* Trend Section */}
        <Card withBorder p="md" radius="md">
          <Stack spacing="md">
            <Group position="apart">
              <Title order={3}>Item Billing Trends</Title>
              <Group>
                <DateRangePicker
                  placeholder="Select date range"
                  label="Date Range"
                  value={trendDateRange}
                  onChange={(value) => dispatch(setTrendDateRange(value))}
                  clearable
                  w={400}
                  withinPortal
                />
                <Select
                  placeholder="Select item"
                  label="Item"
                  data={itemOptions}
                  value={selectedItem}
                  onChange={(value) => dispatch(setSelectedItem(value))}
                  w={200}
                  size="xs"
                />
              </Group>
            </Group>
            <TableSection
              title=""
              columns={[
                'Bill No',
                'Bill Date',
                'Staff Name',
                'Item Quantity',
                'Selling Price Total',
                'Discount Total',
              ]}
              data={itemBillingTrend}
              loading={loading.itemTrend}
              renderRow={renderItemTrendRow}
              csvHeaders={[
                'Bill No',
                'Bill Date',
                'Staff Name',
                'Item Quantity',
                'Selling Price Total',
                'Discount Total',
              ]}
              mapRowToCSV={mapItemTrendToCSV}
            />
          </Stack>
        </Card>

        {/* All Items Billing Trend List Section */}
        <Card withBorder p="md" radius="md">
          <Stack spacing="md">
            <Group position="apart">
              <Title order={3}>All Items Billing Trend</Title>
              <Group>
                <DateRangePicker
                  placeholder="Select date range"
                  label="Date Range"
                  value={trendDateRange}
                  onChange={(value) => dispatch(setTrendDateRange(value))}
                  clearable
                  w={400}
                  withinPortal
                />
              </Group>
            </Group>
            <DataTable
              columns={[
                {
                  key: 'sku',
                  label: 'SKU',
                  render: (row: any) => row?.itemDetail?.sku || '-',
                  minWidth: 120,
                },
                {
                  key: 'sevenDayAvg',
                  label: '7-Day Average',
                  minWidth: 120,
                  render: (row: any) => {
                    if (!row) return '-';
                    const avg = calculateWeeklyAverage(row, dateColumns.map(col => col.key));
                    return avg === null ? '-' : avg;
                  }
                },
                ...dateColumns
              ]}
              data={allItemsTrendData || []}
              isLoading={loading.itemTrend}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowCount={totalCount}
              paginationMode="server"
            />
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};

export default Dashboard;
