'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
    mainImage: string;
    images?: string[];
    title: string;
}

export default function ProductGallery({ mainImage, images, title }: ProductGalleryProps) {
    // Combine mainImage and additional images, unique set
    const allImages = [mainImage, ...(images || [])].filter((v, i, a) => a.indexOf(v) === i);
    const [activeImage, setActiveImage] = useState(allImages[0]);

    return (
        <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-200 shadow-sm">
                <Image
                    src={activeImage}
                    alt={title}
                    fill
                    className="object-cover animate-in fade-in duration-300"
                />
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {allImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveImage(img)}
                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent hover:border-gray-300'
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${idx}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
