export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    image: string;
    stock?: number;
    originalPrice?: number;
}

// Simulated database
const PRODUCTS: Product[] = [
    {
        id: '1',
        title: 'Diamond Sword',
        description: 'A sharp diamond sword for your adventures.',
        price: 500,
        category: 'Weapons',
        image: 'https://placehold.co/400x300/4F46E5/FFFFFF?text=Diamond+Sword',
    },
    {
        id: '2',
        title: 'Golden Shield',
        description: 'Protects you from damage.',
        price: 300,
        category: 'Armor',
        image: 'https://placehold.co/400x300/d97706/FFFFFF?text=Golden+Shield',
    },
    {
        id: '3',
        title: 'Health Potion',
        description: 'Restores 50 HP.',
        price: 50,
        category: 'Consumables',
        image: 'https://placehold.co/400x300/dc2626/FFFFFF?text=Health+Potion',
    },
    {
        id: '4',
        title: 'Magic Staff',
        description: 'Casts powerful spells.',
        price: 1200,
        category: 'Weapons',
        image: 'https://placehold.co/400x300/7c3aed/FFFFFF?text=Magic+Staff',
    }
];

export async function getProducts() {
    // Simulate async DB call
    return PRODUCTS;
}

export async function getProductById(id: string) {
    return PRODUCTS.find((p) => p.id === id);
}

export async function addProduct(product: Omit<Product, 'id'>) {
    const newProduct = { ...product, id: (PRODUCTS.length + 1).toString() };
    PRODUCTS.push(newProduct);
    return newProduct;
}
