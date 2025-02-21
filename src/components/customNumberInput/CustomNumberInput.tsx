import { Input } from '@mantine/core';
import React from 'react';

const CustomNumberInput: React.FC<CustomNumberInputProps> = ({
  value,
  onChange,
  placeholder = "Enter a number",
  error,
  label,
  required
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center'}}>
      <Input.Wrapper  error={error} label={label} required={required}>
        <Input
          type="number"
          onChange={onChange}
          placeholder={placeholder}
          value={value}
      />
      </Input.Wrapper>
    </div>
  );
};

export default CustomNumberInput;
