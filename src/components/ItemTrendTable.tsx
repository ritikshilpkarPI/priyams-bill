import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Box,
} from "@mui/material";
import { useMantineTheme } from '@mantine/core';

interface ItemTrendTableProps {
  items: any[];
  startDate: Date;
  endDate: Date;
  calculateWeeklyAverage: (item: any, dates: Date[]) => number | null;
}

const generateDateRange = (start: Date, end: Date): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(start);
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

const getQuantityMap = (item: any, dates: Date[]): { [key: string]: number } => {
  const quantityMap: { [key: string]: number } = {};
  
  dates.forEach(date => {
    quantityMap[date.toISOString().split('T')[0]] = 0;
  });

  if (item.itemBillingTrend) {
    item.itemBillingTrend.forEach((entry: any) => {
      const date = new Date(entry.date).toISOString().split('T')[0];
      quantityMap[date] = (quantityMap[date] || 0) + entry.quantity;
    });
  }
  return quantityMap;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  });
};

const ItemTrendTable: React.FC<ItemTrendTableProps> = ({
  items,
  startDate,
  endDate,
  calculateWeeklyAverage,
}) => {
  const mantineTheme = useMantineTheme();
  const dates = generateDateRange(startDate, endDate);

  const tableStyles = {
    container: {
      width: '100%',
      overflowX: 'auto' as const,
      '&::-webkit-scrollbar': {
        height: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '4px',
        '&:hover': {
          background: '#555',
        },
      },
    },
    headerCell: {
      backgroundColor: mantineTheme.colors.gray[0],
      fontWeight: 600,
    },
    zeroValue: {
      color: mantineTheme.colors.gray[5],
      fontSize: '0.875rem',
    }
  };

  if (items.length === 0) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        No data available for the selected date range
      </Box>
    );
  }

  return (
    <Box sx={tableStyles.container}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={tableStyles.headerCell}>SKU</TableCell>
              {dates.length >= 7 && (
                <TableCell sx={tableStyles.headerCell}>Weekly Average</TableCell>
              )}
              {dates.map((date) => (
                <TableCell
                  key={date.toISOString()}
                  sx={tableStyles.headerCell}
                >
                  {formatDate(date)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => {
              const quantityMap = getQuantityMap(item, dates);
              return (
                <TableRow key={index}>
                  <TableCell>{item.sku || item.itemDetail?.sku || 'N/A'}</TableCell>
                  {dates.length >= 7 && (
                    <TableCell>
                      {calculateWeeklyAverage(item, dates)?.toFixed(2) || '-'}
                    </TableCell>
                  )}
                  {dates.map((date) => {
                    const quantity = quantityMap[date.toISOString().split('T')[0]] || 0;
                    return (
                      <TableCell 
                        key={date.toISOString()}
                        sx={quantity === 0 ? tableStyles.zeroValue : undefined}
                      >
                        {quantity}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ItemTrendTable;

