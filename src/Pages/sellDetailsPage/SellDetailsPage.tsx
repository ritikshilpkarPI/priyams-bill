import React from 'react'
import { LineGraph } from '../../components/lineGraph/LineGraph';

const SellDetailsPage = () => {
    const sampleData = [
      { date: "10:20:25", value: 157 },
      { date: "10:22:25", value: 165 },
      { date: "10:24:25", value: 172 },
      { date: "10:26:25", value: 168 },
      { date: "10:28:25", value: 175 },
    ];
  return (
    <div>
          <LineGraph data={sampleData} width={900} height={500} />
    </div>
  )
}

export default SellDetailsPage