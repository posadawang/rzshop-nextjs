import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './data';

// --- Cart Store ---

interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    toggleCart: () => void;
    // Methods expected by User's components
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void; // Keep for internal/drawer usage if needed, though User's component only used removeItem
    clearCart: () => void;
    total: () => number; // Renamed from totalPrice to match user code
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    isOpen: false,
    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    addItem: (product) =>
        set((state) => {
            const existing = state.items.find((item) => item.id === product.id);
            const quantityToAdd = (product as any).quantity || 1;

            if (existing) {
                return {
                    items: state.items.map((item) =>
                        item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
                    ),
                    isOpen: true,
                };
            }
            return {
                items: [...state.items, { ...product, price: Number(product.price), quantity: quantityToAdd }],
                isOpen: true
            };
        }),
    removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
    updateQuantity: (id, quantity) =>
        set((state) => {
            if (quantity <= 0) {
                return { items: state.items.filter((item) => item.id !== id) }
            }
            return {
                items: state.items.map((item) =>
                    item.id === id ? { ...item, quantity } : item
                ),
            };
        }),
    clearCart: () => set({ items: [] }),
    total: () => {
        return get().items.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0);
    },
}));

// --- User Store (Auth) ---

interface Order {
    id: string;
    date: string;
    items: { title: string; price: number; quantity: number }[];
    total: number;
}

interface User {
    id: string;
    email: string;
    password?: string; // For mock auth validation
    name: string;
    orders: Order[];
}

interface UserState {
    user: User | null;
    registeredUsers: User[]; // Persistence for "database"
    login: (email: string, password: string) => boolean;
    register: (email: string, password: string, name: string) => boolean;
    logout: () => void;
    addOrder: (order: Order) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            registeredUsers: [],
            login: (email, password) => {
                const user = get().registeredUsers.find(u => u.email === email && u.password === password);
                if (user) {
                    set({ user });
                    return true;
                }
                return false;
            },
            register: (email, password, name) => {
                if (get().registeredUsers.some(u => u.email === email)) {
                    return false; // Email exists
                }
                const newUser = { id: Date.now().toString(), email, password, name, orders: [] };
                set(state => ({
                    registeredUsers: [...state.registeredUsers, newUser],
                    user: newUser // Auto login
                }));
                return true;
            },
            logout: () => set({ user: null }),
            addOrder: (order) => set(state => {
                if (!state.user) return {};
                const updatedUser = { ...state.user, orders: [order, ...state.user.orders] };
                // Also update the user in the registered list
                const updatedList = state.registeredUsers.map(u => u.id === state.user!.id ? updatedUser : u);
                return {
                    user: updatedUser,
                    registeredUsers: updatedList
                };
            }),
        }),
        {
            name: 'user-storage',
        }
    )
);

// --- Product Store (Admin) ---

interface ProductState {
    products: Product[];
    setProducts: (products: Product[]) => void;
    fetchProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}


const INITIAL_PRODUCTS: Product[] = [
    { id: '1', title: '部落衝突 14本滿防', price: 3500, category: '部落衝突', description: '全滿防禦，包含稀有造型，立即開戰！', image: 'https://placehold.co/600x400/2563eb/FFF?text=COC+Base', stock: 1 },
    { id: '2', title: '荒野亂鬥 全英雄滿等', price: 5000, category: '荒野亂鬥', description: '擁有所有傳奇英雄，包含絕版造型。', image: 'https://placehold.co/600x400/e11d48/FFF?text=Brawl+Stars', stock: 1 },
    { id: '3', title: '皇室戰爭 7000盃', price: 1200, category: '皇室戰爭', description: '高端帳號，全卡牌收集。', image: 'https://placehold.co/600x400/ca8a04/FFF?text=Clash+Royale', stock: 1 },
    { id: '4', title: '特戰英豪 鑽石牌位', price: 2500, category: '其他遊戲', description: '內含多款紫金造型，排位高。', image: 'https://placehold.co/600x400/7c3aed/FFF?text=Valorant', stock: 1 },
    { id: '5', title: '部落衝突 12本速本', price: 800, category: '部落衝突', description: '適合新手練習。', image: 'https://placehold.co/600x400/2563eb/FFF?text=COC+Starter', stock: 1 },
];

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    setProducts: (products) => set({ products }),
    fetchProducts: async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            set({ products: data });
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    },
    addProduct: async (product) => {
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
            });
            const newProduct = await res.json();
            set((state) => ({ products: [...state.products, newProduct] }));
        } catch (error) {
            console.error('Failed to add product:', error);
        }
    },
    updateProduct: async (id, updatedProduct) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct),
            });
            const data = await res.json();
            set((state) => ({
                products: state.products.map((p) => (p.id === id ? data : p)),
            }));
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    },
    deleteProduct: async (id) => {
        try {
            await fetch(`/api/products/${id}`, { method: 'DELETE' });
            set((state) => ({
                products: state.products.filter((p) => p.id !== id),
            }));
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    },
}));


