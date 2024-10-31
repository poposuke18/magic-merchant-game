import React, { useState, useEffect } from 'react';
import { 
  Play,
  Pause, 
  Settings, 
  AlertCircle, 
  Lock 
} from 'lucide-react';
import { MAGIC_ELEMENTS } from '../constants/magicSystem';


const AUTO_PRODUCTION_CONFIG = {
  UNLOCK_LEVEL: 5,  // 自動生成が解放されるレベル
  MAX_SLOTS: 3,     // 最大スロット数
  LEVEL_PENALTY: 2, // 自動生成で作れる魔術書のレベル差
  EFFICIENCY: 0.8,  // 自動生成の効率（80%）
  SLOT_UNLOCK_LEVELS: {
    1: 5,   // 1つ目のスロット解放レベル
    2: 10,  // 2つ目のスロット解放レベル
    3: 15   // 3つ目のスロット解放レベル
  }
};

const AutoProductionSlot = ({
  slot,
  isUnlocked,
  activeRecipe,
  onRecipeSelect,
  onToggle,
  isActive,
  level,
  materials,
  materialInventory,
  recipe,
  unlockLevel,
  recipes  // これを追加

}) => {
  const [showConfig, setShowConfig] = useState(false);

  if (!isUnlocked) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Lock className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">レベル{unlockLevel}で解放</p>
          </div>
        </div>
      </div>
    );
  }

  const element = recipe ? MAGIC_ELEMENTS[recipe.element] : null;
  const canProduce = recipe && Object.entries(recipe.materials).every(
    ([materialId, required]) => materialInventory[materialId] >= required
  );

  return (
    <div className={`
      relative p-4 rounded-lg border-2 transition-all duration-300
      ${element ? element.bgColor : 'bg-gray-50'}
      ${element ? element.borderColor : 'border-gray-300'}
    `}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {recipe ? (
            <>
              <span className="text-2xl">{element.icon}</span>
              <div>
                <h3 className={`font-medium ${element.color}`}>{recipe.name}</h3>
                <p className="text-xs text-gray-600">自動生成スロット {slot}</p>
              </div>
            </>
          ) : (
            <div className="text-gray-500">
              <p className="font-medium">未設定</p>
              <p className="text-xs">自動生成スロット {slot}</p>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-1 rounded hover:bg-gray-200 transition-colors"
          >
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onToggle(slot)}
            disabled={!recipe || !canProduce}
            className={`p-1 rounded transition-colors ${
              isActive 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-gray-200 hover:bg-gray-300'
            } ${(!recipe || !canProduce) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isActive ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {recipe && (
        <div className="space-y-1">
          {Object.entries(recipe.materials).map(([materialId, required]) => {
            const material = materials[materialId];
            const current = materialInventory[materialId] || 0;
            return (
              <div key={materialId} className="flex justify-between text-sm">
                <span className="text-gray-600">{material.name}</span>
                <span className={current >= required ? 'text-green-500' : 'text-red-500'}>
                  {current}/{required}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {showConfig && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white rounded-lg shadow-xl border z-10">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">レシピ設定</h4>
              <button
                onClick={() => setShowConfig(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(recipes)
                .filter(([_, recipe]) => recipe.levelRequired <= level - AUTO_PRODUCTION_CONFIG.LEVEL_PENALTY)
                .map(([recipeId, recipe]) => {
                  const element = MAGIC_ELEMENTS[recipe.element];
                  return (
                    <button
                      key={recipeId}
                      onClick={() => {
                        onRecipeSelect(slot, recipeId);
                        setShowConfig(false);
                      }}
                      className={`p-2 rounded-lg ${element.bgColor} hover:opacity-80 transition-opacity`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{element.icon}</span>
                        <span className={`text-sm ${element.color}`}>{recipe.name}</span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AutoProductionSystem = ({
  level,
  materials,
  recipes,
  materialInventory,
  gameState,
  buyMaterial,
  startCrafting,
  onSell
}) => {
  const [slots, setSlots] = useState([
    { id: 1, recipe: null, isActive: false },
    { id: 2, recipe: null, isActive: false },
    { id: 3, recipe: null, isActive: false }
  ]);

  const [lastProductionTime, setLastProductionTime] = useState({});
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (level < AUTO_PRODUCTION_CONFIG.UNLOCK_LEVEL) return;

    const timer = setInterval(() => {
      setSlots(currentSlots => {
        const newSlots = [...currentSlots];
        const now = Date.now();

        newSlots.forEach(slot => {
          if (!slot.isActive || !slot.recipe) return;

          const recipe = recipes[slot.recipe];
          const lastTime = lastProductionTime[slot.id] || 0;
          const adjustedCraftingTime = recipe.craftingTime / AUTO_PRODUCTION_CONFIG.EFFICIENCY;

          if (now - lastTime >= adjustedCraftingTime) {
            // 素材の自動購入
            Object.entries(recipe.materials).forEach(([materialId, required]) => {
              if (materialInventory[materialId] < required) {
                buyMaterial(materialId);
              }
            });

            // 作成と販売の実行
            if (Object.entries(recipe.materials).every(
              ([materialId, required]) => materialInventory[materialId] >= required
            )) {
              startCrafting(slot.recipe);
              // 自動販売（例：ランダムな勢力に販売）
              const faction = Math.random() > 0.5 ? 'human' : 'monster';
              onSell(slot.recipe, faction);
            }

            setLastProductionTime(prev => ({
              ...prev,
              [slot.id]: now
            }));
          }
        });

        return newSlots;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [level, recipes, materialInventory, buyMaterial, startCrafting, onSell]);

  if (level < AUTO_PRODUCTION_CONFIG.UNLOCK_LEVEL) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg">
        <div className="text-center text-gray-500">
          <Lock className="w-8 h-8 mx-auto mb-2" />
          <p className="font-medium">自動生成システム</p>
          <p className="text-sm">レベル{AUTO_PRODUCTION_CONFIG.UNLOCK_LEVEL}で解放</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-800">自動生成システム</h2>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-gray-400 hover:text-gray-600"
          >
            <AlertCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="text-sm text-gray-500">
          効率: {AUTO_PRODUCTION_CONFIG.EFFICIENCY * 100}%
        </div>
      </div>

      {showHelp && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-700 mb-2">自動生成システムについて</h3>
          <ul className="text-sm text-blue-600 space-y-1">
            <li>• プレイヤーレベルより{AUTO_PRODUCTION_CONFIG.LEVEL_PENALTY}レベル低い魔術書のみ作成可能</li>
            <li>• 通常の{AUTO_PRODUCTION_CONFIG.EFFICIENCY * 100}%の効率で動作</li>
            <li>• 必要な素材は自動で購入</li>
            <li>• 完成品は自動で販売</li>
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {slots.map(slot => (
          <AutoProductionSlot
            key={slot.id}
            slot={slot.id}
            isUnlocked={level >= AUTO_PRODUCTION_CONFIG.SLOT_UNLOCK_LEVELS[slot.id]}
            activeRecipe={slot.recipe}
            onRecipeSelect={(slotId, recipeId) => {
              setSlots(current =>
                current.map(s =>
                  s.id === slotId ? { ...s, recipe: recipeId } : s
                )
              );
            }}
            onToggle={(slotId) => {
              setSlots(current =>
                current.map(s =>
                  s.id === slotId ? { ...s, isActive: !s.isActive } : s
                )
              );
            }}
            isActive={slot.isActive}
            level={level}
            materials={materials}
            materialInventory={materialInventory}
            recipe={slot.recipe ? recipes[slot.recipe] : null}
            unlockLevel={AUTO_PRODUCTION_CONFIG.SLOT_UNLOCK_LEVELS[slot.id]}
            recipes={recipes}  // これを追加
            />
        ))}
      </div>
    </div>
  );
};

export default AutoProductionSystem;