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
    summary: true,
    topSelling: true,
    topDealers: true,
    categoryWise: true,
    brandWise: true,
  });
  const [dateRanges, setDateRanges] = useState<Record<string, [Date | null, Date | null]>>({
    summary: [new Date(new Date().setDate(new Date().getDate() - 15)), new Date()],
    topSelling: [new Date(new Date().setDate(new Date().getDate() - 15)), new Date()],
    topDealers: [new Date(new Date().setDate(new Date().getDate() - 15)), new Date()],
    categoryWise: [new Date(new Date().setDate(new Date().getDate() - 15)), new Date()],
    brandWise: [new Date(new Date().setDate(new Date().getDate() - 15)), new Date()],
  });
  const [reports, setReports] = useState<{
    highestSellingByQuantity?: ReportData;
    highestSellingByAmount?: ReportData;
    categoryWiseTopProducts?: ReportData;
    brandWiseTopProducts?: ReportData;
    topDealersByQuantity?: ReportData;
    topDealersByAmount?: ReportData;
  }>({});

  const fetchReport = async (type: string, section: string) => {
    try {
      const dateRange = dateRanges[section];
      if (!dateRange[0] || !dateRange[1]) return;

      const response = await postAPI({
        path: API_PATHS.REPORT.POST_SALES_REPORTS + '/reports',
        data: {
          reportType: type,
          startDate: dateRange[0].toISOString().split('T')[0],
          endDate: dateRange[1].toISOString().split('T')[0],
        },
      });
      setReports((prev) => ({ ...prev, [type]: response }));
    } catch (error) {
      console.error(`Error fetching ${type} report:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [section]: false }));
    }
  };

  const handleDateRangeChange = (section: string, newDateRange: [Date | null, Date | null]) => {
    setDateRanges((prev) => ({ ...prev, [section]: newDateRange }));
    setLoading((prev) => ({ ...prev, [section]: true }));

    switch (section) {
      case 'summary':
        Promise.all([
          fetchReport('highestSellingByAmount', 'summary'),
          fetchReport('highestSellingByQuantity', 'summary'),
          fetchReport('topDealersByQuantity', 'summary'),
          fetchReport('categoryWiseTopProducts', 'summary'),
        ]);
        break;
      case 'topSelling':
        fetchReport('highestSellingByQuantity', 'topSelling');
        break;
      case 'topDealers':
        fetchReport('topDealersByQuantity', 'topDealers');
        break;
      case 'categoryWise':
        fetchReport('categoryWiseTopProducts', 'categoryWise');
        break;
      case 'brandWise':
        fetchReport('brandWiseTopProducts', 'brandWise');
        break;
    }
  };

  useEffect(() => {
    // Initial data fetch
    handleDateRangeChange('summary', dateRanges.summary);
    handleDateRangeChange('topSelling', dateRanges.topSelling);
    handleDateRangeChange('topDealers', dateRanges.topDealers);
    handleDateRangeChange('categoryWise', dateRanges.categoryWise);
    handleDateRangeChange('brandWise', dateRanges.brandWise);
  }, []);

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

  if (loading.summary) {
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack spacing="xl">
        <Title order={2}>Sales Dashboard</Title>

        <Grid>
          <Grid.Col span={3}>
            <Card withBorder p="md" radius="md">
              <Stack spacing="xs">
                <DateRangePicker
                  label="Summary Date Range"
                  value={dateRanges.summary}
                  onChange={(value) => handleDateRangeChange('summary', value)}
                  clearable
                  size="xs"
                />
                <Group>
                  <IconChartBar size={32} color="blue" />
                  <div>
                    <Text size="xs" c="dimmed">Total Sales</Text>
                    <Text fw={700} size="xl">
                      ₹{reports.highestSellingByAmount?.data.reduce((sum, item) => sum + item.totalAmount, 0).toFixed(2)}
                    </Text>
                  </div>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
            <Card withBorder p="md" radius="md">
              <Stack spacing="xs">
                <DateRangePicker
                  label="Summary Date Range"
                  value={dateRanges.summary}
                  onChange={(value) => handleDateRangeChange('summary', value)}
                  clearable
                  size="xs"
                />
                <Group>
                  <IconPackage size={32} color="green" />
                  <div>
                    <Text size="xs" c="dimmed">Total Items Sold</Text>
                    <Text fw={700} size="xl">
                      {reports.highestSellingByQuantity?.data.reduce((sum, item) => sum + item.totalQuantity, 0)}
                    </Text>
                  </div>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
            <Card withBorder p="md" radius="md">
              <Stack spacing="xs">
                <DateRangePicker
                  label="Summary Date Range"
                  value={dateRanges.summary}
                  onChange={(value) => handleDateRangeChange('summary', value)}
                  clearable
                  size="xs"
                />
                <Group>
                  <IconUsers size={32} color="orange" />
                  <div>
                    <Text size="xs" c="dimmed">Active Dealers</Text>
                    <Text fw={700} size="xl">
                      {reports.topDealersByQuantity?.data.length}
                    </Text>
                  </div>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
            <Card withBorder p="md" radius="md">
              <Stack spacing="xs">
                <DateRangePicker
                  label="Summary Date Range"
                  value={dateRanges.summary}
                  onChange={(value) => handleDateRangeChange('summary', value)}
                  clearable
                  size="xs"
                />
                <Group>
                  <IconBuildingStore size={32} color="grape" />
                  <div>
                    <Text size="xs" c="dimmed">Categories</Text>
                    <Text fw={700} size="xl">
                      {reports.categoryWiseTopProducts?.data.length}
                    </Text>
                  </div>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={6}>
            <Paper withBorder p="md" radius="md">
              <Stack spacing="xs">
                <Group position="apart">
                  <Title order={3}>Top Selling Items</Title>
                  <DateRangePicker
                    label="Date Range"
                    value={dateRanges.topSelling}
                    onChange={(value) => handleDateRangeChange('topSelling', value)}
                    clearable
                    size="xs"
                  />
                </Group>
                {loading.topSelling ? (
                  <Center p="xl">
                    <Loader size="sm" />
                  </Center>
                ) : (
                  reports.highestSellingByQuantity?.data && 
                  renderTopSellingItems(reports.highestSellingByQuantity.data)
                )}
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={6}>
            <Paper withBorder p="md" radius="md">
              <Stack spacing="xs">
                <Group position="apart">
                  <Title order={3}>Top Dealers</Title>
                  <DateRangePicker
                    label="Date Range"
                    value={dateRanges.topDealers}
                    onChange={(value) => handleDateRangeChange('topDealers', value)}
                    clearable
                    size="xs"
                  />
                </Group>
                {loading.topDealers ? (
                  <Center p="xl">
                    <Loader size="sm" />
                  </Center>
                ) : (
                  reports.topDealersByQuantity?.data && 
                  renderTopDealers(reports.topDealersByQuantity.data)
                )}
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper withBorder p="md" radius="md">
              <Stack spacing="xs">
                <Group position="apart">
                  <Title order={3}>Category-wise Performance</Title>
                  <DateRangePicker
                    label="Date Range"
                    value={dateRanges.categoryWise}
                    onChange={(value) => handleDateRangeChange('categoryWise', value)}
                    clearable
                    size="xs"
                  />
                </Group>
                {loading.categoryWise ? (
                  <Center p="xl">
                    <Loader size="sm" />
                  </Center>
                ) : (
                  reports.categoryWiseTopProducts?.data && 
                  renderCategoryBrandReport(reports.categoryWiseTopProducts.data)
                )}
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper withBorder p="md" radius="md">
              <Stack spacing="xs">
                <Group position="apart">
                  <Title order={3}>Brand-wise Performance</Title>
                  <DateRangePicker
                    label="Date Range"
                    value={dateRanges.brandWise}
                    onChange={(value) => handleDateRangeChange('brandWise', value)}
                    clearable
                    size="xs"
                  />
                </Group>
                {loading.brandWise ? (
                  <Center p="xl">
                    <Loader size="sm" />
                  </Center>
                ) : (
                  reports.brandWiseTopProducts?.data && 
                  renderCategoryBrandReport(reports.brandWiseTopProducts.data)
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