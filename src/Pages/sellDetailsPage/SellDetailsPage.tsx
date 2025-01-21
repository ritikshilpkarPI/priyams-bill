import { GraphComponent } from 'components/graphComponent/GraphComponent'
import React from 'react'

const SellDetailsPage = () => {
    const sampleData = [
      { date: "10:20:25", value: 157 },
      { date: "10:22:25", value: 165 },
      { date: "10:24:25", value: 172 },
      { date: "10:26:25", value: 168 },
      { date: "10:28:25", value: 175 },
    ];
   const width= 900; 
   const height= 500;
  return (
    <div>
          <GraphComponent data={sampleData} width={width} height={height} />
    </div>
  )
}

export default SellDetailsPage