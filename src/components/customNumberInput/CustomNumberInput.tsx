import { Input } from '@mantine/core';
import React from 'react';

const CustomNumberInput: React.FC<CustomNumberInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter a number',
  error,
  label,
  required,
  disabled
}) => {
  return (
      <Input.Wrapper error={error} label={label} required={required}>
        <Input
          type="number"
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
        />
      </Input.Wrapper>
  );
};

export default CustomNumberInput;
