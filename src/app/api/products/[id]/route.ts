import { NextResponse } from 'next/server';
import { updateProduct, deleteProduct, getProductById } from '@/lib/product-db';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        // Since params is pending in Next.js 15+ in some contexts but params here is usually directly available in older style or via await
        // Safe bet for standard route handlers:
        const id = params.id;
        const updated = await updateProduct(id, body);

        if (!updated) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        await deleteProduct(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
