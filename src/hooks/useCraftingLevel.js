// src/hooks/useCraftingLevel.js
import { useState } from 'react';

export const useCraftingLevel = () => {
  const [craftingExp, setCraftingExp] = useState(0);
  
  const getCurrentLevel = () => Math.floor(Math.sqrt(craftingExp / 100));
  
  const getNextLevelExp = () => Math.pow((getCurrentLevel() + 1), 2) * 100;
  
  const getExpProgress = () => {
    const currentLevelExp = Math.pow(getCurrentLevel(), 2) * 100;
    const nextLevelExp = getNextLevelExp();
    return ((craftingExp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
  };
  
  const addExp = (amount) => {
    setCraftingExp(prev => prev + amount);
  };

  return {
    level: getCurrentLevel(),
    exp: craftingExp,
    progress: getExpProgress(),
    addExp,
  };
};