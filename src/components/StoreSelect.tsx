import React from 'react';
import { Select } from '@mantine/core';

interface StoreSelectProps {
  stores: Store[]; 
  value: string;
  error?: string;
  onChange: (storeId: string) => void;
  disabled?: boolean;
}

export const StoreSelect: React.FC<StoreSelectProps> = ({ stores, value, onChange, error, disabled }) => {
  const data = stores.map((store) => ({
    value: store.code,
    label: store.code + ' - ' + store.name,
  }));
  return (
    <Select
      label="Select Store"
      placeholder="Choose a store"
      data={data}
      value={value}
      onChange={(val) => onChange(val || '')}
      error={error}
      disabled={disabled}
    />
  );
};
