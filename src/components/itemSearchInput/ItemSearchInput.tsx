import React, { useEffect, useState } from 'react';
import { Box, InputBase } from '@mui/material';
import { IconLetterISmall, IconSearch } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';

interface GoogleSearchBarProps {
  onChange: (value: string) => void;
  placeholder?: string;
}

const ItemSearchInput: React.FC<GoogleSearchBarProps> = ({
  onChange,
  placeholder = 'Search for a document',
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearchInput] = useDebouncedValue(searchInput, 500);

  useEffect(() => {
    onChange(debouncedSearchInput);
  }, [debouncedSearchInput, onChange]);

  return (
    <Box
      sx={{
        background: 'linear-gradient(90deg, rgba(39,181,207,1) 0%, rgba(50,105,207,1) 33%, rgba(222,51,213,1) 67%, rgb(255, 82, 108) 100%)',
        borderRadius: '12px',
        padding: '2px',
        width: '100%',
        height: '45px',
      }}
    >
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        <IconSearch size={23} stroke={1.5} color="#999" />
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
        />
      </Box>
    </Box>
  );
};

export default ItemSearchInput;
