'use client';

import { ShoppingCart, Search, Gamepad2, User as UserIcon, LogOut, LogIn } from 'lucide-react';
import { useCartStore, useUserStore } from '@/lib/store';
import Link from 'next/link';
import { useState } from 'react';

interface NavbarProps {
    onSearch: (term: string) => void;
    onCategorySelect: (category: string) => void;
    onCartClick: () => void;
}

export default function Navbar({ onSearch, onCategorySelect, onCartClick }: NavbarProps) {
    const cartCount = useCartStore((state) => state.items.length);
    const { user, login, logout } = useUserStore();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    }

    const handleMockLogin = () => {
        login('testuser@example.com', 'Test User');
    };

    return (
        <nav className="sticky top-0 z-50 bg-blue-600 shadow-lg text-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">

                    {/* 1. LOGO & Brand Name */}
                    <Link href="/" className="flex items-center space-x-2 text-xl font-bold tracking-wide hover:text-blue-100 transition">
                        <Gamepad2 className="w-8 h-8" />
                        <span>阿智小舖</span>
                    </Link>

                    {/* 2. Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-6 text-sm font-medium">
                        <button onClick={() => onCategorySelect('')} className="hover:text-blue-200 transition">首頁</button>
                        <button onClick={() => onCategorySelect('部落衝突')} className="hover:text-blue-200 transition">部落衝突</button>
                        <button onClick={() => onCategorySelect('荒野亂鬥')} className="hover:text-blue-200 transition">荒野亂鬥</button>
                        <button onClick={() => onCategorySelect('皇室戰爭')} className="hover:text-blue-200 transition">皇室戰爭</button>
                    </div>

                    {/* 3. Right Icons */}
                    <div className="flex items-center space-x-3">

                        {/* Search Bar */}
                        <div className="hidden md:flex relative">
                            <input
                                type="search"
                                placeholder="搜尋商品..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="pl-4 pr-10 py-1.5 rounded-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-48"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600">
                                <Search className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Auth Buttons */}
                        {user ? (
                            <div className="hidden md:flex items-center space-x-2">
                                <div className="flex items-center space-x-1 border border-white/30 px-3 py-1.5 rounded bg-blue-700/50 text-sm">
                                    <UserIcon className="w-4 h-4" />
                                    <span>{user.name}</span>
                                </div>
                                <button onClick={logout} className="flex items-center space-x-1 border border-white/50 px-3 py-1.5 rounded hover:bg-white hover:text-blue-600 transition text-sm">
                                    <LogOut className="w-4 h-4" />
                                    <span>登出</span>
                                </button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-2">
                                <button onClick={handleMockLogin} className="flex items-center space-x-1 border border-white/50 px-3 py-1.5 rounded hover:bg-white hover:text-blue-600 transition text-sm">
                                    <LogIn className="w-4 h-4" />
                                    <span>登入 / 註冊</span>
                                </button>
                            </div>
                        )}

                        {/* Cart Button */}
                        <button
                            onClick={onCartClick}
                            className="relative p-2 bg-yellow-500 hover:bg-yellow-400 text-blue-900 rounded-lg transition shadow-md flex items-center justify-center"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}


