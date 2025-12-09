import { NextResponse } from 'next/server';
import { getProducts, saveProduct } from '@/lib/product-db';

export async function GET() {
    const products = await getProducts();
    return NextResponse.json(products);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newProduct = await saveProduct(body);
        return NextResponse.json(newProduct);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
