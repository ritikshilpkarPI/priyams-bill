import React from 'react';
import { Card, Text } from '@mantine/core';
import styles from './MetricCard.module.css';

const MetricCard: React.FC<MetricCardProps> = ({ title, value, prefix, suffix }) => {
  return (
    <Card shadow="lg" p="lg" className={styles.metricCard}>
      <Text weight={500}>{title}</Text>
      <Text size="xl">
        {prefix && `${prefix} `}{value}{suffix && ` ${suffix}`}
      </Text>
    </Card>
  );
};

export default MetricCard;
