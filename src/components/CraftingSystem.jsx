// src/components/CraftingSystem.jsx
import React, { useState, useEffect } from 'react';
import { Timer, Lock } from 'lucide-react';
import { useCraftingLevel } from '../hooks/useCraftingLevel';
import DebugPanel from './DebugPanel';  // パスは実際の構造に合わせて調整してください

import { 
  MATERIALS, 
  RECIPES, 
  MAGIC_ELEMENTS, 
  LEVEL_REQUIREMENTS 
} from '../constants/magicSystem';

const CraftingSystem = ({ gameState, setGameState }) => {
  // ステート定義
  const { level, exp, progress, addExp } = useCraftingLevel();
  const [showCraftingEffect, setShowCraftingEffect] = useState(false);
  const [showLevelUpEffect, setShowLevelUpEffect] = useState(false);
  const [showUnlockNotification, setShowUnlockNotification] = useState(null);
  const [lastLevel, setLastLevel] = useState(level);
  const [materials, setMaterials] = useState(
    Object.keys(MATERIALS).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
  );
  const [craftingQueue, setCraftingQueue] = useState([]);

  // サブコンポーネント: レベル情報表示
  const LevelInfoSection = ({ level, progress }) => {
    const getNextUnlocks = () => {
      const nextMagicUnlock = Object.entries(LEVEL_REQUIREMENTS.MAGIC_TIERS)
        .find(([_, tier]) => tier.level > level);
      
      const nextRankUnlock = Object.entries(LEVEL_REQUIREMENTS.BOOK_RANKS)
        .find(([_, rank]) => rank.level > level);
  
      return { nextMagicUnlock, nextRankUnlock };
    };
  
    const { nextMagicUnlock, nextRankUnlock } = getNextUnlocks();
  
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-800">魔術書作成レベル: {level}</h3>
          <span className="text-sm text-gray-600">次のレベルまで: {Math.floor(progress)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
  
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">利用可能な属性:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(LEVEL_REQUIREMENTS.MAGIC_TIERS)
              .filter(([_, tier]) => tier.level <= level)
              .flatMap(([_, tier]) => tier.elements)
              .map(element => {
                const elementInfo = MAGIC_ELEMENTS[element];
                return (
                  <span 
                    key={element}
                    className={`${elementInfo.bgColor} ${elementInfo.color} px-2 py-1 rounded text-sm flex items-center gap-1`}
                  >
                    {elementInfo.icon} {elementInfo.name}
                  </span>
                );
              })}
          </div>
        </div>
  
        {(nextMagicUnlock || nextRankUnlock) && (
          <div className="text-sm text-gray-600">
            <h4 className="font-medium text-gray-700 mb-1">次の解放:</h4>
            <ul className="space-y-1">
              {nextMagicUnlock && (
                <li className="flex items-center gap-1">
                  <span className="text-purple-500">Lv.{nextMagicUnlock[1].level}</span>
                  <span>- {nextMagicUnlock[1].description}</span>
                </li>
              )}
              {nextRankUnlock && (
                <li className="flex items-center gap-1">
                  <span className="text-purple-500">Lv.{nextRankUnlock[1].level}</span>
                  <span>- {nextRankUnlock[1].description}作成可能</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // サブコンポーネント: 素材アイテム
  const MaterialItem = ({ material, materials, gameState, buyMaterial, calculateMaterialPrice }) => (
    <div className="bg-gray-50 p-2 rounded">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl">{material.icon}</span>
          <div>
            <h3 className="text-sm font-medium text-gray-700">{material.name}</h3>
            <p className="text-xs text-gray-500">{material.description}</p>
            <p className="text-xs text-gray-500">所持数: {materials[material.id]}</p>
          </div>
        </div>
        <button
          onClick={() => buyMaterial(material.id)}
          disabled={gameState.gold < calculateMaterialPrice(material)}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {calculateMaterialPrice(material)}G
        </button>
      </div>
    </div>
  );

  // ヘルパー関数
  const getAvailableRecipes = () => {
    const availableElements = Object.entries(LEVEL_REQUIREMENTS.MAGIC_TIERS)
      .filter(([_, tier]) => tier.level <= level)
      .flatMap(([_, tier]) => tier.elements);

    const availableRanks = Object.entries(LEVEL_REQUIREMENTS.BOOK_RANKS)
      .filter(([_, rank]) => rank.level <= level)
      .map(([key, _]) => key);

    return Object.entries(RECIPES).filter(([_, recipe]) => {
      return availableElements.includes(recipe.element) && 
             availableRanks.includes(recipe.rank) &&
             recipe.levelRequired <= level;
    });
  };

  const getCraftingTimeReduction = () => {
    return Math.max(0.5, 1 - (level * 0.05));
  };

  const getQualityBonus = () => {
    return 1 + (level * 0.1);
  };

  const calculateMaterialPrice = (material) => {
    return Math.round(material.basePrice * (1 + gameState.marketTrend * material.marketInfluence));
  };

  // アクション関数
  const showCompletionEffect = () => {
    setShowCraftingEffect(true);
    setTimeout(() => setShowCraftingEffect(false), 2000);
  };

  const buyMaterial = (materialId) => {
    const material = MATERIALS[materialId];
    const price = calculateMaterialPrice(material);

    if (gameState.gold < price) return;

    setGameState(prev => ({
      ...prev,
      gold: prev.gold - price
    }));

    setMaterials(prev => ({
      ...prev,
      [materialId]: prev[materialId] + 1
    }));
  };

  // RecipeItemコンポーネント（CraftingSystem内に追加）
const RecipeItem = ({ recipe, recipeId, materials, level, startCrafting }) => {
    const isLocked = recipe.levelRequired > level;
    const element = MAGIC_ELEMENTS[recipe.element];
  
    return (
      <div className={`relative ${element.bgColor} p-3 rounded-lg border ${element.borderColor}`}>
        {isLocked ? (
          <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <Lock className="w-6 h-6 mx-auto mb-1" />
              <p className="text-sm">レベル{recipe.levelRequired}で解放</p>
            </div>
          </div>
        ) : null}
  
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{element.icon}</span>
          <div>
            <h3 className={`font-medium ${element.color}`}>{recipe.name}</h3>
            <p className="text-xs text-gray-600">{recipe.description}</p>
          </div>
        </div>
  
        <div className="grid grid-cols-2 gap-1 mb-2">
          {Object.entries(recipe.materials).map(([materialId, required]) => (
            <p key={materialId} className="text-xs text-gray-600">
              {MATERIALS[materialId].name}:
              <span className={materials[materialId] >= required ? 'text-green-500' : 'text-red-500'}>
                {` ${materials[materialId] || 0}/${required}`}
              </span>
            </p>
          ))}
        </div>
  
        <button
          onClick={() => startCrafting(recipeId)}
          disabled={isLocked || Object.entries(recipe.materials).some(
            ([materialId, required]) => materials[materialId] < required
          )}
          className="w-full bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          作成開始
        </button>
      </div>
    );
  };

  const startCrafting = (recipeId) => {
    const recipe = RECIPES[recipeId];
    if (!recipe || recipe.levelRequired > level) return;

    // 素材チェック
    for (const [materialId, required] of Object.entries(recipe.materials)) {
      if (materials[materialId] < required) return;
    }

    // 素材を消費
    setMaterials(prev => {
      const newMaterials = { ...prev };
      for (const [materialId, required] of Object.entries(recipe.materials)) {
        newMaterials[materialId] -= required;
      }
      return newMaterials;
    });

    const adjustedCraftingTime = recipe.craftingTime * getCraftingTimeReduction();
    setCraftingQueue(prev => [...prev, {
      recipeId,
      startTime: Date.now(),
      craftingTime: adjustedCraftingTime,
      recipe: recipe
    }]);
  };

  const handleCraftingComplete = (completedItems) => {
    // 品質計算を修正
    const calculateQuality = (level) => {
      // 5レベルごとに0.2ずつ上昇（見やすい数値に）
      const qualityBonus = Math.floor(level / 5) * 0.2;
      return 1 + qualityBonus;
    };
  
    // パワー計算を修正（品質による補正を明確に）
    const calculatePower = (basePower, element, quality) => {
      const elementPower = MAGIC_ELEMENTS[element].basePower;
      // 品質が威力に与える影響を強化
      return Math.floor(basePower * elementPower * quality);
    };
  
    // 価格計算を修正（品質による補正を強化）
    const calculateBasePrice = (power, quality) => {
      // 品質が価格に与える影響を強化
      return Math.floor(power * 20 * quality);
    };
  
    setGameState(prev => ({
      ...prev,
      inventory: completedItems.reduce((inv, item) => {
        const element = MAGIC_ELEMENTS[item.recipe.element];
        const quality = calculateQuality(level);
        const power = calculatePower(item.recipe.basePower, item.recipe.element, quality);
        
        const newBook = {
          id: item.recipeId,
          name: item.recipe.name,
          element: item.recipe.element,
          basePrice: calculateBasePrice(power, quality),
          power: power,
          level: level,
          quality: quality,
          quantity: 1,
          crafted: true,
          description: item.recipe.description
        };
  
        const existingBook = inv.find(b => b.id === item.recipeId);
  
        if (existingBook) {
          return inv.map(b => 
            b.id === item.recipeId
              ? { 
                  ...b, 
                  quantity: b.quantity + 1,
                  // 常に最新のレベルと品質を反映
                  quality: quality,
                  power: power,
                  level: level,
                  basePrice: calculateBasePrice(power, quality)
                }
              : b
          );
        }
        return [...inv, newBook];
      }, prev.inventory)
    }));
  };

  // エフェクト
  useEffect(() => {
    if (level > lastLevel) {
      setShowLevelUpEffect(true);
      setLastLevel(level);
      
      const newMagics = Object.entries(LEVEL_REQUIREMENTS.MAGIC_TIERS)
        .filter(([_, tier]) => tier.level === level)
        .flatMap(([_, tier]) => tier.elements);
        
      const newRanks = Object.entries(LEVEL_REQUIREMENTS.BOOK_RANKS)
        .filter(([_, rank]) => rank.level === level)
        .map(([_, rank]) => rank.description);

      if (newMagics.length > 0 || newRanks.length > 0) {
        setShowUnlockNotification({
          magics: newMagics.map(element => MAGIC_ELEMENTS[element].name),
          ranks: newRanks
        });
      }

      setTimeout(() => {
        setShowLevelUpEffect(false);
        setShowUnlockNotification(null);
      }, 3000);
    }
  }, [level, lastLevel]);

  useEffect(() => {
    if (craftingQueue.length === 0) return;

    const timer = setInterval(() => {
      const currentTime = Date.now();
      const { completedItems, remainingQueue } = craftingQueue.reduce(
        (acc, item) => {
          if (currentTime - item.startTime >= item.craftingTime) {
            acc.completedItems.push(item);
          } else {
            acc.remainingQueue.push(item);
          }
          return acc;
        },
        { completedItems: [], remainingQueue: [] }
      );

      if (completedItems.length > 0) {
        setCraftingQueue(remainingQueue);
        
        completedItems.forEach(item => {
          addExp(parseInt(item.recipe.basePower) * 2);
          showCompletionEffect();
        });

        handleCraftingComplete(completedItems);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [craftingQueue, addExp]);

  // レンダリング
  return (
    <div className="space-y-4">
      {craftingQueue.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-3">
          <div className="space-y-2">
            {craftingQueue.map((item, index) => {
              const elapsedTime = Date.now() - item.startTime;
              const remainingTime = Math.max(0, item.craftingTime - elapsedTime);
              const progress = Math.min(100, (elapsedTime / item.craftingTime) * 100);
              const element = MAGIC_ELEMENTS[item.recipe.element];
              
              return (
                <div key={index} className={`${element.bgColor} p-2 rounded`}>
                  <div className="flex items-center gap-2 mb-1 text-sm">
                    <Timer className={`w-4 h-4 ${element.color}`} />
                    <span className="font-medium">
                      {`${item.recipe.name} 作成中...`}
                    </span>
                    <span className="text-xs text-gray-500">
                      {remainingTime > 0 
                        ? `残り${Math.ceil(remainingTime / 1000)}秒`
                        : '完成間近'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-1000 ${element.borderColor.replace('border', 'bg')}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <LevelInfoSection level={level} progress={progress} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white rounded-lg shadow-sm p-3">
          <h2 className="text-base font-bold mb-3 text-gray-800">素材購入</h2>
          <div className="space-y-3">
            {Object.values(MATERIALS).map(material => (
              <MaterialItem 
                key={material.id}
                material={material}
                materials={materials}
                gameState={gameState}
                buyMaterial={buyMaterial}
                calculateMaterialPrice={calculateMaterialPrice}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3">
  <h2 className="text-base font-bold mb-3 text-gray-800">魔術書作成</h2>
  <div className="space-y-3">
    {getAvailableRecipes().map(([recipeId, recipe]) => (
      <RecipeItem 
        key={recipeId} 
        recipe={recipe} 
        recipeId={recipeId}
        materials={materials}
        level={level}
        startCrafting={startCrafting}
      />
    ))}
  </div>
</div>
      </div>

      {/* エフェクト表示 */}
      {showCraftingEffect && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="animate-craftComplete bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg">
            魔術書が完成しました！
          </div>
        </div>
      )}

      {showLevelUpEffect && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="animate-levelUp bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg text-center">
            <div className="text-xl font-bold mb-2">レベルアップ！</div>
            <div className="text-lg">レベル {level} に到達しました！</div>
          </div>
        </div>
      )}

      {showUnlockNotification && (
        <div className="fixed top-4 right-4 z-50 bg-purple-100 border-l-4 border-purple-500 p-4 rounded shadow-lg max-w-sm">
          <div className="font-bold text-purple-800 mb-2">新要素解放！</div>
          {showUnlockNotification.magics.length > 0 && (
            <div className="text-sm text-purple-700">
              新しい属性: {showUnlockNotification.magics.join(', ')}
            </div>
          )}
          {showUnlockNotification.ranks.length > 0 && (
            <div className="text-sm text-purple-700">
              新しいランク: {showUnlockNotification.ranks.join(', ')}
            </div>
          )}
        </div>
      )}

    {process.env.NODE_ENV === 'development' && (
      <DebugPanel addExp={addExp} />
    )}

    </div>
  );
};

export default CraftingSystem;