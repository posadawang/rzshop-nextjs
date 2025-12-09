import { useState } from 'react';
import { Product } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import { ShoppingBag, Minus, Plus } from 'lucide-react';


export default function AddToCartButton({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem);
    const [quantity, setQuantity] = useState(1);

    const handleAdd = () => {
        addItem({ ...product, quantity } as any);
    }

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center border-4 border-black rounded-xl overflow-hidden bg-white w-full sm:w-auto h-14">
                <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 h-full hover:bg-gray-100 transition flex items-center justify-center border-r-4 border-black active:bg-gray-200"
                >
                    <Minus className="w-5 h-5 font-bold text-black" />
                </button>
                <div className="w-16 h-full flex items-center justify-center font-black text-xl text-black">
                    {quantity}
                </div>
                <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 h-full hover:bg-gray-100 transition flex items-center justify-center border-l-4 border-black active:bg-gray-200"
                >
                    <Plus className="w-5 h-5 font-bold text-black" />
                </button>
            </div>

            <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-gray-900 transition-all hover:scale-[1.02] active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none border-4 border-transparent"
            >
                <ShoppingBag className="w-6 h-6" />
                加入購物車
            </button>
        </div>
    );
}

