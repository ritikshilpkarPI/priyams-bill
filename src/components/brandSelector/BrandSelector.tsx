import React from 'react';
import { Autocomplete } from '@mantine/core';

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

export default BrandSelector;
