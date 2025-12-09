'use client';

import { X, Trash2, CreditCard } from 'lucide-react';
import { useCartStore, useUserStore } from '@/lib/store'; // 引入 UserStore
import { useState } from 'react';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, removeItem, total, clearCart } = useCartStore();
    const { user } = useUserStore(); // 👈 1. 取得使用者狀態
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckout = async () => {
        // 👈 2. 檢查是否登入
        if (!user) {
            alert('請先登入會員才能結帳！');
            // 這裡你可以選擇打開登入視窗，或者只顯示警告
            return;
        }

        if (items.length === 0) return;

        setIsProcessing(true);

        try {
            // 👈 3. 計算總金額 (Explicitly recalculate to ensure accuracy)
            const currentTotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
            console.log('Checkout Calculated Total:', currentTotal); // Debug log

            // 檢查金額是否為 0 (避免傳送 0 元給藍新)
            if (currentTotal <= 0) {
                alert('購物車金額不能為 0');
                setIsProcessing(false);
                return;
            }

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    email: user.email, // 👈 4. 傳送使用者的 Email
                    amount: currentTotal, // 👈 5. 這裡最重要！明確把金額傳給後端
                }),
            });

            const data = await response.json();

            if (data.form) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = data.url;

                Object.entries(data.form).forEach(([key, value]) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = value as string;
                    form.appendChild(input);
                });

                document.body.appendChild(form);
                form.submit();
                clearCart();
            } else {
                console.error('API Error:', data);
                alert('結帳發生錯誤：' + (data.error || '未知錯誤'));
            }
        } catch (error) {
            console.error(error);
            alert('連線錯誤');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />}
            <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-bold text-gray-800">我的購物車</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {items.length === 0 ? (
                            <div className="text-center text-gray-500 mt-10">購物車是空的</div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800 line-clamp-1">{item.title}</h4>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-blue-600 font-bold">NT$ {item.price}</p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center border border-gray-300 rounded-md">
                                                <button
                                                    onClick={() => useCartStore.getState().updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="px-2 text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => useCartStore.getState().updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 p-2">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-4 border-t bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600">總金額</span>
                            <span className="text-2xl font-bold text-blue-600">NT$ {total()}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={items.length === 0 || isProcessing}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all"
                        >
                            {isProcessing ? '處理中...' : (
                                <>
                                    <CreditCard className="w-5 h-5" />
                                    <span>前往結帳</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}



