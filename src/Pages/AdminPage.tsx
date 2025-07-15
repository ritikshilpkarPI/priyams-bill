import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { updateSellFrequencyAPI, checkLowStockAndCreateTransactionAPI, checkLowStockAndCreateAutoPOAPI } from '../utils/apiUtils';
import Cookies from 'js-cookie';
import { isAdmin } from 'src/utils/isAdmin';

const getToken = () => Cookies.get('token') || localStorage.getItem('token') || '';

const getStoreId = () => localStorage.getItem('storeId');

const getStaffId = () => localStorage.getItem('staffId');

const getWarehouseId = () => localStorage.getItem('warehouseId');

const AdminPage: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateSellFrequency = async () => {
    setLoading('updateSellFrequency');
    setResult(null);
    setError(null);
    const storeId = getStoreId();
    if (!storeId) {
      setLoading(null);
      alert('Store ID not found in localStorage.');
      return;
    }
    const token = getToken();
    const res = await updateSellFrequencyAPI(storeId, token);
    setLoading(null);
    if ('isError' in res && res.isError) {
      setError('Failed to update sell frequency');
    } else {
      setResult('Sell frequency updated successfully!');
    }
  };

  const handleCheckLowStock = async () => {
    setLoading('checkLowStock');
    setResult(null);
    setError(null);
    const storeId = getStoreId();
    const staffId = getStaffId();
    if (!storeId || !staffId) {
      setLoading(null);
      alert('Store ID or Staff ID not found in localStorage.');
      return;
    }
    const token = getToken();
    const res = await checkLowStockAndCreateTransactionAPI(storeId, staffId, token);
    setLoading(null);
    if ('isError' in res && res.isError) {
      setError('Failed to check low stock and create transaction');
    } else {
      setResult('Checked low stock and created transaction successfully!');
    }
  };

  const handleCheckLowStockAutoPO = async () => {
    setLoading('checkLowStockAutoPO');
    setResult(null);
    setError(null);
    const warehouseId = getWarehouseId();
    const staffId = getStaffId();
    if (!warehouseId || !staffId) {
      setLoading(null);
      alert('Warehouse ID or Staff ID not found in localStorage.');
      return;
    }
    const token = getToken();
    const res = await checkLowStockAndCreateAutoPOAPI(warehouseId, staffId, token);
    setLoading(null);
    if ('isError' in res && res.isError) {
      setError('Failed to check low stock and create auto POs');
    } else {
      setResult('Checked low stock and created auto POs successfully!');
    }
  };

  const isAdminUser = isAdmin();
  useEffect(() => {
    if (!isAdminUser) {
      alert('You do not have permission to access this page.');
      window.location.href = '/';
    }
  },[isAdminUser]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={4}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Admin Panel
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateSellFrequency}
          disabled={loading !== null}
          fullWidth
          sx={{ py: 2, fontSize: '1.1rem' }}
        >
          {loading === 'updateSellFrequency' ? <CircularProgress size={24} /> : 'Update Sell Frequency'}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCheckLowStock}
          disabled={loading !== null}
          fullWidth
          sx={{ py: 2, fontSize: '1.1rem' }}
        >
          {loading === 'checkLowStock' ? <CircularProgress size={24} /> : 'Check Low Stock & Create Transaction'}
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleCheckLowStockAutoPO}
          disabled={loading !== null}
          fullWidth
          sx={{ py: 2, fontSize: '1.1rem' }}
        >
          {loading === 'checkLowStockAutoPO' ? <CircularProgress size={24} /> : 'Check Low Stock & Create Auto POs'}
        </Button>
        {result && <Alert severity="success">{result}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Container>
  );
};

export default AdminPage; 