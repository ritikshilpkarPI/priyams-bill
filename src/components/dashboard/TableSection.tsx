import React, { useState } from 'react';
import {
  Stack,
  Group,
  Title,
  Button,
  Table,
  Text,
  Pagination,
  Skeleton,
} from '@mantine/core';

interface TableSectionProps<RowData> {
  title: string;
  columns: string[];
  data: RowData[] | undefined;
  loading: boolean;
  renderRow: (item: RowData, idx: number) => React.ReactNode;
  csvHeaders: string[];
  mapRowToCSV: (item: RowData) => (string | number)[];
}

const TableSkeleton = () => (
  <Table withBorder withColumnBorders>
    <thead>
      <tr>
        {[1, 2, 3, 4].map((i) => (
          <th key={i}>
            <Skeleton height={20} />
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i}>
          <td colSpan={4}>
            <Group position="apart">
              <Group>
                <Skeleton height={24} circle />
                <Skeleton height={24} width={120} />
              </Group>
              <Skeleton height={16} width={16} />
            </Group>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export const TableSection = <RowData,>({
  title,
  columns,
  data,
  loading,
  renderRow,
  csvHeaders,
  mapRowToCSV,
}: TableSectionProps<RowData>) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const handleDownloadCSV = () => {
    if (!data || data.length === 0) return;
    const csvRows: (string | number)[][] = [csvHeaders, ...data.map(mapRowToCSV)];
    const csvContent = csvRows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_').toLowerCase()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPages = data ? Math.ceil(data.length / itemsPerPage) : 0;
  const paginatedData = data ? data.slice((page - 1) * itemsPerPage, page * itemsPerPage) : [];

  return (
    <Stack spacing="xs">
      <Group position="apart">
        <Title order={3}>{title}</Title>
        <Group>
          <Button size="xs" onClick={handleDownloadCSV} disabled={!data || data.length === 0}>
            Download CSV
          </Button>
        </Group>
      </Group>
      {loading ? (
        <TableSkeleton />
      ) : data && data.length > 0 ? (
        <>
          <div style={{ minHeight: '400px' }}>
            <Table striped highlightOnHover withBorder withColumnBorders>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col}>
                      <Text size="xs" fw={500} c="dimmed">
                        {col}
                      </Text>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{paginatedData.map(renderRow)}</tbody>
            </Table>
          </div>
          {totalPages > 1 && (
            <Group position="center" mt="md">
              <Pagination
                total={totalPages}
                page={page}
                onChange={setPage}
                size="sm"
                radius="md"
                withEdges
              />
            </Group>
          )}
        </>
      ) : (
        <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text align="center" c="dimmed">
            No data available.
          </Text>
        </div>
      )}
    </Stack>
  );
}; 