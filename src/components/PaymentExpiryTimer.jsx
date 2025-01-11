import { useEffect } from 'react';
import useTimer from 'src/hooks/useTimer';

export const PaymentExpiryTimer = ({ expiryTimeInSec = 10, onTimerEnd }) => {
  const { start, time } = useTimer(expiryTimeInSec);

  useEffect(() => {
    if(time === 0) {
      onTimerEnd && onTimerEnd();
    }
  }, [time])
  
  useEffect(() => {
    start();
  }, []);

  const remainingSecs = Math.floor(time % 60);
  const remainingMins = Math.floor(time / 60);

  return (
    <span>
      {remainingMins} : {remainingSecs}
    </span>
  );
};
