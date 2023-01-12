import { Grid } from '@mantine/core';
import React from "react";
import ExpiredItemTable from "src/components/ExpiredItemTable";
import '../CSS/expiredItem.css'
const ExpiredItems = () => {

  return (
    <>
      <Grid>
        <Grid.Col span={6}>
          <ExpiredItemTable header="1 day" />
        </Grid.Col>
        <Grid.Col span={6}>
          <ExpiredItemTable header="7 days" />
        </Grid.Col>
        <Grid.Col span={6}>
          <ExpiredItemTable header="15 days" />
        </Grid.Col>
        <Grid.Col span={6}>
          <ExpiredItemTable header="30 days" />
        </Grid.Col>

      </Grid>
    </>
  );
};

export default ExpiredItems;
