import * as React from 'react';
export const Cross = ({ width = '20', height = '20', color = 'red' }) => (
  <svg
    fill={color}
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={width}
    height={height}
    x="0px"
    y="0px"
    viewBox="0 0 490 490"
    style={{
      enableBackground: 'new 0 0 490 490',
    }}
    xmlSpace="preserve"
  >
    <g>
      <path d="M76.563,490h336.875C455.547,490,490,455.547,490,413.438V76.563C490,34.453,455.547,0,413.437,0H76.563 C34.453,0,0,34.453,0,76.563v336.875C0,455.547,34.453,490,76.563,490z M124.835,175.445l50.61-50.611L245,194.39l69.555-69.555 l50.61,50.611L295.611,245l69.555,69.555l-50.61,50.611L245,295.611l-69.555,69.555l-50.61-50.61L194.389,245L124.835,175.445z" />
    </g>
  </svg>
);
