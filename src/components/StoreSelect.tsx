import React from 'react';
import { Select } from '@mantine/core';


interface StoreSelectProps {
  stores: Store[];
  value: string;
  onChange: (storeId: string) => void;
}

export const StoreSelect: React.FC<StoreSelectProps> = ({ stores, value, onChange }) => {
  const data = stores.map((store) => ({ value: store.id, label: store.name }));
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
