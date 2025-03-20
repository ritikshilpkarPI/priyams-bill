import {
  Card,
  Flex,
  Group,
  ScrollArea,
  Text,
  Badge,
  Image,
  Button,
  ActionIcon,
  Box,
} from '@mantine/core';
import React from 'react';
import PaymentDetailsCard from '../paymentDetailsCard/PaymentDetailsCard';

const PaymentDetailsFormCard = ({
  removePaymentRecord,
  paymentsList,
  title
}: PaymentDetailsFormCardProps) => {
  

  return (
    <Flex
      gap="16px"
      direction="column"
      sx={{
        border: '0.5px solid #D4D4D4',
        padding: '16px',
        borderRadius: '4px',
      }}
    >
      <Text><Badge color="green" size="lg" radius="md">{title} list</Badge></Text>
      <Box
        sx={{
          maxHeight: '60vh',
          width: '100%',
          borderRadius: '8px',
          overflow: 'scroll',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >

      {paymentsList.map((payment, index) => (
        <PaymentDetailsCard
          payment = {payment}
          index = {index}
        />
      ))}
      </Box>

    </Flex>
  );
};

export default PaymentDetailsFormCard;
