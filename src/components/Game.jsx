// src/components/Game.jsx
import React, { useState, useEffect } from 'react';
import { Shield, Sword, TrendingUp, Timer, Coins } from 'lucide-react';
import Inventory from './Inventory';
import EventManager from './EventManager';
import { usePowerAnimation } from '../hooks/usePowerAnimation';
import CraftingSystem from './CraftingSystem';

// ゲームの定数
const INITIAL_STATE = {
  HUMAN_POWER: 20,
  MONSTER_POWER: 80,
  INITIAL_GOLD: 1000,
  MARKET_UPDATE_INTERVAL: 15000,
  EVENT_CHECK_INTERVAL: 30000
};

// 魔術書の定義
const MAGIC_BOOKS = [
  {
    id: 1,
    name: '初級魔術書',
    basePrice: 100,
    power: 5,
    description: '基本的な魔力を持つ魔術書'
  },
  {
    id: 2,
    name: '中級魔術書',
    basePrice: 300,
    power: 15,
    description: '一定の魔力を持つ魔術書'
  },
  {
    id: 3,
    name: '上級魔術書',
    basePrice: 800,
    power: 40,
    description: '強大な魔力を持つ魔術書'
  }
];

// StartScreen コンポーネント
const StartScreen = ({ onStart }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
    <h1 className="text-4xl mb-8 font-bold">魔術商人</h1>
    <div className="mb-8 text-center max-w-md">
      <p className="mb-4">争いの絶えない世界で、あなたは魔術書を売る商人となります。</p>
      <p className="mb-4">人間と魔物、どちらの勢力も滅ぼさず、永遠の均衡を保ちながら利益を追求しましょう。</p>
      <p>現在、人間勢力は劣勢です。しかし、それは新たなビジネスチャンスかもしれません...</p>
    </div>
    <button
      onClick={onStart}
      className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors"
    >
      ゲームを開始
    </button>
  </div>
);

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

  // 魔術書の購入処理
  const handleBuyBook = (bookId) => {
    const book = MAGIC_BOOKS.find(b => b.id === bookId);
    if (book && gameState.gold >= book.basePrice) {
      setGameState(prev => ({
        ...prev,
        gold: prev.gold - book.basePrice,
        inventory: prev.inventory.some(item => item.id === bookId)
          ? prev.inventory.map(item => 
              item.id === bookId 
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prev.inventory, { ...book, quantity: 1 }]
      }));
    }
  };

  // 魔術書の販売処理
  const handleSellBook = (bookId, faction) => {
    const book = gameState.inventory.find(b => b.id === bookId);
    if (book && book.quantity > 0) {
      setGameState(prev => ({
        ...prev,
        gold: prev.gold + book.basePrice,
        humanPower: faction === 'human' 
          ? Math.min(100, prev.humanPower + book.power)
          : Math.max(0, prev.humanPower - book.power),
        monsterPower: faction === 'monster'
          ? Math.min(100, 100 - (prev.humanPower - book.power))
          : Math.max(0, 100 - (prev.humanPower + book.power)),
        inventory: prev.inventory.map(item =>
          item.id === bookId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      }));
    }
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
    <div className="min-h-screen bg-gray-100">
      <GameHeader gameState={gameState} />
      <main className="container mx-auto pt-32 p-4">
      <Inventory 
  gold={gameState.gold}
  inventory={gameState.inventory}
  marketTrend={gameState.marketTrend}  // これを追加
  onBuy={handleBuyBook}
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
    </div>
  );
};

export default MagicMerchantGame;