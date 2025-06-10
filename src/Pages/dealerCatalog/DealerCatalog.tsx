import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  Button,
  Chip,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Flex, Text, Grid } from '@mantine/core';
import SearchIcon from '@mui/icons-material/Search';
import { getDealerCatalogAPI } from '../../utils/apiUtils';
import CatalogCard from './CatalogCard';

function TabPanel(props: dealerCatalogTabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const DealerCatalog = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [activeFilter, setActiveFilter] = useState<
    'dealer' | 'brand' | 'company'
  >('dealer');
  const [counts, setCounts] = useState<dealerCatalogCounts>({
    dealers: 0,
    companies: 0,
    brands: 0,
  });
  const [data, setData] = useState<dealerCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async (type: 'dealer' | 'brand' | 'company') => {
    try {
      setLoading(true);
      const responseData = await getDealerCatalogAPI(type);
      if (type === 'company') {
        setData(responseData.companies || []);
      } else if (type === 'brand') {
        setData(responseData.brands || []);
      } else {
        setData(responseData.dealers || []);
      }
      setCounts(responseData.counts || { dealers: 0, companies: 0, brands: 0 });
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      setCounts({ dealers: 0, companies: 0, brands: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeFilter);
  }, [activeFilter]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    const types = ['dealer', 'company', 'brand'];
    setActiveFilter(types[newValue] as 'dealer' | 'brand' | 'company');
  };

  const filterData = (items: dealerCatalogItem[]) => {
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();
    return items.filter((item: dealerCatalogItem) => {
      if ('dealerName' in item) {
        const dealerItem = item as dealerCatalogDealer;
        const nameMatches = dealerItem.dealerName.toLowerCase().includes(query);
        const numberMatches = dealerItem.dealerNumber.toString().includes(query);

        const brandMatches =
          dealerItem.brands?.filter((brand) =>
            brand.brandName.toLowerCase().includes(query)
          ).length > 0 || false;

        const companyMatches =
          dealerItem.companies?.filter((company) =>
            company.companyName.toLowerCase().includes(query)
          ).length > 0 || false;

        return nameMatches || numberMatches || brandMatches || companyMatches;
      } else if ('companyName' in item) {
        const companyItem = item as dealerCatalogCompany;
        const nameMatches = companyItem.companyName.toLowerCase().includes(query);

        const brandMatches =
          companyItem.brands?.filter((brand) =>
            brand.brandName.toLowerCase().includes(query)
          ).length > 0 || false;

        const dealerMatches =
          companyItem.dealers?.filter(
            (dealer) =>
              dealer.dealerName.toLowerCase().includes(query) ||
              dealer.dealerNumber.toString().includes(query)
          ).length > 0 || false;

        return nameMatches || brandMatches || dealerMatches;
      } else {
        const brandItem = item as dealerCatalogBrand;
        const nameMatches = brandItem.brandName.toLowerCase().includes(query);

        const companyMatches =
          brandItem.companies?.filter((company) =>
            company.companyName.toLowerCase().includes(query)
          ).length > 0 || false;

        const dealerMatches =
          brandItem.dealers?.filter(
            (dealer) =>
              dealer.dealerName.toLowerCase().includes(query) ||
              dealer.dealerNumber.toString().includes(query)
          ).length > 0 || false;

        return nameMatches || companyMatches || dealerMatches;
      }
    });
  };

  const filteredData = filterData(data);

  const getGridSpan = () => {
    if (isMobile) return 12;
    if (isTablet) return 6;
    return 4;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid>
        <Grid.Col span={12}>
          <Card
            variant="outlined"
            sx={{
              px: 2,
              py: 2,
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              mb: isMobile ? 2 : 4,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  fontSize: isMobile ? '1.5rem' : '2rem',
                }}
              >
                Dealer Catalog
              </Typography>
            </Box>

            <Grid>
              <Grid.Col span={isMobile ? 12 : 4} mb={isMobile ? 1 : 0}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: '#F93D8C',
                    borderRadius: 2,
                    border: 'none',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}
                  >
                    Dealers
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: isMobile ? '1rem' : '1.5rem',
                      fontWeight: 600,
                    }}
                  >
                    {counts.dealers}
                  </Typography>
                </Card>
              </Grid.Col>

              <Grid.Col span={isMobile ? 12 : 4} mb={isMobile ? 1 : 0}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: '#907AEA',
                    borderRadius: 2,
                    border: 'none',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}
                  >
                    Companies
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: isMobile ? '1rem' : '1.5rem',
                      fontWeight: 600,
                    }}
                  >
                    {counts.companies}
                  </Typography>
                </Card>
              </Grid.Col>

              <Grid.Col span={isMobile ? 12 : 4}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: '#2EA8FF',
                    borderRadius: 2,
                    border: 'none',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}
                  >
                    Brands
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: isMobile ? '1rem' : '1.5rem',
                      fontWeight: 600,
                    }}
                  >
                    {counts.brands}
                  </Typography>
                </Card>
              </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>

        <Grid.Col span={12}>
          <Card
            variant="outlined"
            sx={{
              mt: isMobile ? 0 : 2,
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={['dealer', 'company', 'brand'].indexOf(activeFilter)}
                onChange={handleTabChange}
                aria-label="basic tabs example"
                variant={isMobile ? 'fullWidth' : 'standard'}
                sx={{
                  '& .MuiTab-root': {
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    minHeight: isMobile ? 48 : 64,
                  },
                }}
              >
                <Tab label="Dealers" />
                <Tab label="Companies" />
                <Tab label="Brands" />
              </Tabs>
            </Box>
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="300px"
              >
                <Typography>Loading...</Typography>
              </Box>
            ) : (
              <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name, number, or related items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover > fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Box>
                <Grid>
                  {activeFilter === 'dealer' &&
                    Array.isArray(filteredData) &&
                    (filteredData as dealerCatalogItem[])
                      .filter((item): item is dealerCatalogDealer => 'dealerName' in item)
                      .map((dealer: dealerCatalogDealer) => (
                        <Grid.Col key={dealer._id} span={getGridSpan()}>
                          <CatalogCard
                            title={dealer.dealerName}
                            subtitle={`Number: ${dealer.dealerNumber}`}
                            brands={dealer.brands}
                            companies={dealer.companies}
                          />
                        </Grid.Col>
                      ))}
                  {activeFilter === 'company' &&
                    Array.isArray(filteredData) &&
                    (filteredData as dealerCatalogItem[])
                      .filter((item): item is dealerCatalogCompany => 'companyName' in item)
                      .map((company: dealerCatalogCompany) => (
                        <Grid.Col key={company._id} span={getGridSpan()}>
                          <CatalogCard
                            title={company.companyName}
                            brands={company.brands}
                            dealers={company.dealers}
                          />
                        </Grid.Col>
                      ))}
                  {activeFilter === 'brand' &&
                    Array.isArray(filteredData) &&
                    (filteredData as dealerCatalogItem[])
                      .filter((item): item is dealerCatalogBrand => 'brandName' in item)
                      .map((brand: dealerCatalogBrand) => (
                        <Grid.Col key={brand._id} span={getGridSpan()}>
                          <CatalogCard
                            title={brand.brandName}
                            companies={brand.companies}
                            dealers={brand.dealers}
                          />
                        </Grid.Col>
                      ))}
                </Grid>
              </Box>
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default DealerCatalog;
