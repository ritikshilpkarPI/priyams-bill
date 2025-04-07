import React, { useEffect } from 'react';
import { Autocomplete } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCompanies,
  setLoading,
} from '../../redux/companys/companySlice';
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
        const filtered = response.filter(
          (company: { companyName: string }) => Boolean(company.companyName)
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
    fetchCompanies();
  }, []);

  return (
    <Autocomplete
      w="100%"
      label={label}
      value={value}
      onChange={onChange}
      data={companies.map((company) => company.companyName)}
      required={required}
      disabled={disabled || loading}
      error={error}
      placeholder={placeholder}
    />
  );
};

export default CompanySelector;
