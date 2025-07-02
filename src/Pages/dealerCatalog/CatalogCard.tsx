import React from 'react';
import { Card, Typography, Box, Chip, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const CatalogCard: React.FC<CatalogCardProps> = ({
  title,
  subtitle,
  brands,
  companies,
  dealers,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        maxHeight: '300px',
        overflow: 'auto',
        textAlign: 'left',
        bgcolor: '#F8FBFF',
        border: 'none',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#B0BEC5',
          borderRadius: '2px',
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: isMobile ? '1rem' : '1.25rem',
          fontWeight: 600,
          mb: 1,
          color:'#011955'
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          sx={{
            color: '#2C4259',
            fontSize: isMobile ? '0.875rem' : '1rem',
          }}
        >
          {subtitle}
        </Typography>
      )}

      {brands && brands.length > 0 && (
        <Box mt={1}>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              color: '#2C4259',
              fontWeight: 600,
            }}
          >
            Brands
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              mt: 0.5,
            }}
          >
            {brands.map((brand) => (
              <Chip
                key={brand._id}
                label={brand.brandName}
                size="small"
                sx={{
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  bgcolor: '#2EA8FF',
                  color: '#FFFFFF',
                  border:"none",
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/items-by/brand/${brand._id}`)}
              />
            ))}
          </Box>
        </Box>
      )}

      {companies && companies.length > 0 && (
        <Box mt={1}>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              color: '#2C4259',
              fontWeight: 600,
            }}
          >
            Companies
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              mt: 0.5,
            }}
          >
            {companies.map((company) => (
              <Chip
                key={company._id}
                label={company.companyName}
                size="small"
                sx={{
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  bgcolor: '#907AEA',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/items-by/company/${company._id}`)}
              />
            ))}
          </Box>
        </Box>
      )}

      {dealers && dealers.length > 0 && (
        <Box mt={1}>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              color: '#2C4259',
              fontWeight: 600,
            }}
          >
            Dealers
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              mt: 0.5,
            }}
          >
            {dealers.map((dealer) => (
              <Chip
                key={dealer._id}
                label={`${dealer.dealerName} (${dealer.dealerNumber})`}
                size="small"
                sx={{
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  bgcolor: '#F93D8C',
                  color: '#FFFFFF',
                  border:"none"
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default CatalogCard; 