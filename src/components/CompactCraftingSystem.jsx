import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Book, Package, Hammer } from 'lucide-react';

const CompactCraftingSystem = ({ 
    materials, 
    recipes, 
    level,
    buyMaterial,
    calculateMaterialPrice,
    gameState,
    startCrafting,
    materialInventory  // materials を materialInventory にリネーム
  }) => {
  const [activeTab, setActiveTab] = useState('materials');
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {/* タブナビゲーション */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab('materials')}
          className={`flex items-center px-4 py-2 rounded-lg ${
            activeTab === 'materials'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Package className="w-4 h-4 mr-2" />
          素材
        </button>
        <button
          onClick={() => setActiveTab('crafting')}
          className={`flex items-center px-4 py-2 rounded-lg ${
            activeTab === 'crafting'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Hammer className="w-4 h-4 mr-2" />
          作成
        </button>
      </div>

{/* 素材タブ */}
{activeTab === 'materials' && (
  <div className="grid grid-cols-2 gap-2">
    {Object.entries(materials).map(([materialId, material]) => (
      <div key={materialId} className="bg-gray-50 p-2 rounded flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{material.icon}</span>
          <div>
            <h3 className="text-sm font-medium">{material.name}</h3>
            <p className="text-xs text-gray-500">所持: {materialInventory[materialId] || 0}</p>
          </div>
        </div>
        <button 
          onClick={() => buyMaterial(materialId)}
          disabled={gameState.gold < calculateMaterialPrice(material)}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {calculateMaterialPrice(material)}G
        </button>
      </div>
    ))}
  </div>
)}


      {/* 作成タブ */}
      {activeTab === 'crafting' && (
        <div className="space-y-2">
          {Object.entries(recipes).map(([recipeId, recipe]) => (
            <div
              key={recipeId}
              className={`bg-gray-50 rounded-lg transition-all ${
                recipe.levelRequired > level ? 'opacity-50' : ''
              }`}
            >
              {/* ヘッダー部分 */}
              <div
                className="p-2 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                onClick={() => setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId)}
              >
                <div className="flex items-center space-x-2">
                  <Book className="w-4 h-4" />
                  <span className="font-medium">{recipe.name}</span>
                </div>
                {expandedRecipe === recipeId ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>

              {/* 展開時の詳細情報 */}
              {expandedRecipe === recipeId && (
                <div className="p-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    {Object.entries(recipe.materials).map(([materialId, count]) => (
                      <div key={materialId} className="flex items-center space-x-1">
                        <span className="text-gray-500">{materials[materialId].name}:</span>
                        <span>×{count}</span>
                      </div>
                    ))}
                  </div>
{/* 作成開始ボタン */}
<button 
  onClick={() => startCrafting(recipeId)}
  disabled={recipe.levelRequired > level || Object.entries(recipe.materials).some(
    ([materialId, required]) => materialInventory[materialId] < required
  )}
  className="w-full mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
>
  作成開始
</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompactCraftingSystem;