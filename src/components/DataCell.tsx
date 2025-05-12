import { Tooltip } from "@mantine/core";
import { useStyles } from "./ExpiredItemPOTable";

export const DataCell: React.FC<{ value: string | number }> = ({ value }) => {
  const { classes } = useStyles();
  return (
    <td>
      <Tooltip label={value} withArrow>
        <span className={classes.ellipsis}>{value}</span>
      </Tooltip>
    </td>
  );
};