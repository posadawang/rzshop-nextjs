'use client';

import Image from 'next/image';
import { useCartStore } from '@/lib/store';

interface Product {
    id: string;
    title: string;
    price: number;
    originalPrice?: number; // 新增原價欄位
    image: string;
    category: string;
    description: string;
    stock?: number;
}

export default function ProductCard({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem);
    const isOutOfStock = product.stock === 0;

    return (
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full hover:-translate-y-1">
            {/* 圖片區域 */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className={`object-cover transition-transform duration-500 ${isOutOfStock ? 'grayscale' : 'group-hover:scale-110'}`}
                />
                <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                    {product.category}
                </span>
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg border-2 border-white px-4 py-1 rounded">缺貨中</span>
                    </div>
                )}
            </div>

            {/* 內容區域 */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{product.description}</p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        {/* 這裡強制使用 NT$ */}
                        <span className="text-xl font-bold text-blue-600">NT$ {product.price}</span>
                        {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">NT$ {product.originalPrice}</span>
                        )}
                    </div>

                    <button
                        onClick={() => addItem({ id: product.id, title: product.title, price: product.price, image: product.image, description: product.description, category: product.category })}
                        disabled={isOutOfStock}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors active:scale-95"
                    >
                        {isOutOfStock ? '缺貨' : '加入購物車'}
                    </button>
                </div>
            </div>
        </div>
    );
}

