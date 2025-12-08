import { getProductById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from './AddToCartOnly'; // We'll create a small client component for this button or inline it if simple. 
// Actually, I can make this page a server component and use a client component for the button.
// Let's create a client wrapper for the adding part or just reuse logic.
// For simplicity I will just make a separate client button component inside this file or strictly separate.
// I'll stick to separation.

export default async function ProductDetail({ params }: { params: { id: string } }) {
    const product = await getProductById(params.id);

    if (!product) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-sm">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                        <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                    {/* Detailed View / Thumbnails simulated */}
                    <div className="flex gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="relative w-24 h-24 rounded-lg bg-gray-100 overflow-hidden cursor-pointer hover:ring-2 ring-indigo-500 transition-all">
                                <Image
                                    src={product.image}
                                    alt="Thumbnail"
                                    fill
                                    className="object-cover opacity-70 hover:opacity-100"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center">
                    <div className="mb-2">
                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium">
                            {product.category}
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        {product.description}
                        <br /><br />
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-8">
                        <span className="text-4xl font-bold text-gray-900">NT$ {product.price}</span>
                        <AddToCartButton product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
}
