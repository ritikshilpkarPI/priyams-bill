import { useState, useRef, useEffect } from 'react';

const useTimer = (initialTime = 0, interval = 1000) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, interval);
    }
  };

  const pause = () => {
    if (isRunning) {
      setIsRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const reset = (newTime = initialTime) => {
    pause();
    setTime(newTime);
  };

  useEffect(() => {
    if (time <= 0) {
      pause();
    }
  }, [time]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return { time, isRunning, start, pause, reset };
};

export default useTimer;
