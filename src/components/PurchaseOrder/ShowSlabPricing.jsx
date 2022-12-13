import { Button, Table } from '@mantine/core';
import React from 'react'
const ShowSlabPricing = ({slabs,deleteSlab}) => {
    const rows = slabs.map((element, index) => (
        <tr key={index + 1}>
            <td>{element.startValue}</td>
            <td>{element.endValue}</td>
            <td>{element.pricing}</td>
            <td><Button style={{backgroundColor:'#F03E3E'}} onClick={() => deleteSlab(index)}>Delete</Button></td>
        </tr>
      ));
  return (
    <div>
      {slabs.length ? (
        <Table style={{marginTop:'2vmin'}} withColumnBorders striped withBorder>
          <thead>
            <tr>
              <th>Start Value</th>
              <th>End Value</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default ShowSlabPricing
