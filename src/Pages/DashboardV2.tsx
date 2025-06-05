// Dashboard.tsx

import React, { useState, useEffect, useCallback } from 'react';
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
  // Individual date ranges for each section
  const [summaryDateRange, setSummaryDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 15);
    return [start, end];
  });

  const [topQtyDateRange, setTopQtyDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 15);
    return [start, end];
  });

  const [topAmountDateRange, setTopAmountDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 15);
    return [start, end];
  });

  const [categoryDateRange, setCategoryDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 15);
    return [start, end];
  });

  const [brandDateRange, setBrandDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 15);
    return [start, end];
  });

  const [dealerDateRange, setDealerDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 15);
    return [start, end];
  });

  const [purchasedDateRange, setPurchasedDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 15);
    return [start, end];
  });

  const [trendDateRange, setTrendDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 15);
    return [start, end];
  });

  // Individual loading states
  const [loading, setLoading] = useState<LoadingState>({
    totalSales: false,
    totalProfit: false,
    totalDiscount: false,
    totalMRP: false,
    topQty: false,
    topAmount: false,
    categoryWise: false,
    brandWise: false,
    dealersQty: false,
    dealersAmount: false,
    purchased: false,
    itemTrend: false,
    overallTrend: false,
  });

  const [totalSales, setTotalSales] = useState<number | null>(null);
  const [totalProfit, setTotalProfit] = useState<number | null>(null);
  const [totalDiscount, setTotalDiscount] = useState<number | null>(null);
  const [totalMRP, setTotalMRP] = useState<number | null>(null);

  const [topByQty, setTopByQty] = useState<TableRowData[] | undefined>(undefined);
  const [topByAmount, setTopByAmount] = useState<TableRowData[] | undefined>(undefined);
  const [categoryWiseData, setCategoryWiseData] = useState<TableRowData[] | undefined>(undefined);
  const [brandWiseData, setBrandWiseData] = useState<TableRowData[] | undefined>(undefined);
  const [dealersByQty, setDealersByQty] = useState<TableRowData[] | undefined>(undefined);
  const [dealersByAmount, setDealersByAmount] = useState<TableRowData[] | undefined>(undefined);
  const [purchasedItems, setPurchasedItems] = useState<TableRowData[] | undefined>(undefined);
  const [itemBillingTrend, setItemBillingTrend] = useState<TableRowData[] | undefined>(undefined);
  const [overallItemBilling, setOverallItemBilling] = useState<TableRowData[] | undefined>(undefined);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Add state for expanded sections
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>({});

  // Add search states for each table
  const [topQtySearch, setTopQtySearch] = useState('');
  const [topAmountSearch, setTopAmountSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const [dealerSearch, setDealerSearch] = useState('');
  const [purchasedSearch, setPurchasedSearch] = useState('');
  const [trendSearch, setTrendSearch] = useState('');

  // Individual fetch functions for each section
  const fetchSummaryData = useCallback(async (start: Date, end: Date) => {
    setLoading(prev => ({ ...prev, totalSales: true, totalProfit: true, totalDiscount: true, totalMRP: true }));
    
    try {
      const [salesData, profitData, discountData, mrpData] = await Promise.all([
        fetchReport<any>(REPORT_TYPES.TOTAL_SALES, start, end),
        fetchReport<any>(REPORT_TYPES.TOTAL_PROFIT, start, end),
        fetchReport<any>(REPORT_TYPES.TOTAL_DISCOUNT, start, end),
        fetchReport<any>(REPORT_TYPES.TOTAL_MRP, start, end),
      ]);

      if (salesData) {
        const sum = salesData.reduce((acc: number, row: any) => acc + (row.totalAmount || 0), 0);
        setTotalSales(sum);
      }
      if (profitData && profitData.length > 0) {
        setTotalProfit(profitData[0].totalProfitSum ?? null);
      }
      if (discountData && discountData.length > 0) {
        setTotalDiscount(discountData[0].totalDiscountSum ?? null);
      }
      if (mrpData && mrpData.length > 0) {
        setTotalMRP(mrpData[0].totalMRPsum ?? null);
      }
    } finally {
      setLoading(prev => ({ ...prev, totalSales: false, totalProfit: false, totalDiscount: false, totalMRP: false }));
    }
  }, []);

  const fetchTopQtyData = useCallback(async (start: Date, end: Date) => {
    setLoading(prev => ({ ...prev, topQty: true }));
    try {
      const topQtyData = await fetchReport<any>(REPORT_TYPES.TOP_ITEMS_BY_QTY, start, end);
      setTopByQty(topQtyData);
    } finally {
      setLoading(prev => ({ ...prev, topQty: false }));
    }
  }, []);

  const fetchTopAmountData = useCallback(async (start: Date, end: Date) => {
    setLoading(prev => ({ ...prev, topAmount: true }));
    try {
      const topAmountData = await fetchReport<any>(REPORT_TYPES.TOP_ITEMS_BY_AMOUNT, start, end);
      setTopByAmount(topAmountData);
    } finally {
      setLoading(prev => ({ ...prev, topAmount: false }));
    }
  }, []);

  const fetchCategoryData = useCallback(async (start: Date, end: Date) => {
    setLoading(prev => ({ ...prev, categoryWise: true }));
    
    try {
      const categoryData = await fetchReport<any>(REPORT_TYPES.CATEGORY_WISE, start, end);
      setCategoryWiseData(categoryData);
    } finally {
      setLoading(prev => ({ ...prev, categoryWise: false }));
    }
  }, []);

  const fetchBrandData = useCallback(async (start: Date, end: Date) => {
    setLoading(prev => ({ ...prev, brandWise: true }));
    
    try {
      const brandData = await fetchReport<any>(REPORT_TYPES.BRAND_WISE, start, end);
      setBrandWiseData(brandData);
    } finally {
      setLoading(prev => ({ ...prev, brandWise: false }));
    }
  }, []);

  const fetchDealerData = useCallback(async (start: Date, end: Date) => {
    setLoading(prev => ({ ...prev, dealersQty: true, dealersAmount: true }));
    
    try {
      const [dealersQtyData, dealersAmountData] = await Promise.all([
        fetchReport<any>(REPORT_TYPES.TOP_DEALERS_QTY, start, end),
        fetchReport<any>(REPORT_TYPES.TOP_DEALERS_AMOUNT, start, end),
      ]);
      
      setDealersByQty(dealersQtyData);
      setDealersByAmount(dealersAmountData);
    } finally {
      setLoading(prev => ({ ...prev, dealersQty: false, dealersAmount: false }));
    }
  }, []);

  const fetchPurchasedData = useCallback(async (start: Date, end: Date) => {
    setLoading(prev => ({ ...prev, purchased: true }));
    
    try {
      const purchasedData = await fetchReport<any>(REPORT_TYPES.PURCHASED_ITEMS, start, end);
      setPurchasedItems(purchasedData);
    } finally {
      setLoading(prev => ({ ...prev, purchased: false }));
    }
  }, []);

  const fetchTrendData = useCallback(async (start: Date, end: Date) => {
    setLoading(prev => ({ ...prev, itemTrend: true, overallTrend: true }));
    
    try {
      const [overallBillingData, itemTrendData] = await Promise.all([
        fetchReport<any>(REPORT_TYPES.OVERALL_ITEM_BILLING, start, end),
        selectedItem ? fetchReport<any>(REPORT_TYPES.ITEM_BILLING_TREND, start, end, selectedItem) : undefined,
      ]);
      
      setOverallItemBilling(overallBillingData);
      setItemBillingTrend(itemTrendData);
    } finally {
      setLoading(prev => ({ ...prev, itemTrend: false, overallTrend: false }));
    }
  }, [selectedItem]);

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
      fetchTrendData(trendDateRange[0], trendDateRange[1]);
    }
  }, [trendDateRange, fetchTrendData]);

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
                onChange={setSummaryDateRange}
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
                      onChange={setTopQtyDateRange}
                      clearable
                      w={300}
                      withinPortal
                    />
                    <TextInput
                      placeholder="Search by SKU or Barcode"
                      value={topQtySearch}
                      onChange={(e) => setTopQtySearch(e.currentTarget.value)}
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
                      onChange={setTopAmountDateRange}
                      clearable
                      w={300}
                      withinPortal
                    />
                    <TextInput
                      placeholder="Search by SKU or Barcode"
                      value={topAmountSearch}
                      onChange={(e) => setTopAmountSearch(e.currentTarget.value)}
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
                  onChange={setCategoryDateRange}
                  clearable
                  w={300}
                  withinPortal
                />
                <TextInput
                  placeholder="Search by SKU or Barcode"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.currentTarget.value)}
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
              renderRow={(item, idx) => renderCategoryRow(item, idx, expandedCategories, setExpandedCategories, categorySearch)}
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
                  onChange={setBrandDateRange}
                  clearable
                  w={300}
                  withinPortal
                />
                <TextInput
                  placeholder="Search by SKU or Barcode"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.currentTarget.value)}
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
              renderRow={(item, idx) => renderBrandRow(item, idx, expandedBrands, setExpandedBrands, brandSearch)}
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
                onChange={setDealerDateRange}
                clearable
                w={400}
                withinPortal
              />
            </Group>
            <Grid gutter="xl">
              <Grid.Col md={6}>
                <TableSection
                  title="Top Dealers by Quantity"
                  columns={['Dealer Name', 'Quantity', 'Amount']}
                  data={dealersByQty}
                  loading={loading.dealersQty}
                  renderRow={renderDealerQtyRow}
                  csvHeaders={['Dealer Name', 'Quantity', 'Amount']}
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
                  onChange={setPurchasedDateRange}
                  clearable
                  w={300}
                  withinPortal
                />
                <TextInput
                  placeholder="Search by SKU or Item Name"
                  value={purchasedSearch}
                  onChange={(e) => setPurchasedSearch(e.currentTarget.value)}
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
                  onChange={setTrendDateRange}
                  clearable
                  w={400}
                  withinPortal
                />
                <Select
                  placeholder="Select item"
                  label="Item"
                  data={itemOptions}
                  value={selectedItem}
                  onChange={setSelectedItem}
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
      </Stack>
    </Container>
  );
};

export default Dashboard;
