import { Chip } from '@mantine/core';

export const TAB: Record<string, string> = {
  dealerDetails: 'dealerDetails',
  itemDetails: 'itemDetails',
  paymentDetails: 'paymentDetails',
  billUpload: 'billUpload',
  summary: 'summary',
};

export type TabKey = keyof typeof TAB;
interface TabChipProps {
  label: string;
  isValid: boolean;
  tabKey: TabKey;
  activeTab: string;
  onTabChange: (newTab: TabKey) => void;
}

export const TabChip: React.FC<TabChipProps> = ({
  label,
  isValid,
  tabKey,
  activeTab,
  onTabChange,
}) => {
  return (
    <Chip
      checked={true}
      color={isValid ? 'green' : 'yellow'}
      size="md"
      onClick={() => onTabChange(tabKey)}
    >
      {label}
    </Chip>
  );
};
