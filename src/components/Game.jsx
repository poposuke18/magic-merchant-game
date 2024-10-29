// src/components/Game.jsx
import React, { useState, useEffect } from 'react';
import { Shield, Sword, TrendingUp, Timer, Coins } from 'lucide-react';
import Inventory from './Inventory';
import EventManager from './EventManager';
import { usePowerAnimation } from '../hooks/usePowerAnimation';
import CraftingSystem from './CraftingSystem';
import { motion, AnimatePresence } from 'framer-motion';
import { MAGIC_ELEMENTS } from '../constants/magicSystem';



// ゲームの定数
const INITIAL_STATE = {
  HUMAN_POWER: 20,
  MONSTER_POWER: 80,
  INITIAL_GOLD: 1000,
  MARKET_UPDATE_INTERVAL: 15000,
  EVENT_CHECK_INTERVAL: 30000
};


// StartScreen コンポーネント
const StartScreen = ({ onStart }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const storySteps = [
    {
      title: "魔術商人",
      content: "混沌の時代が訪れようとしていた...",
    },
    {
      title: "世界の均衡",
      content: "人間と魔物の力が拮抗する中、あなたは一人の魔術商人として目覚めた。",
    },
    {
      title: "魔術書",
      content: "魔術書を作り、売り、そして世界の均衡を保つ。それがあなたの使命となる。",
    },
    {
      title: "商人としての道",
      content: "人間と魔物、どちらかに肩入れすれば世界は崩壊へと向かうだろう。賢明な取引こそが、この世界を救う鍵となる。",
    }
  ];

  const handleNext = () => {
    if (currentStep < storySteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsVisible(false);
      setTimeout(onStart, 500);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white"
        >
          <div className="max-w-xl w-full px-4">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-8"
            >
              <h1 className="text-4xl mb-8 font-bold">
                {storySteps[currentStep].title}
              </h1>
              
              <p className="text-xl mb-12 leading-relaxed">
                {storySteps[currentStep].content}
              </p>

              <div className="flex justify-center gap-4">
                {currentStep < storySteps.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors"
                  >
                    続ける
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition-colors"
                  >
                    冒険の始まり
                  </button>
                )}
              </div>

              <div className="flex justify-center gap-2 mt-8">
                {storySteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep ? 'bg-white' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// GameOver コンポーネント
const GameOver = ({ gameState, onRestart }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
    <h1 className="text-4xl mb-8 font-bold">死の商人</h1>
    <div className="mb-8 text-center max-w-md">
      <p className="mb-4">あなたは均衡を崩してしまいました。</p>
      <p className="mb-4">永遠の争いを望んだ死の商人は、その役目を終えたのです。</p>
      <p>最終結果：{Math.floor(gameState.elapsedTime / 60)}分{gameState.elapsedTime % 60}秒</p>
      <p>獲得金額：{gameState.gold}G</p>
    </div>
    <button
      onClick={onRestart}
      className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors"
    >
      もう一度プレイ
    </button>
  </div>
);

// GameHeader コンポーネント
const GameHeader = ({ gameState }) => {
  const { currentHumanPower } = usePowerAnimation(gameState.humanPower);
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white z-50 shadow-lg">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-2">
              <Coins className="text-yellow-500" />
              <span>{gameState.gold}G</span>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="flex items-center space-x-2">
        <TrendingUp className={gameState.marketTrend >= 0 ? "text-green-500" : "text-red-500"} />
        <div className="flex flex-col">
          <span>{Math.abs(gameState.marketTrend * 100).toFixed(1)}%</span>
          <span className="text-xs text-gray-400">
            変動率: {(gameState.volatility * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
          
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between mb-2">
              <span className="text-blue-400 flex items-center">
                <Shield className="w-4 h-4 mr-1" />{Math.round(currentHumanPower)}%
              </span>
              <span className="text-red-400 flex items-center">
                <Sword className="w-4 h-4 mr-1" />{Math.round(100 - currentHumanPower)}%
              </span>
            </div>
            <div className="w-full bg-red-500 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${currentHumanPower}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-2">
              <TrendingUp className={gameState.marketTrend >= 0 ? "text-green-500" : "text-red-500"} />
              <span>{Math.abs(gameState.marketTrend * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-2">
              <Timer className="text-gray-400" />
              <span>{Math.floor(gameState.elapsedTime / 60)}:{(gameState.elapsedTime % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// メインのゲームコンポーネント
const MagicMerchantGame = () => {
  const [gameState, setGameState] = useState({
    gameStarted: false,
    gold: INITIAL_STATE.INITIAL_GOLD,
    humanPower: INITIAL_STATE.HUMAN_POWER,
    monsterPower: INITIAL_STATE.MONSTER_POWER,
    marketTrend: 0,
    volatility: 0.2,
    inventory: [],
    elapsedTime: 0
  });

  // 時間経過の処理
  useEffect(() => {
    if (!gameState.gameStarted) return;
    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        elapsedTime: prev.elapsedTime + 1
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState.gameStarted]);

  // 市場変動の処理
  useEffect(() => {
    if (!gameState.gameStarted) return;
    const marketTimer = setInterval(() => {
      setGameState(prev => {
        const randomChange = (Math.random() - 0.5) * 0.4;
        return {
          ...prev,
          marketTrend: Math.max(-0.5, Math.min(0.5, prev.marketTrend + randomChange)),
          volatility: Math.max(0.1, Math.min(0.4, prev.volatility * (1 + (Math.random() - 0.5) * 0.1)))
        };
      });
    }, INITIAL_STATE.MARKET_UPDATE_INTERVAL);
    return () => clearInterval(marketTimer);
  }, [gameState.gameStarted]);

  // 自然な勢力変動の処理
  useEffect(() => {
    if (!gameState.gameStarted) return;
    const balanceTimer = setInterval(() => {
      setGameState(prev => {
        const strongerSide = prev.humanPower > prev.monsterPower ? 'human' : 'monster';
        const difference = Math.abs(prev.humanPower - prev.monsterPower);
        const change = Math.min(difference * 0.05, 1) * (strongerSide === 'human' ? 1 : -1);
        const newHumanPower = Math.max(0, Math.min(100, prev.humanPower + change));
        return {
          ...prev,
          humanPower: newHumanPower,
          monsterPower: 100 - newHumanPower
        };
      });
    }, 5000);
    return () => clearInterval(balanceTimer);
  }, [gameState.gameStarted]);


  // 魔術書の販売処理
  const handleSellBook = (bookId, faction) => {
    const book = gameState.inventory.find(b => b.id === bookId);
    if (!book || book.quantity <= 0) return;
  
    // 属性に基づく需要の計算
    const element = MAGIC_ELEMENTS[book.element];
    const demandMultiplier = faction === 'human' ? element.humanDemand : element.monsterDemand;
    const situationalDemand = calculateSituationalDemand(gameState, book.element, faction);
    const finalPrice = Math.floor(book.basePrice * demandMultiplier * situationalDemand * (1 + gameState.marketTrend));
  
    setGameState(prev => ({
      ...prev,
      gold: prev.gold + finalPrice,
      humanPower: faction === 'human' 
        ? Math.min(100, prev.humanPower + book.power)
        : Math.max(0, prev.humanPower - book.power),
      monsterPower: faction === 'monster'
        ? Math.min(100, 100 - (prev.humanPower - book.power))
        : Math.max(0, 100 - (prev.humanPower + book.power)),
      inventory: prev.inventory.map(item =>
        item.id === bookId && item.quality === book.quality && item.element === book.element
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    }));
  };

  const calculateSituationalDemand = (gameState, element, faction) => {
    let demand = 1.0;
    
    // 勢力バランスによる補正
    if (faction === 'human' && gameState.humanPower < 40) {
      demand *= 1.2; // 劣勢時は需要増加
    } else if (faction === 'monster' && gameState.humanPower > 60) {
      demand *= 1.2;
    }
  
    // 属性相性による補正
    switch (element) {
      case 'FIRE':
        demand *= gameState.humanPower < 50 ? 1.3 : 0.8; // 人間が劣勢のとき火属性の需要増加
        break;
      case 'ICE':
        demand *= Math.abs(gameState.humanPower - 50) < 20 ? 1.2 : 0.9; // 均衡時に氷属性の需要増加
        break;
      // 他の属性も同様に追加
    }
  
    return demand;
  };

  // ゲームの再起動
  const handleRestart = () => {
    setGameState({
      gameStarted: false,
      gold: INITIAL_STATE.INITIAL_GOLD,
      humanPower: INITIAL_STATE.HUMAN_POWER,
      monsterPower: INITIAL_STATE.MONSTER_POWER,
      marketTrend: 0,
      volatility: 0.2,
      inventory: [],
      elapsedTime: 0
    });
  };

  if (!gameState.gameStarted) {
    return <StartScreen onStart={() => setGameState(prev => ({ ...prev, gameStarted: true }))} />;
  }

  if (gameState.humanPower <= 0 || gameState.humanPower >= 100) {
    return <GameOver gameState={gameState} onRestart={handleRestart} />;
  }

  return (
    <AnimatePresence mode="wait">
      {!gameState.gameStarted ? (
        <StartScreen onStart={() => setGameState(prev => ({ ...prev, gameStarted: true }))} />
      ) : gameState.humanPower <= 0 || gameState.humanPower >= 100 ? (
        <motion.div
          key="game-over"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GameOver gameState={gameState} onRestart={handleRestart} />
        </motion.div>
      ) : (
        <motion.div
          key="game-main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gray-100"
        >
          <GameHeader gameState={gameState} />
          <main className="container mx-auto pt-32 p-4">
            <Inventory 
              gold={gameState.gold}
              inventory={gameState.inventory}
              marketTrend={gameState.marketTrend}
              onSell={handleSellBook}
            />
            <CraftingSystem 
              gameState={gameState}
              setGameState={setGameState}
            />
            <EventManager 
              gameState={gameState}
              setGameState={setGameState}
            />
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MagicMerchantGame;