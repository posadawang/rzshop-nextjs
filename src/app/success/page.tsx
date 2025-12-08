'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useCartStore } from '@/lib/store';

export default function SuccessPage() {
    const clearCart = useCartStore((state) => state.clearCart);

    // 進入此頁面時清空購物車
    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                <div className="flex justify-center mb-4">
                    <CheckCircle className="w-20 h-20 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">付款成功！</h1>
                <p className="text-gray-600 mb-8">感謝您的購買，您的訂單已確認。</p>

                <div className="space-y-3">
                    <Link
                        href="/"
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
                    >
                        繼續購物
                    </Link>
                    <Link
                        href="/"
                        className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-lg transition"
                    >
                        查看訂單記錄
                    </Link>
                </div>
            </div>
        </div>
    );
}
