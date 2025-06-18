import React from 'react';
import { Card, Stack, Group, Text, Skeleton } from '@mantine/core';

interface SummaryCardProps {
  label: string;
  value: string | number | null;
  icon: React.ReactNode;
  loading: boolean;
  noDataText?: string;
  disabled?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  value,
  icon,
  loading,
  noDataText = 'No data',
  disabled = false,
}) => (
  <Card 
    withBorder 
    p="md" 
    radius="md" 
    h={120}
    sx={(theme) => ({
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? 'not-allowed' : 'default',
      backgroundColor: disabled ? theme.colors.gray[0] : theme.white,
      '&:hover': {
        backgroundColor: disabled ? theme.colors.gray[0] : theme.colors.gray[0],
      },
    })}
  >
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