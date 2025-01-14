import { Badge } from '@mantine/core';
import { useEffect } from 'react';
import useTimer from '../hooks/useTimer';

export const PaymentExpiryTimer = ({
  expiryTimeInSec = 10,
  onTimerEnd,
  id,
}) => {
  const { start, time, reset } = useTimer(expiryTimeInSec);

  useEffect(() => {
    if (time === 0) {
      onTimerEnd && onTimerEnd();
    }
  }, [time]);

  useEffect(() => {
    if (time === expiryTimeInSec) {
      start();
    }
  }, [time]);

  useEffect(() => {
    reset();
  }, [id]);

  const remainingSecs = Math.floor(time % 60);
  const remainingMins = Math.floor(time / 60);

  return (
    <Badge className="payment-timer-badge" color="yellow">
      {remainingMins} : {remainingSecs}
    </Badge>
  );
};
