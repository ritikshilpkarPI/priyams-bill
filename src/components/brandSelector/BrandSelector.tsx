import React, { useEffect } from 'react';
import { Autocomplete } from '@mantine/core';
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
    } 
    finally {
        dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <Autocomplete
      w="100%"
      label={label}
      value={value}
      required={required}
      onChange={onChange}
      data={brands.map((brand) => brand.brandName)}
      disabled={disabled || loading}
      error={error}
      placeholder={placeholder}
    />
  );
};

export default BrandSelector;
