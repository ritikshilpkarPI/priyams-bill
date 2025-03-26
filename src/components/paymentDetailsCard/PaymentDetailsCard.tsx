import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Group,
  Image,
  Overlay,
  Text,
  TextInput,
  Tooltip,
  LoadingOverlay,
} from '@mantine/core';
import { IconBrandWhatsapp, IconX } from '@tabler/icons-react';
import React, { useState } from 'react';
import { formatShortDate } from 'src/utils/formatDate';
import { shareOnWhatsApp } from 'src/utils/shareOnWhatsApp';
import { toast } from 'react-toastify';

const PaymentDetailsCard = ({ payment, index, removePaymentRecord }: PaymentDetailsCardProps) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [phoneNumberError, setPhoneNumberError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isShared, setIsShared] = useState(false);

  const imagePickHandler = (url: string) => {
    if (isShared && imageUrl === url) {
      setIsShared(false);
      setImageUrl('');
      setPhoneNumber('');
    } else if (isShared && imageUrl !== url) {
      setImageUrl(url);
    } else {
      setIsShared(true);
      setImageUrl(url);
    }
  };

  const shareHandler = () => {
    if (phoneNumber.length === 10) {
      setPhoneNumberError('');
      shareOnWhatsApp(`Payment Image - ${imageUrl}`, phoneNumber);
      setIsShared(false);
      setImageUrl('');
      setPhoneNumber('');
    } else {
      setPhoneNumberError('Please enter valid phone number');
    }
  };

  const deletePayment = async () => {
    if (!payment._id) return;
    setLoading(true);
    const response = await removePaymentRecord(payment._id);
    if (response.isError) {
      setLoading(false);
      return toast.error(response.error);
    }
    setLoading(false);
    toast.success('payment delete successfully');
  };

  return (
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
        overflow: 'hidden',
      }}
    >
      <LoadingOverlay zIndex={1} visible={loading} />
      <Flex direction="column" gap="sm">
        <Tooltip color="red" label="Delete Payment">
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
            onClick={() => deletePayment()}
          >
            <IconX size={18} />
          </ActionIcon>
        </Tooltip>
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
                  <Tooltip color="green" label="Share on WhatsAap">
                    <Box
                      key={imgIndex}
                      sx={{
                        position: 'relative',
                        cursor: 'pointer',
                        width: 50,
                        height: 50,
                        borderRadius: '5px',
                        overflow: 'hidden',
                      }}
                      onClick={() => imagePickHandler(file.secure_url)}
                    >
                      <Image
                        sx={{ cursor: 'pointer' }}
                        key={imgIndex}
                        src={file.secure_url}
                        width={50}
                        height={50}
                        onClick={() => imagePickHandler(file.secure_url)}
                      />
                      {imageUrl === file.secure_url && (
                        <Overlay color="green" />
                      )}
                    </Box>
                  </Tooltip>
                );
              })}
            </Group>
          )}
        {isShared && (
          <TextInput
            label="Phone Number"
            value={phoneNumber}
            onChange={(event) =>
              setPhoneNumber(event.currentTarget.value.replace(/[^0-9]/g, ''))
            }
            error={phoneNumberError}
            placeholder="Enter phone number"
            maxLength={10}
          />
        )}
        {isShared && (
          <Button color="green" w={'100%'} onClick={shareHandler}>
            <IconBrandWhatsapp />
          </Button>
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

        {payment.creditLimitInDays !== null &&
          payment.creditLimitInDays !== undefined && (
            <Text weight={600} size="md" color="dark">
              Credit Limit In Days: <b>{payment.creditLimitInDays}</b>
            </Text>
          )}
      </Flex>
    </Card>
  );
};

export default PaymentDetailsCard;
