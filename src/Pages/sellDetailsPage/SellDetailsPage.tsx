import React from 'react';
import { LineGraph } from '../../components/lineGraph/LineGraph';
import { SellDetailsTable } from '../../components/sellDetailsTable/SellDetailsTable';
import { sampleData } from './sampleData';

const SellDetailsPage = () => {
  return (
    <div>
      <h1>Sell Details Page</h1>
      <SellDetailsTable tableData={sampleData.data.items} />
    </div>
  );
};

export default SellDetailsPage;