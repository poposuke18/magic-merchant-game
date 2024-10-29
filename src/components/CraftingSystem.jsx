// src/components/CraftingSystem.jsx
import React, { useState, useEffect } from 'react';
import { Timer, Lock } from 'lucide-react';
import { useCraftingLevel } from '../hooks/useCraftingLevel';
import { 
  MATERIALS, 
  RECIPES, 
  MAGIC_ELEMENTS, 
  LEVEL_REQUIREMENTS 
} from '../constants/magicSystem';

const CraftingSystem = ({ gameState, setGameState }) => {
  const { level, exp, progress, addExp } = useCraftingLevel();
  const [showCraftingEffect, setShowCraftingEffect] = useState(false);
  const [materials, setMaterials] = useState(
    Object.keys(MATERIALS).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
  );
  const [craftingQueue, setCraftingQueue] = useState([]);

  // レベルに応じて利用可能なレシピを取得
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

  const getCraftingTimeReduction = () => {
    return Math.max(0.5, 1 - (level * 0.05)); // レベルごとに5%短縮（最大50%まで）
  };

  const getQualityBonus = () => {
    return 1 + (level * 0.1); // レベルごとに10%ずつ品質向上
  };

  const showCompletionEffect = () => {
    setShowCraftingEffect(true);
    setTimeout(() => setShowCraftingEffect(false), 2000);
  };

  const calculateMaterialPrice = (material) => {
    return Math.round(material.basePrice * (1 + gameState.marketTrend * material.marketInfluence));
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

    // レベルに応じた作成時間の計算
    const adjustedCraftingTime = recipe.craftingTime * getCraftingTimeReduction();

    // 作成キューに追加
    setCraftingQueue(prev => [...prev, {
      recipeId,
      startTime: Date.now(),
      craftingTime: adjustedCraftingTime,
      recipe: recipe
    }]);
  };

  // 作成キューの処理
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

        setGameState(prev => ({
          ...prev,
          inventory: completedItems.reduce((inv, item) => {
            const qualityBonus = getQualityBonus();
            const element = MAGIC_ELEMENTS[item.recipe.element];
            const power = Math.floor(item.recipe.basePower * qualityBonus * element.basePower);

            const newBook = {
              id: item.recipeId,
              name: item.recipe.name,
              element: item.recipe.element,
              basePrice: Math.floor(power * 20),
              power: power,
              quality: level,
              quantity: 1,
              crafted: true,
              description: item.recipe.description
            };

            const existingBook = inv.find(b => 
              b.id === item.recipeId && 
              b.quality === level && 
              b.element === item.recipe.element
            );

            if (existingBook) {
              return inv.map(b => 
                b.id === item.recipeId && 
                b.quality === level && 
                b.element === item.recipe.element
                  ? { ...b, quantity: b.quantity + 1 }
                  : b
              );
            }
            return [...inv, newBook];
          }, prev.inventory)
        }));
      }
    }, 100);

    return () => clearInterval(timer);
  }, [craftingQueue, setGameState, level, addExp]);

  // MaterialItemコンポーネントとRecipeItemコンポーネントは変更なし...

  return (
    <div className="space-y-4">
      {/* 作成キュー表示 */}
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

      {/* レベル表示 */}
      <div className="bg-white rounded-lg shadow-sm p-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium">魔術書作成レベル: {level}</h3>
          <span className="text-xs text-gray-600">次のレベルまで: {Math.floor(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 素材とレシピセクション */}
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