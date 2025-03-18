import React from 'react';
import { Button } from '@mantine/core';

interface ShareOnWhatsAppProps {
  message: string;
  phoneNumber?: string;
}

const ShareOnWhatsApp: React.FC<ShareOnWhatsAppProps> = ({
  message,
  phoneNumber = process.env.REACT_APP_CLIENT_WHATSAPP_PHONE_NUMBER,
}) => {
  const handleShare = () => {
    const encodedMessage = encodeURIComponent(message);
    const phone = `+91${phoneNumber}`;

    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    let url = isMobile
      ? `whatsapp://send?phone=${phone}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}&app_absent=0`;

    window.open(url, '_blank');
  };

  return (
    <Button onClick={handleShare} color="green">
      Share on WhatsApp
    </Button>
  );
};

export default ShareOnWhatsApp;
