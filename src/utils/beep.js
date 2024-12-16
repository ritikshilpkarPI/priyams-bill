import { useRef, useState, useEffect } from 'react';

export const useBeep = (audioSrc) => {
  const [isBeeping, setIsBeeping] = useState(false);
  const newBuzzer = useRef(null);

  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.loop = true;
    newBuzzer.current = audio;
  }, [audioSrc]);

  const beep = () => {
    setIsBeeping(true);
    newBuzzer.current.loop=true;
    newBuzzer.current.play().catch((error) => {
      console.error('Error playing sound:', error);
    });
  };

  const stopBeep = () => {
    if (newBuzzer.current) {
      newBuzzer.current.pause();
      newBuzzer.current.currentTime = 0;
      newBuzzer.current.loop = false;
    }
    setIsBeeping(false);
  };

  return { beep, stopBeep, isBeeping };
};
