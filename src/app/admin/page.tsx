'use client';

import { useState, useEffect } from 'react';
import { Plus, Upload, Save, Trash2, Edit, X, Lock } from 'lucide-react';
import { useProductStore } from '@/lib/store';
import Image from 'next/image';

// Initial state for the form
const initialFormState = {
    title: '',
    price: 0,
    category: '部落衝突',
    description: '',
    stock: 1,
    image: '',
};

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState(initialFormState);

    const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
    const [domLoaded, setDomLoaded] = useState(false);

    // Hyradtion fix
    useEffect(() => {
        useProductStore.persist.rehydrate();
        setDomLoaded(true);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsAuthenticated(true);
        } else {
            alert('密碼錯誤');
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateProduct(editingId, formData);
        } else {
            if (!formData.image) {
                // Default placeholder if no image
                addProduct({ ...formData, image: 'https://placehold.co/600x400/gray/white?text=No+Image' });
            } else {
                addProduct(formData);
            }
        }
        closeModal();
    };

    const openEditModal = (product: any) => {
        setEditingId(product.id);
        setFormData(product);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormState);
        setEditingId(null);
    };

    if (!domLoaded) return null; // Avoid hydration mismatch

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Lock className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">管理者登入</h2>
                    <input
                        type="password"
                        placeholder="請輸入密碼 (admin123)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold transition transform active:scale-95">登入</button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded">Admin</span>
                        商品管理後台
                    </h1>
                    <div className="flex gap-3">
                        <button onClick={() => setIsAuthenticated(false)} className="text-gray-500 hover:text-gray-800">登出</button>
                        <button onClick={openAddModal} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-md hover:shadow-lg active:scale-95">
                            <Plus className="w-4 h-4" /> 新增商品
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="p-4">圖片</th>
                                    <th className="p-4">名稱</th>
                                    <th className="p-4">價格</th>
                                    <th className="p-4">分類</th>
                                    <th className="p-4 text-center">庫存</th>
                                    <th className="p-4 text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="w-16 h-16 relative rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                                <Image src={product.image} alt={product.title} fill className="object-cover" />
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">{product.title}</td>
                                        <td className="p-4 text-blue-600 font-bold">NT$ {product.price}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{product.category}</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock! > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openEditModal(product)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => deleteProduct(product.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {products.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                目前沒有商品，請點擊右上角新增。
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold text-gray-800">{editingId ? '編輯商品' : '新增商品'}</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Image Upload */}
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">商品圖片</label>
                                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition relative overflow-hidden group">
                                        {formData.image ? (
                                            <>
                                                <Image src={formData.image} alt="Preview" fill className="object-cover" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-white font-medium">點擊更換圖片</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">點擊上傳</span> 或拖曳檔案</p>
                                                <p className="text-xs text-gray-500">支援 .JPG, .PNG</p>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">商品名稱</label>
                                        <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full border p-2 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">分類</label>
                                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full border p-2 rounded-lg bg-white">
                                            <option value="部落衝突">部落衝突</option>
                                            <option value="荒野亂鬥">荒野亂鬥</option>
                                            <option value="皇室戰爭">皇室戰爭</option>
                                            <option value="其他遊戲">其他遊戲</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">價格 (NT$)</label>
                                        <input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full border p-2 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">庫存</label>
                                        <input required type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full border p-2 rounded-lg" />
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">商品描述</label>
                                    <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border p-2 rounded-lg h-32"></textarea>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t">
                                <button type="button" onClick={closeModal} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">取消</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2">
                                    <Save className="w-4 h-4" /> 儲存
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

