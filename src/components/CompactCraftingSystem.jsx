import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Book, Package, Hammer, Lock } from 'lucide-react';
import { MAGIC_ELEMENTS } from '../constants/magicSystem';  // この行を追加

const CraftingRecipeCard = ({ 
  recipe, 
  recipeId, 
  materials, 
  materialInventory,
  level, 
  startCrafting,
  element 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isLocked = recipe.levelRequired > level;
  // 必要な素材の充足状況を確認
  const canCraft = !Object.entries(recipe.materials).some(
    ([materialId, required]) => (materialInventory[materialId] || 0) < required
  );

  return (
    <div
      className={`relative transform transition-all duration-300 ${
        isHovered && !isLocked ? 'scale-102' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        ${element.bgColor} p-4 rounded-lg border-2 
        ${isHovered && !isLocked ? element.borderColor : 'border-transparent'}
        ${isLocked ? 'opacity-50' : ''}
        transition-all duration-300
      `}>
        {/* ヘッダー部分 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl transform transition-all duration-300">
              {element.icon}
            </span>
            <div>
              <h3 className={`font-bold ${element.color}`}>{recipe.name}</h3>
              <p className="text-sm text-gray-600">{recipe.description}</p>
            </div>
          </div>
          {isLocked && (
            <div className="flex items-center gap-2 text-gray-500">
              <Lock className="w-5 h-5" />
              <span className="text-sm">Lv.{recipe.levelRequired}</span>
            </div>
          )}
        </div>

        {/* 素材リスト */}
        <div className="space-y-2">
          {Object.entries(recipe.materials).map(([materialId, required]) => {
            const material = materials[materialId];
            const current = materialInventory[materialId] || 0;
            const hasEnough = current >= required;

            return (
              <div key={materialId} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl opacity-75">{material.icon}</span>
                  <span className="text-sm text-gray-600">{material.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-medium ${
                    hasEnough ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {current}
                  </span>
                  <span className="text-gray-400">/</span>
                  <span className="text-sm text-gray-600">{required}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 作成ボタン */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // これが重要：親要素へのイベント伝播を防ぐ
            startCrafting(recipe.id);
          }}
          disabled={isLocked || !canCraft}
          className={`
            w-full mt-4 px-4 py-2 rounded-lg font-medium
            transition-all duration-300
            ${canCraft && !isLocked 
              ? `${element.bgColor.replace('100', '500')} text-white hover:${element.bgColor.replace('100', '600')}` 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
          `}
        >
          {isLocked ? 'レベル不足' : canCraft ? '作成開始' : '素材不足'}
        </button>
      </div>

      {/* エフェクト装飾（任意） */}
      {isHovered && !isLocked && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shine" />
      )}
    </div>
  );
};

const CompactCraftingSystem = ({ 
  materials, 
  recipes, 
  level,
  buyMaterial,
  calculateMaterialPrice,
  gameState,
  startCrafting,
  materialInventory
}) => {
  const [activeTab, setActiveTab] = useState('materials');
  const [selectedElement, setSelectedElement] = useState(null);
  const [expandedRecipe, setExpandedRecipe] = useState(null); // この行を追加


  // 属性ごとにレシピをグループ化
  const recipesByElement = Object.entries(recipes).reduce((acc, [recipeId, recipe]) => {
    if (!acc[recipe.element]) {
      acc[recipe.element] = [];
    }
    acc[recipe.element].push({ ...recipe, id: recipeId });
    return acc;
  }, {});

  const elementTabs = Object.keys(recipesByElement);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {/* メインタブ */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab('materials')}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'materials'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Package className="w-4 h-4 mr-2" />
          素材
        </button>
        <button
          onClick={() => {
            setActiveTab('crafting');
            setSelectedElement(null);
          }}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'crafting'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Hammer className="w-4 h-4 mr-2" />
          作成
        </button>
      </div>

      {/* 素材タブの内容 */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(materials).map(([materialId, material]) => (
            <div key={materialId} 
              className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{material.icon}</span>
                  <div>
                    <h3 className="font-medium">{material.name}</h3>
                    <p className="text-xs text-gray-500">{material.description}</p>
                    <p className="text-sm mt-1">
                      所持: <span className="font-medium">{materialInventory[materialId] || 0}</span>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => buyMaterial(materialId)}
                  disabled={gameState.gold < calculateMaterialPrice(material)}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm 
                    hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors"
                >
                  {calculateMaterialPrice(material)}G
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 作成タブの内容 */}
      {activeTab === 'crafting' && (
        <div>
          {/* 属性フィルター */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedElement(null)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                !selectedElement 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              全属性
            </button>
            {elementTabs.map(elementKey => {
              const elementInfo = MAGIC_ELEMENTS[elementKey];
              return (
                <button
                  key={elementKey}
                  onClick={() => setSelectedElement(elementKey)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedElement === elementKey
                      ? `${elementInfo.bgColor} ${elementInfo.color} font-medium`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{elementInfo.icon}</span>
                  {elementInfo.name}
                </button>
              );
            })}
          </div>
          {/* レシピリスト */}
<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  {Object.entries(recipesByElement)
    .filter(([element]) => !selectedElement || element === selectedElement)
    .map(([element, elementRecipes]) => (
      <div key={element}>
        {elementRecipes.map(recipe => (
          <div
            key={recipe.id}
            className="relative mb-2"
          >
            {/* コンパクトビュー */}
            <div 
              className={`${MAGIC_ELEMENTS[element].bgColor} p-3 rounded-lg cursor-pointer
                hover:shadow-md transition-all duration-300`}
              onClick={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{MAGIC_ELEMENTS[element].icon}</span>
                  <div>
                    <h3 className={`font-medium ${MAGIC_ELEMENTS[element].color}`}>
                      {recipe.name}
                    </h3>
                  </div>
                </div>
                {recipe.levelRequired > level ? (
                  <Lock className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            {/* 展開ビュー */}
            {expandedRecipe === recipe.id && (
              <div className="absolute z-10 left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border p-4">
                <p className="text-sm text-gray-600 mb-3">{recipe.description}</p>
                <div className="space-y-2">
                  {Object.entries(recipe.materials).map(([materialId, required]) => {
                    const material = materials[materialId];
                    const current = materialInventory[materialId] || 0;
                    const hasEnough = current >= required;

                    return (
                      <div key={materialId} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl opacity-75">{material.icon}</span>
                          <span className="text-sm text-gray-600">{material.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`text-sm font-medium ${
                            hasEnough ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {current}
                          </span>
                          <span className="text-gray-400">/</span>
                          <span className="text-sm text-gray-600">{required}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startCrafting(recipe.id);
                  }}
                  disabled={
                    recipe.levelRequired > level ||
                    Object.entries(recipe.materials).some(
                      ([materialId, required]) => (materialInventory[materialId] || 0) < required
                    )
                  }
                  className={`
                    w-full mt-4 px-4 py-2 rounded-lg font-medium
                    transition-all duration-300
                    ${recipe.levelRequired <= level 
                      ? 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                  `}
                >
                  {recipe.levelRequired > level 
                    ? 'レベル不足'
                    : Object.entries(recipe.materials).some(
                        ([materialId, required]) => (materialInventory[materialId] || 0) < required
                      )
                      ? '素材不足'
                      : '作成開始'
                  }
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    ))}
</div>
        </div>
      )}
    </div>
  );
};

export default CompactCraftingSystem;