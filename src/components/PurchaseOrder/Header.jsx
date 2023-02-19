import React from 'react';
import { tableHead } from './constant';

const Header = () => {
  return (
    <thead>
      <tr>
        {tableHead.map((item, index) => {
          return <td key={index}>{item}</td>;
        })}
      </tr>
    </thead>
  );
};

export default Header;
