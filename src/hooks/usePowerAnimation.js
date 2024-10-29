// src/hooks/usePowerAnimation.js
import { useState, useEffect } from 'react';

export const usePowerAnimation = (targetHumanPower, duration = 1000) => {
  const [currentHumanPower, setCurrentHumanPower] = useState(targetHumanPower);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (currentHumanPower === targetHumanPower) return;
    
    setIsAnimating(true);
    const startPower = currentHumanPower;
    const powerDiff = targetHumanPower - startPower;
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // イージング関数を使用してよりスムーズなアニメーションに
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const newPower = startPower + (powerDiff * easeProgress);
      setCurrentHumanPower(newPower);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [targetHumanPower, duration]);

  return { currentHumanPower, isAnimating };
};