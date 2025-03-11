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
} from '@mantine/core';
import React from 'react';
import { IconX } from '@tabler/icons-react';

const PaymentDetailsFormCard = ({
  removePaymentRecord,
  paymentsList,
}: PaymentDetailsFormCardProps) => {
  
  const handleDelete = (index: number) => {
    removePaymentRecord(index);
  };

  return (
    <Flex
      align="left"
      gap="16px"
      direction="column"
      sx={{
        maxHeight: '500px',
        width: '350px',
        border: '1px solid grey',
        padding: '16px',
        borderRadius: '8px',
        textAlign: 'left',
        overflow: 'scroll',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
      mx="sm"
      mt="16px"
    >
      {paymentsList.map((payment, index) => (
        <Card
          key={index}
          shadow="md"
          p="md"
          radius="lg"
          withBorder
          sx={{
            flexShrink: 0,
            marginBottom: '8px',
            width: '100%',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Flex direction="column" gap="sm">
            <ActionIcon
              color="red"
              variant="filled"
              size={25}
              radius="xl"
              onClick={() => handleDelete(index)}
              sx={{
                position: 'absolute',
                top: '8px',
                right: '8px',
              }}
            >
              <IconX size={18} />
            </ActionIcon>
            {payment.paymentDate && (
              <Text weight={600} size="md" color="dark">
                Payment Date: {payment.paymentDate}
              </Text>
            )}

            {payment.paidBy && (
              <Text weight={600} size="md" color="dark">
                Paid By:{' '}
                <Badge color="blue" size="lg" radius="md">
                  {payment.paidBy}
                </Badge>
              </Text>
            )}

            {payment.paidAmount && (
              <Text weight={600} size="md" color="dark">
                Paid Amount: <b>{payment.paidAmount}</b>
              </Text>
            )}

            {Array.isArray(payment.paymentImages) &&
              payment.paymentImages.length > 0 && (
                <Group mt="sm" spacing="xs">
                  {payment.paymentImages.map((file, imgIndex) => {
                    if (file instanceof File) {
                      const imageUrl = URL.createObjectURL(file);
                      return (
                        <Image
                          key={imgIndex}
                          src={imageUrl}
                          width={50}
                          height={50}
                          radius="sm"
                          alt={file.name}
                          sx={{ border: '1px solid #ddd' }}
                        />
                      );
                    }
                    return null;
                  })}
                </Group>
              )}

            {payment.payDate && (
              <Text weight={600} size="md" color="dark">
                Pay Date: <b>{payment.payDate}</b>
              </Text>
            )}

            {payment.creditAmount && (
              <Text weight={600} size="md" color="dark">
                Credit Amount: <b>{payment.creditAmount}</b>
              </Text>
            )}

            {payment.creditLimitInDays && (
              <Text weight={600} size="md" color="dark">
                Credit Limit In Days: <b>{payment.creditLimitInDays}</b>
              </Text>
            )}
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

export default PaymentDetailsFormCard;
