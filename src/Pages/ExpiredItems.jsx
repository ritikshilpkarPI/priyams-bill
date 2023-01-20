import { Grid } from '@mantine/core';
import React from "react";
import ExpiredItemTable from "src/components/ExpiredItemTable";
import '../CSS/expiredItem.css'
const ExpiredItems = () => {
  return (
    <>
      <Grid>
        <Grid.Col sm={6} lg={6}>
          <ExpiredItemTable day={1} />
        </Grid.Col>
        <Grid.Col sm={6} lg={6}>
          <ExpiredItemTable day={7} />
        </Grid.Col>
        <Grid.Col sm={6} lg={6}>
          <ExpiredItemTable day={15} />
        </Grid.Col>
        <Grid.Col sm={6} lg={6}>
          <ExpiredItemTable day={30} />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default ExpiredItems;
