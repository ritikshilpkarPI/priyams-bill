import { Flex, Group, Text, Badge } from '@mantine/core';
import { getShelfLifeInfo } from 'src/utils/calculateShelfLife';


export const ShelfLifeInfo = ({ expiryDate }: ShelfLifeInfoProps) => {
  const mfgDate = new Date(expiryDate.mfgDate);
  const expDate = new Date(expiryDate.date);
  const addedOn =  new Date(expiryDate.addedOn);
    
  const shelfLife = getShelfLifeInfo(mfgDate, expDate, addedOn);

  return (
    <Flex direction="column" gap={4}>
      <Group spacing="xs" noWrap>
        <Text size="xs" weight={500} color="dimmed">Total:</Text>
        <Text size="xs" truncate>{shelfLife.totalShelfLife}</Text>
      </Group>
      <Group spacing="xs" noWrap>
        <Text size="xs" weight={500} color="dimmed">Left:</Text>
        <Text size="xs" truncate>{shelfLife.leftShelfLife}</Text>
      </Group>
      <Group spacing="xs" noWrap>
        <Text size="xs" weight={500} color="dimmed">% Left:</Text>
        <Badge size="xs" color="blue" variant="light">{shelfLife.percentShelfLifeLeft}</Badge>
      </Group>
    </Flex>
  );
};
