export const shareOnWhatsApp = (message: string, phoneNumber: string) => {
    if (!phoneNumber) {
      return;
    }
  
    const encodedMessage = encodeURIComponent(message);
    const phone = `+91${phoneNumber}`;
  
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
  
    const url = isMobile
      ? `whatsapp://send?phone=${phone}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}&app_absent=0`;
  
    window.open(url, "_blank");
  };
  