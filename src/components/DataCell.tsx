import React from 'react';
import { Tooltip } from '@mantine/core';
// import { useStyles } from './ExpiredItemPOTable';

type DataCellProps = {
  value: string | number;
  className?: string;
  style?: React.CSSProperties;
};

export const DataCell: React.FC<DataCellProps> = ({ value, className, style }) => {
  // const { classes } = useStyles();

  return (
    <td className={className} style={style}>
      <Tooltip label={value} withArrow>
        {/* <div className={classes.ellipsis}>{value}</div> */}
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value}
        </div>
      </Tooltip>
    </td>
  );
};