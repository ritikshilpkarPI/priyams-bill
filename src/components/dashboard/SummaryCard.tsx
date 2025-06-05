import React from 'react';
import { Card, Stack, Group, Text, Skeleton } from '@mantine/core';

interface SummaryCardProps {
  label: string;
  value: string | number | null;
  icon: React.ReactNode;
  loading: boolean;
  noDataText?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  value,
  icon,
  loading,
  noDataText = 'No data',
}) => (
  <Card withBorder p="md" radius="md" h={120}>
    <Stack spacing="sm" justify="center" align="flex-start" style={{ height: '100%' }}>
      {loading ? (
        <Group align="center" spacing="md" style={{ width: '100%' }}>
          <Skeleton height={32} circle />
          <div style={{ width: '100%' }}>
            <Skeleton height={16} width="60%" mb={8} />
            <Skeleton height={24} width="80%" />
          </div>
        </Group>
      ) : value !== null ? (
        <Group align="center" spacing="md" style={{ width: '100%' }}>
          {icon}
          <div style={{ width: '100%' }}>
            <Text size="xs" c="dimmed">
              {label}
            </Text>
            <Text fw={700} size="xl">
              {value}
            </Text>
          </div>
        </Group>
      ) : (
        <Text size="sm" c="dimmed">
          {noDataText}
        </Text>
      )}
    </Stack>
  </Card>
); 