// src/components/CraftingSystem.jsx
import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { useCraftingLevel } from '../hooks/useCraftingLevel';  // これを追加


// 定数を別のオブジェクトとして定義
const MATERIALS = {
  MAGIC_INK: {
    id: 'MAGIC_INK',
    name: '魔法の墨',
    basePrice: 50,
    marketInfluence: 0.8
  },
  ENCHANTED_PAPER: {
    id: 'ENCHANTED_PAPER',
    name: '魔法の紙',
    basePrice: 30,
    marketInfluence: 0.5
  },
  SPIRIT_ESSENCE: {
    id: 'SPIRIT_ESSENCE',
    name: '精霊のエッセンス',
    basePrice: 100,
    marketInfluence: 1.2
  }
};

const RECIPES = {
  1: {
    materials: {
      MAGIC_INK: 1,
      ENCHANTED_PAPER: 2
    },
    craftingTime: 5000,
    power: 5
  },
  2: {
    materials: {
      MAGIC_INK: 2,
      ENCHANTED_PAPER: 3,
      SPIRIT_ESSENCE: 1
    },
    craftingTime: 10000,
    power: 15
  },
  3: {
    materials: {
      MAGIC_INK: 3,
      ENCHANTED_PAPER: 4,
      SPIRIT_ESSENCE: 2
    },
    craftingTime: 15000,
    power: 40
  }
};

const CraftingSystem = ({ gameState, setGameState }) => {
    const { level, exp, progress, addExp } = useCraftingLevel();
    const [showCraftingEffect, setShowCraftingEffect] = useState(false);
  const [materials, setMaterials] = useState({
    MAGIC_INK: 0,
    ENCHANTED_PAPER: 0,
    SPIRIT_ESSENCE: 0
  });
  const [craftingQueue, setCraftingQueue] = useState([]);

  const getQualityBonus = () => {
    return 1 + (level * 0.1); // レベルごとに10%ずつ品質向上
  };

  const showCompletionEffect = () => {
    setShowCraftingEffect(true);
    setTimeout(() => setShowCraftingEffect(false), 2000);
  };

  // 素材の価格計算
  const calculateMaterialPrice = (material) => {
    return Math.round(material.basePrice * (1 + gameState.marketTrend * material.marketInfluence));
  };

  // 素材購入
  const buyMaterial = (materialId) => {
    const material = MATERIALS[materialId];
    const price = calculateMaterialPrice(material);

    if (gameState.gold < price) {
      return;
    }

    setGameState(prev => ({
      ...prev,
      gold: prev.gold - price
    }));

    setMaterials(prev => ({
      ...prev,
      [materialId]: prev[materialId] + 1
    }));
  };

  // 魔術書作成開始
  const startCrafting = (recipeId) => {
    const recipe = RECIPES[recipeId];
    
    // 素材チェック
    for (const [materialId, required] of Object.entries(recipe.materials)) {
      if (materials[materialId] < required) {
        return;
      }
    }

    // 素材を消費
    setMaterials(prev => {
      const newMaterials = { ...prev };
      for (const [materialId, required] of Object.entries(recipe.materials)) {
        newMaterials[materialId] -= required;
      }
      return newMaterials;
    });

    // 作成キューに追加
    setCraftingQueue(prev => [...prev, {
      recipeId,
      startTime: Date.now(),
      craftingTime: recipe.craftingTime
    }]);
  };

  // 作成キューの処理
  useEffect(() => {
    if (craftingQueue.length === 0) return;

    const timer = setInterval(() => {
      const currentTime = Date.now();
      const completedItems = [];
      const remainingQueue = [];

      craftingQueue.forEach(item => {
        if (currentTime - item.startTime >= item.craftingTime) {
          completedItems.push(item);
          addExp(item.recipeId * 10); // レシピの難易度に応じて経験値を獲得
          showCompletionEffect(); // 完成エフェクトを表示
        } else {
          remainingQueue.push(item);
        }
      });

      if (completedItems.length > 0) {
        setCraftingQueue(remainingQueue);
        setGameState(prev => ({
          ...prev,
          inventory: completedItems.reduce((inv, item) => {
            const bookId = parseInt(item.recipeId);
            const qualityBonus = getQualityBonus();
            const existingBook = inv.find(b => b.id === bookId);
            
            const enhancedBook = {
              id: bookId,
              name: `${bookId === 1 ? '初級' : bookId === 2 ? '中級' : '上級'}魔術書`,
              basePrice: Math.floor(RECIPES[bookId].power * 20 * qualityBonus),
              power: Math.floor(RECIPES[bookId].power * qualityBonus),
              quality: level,
              quantity: 1,
              crafted: true // 作成した本であることを示すフラグ
            };

            if (existingBook && existingBook.quality === level) {
              return inv.map(b => b.id === bookId ? { ...b, quantity: b.quantity + 1 } : b);
            }
            return [...inv, enhancedBook];
          }, prev.inventory)
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [craftingQueue, setGameState, level]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 relative">
      {/* 熟練度表示 */}
      <div className="col-span-2 bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">魔術書作成レベル: {level}</h3>
          <span className="text-sm text-gray-600">次のレベルまで: {Math.floor(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
  
      {/* 素材購入セクション */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">素材購入</h2>
        <div className="space-y-4">
          {Object.values(MATERIALS).map((material) => (
            <div key={material.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-700">{material.name}</h3>
                  <p className="text-sm text-gray-500">所持数: {materials[material.id]}</p>
                </div>
                <button
                  onClick={() => buyMaterial(material.id)}
                  disabled={gameState.gold < calculateMaterialPrice(material)}
                  className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors
                    ${gameState.gold < calculateMaterialPrice(material) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  購入 ({calculateMaterialPrice(material)}G)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
  
      {/* 魔術書作成セクション */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">魔術書作成</h2>
        <div className="space-y-4">
          {Object.entries(RECIPES).map(([recipeId, recipe]) => (
            <div key={recipeId} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-700">
                {`${recipeId === '1' ? '初級' : recipeId === '2' ? '中級' : '上級'}魔術書`}
              </h3>
              <div className="mt-2 space-y-1">
                {Object.entries(recipe.materials).map(([materialId, required]) => (
                  <p key={materialId} className="text-sm text-gray-600">
                    {MATERIALS[materialId].name}: {required}個
                    <span className={`ml-2 ${materials[materialId] >= required ? 'text-green-500' : 'text-red-500'}`}>
                      ({materials[materialId] || 0}/{required})
                    </span>
                  </p>
                ))}
              </div>
              <button
                onClick={() => startCrafting(recipeId)}
                disabled={Object.entries(recipe.materials).some(
                  ([materialId, required]) => materials[materialId] < required
                )}
                className={`mt-3 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors
                  ${Object.entries(recipe.materials).some(
                    ([materialId, required]) => materials[materialId] < required
                  ) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                作成開始
              </button>
            </div>
          ))}
        </div>
      </div>
  
      {/* 作成キュー */}
      {craftingQueue.length > 0 && (
        <div className="col-span-2 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4 text-gray-800">作成中の魔術書</h2>
          <div className="space-y-4">
            {craftingQueue.map((item, index) => {
              const progress = Math.min(100, ((Date.now() - item.startTime) / item.craftingTime) * 100);
              return (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">
                      {`${item.recipeId === 1 ? '初級' : item.recipeId === 2 ? '中級' : '上級'}魔術書`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
  
      {/* 完成エフェクト */}
      {showCraftingEffect && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="animate-craftComplete bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg">
            魔術書が完成しました！
          </div>
        </div>
      )}
    </div>
  );
};

export default CraftingSystem;