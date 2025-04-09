import React, { useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCompanies, setLoading } from '../../redux/companys/companySlice';
import { getAllCompaniesAPI } from '../../utils/apiUtils';
import {
  selectCompanys,
  selectCompanysLoading,
} from '../../redux/companys/companySelectors';

const CompanySelector: React.FC<CompanySelectorProps> = ({
  label = '',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  disabled = false,
}) => {
  const dispatch = useDispatch();
  const companies = useSelector(selectCompanys);
  const loading = useSelector(selectCompanysLoading);

  const fetchCompanies = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllCompaniesAPI();

      if (!response.isError) {
        const filtered = response.filter((company: { companyName: string }) =>
          Boolean(company.companyName)
        );
        dispatch(setCompanies(filtered));
      }
    } catch {
      dispatch(setLoading(false));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      fetchCompanies();
    });
  }, []);

  return (
    <Autocomplete
      size="small"
      freeSolo
      disabled={disabled || loading}
      value={value}
      options={companies.map((company) => company.companyName)}
      onInputChange={(event, newInputValue) => {
        onChange?.(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={Boolean(error)}
          helperText={error}
          sx={{
            backgroundColor: 'white',
          }}
        />
      )}
    />
  );
};

export default CompanySelector;
