'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const categories = ['Weapons', 'Armor', 'Consumables', 'Misc'];

    const handleCategoryClick = (category: string) => {
        const params = new URLSearchParams(searchParams);
        if (category === 'All') {
            params.delete('category');
        } else {
            params.set('category', category);
        }
        router.push(`${pathname}?${params.toString()}`);
    }

    const currentCategory = searchParams.get('category');

    return (
        <div className="w-64 flex-shrink-0 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit hidden lg:block sticky top-24">
            <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
            </div>

            <div className="mb-8">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categories</h4>
                <ul className="space-y-1">
                    <li>
                        <button
                            onClick={() => handleCategoryClick('All')}
                            className={`w-full text-left px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${!currentCategory ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            All Products
                        </button>
                    </li>
                    {categories.map((cat) => (
                        <li key={cat}>
                            <button
                                onClick={() => handleCategoryClick(cat)}
                                className={`w-full text-left px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${currentCategory === cat ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Price Range</h4>
                <div className="px-2">
                    <input type="range" min="0" max="2000" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                    <div className="flex justify-between text-xs font-medium text-gray-500 mt-3">
                        <span>$0</span>
                        <span>$2000+</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
