import { GraphComponent } from 'components/graphComponent/GraphComponent'
import React from 'react'

const SellDetailsPage = () => {
    const sampleData = [12, 15, 10];
  return (
    <div>
          <GraphComponent data={sampleData} width={300} height={150} />
    </div>
  )
}

export default SellDetailsPage