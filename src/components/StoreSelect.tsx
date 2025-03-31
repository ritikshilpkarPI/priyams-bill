import React from 'react';
import { Select } from '@mantine/core';

interface StoreSelectProps {
  stores: string[]; 
  value: string;
  onChange: (storeId: string) => void;
}

export const StoreSelect: React.FC<StoreSelectProps> = ({ stores, value, onChange }) => {
  const data = stores.map((storeCode) => ({
    value: storeCode,
    label: storeCode,
  }));
  return (
    <Select
      label="Select Store"
      placeholder="Choose a store"
      data={data}
      value={value}
      onChange={(val) => onChange(val || '')}
    />
  );
};
