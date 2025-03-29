import * as React from 'react';
export const Caret = ({ 
    width = '20', height = '20', color = '#0D0D0D', className = ""
}) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 14l5-6 5 6H7z" fill={color} />
  </svg>
);
