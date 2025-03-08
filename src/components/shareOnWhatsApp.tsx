import React from 'react';
import { Button } from '@mantine/core';

interface ShareOnWhatsAppProps {
  id?: string; 
}

const ShareOnWhatsApp: React.FC<ShareOnWhatsAppProps> = ({ id }) => {
  const currentUrl = window.location.href;

  const baseUrl = window.location.origin;

  const message = id ? `${baseUrl}/new-purchase-order/${id}` : currentUrl;

  const phoneNumber = process.env.REACT_APP_CLIENT_WHATSAPP_PHONE_NUMBER;

  const isApprovalPage = currentUrl.includes('approval');
  const match = currentUrl.match(/\/new-purchase-order\/([a-f0-9]{24})/);
  const orderId = match ? match[1] : null;
  
  const handleShare = () => {
    let url = `https://web.whatsapp.com/send?phone=+91${phoneNumber}`;

    url += `&text=${encodeURI(message)}&app_absent=0`;


    window.open(url);
  };

  return isApprovalPage || orderId ? (
    <Button onClick={handleShare} color="green">
      Share on WhatsApp
    </Button>
  ) : (
    <></>
  );
};

export default ShareOnWhatsApp;
