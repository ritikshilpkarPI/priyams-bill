import React, { useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { getAllBrandsAPI } from '../../utils/apiUtils';
import { useDispatch, useSelector } from 'react-redux';
import { setBrands, setLoading } from '../../redux/brands/brandSlice';
import { selectBrands, selectBrandLoading } from '../../redux/brands/brandSelectors';

type BrandSelectorProps = {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
};

const BrandSelector: React.FC<BrandSelectorProps> = ({
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
  );
};

export default BrandSelector;
