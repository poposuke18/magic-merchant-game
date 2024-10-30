import React, { useState } from 'react';
import { ShoppingBag, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { MAGIC_ELEMENTS } from '../constants/magicSystem';

const ItemTooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 w-64 p-3 text-sm bg-gray-900 text-white rounded-lg shadow-xl -translate-x-1/2 left-1/2 bottom-full mb-2">
          {content}
          <div className="absolute w-3 h-3 bg-gray-900 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1.5" />
        </div>
      )}
    </div>
  );
};

const Inventory = ({ gold, inventory, marketTrend, onSell }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const calculatePrice = (book, faction) => {
    const element = MAGIC_ELEMENTS[book.element];
    const baseDemand = faction === 'human' ? element.humanDemand : element.monsterDemand;
    const marketModifier = 1 + marketTrend;
    return Math.floor(book.basePrice * baseDemand * marketModifier);
  };

  const handleSell = (book, faction) => {
    if (!book || book.quantity <= 0) {
      showNotification('在庫がありません！', 'error');
      return;
    }

    onSell(book.id, faction);
    showNotification(
      `${faction === 'human' ? '人間' : '魔物'}に${book.name}を販売しました！`, 
      'success'
    );
  };

  return (
    <div className="space-y-4">
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg animate-notification
          ${notification.type === 'error' ? 'bg-red-500 text-white' : 
            notification.type === 'success' ? 'bg-green-500 text-white' : 
            'bg-blue-500 text-white'}`}>
          {notification.message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">魔術書在庫</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {inventory
            .filter(book => book.quantity > 0)
            .map((book) => {
              const element = MAGIC_ELEMENTS[book.element];
              const humanPrice = calculatePrice(book, 'human');
              const monsterPrice = calculatePrice(book, 'monster');

              return (
                <div 
                  key={`${book.id}-${book.level}`}
                  className={`${element?.bgColor || 'bg-gray-50'} p-3 rounded-lg ${
                    book.crafted ? `border-l-4 ${element?.borderColor || 'border-purple-500'}` : ''
                  }`}
                >
                  <ItemTooltip content={
                    <div className="space-y-2">
                      <p>{book.description}</p>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>
                          <div className="text-gray-400">基本威力</div>
                          <div className="font-bold">{Math.floor(book.power / book.quality)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">品質補正後</div>
                          <div className="font-bold text-green-400">{book.power}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">人間需要</div>
                          <div className={`font-bold ${element.humanDemand >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                            {(element.humanDemand * 100).toFixed(0)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400">魔物需要</div>
                          <div className={`font-bold ${element.monsterDemand >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                            {(element.monsterDemand * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  }>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{element?.icon || '📚'}</span>
                        <div>
                          <h3 className={`font-bold ${element?.color || 'text-gray-700'} text-sm`}>
                            {book.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-purple-500">Lv.{book.level}</span>
                            {book.quality > 1 && (
                              <span className="text-green-500">
                                (x{book.quality.toFixed(1)})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">所持: {book.quantity}</span>
                      <div className="flex gap-2">
                        <span className="text-blue-600">{humanPrice}G</span>
                        <span className="text-red-600">{monsterPrice}G</span>
                      </div>
                    </div>
                  </ItemTooltip>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleSell(book, 'human')}
                      className="flex-1 bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      人間
                    </button>
                    <button
                      onClick={() => handleSell(book, 'monster')}
                      className="flex-1 bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      魔物
                    </button>
                  </div>
                </div>
              );
            })}
          {inventory.filter(book => book.quantity > 0).length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              在庫がありません
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;