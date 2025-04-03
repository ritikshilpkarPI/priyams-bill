import { Chip } from '@mantine/core';

export const PaidChip = ({color="green", variant="filled"}) => {
  return (
    <Chip defaultChecked color={color} variant={variant} >
      Paid
    </Chip>
  );
};
