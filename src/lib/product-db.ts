import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'db', 'products.json');

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    image: string;
    images?: string[];
    stock?: number;
}

export async function getProducts(): Promise<Product[]> {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading product DB:', error);
        return [];
    }
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const products = await getProducts();
    return products.find(p => p.id === id);
}

export async function saveProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const products = await getProducts();
    const newProduct = { ...product, id: Date.now().toString() };
    products.push(newProduct);
    await fs.writeFile(DB_PATH, JSON.stringify(products, null, 2));
    return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = await getProducts();
    const index = products.findIndex(p => p.id === id);

    if (index === -1) return null;

    products[index] = { ...products[index], ...updates };
    await fs.writeFile(DB_PATH, JSON.stringify(products, null, 2));
    return products[index];
}

export async function deleteProduct(id: string): Promise<void> {
    const products = await getProducts();
    const filtered = products.filter(p => p.id !== id);
    await fs.writeFile(DB_PATH, JSON.stringify(filtered, null, 2));
}
