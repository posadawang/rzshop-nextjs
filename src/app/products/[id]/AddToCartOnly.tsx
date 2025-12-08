'use client';

import { Product } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import { ShoppingBag } from 'lucide-react';

export default function AddToCartButton({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem);

    const handleAdd = () => {
        addItem(product);
    }

    return (
        <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200 w-full md:w-auto min-w-[200px]"
        >
            <ShoppingBag className="w-5 h-5" />
            Add to Cart
        </button>
    );
}
