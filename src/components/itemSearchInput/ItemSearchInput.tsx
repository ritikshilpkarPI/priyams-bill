import React, { useEffect, useState } from 'react';
import { Box, InputBase } from '@mui/material';
import { IconSearch } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';

const ItemSearchInput = ({
  onChange,
  placeholder = 'Search for a document',
  disabled = false,
}: {
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearchInput] = useDebouncedValue(searchInput, 500);

  useEffect(() => {
    if (!disabled) {
      onChange(debouncedSearchInput);
    }
  }, [debouncedSearchInput, onChange, disabled]);

  return (
    <Box
      sx={{
        border: '2px solid',
        borderImageSlice: 1,
        borderImageSource:
          'linear-gradient(90deg, rgba(39,181,207,1) 0%, rgba(50,105,207,1) 33%, rgba(222,51,213,1) 67%, rgb(255, 82, 108) 100%)',
        display: 'flex',
        alignItems: 'center',
        px: 2,
        height: '45px',
        width: '100%',
        backgroundColor: disabled ? '#f5f5f5' : '#fff',       
      }}
      >
      <IconSearch size={20} stroke={1.5} color="#666" />
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
          fontSize: '15px',
          color: '#333',
        }}
        placeholder={placeholder}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        inputProps={{ 'aria-label': 'search' }}
        disabled={disabled}
      />
    </Box>
  );
};

export default ItemSearchInput;
