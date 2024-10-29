import React from 'react';

// Magic Books constant (これを追加)
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

const Inventory = ({ gold, inventory, onBuy, onSell }) => {
  // 価格変動を計算する関数
  const calculatePrice = (basePrice, marketTrend) => {
    return Math.round(basePrice * (1 + marketTrend));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 在庫セクション */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">在庫</h2>
        <div className="space-y-4">
          {inventory.map((item) => (
            <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-700">{item.name}</h3>
                <span className="text-sm text-gray-500">所持数: {item.quantity}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => onSell(item.id, 'human')}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  disabled={item.quantity <= 0}
                >
                  人間に売る
                  <span className="block text-sm">
                    ({calculatePrice(item.basePrice, 0)}G)
                  </span>
                </button>
                <button
                  onClick={() => onSell(item.id, 'monster')}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  disabled={item.quantity <= 0}
                >
                  魔物に売る
                  <span className="block text-sm">
                    ({calculatePrice(item.basePrice, 0)}G)
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 仕入れセクション */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">仕入れ</h2>
        <div className="space-y-4">
          {MAGIC_BOOKS.map((book) => (
            <div key={book.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-700">{book.name}</h3>
                <span className="text-sm text-gray-500">{book.basePrice}G</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{book.description}</p>
              <button
                onClick={() => onBuy(book.id)}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                disabled={gold < book.basePrice}
              >
                仕入れる
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inventory;