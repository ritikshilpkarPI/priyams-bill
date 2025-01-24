import React from 'react'
import { render, screen } from '@testing-library/react';
import SellDetailsPage from './SellDetailsPage';
jest.mock('../../components/lineGraph/LineGraph', () => ({
  LineGraph: jest.fn(() => <div>Mocked LineGraph</div>),
}));

describe('SellDetailsPage', () => {
  it('renders the LineGraph component correctly', () => {
    render(<SellDetailsPage />);

    expect(screen.getByText('Mocked LineGraph')).toBeInTheDocument();
  });

  it('passes correct data to the LineGraph component', () => {
    render(<SellDetailsPage />);

    const { LineGraph } = require('../../components/lineGraph/LineGraph.tsx');

    expect(LineGraph).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [
          { date: '10:20:25', value: 157 },
          { date: '10:22:25', value: 165 },
          { date: '10:24:25', value: 172 },
          { date: '10:26:25', value: 168 },
          { date: '10:28:25', value: 175 },
        ],
        width: 900,
        height: 500,
      }),
      undefined
    );
  });
});