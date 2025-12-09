'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import { useProductStore } from '@/lib/store';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Use Product Store
  // Use Product Store
  const { products, fetchProducts } = useProductStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await fetchProducts();
      setIsLoading(false);
    };
    load();
  }, []);

  // 篩選邏輯
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === 'price-low') return a.price - b.price;
      if (sortOption === 'price-high') return b.price - a.price;
      return 0;
    });

  // Prevent hydration mismatch by returning null or a skeleton until mounted
  // For simplicity, we just render the structure but without products if not loaded, or just wait.
  // Ideally we show a loader.
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* 導覽列 */}
      <Navbar
        onSearch={setSearchTerm}
        onCategorySelect={setSelectedCategory}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* 購物車抽屜 (取代 Offcanvas) */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main className="container mx-auto px-4 py-6">

        {/* Hero 區塊 (取代 Bootstrap Carousel) */}
        <div className="mb-10 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-r from-blue-600 to-blue-400 text-white text-center py-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">歡迎來到阿智小舖</h2>
          <p className="text-xl opacity-90 mb-6">高品質遊戲帳號專賣，安全交易保障</p>
          <div className="inline-block bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 rounded-full">
            🎉 限時優惠：全站商品 9 折優惠
          </div>
        </div>

        {/* 商品分類按鈕區 (手機版方便點選) */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">快速分類</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['部落衝突', '荒野亂鬥', '皇室戰爭', '其他遊戲'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-4 rounded-xl shadow-sm transition transform hover:-translate-y-1 ${selectedCategory === cat ? 'bg-blue-600 text-white ring-2 ring-blue-300' : 'bg-white text-gray-700 hover:shadow-md'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* 熱門商品 / 所有商品 */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 border-l-4 border-yellow-500 pl-3">
              {selectedCategory ? `${selectedCategory} 商品` : '精選商品'}
            </h3>

            {/* 排序選單 */}
            <select
              className="mt-4 md:mt-0 p-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">預設排序</option>
              <option value="price-low">價格：由低到高</option>
              <option value="price-high">價格：由高到低</option>
            </select>
          </div>

          {/* 商品列表 Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500 text-lg">沒有找到相關商品 🥲</p>
              <button onClick={() => { setSearchTerm(''); setSelectedCategory('') }} className="mt-4 text-blue-600 hover:underline">
                顯示所有商品
              </button>
            </div>
          )}
        </section>
      </main>

      {/* 頁尾 */}
      <footer className="bg-gray-800 text-gray-400 py-8 text-center mt-12">
        <div className="container mx-auto">
          <p className="mb-2">© 2025 阿智小舖. All rights reserved.</p>
          <p className="text-sm">虛擬商品交易平台 | 安全保障 | 快速移交</p>
        </div>
      </footer>
    </div>
  );
}


