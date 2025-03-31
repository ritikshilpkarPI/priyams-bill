// src/components/CustomChip.jsx
import { Chip } from '@mantine/core';

/**
 * Reusable Chip Component
 *
 * @param {string} label - Text to show inside the chip.
 * @param {string} color - Color of the chip. Defaults to "green".
 * @param {string} variant - Variant of the chip. Defaults to "filled".
 * @param {boolean} defaultChecked - Whether chip is checked by default. Defaults to true.
 *
 */
export const CustomChip = ({
  label = 'Paid',
  color = 'green',
  variant = 'filled',
  defaultChecked = true,
  labelClassName
}) => {
  return (
    <Chip
      defaultChecked={defaultChecked}
      color={color}
      variant={variant}
      classNames={{
        label: labelClassName
      }}
    >
      {label}
    </Chip>
  );
};
