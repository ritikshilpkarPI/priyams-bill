import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.useFakeTimers();

const Component = () => (
  <div>
    <input name="input" placeholder="input" type="text" />
  </div>
);

describe('Search Component', () => {
  it('renders the input field', () => {
    render(<Component />);
    const input = screen.getByPlaceholderText('input');
    expect(input).toBeDefined();
  });
});
