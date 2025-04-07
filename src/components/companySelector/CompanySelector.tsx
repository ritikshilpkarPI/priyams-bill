import React from 'react';
import { Autocomplete } from '@mantine/core';

type CompanySelectorProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean; 
};

const CompanySelector: React.FC<CompanySelectorProps> = ({
  label = '',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  disabled = false,
}) => {
  return (
    <Autocomplete
      w="100%"
      label={label}
      value={value}
      required={required}
      onChange={onChange}
      data={[]}
      disabled={disabled}
      error = {error}
      placeholder={placeholder}
    />
  );
};

export default CompanySelector;
