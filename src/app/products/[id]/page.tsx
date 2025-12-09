'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AddToCartButton from './AddToCartOnly';
import ProductGallery from '@/components/ProductGallery';
import { useProductStore } from '@/lib/store';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetail() {
    const params = useParams();
    const router = useRouter();
    const { products, fetchProducts } = useProductStore();
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data
    useEffect(() => {
        const load = async () => {
            await fetchProducts();
            setIsLoading(false);
        };
        load();
    }, []);

    // Find product
    const product = products.find(p => p.id === params.id);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">找不到商品</h2>
                <p>該商品可能已被移除或不存在。</p>
                <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    回首頁
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Back Button */}
            <div className="container mx-auto px-4 py-6">
                <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black font-medium transition mb-4">
                    <ArrowLeft className="w-5 h-5 mr-2" /> 回首頁
                </Link>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                    {/* Image Gallery */}
                    <div className="w-full">
                        <ProductGallery mainImage={product.image} images={product.images} title={product.title} />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col">
                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-bold tracking-wide">
                                {product.category}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">{product.title}</h1>

                        <div className="prose prose-lg text-gray-600 mb-8 whitespace-pre-wrap leading-relaxed">
                            {product.description}
                        </div>

                        <div className="mt-auto border-t border-gray-100 pt-8 space-y-6">
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 font-bold mb-1">價格</p>
                                    <span className="text-4xl font-black text-blue-600">NT$ {product.price}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 font-bold mb-1">庫存狀況</p>
                                    <span className={`text-xl font-bold ${product.stock! > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {product.stock! > 0 ? `現貨 ${product.stock} 件` : '暫無庫存'}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4">
                                <AddToCartButton product={product} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
