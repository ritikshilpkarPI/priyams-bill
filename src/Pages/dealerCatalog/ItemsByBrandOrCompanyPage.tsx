import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Grid, Card, CardContent, CardMedia, TextField, CircularProgress, Alert } from '@mui/material';
import { API_PATHS } from '../../utils/constants/apiPaths';
import { genericAxios } from '../../utils/genericAxiosMethod';

interface Item {
  _id: string;
  itemName: string;
  itemBarcode: string;
  itemMRPperUnit: number;
  itemSellingPricePerUnit: number;
  images?: { secure_url: string }[];
}

const ItemsByBrandOrCompanyPage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const filterKey = type === 'brand' ? 'brandId' : 'companyId';
        const res = await genericAxios({
          url: '/api/inventory/items/filter',
          method: 'POST',
          data: { [filterKey]: id },
        });
        setItems((res && 'data' in res && res.data?.message) ? res.data.message : []);
      } catch (err: any) {
        setError('Failed to fetch items.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [type, id]);

  const filteredItems = items.filter(item =>
    item.itemName.toLowerCase().includes(search.toLowerCase()) ||
    item.itemBarcode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          {type === 'brand' ? 'Items by Brand' : 'Items by Company'}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by item name or barcode..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ maxWidth: 400, mt: 2 }}
        />
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : filteredItems.length === 0 ? (
        <Typography>No items found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredItems.map(item => (
            <Grid  key={item._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {item.images && item.images.length > 0 && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={item.images[0].secure_url}
                    alt={item.itemName}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" fontWeight={500} gutterBottom>
                    {item.itemName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Barcode: {item.itemBarcode}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    MRP: ₹{item.itemMRPperUnit}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Selling Price: ₹{item.itemSellingPricePerUnit}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ItemsByBrandOrCompanyPage; 