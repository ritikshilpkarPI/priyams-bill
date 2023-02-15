import { Grid } from '@mantine/core';
import React from 'react';
import ExpiredItemTable from 'src/components/ExpiredItemTable';

const ExpiredItems = () => {
  const dateIntervalArr = [1, 7, 15, 30];

  return (
    <Grid>
      {dateIntervalArr.map((dayInterval) => (
        <Grid.Col key={dayInterval} sm={6} lg={6}>
          <ExpiredItemTable day={dayInterval} />
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default ExpiredItems;
