'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { User, Package, Calendar, LogOut } from 'lucide-react';

export default function ProfilePage() {
    const { user, logout } = useUserStore();
    const router = useRouter();
    const [domLoaded, setDomLoaded] = useState(false);

    useEffect(() => {
        useUserStore.persist.rehydrate();
        setDomLoaded(true);
    }, []);

    useEffect(() => {
        if (domLoaded && !user) {
            router.push('/');
        }
    }, [domLoaded, user, router]);

    if (!domLoaded || !user) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / User Info */}
                    <div className="w-full md:w-1/3">
                        <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-24">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <User className="w-12 h-12 text-blue-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                <p className="text-gray-500 mb-6">{user.email}</p>
                                <button
                                    onClick={() => {
                                        logout();
                                        router.push('/');
                                    }}
                                    className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold transition"
                                >
                                    <LogOut className="w-4 h-4" /> 登出
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Orders */}
                    <div className="w-full md:w-2/3">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Package className="w-6 h-6 text-blue-600" /> 我的訂單記錄
                        </h2>

                        <div className="space-y-4">
                            {user.orders.length === 0 ? (
                                <div className="bg-white p-8 rounded-2xl shadow-sm text-center text-gray-500">
                                    尚無訂單記錄，趕快去購物吧！
                                </div>
                            ) : (
                                user.orders.map((order) => (
                                    <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                        <div className="flex justify-between items-start mb-4 border-b pb-4">
                                            <div>
                                                <p className="font-bold text-gray-900">訂單編號 #{order.id}</p>
                                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    {new Date(order.date).toLocaleString()}
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                                付款成功
                                            </span>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span className="text-gray-700">{item.title} <span className="text-gray-400">x{item.quantity}</span></span>
                                                    <span className="font-medium">NT$ {item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center pt-2 border-t">
                                            <span className="font-bold text-gray-600">總金額</span>
                                            <span className="text-xl font-bold text-blue-600">NT$ {order.total}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
