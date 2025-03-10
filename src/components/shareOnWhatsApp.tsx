import React from 'react';
import { Button } from '@mantine/core';

interface ShareOnWhatsAppProps {
  message: string,
  phoneNumber? :string
}

const ShareOnWhatsApp: React.FC<ShareOnWhatsAppProps> = ({ message,phoneNumber=process.env.REACT_APP_CLIENT_WHATSAPP_PHONE_NUMBER }) => {


  const handleShare = () => {
    let url = `https://web.whatsapp.com/send?phone=+91${phoneNumber}`;

    url += `&text=${encodeURI(message)}&app_absent=0`;


    window.open(url);
  };

  return  (
    <Button onClick={handleShare} color="green">
      Share on WhatsApp
    </Button>
  )
};

export default ShareOnWhatsApp;
