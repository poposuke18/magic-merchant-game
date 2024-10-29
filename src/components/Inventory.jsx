// src/components/Inventory.jsx
import React, { useState } from 'react';
import { ShoppingBag, ArrowUp, ArrowDown } from 'lucide-react';
import { MAGIC_ELEMENTS } from '../constants/magicSystem';

const Inventory = ({ gold, inventory, marketTrend, onSell }) => {
  const [notification, setNotification] = useState(null);

  // 通知を表示する関数
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // 販売処理
  const handleSell = (book, faction) => {
    if (!book || book.quantity <= 0) {
      showNotification('在庫がありません！', 'error');
      return;
    }

    onSell(book.id, faction);
    showNotification(`${faction === 'human' ? '人間' : '魔物'}に${book.name}を販売しました！`, 'success');
  };

  // 需要レベルに基づくスタイルを取得
  const getDemandStyle = (book, faction) => {
    const element = MAGIC_ELEMENTS[book.element];
    const demand = faction === 'human' ? element.humanDemand : element.monsterDemand;
    
    if (demand >= 1.2) return 'text-green-500';
    if (demand <= 0.8) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-4">
      {/* 通知表示 */}
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transition-all transform animate-notification
          ${notification.type === 'error' ? 'bg-red-500 text-white' : 
            notification.type === 'success' ? 'bg-green-500 text-white' : 
            'bg-blue-500 text-white'}`}>
          {notification.message}
        </div>
      )}

      {/* 在庫表示 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">魔術書在庫</h2>
        <div className="space-y-4">
          {inventory
            .filter(item => item.quantity > 0)
            .map((book) => {
              const element = MAGIC_ELEMENTS[book.element];
              return (
                <div key={`${book.id}-${book.quality}-${book.element}`} 
                  className={`${element?.bgColor || 'bg-gray-50'} p-4 rounded-lg ${
                    book.crafted ? `border-l-4 ${element?.borderColor || 'border-purple-500'}` : ''
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{element?.icon || '📚'}</span>
                        <div>
                          <h3 className={`font-bold ${element?.color || 'text-gray-700'}`}>
                            {book.name}
                            {book.crafted && book.quality > 0 && (
                              <span className="ml-2 text-purple-500 text-sm">
                                品質 Lv.{book.quality}
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600">{book.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-1 text-sm">
                        <span className="text-gray-500">所持数: {book.quantity}</span>
                        <span className="text-gray-500">威力: {book.power}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-700">
                        {Math.floor(book.basePrice * (1 + marketTrend))}G
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className={getDemandStyle(book, 'human')}>
                          人間需要 {element?.humanDemand >= 1 ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />}
                        </div>
                        <div className={getDemandStyle(book, 'monster')}>
                          魔物需要 {element?.monsterDemand >= 1 ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleSell(book, 'human')}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      人間に売る
                    </button>
                    <button
                      onClick={() => handleSell(book, 'monster')}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                      魔物に売る
                    </button>
                  </div>
                </div>
              );
            })}
          {inventory.filter(item => item.quantity > 0).length === 0 && (
            <div className="text-center text-gray-500 py-8">
              在庫がありません
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;