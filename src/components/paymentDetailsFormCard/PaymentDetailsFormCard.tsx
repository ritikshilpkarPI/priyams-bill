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
import { IconX } from '@tabler/icons-react';
import { formatShortDate } from 'src/utils/formatDate';

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
                Payment Date: <b>{formatShortDate(payment.paymentDate)}</b>
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

            {Array.isArray(payment.paymentImgURL) &&
              payment.paymentImgURL.length > 0 && (
                <Group mt="sm" spacing="xs">
                  {payment.paymentImgURL.map((file, imgIndex) => {
                      return (
                        <Image
                          key={imgIndex}
                          src={file.secure_url}
                          width={50}
                          height={50}
                          radius="sm"
                        />
                      );
                    return null;
                  })}
                </Group>
              )}

            {payment.payDate && (
              <Text weight={600} size="md" color="dark">
                Pay Date: <b>{formatShortDate(payment.payDate)}</b>
              </Text>
            )}

            {payment.creditAmount && (
              <Text weight={600} size="md" color="dark">
                Credit Amount: <b>{payment.creditAmount}</b>
              </Text>
            )}

            { payment.creditLimitInDays !== null && payment.creditLimitInDays !== undefined && (
              <Text weight={600} size="md" color="dark">
                Credit Limit In Days: <b>{payment.creditLimitInDays}</b>
              </Text>
            )}
          </Flex>
        </Card>
      ))}
      </Box>

    </Flex>
  );
};

export default PaymentDetailsFormCard;
