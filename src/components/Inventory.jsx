import React, { useState, useEffect } from 'react';
import { ShoppingBag, Coins } from 'lucide-react';

// Magic Books constant
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

const Inventory = ({ gold, inventory, onBuy, onSell, marketTrend }) => {
  const [merchantStock, setMerchantStock] = useState({});
  const [nextRestockTime, setNextRestockTime] = useState(Date.now() + 300000); // 5分後
  const [notification, setNotification] = useState(null);

  // 価格計算関数
  const calculatePrice = (basePrice, isSelling = false, isCrafted = false) => {
    const craftedFactor = isCrafted ? 1 : 2; // クラフトしていない場合は2倍の価格
    const marketFactor = 1 + marketTrend;
    const sellingFactor = isSelling ? 0.8 : 1; // 売却時は80%の価格
    return Math.round(basePrice * craftedFactor * marketFactor * sellingFactor);
  };

  // 通知を表示する関数
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // 在庫の補充処理
  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() >= nextRestockTime) {
        const newStock = {};
        MAGIC_BOOKS.forEach(book => {
          newStock[book.id] = Math.floor(Math.random() * 3) + 1;
        });
        setMerchantStock(newStock);
        setNextRestockTime(Date.now() + 300000);
        showNotification('商人の商品が補充されました！', 'success');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextRestockTime]);

  // 購入処理
  const handleBuy = (bookId) => {
    const book = MAGIC_BOOKS.find(b => b.id === bookId);
    const price = calculatePrice(book.basePrice);

    if (gold < price) {
      showNotification('所持金が足りません！', 'error');
      return;
    }

    if (merchantStock[bookId] <= 0) {
      showNotification('在庫切れです！', 'error');
      return;
    }

    onBuy(bookId);
    setMerchantStock(prev => ({
      ...prev,
      [bookId]: prev[bookId] - 1
    }));
    showNotification('魔術書を購入しました！', 'success');
  };

  // 販売処理
  const handleSell = (bookId, faction) => {
    const item = inventory.find(b => b.id === bookId);
    if (!item || item.quantity <= 0) {
      showNotification('在庫がありません！', 'error');
      return;
    }

    onSell(bookId, faction);
    showNotification(`${faction === 'human' ? '人間' : '魔物'}に魔術書を販売しました！`, 'success');
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 在庫セクション */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4 text-gray-800">在庫</h2>
          <div className="space-y-4">
            {inventory
              .filter(item => item.quantity > 0)
              .map((item) => (
                <div key={item.id} 
                  className={`bg-gray-50 p-4 rounded-lg ${
                    item.crafted ? 'border-l-4 border-purple-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-bold text-gray-700">
                        {item.name}
                        {item.crafted && item.quality > 0 && (
                          <span className="ml-2 text-purple-500 text-sm">
                            品質 Lv.{item.quality}
                          </span>
                        )}
                      </h3>
                      <span className="text-sm text-gray-500">所持数: {item.quantity}</span>
                    </div>
                    <span className="text-lg text-gray-700">
                      {calculatePrice(item.basePrice, true, item.crafted)}G
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSell(item.id, 'human')}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      人間に売る
                    </button>
                    <button
                      onClick={() => handleSell(item.id, 'monster')}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                      魔物に売る
                    </button>
                  </div>
                </div>
              ))}
            {inventory.filter(item => item.quantity > 0).length === 0 && (
              <div className="text-center text-gray-500 py-8">
                在庫がありません
              </div>
            )}
          </div>
        </div>

        {/* 商人の商品セクション */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">商人の商品</h2>
            <div className="text-sm text-gray-600">
              次の入荷まで: {Math.max(0, Math.floor((nextRestockTime - Date.now()) / 1000))}秒
            </div>
          </div>
          <div className="space-y-4">
            {MAGIC_BOOKS.map((book) => (
              <div key={book.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-bold text-gray-700">{book.name}</h3>
                    <div className="flex items-center space-x-2">
                      <ShoppingBag className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        在庫: {merchantStock[book.id] || 0}
                      </span>
                      <Coins className="w-4 h-4 text-yellow-500 ml-2" />
                      <span className="text-sm text-gray-500">
                        {calculatePrice(book.basePrice)}G
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{book.description}</p>
                <button
                  onClick={() => handleBuy(book.id)}
                  disabled={!merchantStock[book.id] || gold < calculatePrice(book.basePrice)}
                  className={`w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 
                    transition-colors ${(!merchantStock[book.id] || gold < calculatePrice(book.basePrice)) 
                    ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {!merchantStock[book.id] ? '在庫切れ' : '購入'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;