import React, { useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { getAllBrandsAPI } from '../../utils/apiUtils';
import { useDispatch, useSelector } from 'react-redux';
import { setBrands, setLoading } from '../../redux/brands/brandSlice';
import { selectBrands, selectBrandLoading } from '../../redux/brands/brandSelectors';
import { Box, Center, Flex, Text } from '@mantine/core';
import { IconAsteriskSimple } from '@tabler/icons-react';

const BrandSelector: React.FC<BrandSelectorProps> = ({
  align = 'center',
  label = '',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  disabled = false,
}) => {
  const dispatch = useDispatch();
  const brands = useSelector(selectBrands);
  const loading = useSelector(selectBrandLoading);

  const fetchBrands = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllBrandsAPI();

      if (!response.isError) {
        const validBrands = response.filter((brand: { brandName: string }) =>
          Boolean(brand.brandName)
        );
        dispatch(setBrands(validBrands));
      }
    } catch {
       dispatch(setLoading(false));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      fetchBrands();
    });
  }, []);  

  return (
    <>
    <Flex gap={"5px"} align={"center"} justify={align} mb={"2px"}>
      <Text size="sm" fw={500}>{label}</Text>
      <IconAsteriskSimple stroke={2} height={"7px"} width={"7px"}color='red' />
    </Flex>
    <Autocomplete
      size = "small"
      fullWidth
      freeSolo
      disabled={disabled || loading}
      value={value}
      options={brands.map((brand) => brand.brandName)}
      onInputChange={(event, newInputValue) => {        
        onChange?.(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
        {...params}
        label={label}
        placeholder={placeholder}
        required={required}
        error = {Boolean(error)}
        helperText={error}
        sx={{
          backgroundColor: 'white',
        }}
        />
      )}
    />
    </>
  );
};

export default BrandSelector;
