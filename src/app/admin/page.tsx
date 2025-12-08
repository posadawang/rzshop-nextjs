'use client';

import { useState, useEffect } from 'react';
import { Plus, Upload, Save, Trash2, Edit, X, Lock, Image as ImageIcon, MinusCircle } from 'lucide-react';
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
    images: [] as string[],
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
        if (password === 'Wang75065.') {
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

    const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData(prev => ({
                        ...prev,
                        images: [...(prev.images || []), reader.result as string]
                    }));
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ensure price/stock are numbers
        const cleanData = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock)
        };

        if (editingId) {
            updateProduct(editingId, cleanData);
        } else {
            if (!cleanData.image) {
                // Default placeholder if no image
                addProduct({ ...cleanData, image: 'https://placehold.co/600x400/gray/white?text=No+Image' });
            } else {
                addProduct(cleanData);
            }
        }
        closeModal();
    };

    const openEditModal = (product: any) => {
        setEditingId(product.id);
        setFormData({ ...initialFormState, ...product }); // Merge to ensure images array exists
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
            <div className="min-h-screen flex items-center justify-center bg-gray-200">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm border-4 border-black">
                    <div className="flex justify-center mb-6">
                        <div className="bg-black p-4 rounded-full">
                            <Lock className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black mb-6 text-center text-black tracking-tight">後台管理</h2>
                    <input
                        type="password"
                        placeholder="請輸入密碼"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border-4 border-black p-4 rounded-lg mb-4 focus:ring-4 focus:ring-black/20 outline-none transition font-bold text-xl text-black placeholder:text-gray-500 bg-white"
                    />
                    <button className="w-full bg-black hover:bg-gray-900 text-white p-4 rounded-lg font-black text-xl transition transform active:scale-95 uppercase tracking-wide">
                        確認登入
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white shadow-md sticky top-0 z-10 border-b-4 border-black">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-black text-black flex items-center gap-3">
                        <span className="bg-black text-white text-base px-3 py-1 rounded-md">ADMIN</span>
                        商品管理後台
                    </h1>
                    <div className="flex gap-3">
                        <button onClick={() => setIsAuthenticated(false)} className="px-5 py-2 font-bold text-black border-2 border-black hover:bg-black hover:text-white rounded-lg transition">登出</button>
                        <button onClick={openAddModal} className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-bold transition shadow-lg active:scale-95 border-2 border-transparent">
                            <Plus className="w-6 h-6" /> 新增商品
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-black text-white uppercase text-base font-black">
                                <tr>
                                    <th className="p-4 border-b-4 border-black">圖片</th>
                                    <th className="p-4 border-b-4 border-black">名稱</th>
                                    <th className="p-4 border-b-4 border-black">價格</th>
                                    <th className="p-4 border-b-4 border-black">分類</th>
                                    <th className="p-4 border-b-4 border-black text-center">庫存</th>
                                    <th className="p-4 border-b-4 border-black text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-yellow-50 transition-colors font-bold text-lg">
                                        <td className="p-4">
                                            <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-white border-2 border-black shadow-sm">
                                                <Image src={product.image} alt={product.title} fill className="object-cover" />
                                            </div>
                                        </td>
                                        <td className="p-4 text-black text-xl">{product.title}</td>
                                        <td className="p-4 text-blue-800 font-black text-xl">NT$ {product.price}</td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 bg-white text-black rounded-lg text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{product.category}</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-base font-black border-2 ${product.stock! > 0 ? 'bg-green-100 text-green-900 border-green-900' : 'bg-red-100 text-red-900 border-red-900'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => openEditModal(product)} className="p-2 text-black hover:bg-black hover:text-white rounded-lg transition border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => deleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition border-2 border-red-600 shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {products.length === 0 && (
                            <div className="text-center py-16 text-black font-bold text-2xl bg-gray-50">
                                這裡空蕩蕩的... 快去新增商品吧！
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 border-4 border-black">
                        <div className="sticky top-0 bg-white border-b-4 border-black px-8 py-5 flex justify-between items-center z-10">
                            <h2 className="text-3xl font-black text-black tracking-tight">{editingId ? '編輯商品' : '新增商品'}</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-black hover:text-white rounded-lg text-black transition border-2 border-transparent hover:border-black"><X className="w-8 h-8 font-bold" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Main Image Upload */}
                                <div className="col-span-1 md:col-span-2 space-y-4">
                                    <label className="block text-xl font-black text-black border-l-8 border-black pl-3 uppercase">封面圖片 (主圖)</label>
                                    <div className="flex flex-col md:flex-row gap-6 items-start">
                                        <label className="flex flex-col items-center justify-center w-full md:w-1/2 cn-aspect-video h-64 border-4 border-black border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-yellow-50 transition relative overflow-hidden group">
                                            {formData.image ? (
                                                <>
                                                    <Image src={formData.image} alt="Preview" fill className="object-cover" />
                                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-white font-black text-2xl uppercase tracking-wider border-4 border-white px-4 py-2">更換圖片</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-black group-hover:scale-110 transition-transform">
                                                    <Upload className="w-16 h-16 mb-3" />
                                                    <p className="mb-2 text-lg font-black">點擊上傳主圖</p>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>

                                        {/* Gallery Upload Section */}
                                        <div className="w-full md:w-1/2 space-y-3 bg-gray-100 p-4 rounded-xl border-2 border-black">
                                            <div className="flex justify-between items-center pb-2 border-b-2 border-gray-300">
                                                <span className="text-base font-black text-black">詳細圖片集 ({formData.images?.length || 0})</span>
                                                <label className="cursor-pointer bg-black text-white hover:bg-gray-800 px-3 py-1 rounded text-sm font-bold flex items-center gap-1 transition shadow-lg active:scale-95">
                                                    <Plus className="w-4 h-4" /> 新增
                                                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleGalleryUpload} />
                                                </label>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1">
                                                {formData.images?.map((img, idx) => (
                                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-black group shadow-sm bg-white">
                                                        <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeGalleryImage(idx)}
                                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-md p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition shadow-md border-2 border-white"
                                                        >
                                                            <MinusCircle className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {(!formData.images || formData.images.length === 0) && (
                                                    <div className="col-span-3 text-center py-8 text-gray-500 text-sm border-2 border-gray-300 border-dashed rounded-lg">
                                                        尚未上傳詳細圖片
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-lg font-black text-black mb-2">商品名稱</label>
                                        <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full border-4 border-black p-3 rounded-xl focus:ring-4 focus:ring-black/20 outline-none font-bold text-xl text-black placeholder:text-gray-400 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-lg font-black text-black mb-2">分類</label>
                                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full border-4 border-black p-3 rounded-xl bg-white focus:ring-4 focus:ring-black/20 outline-none font-bold text-xl text-black">
                                            <option value="部落衝突">部落衝突</option>
                                            <option value="荒野亂鬥">荒野亂鬥</option>
                                            <option value="皇室戰爭">皇室戰爭</option>
                                            <option value="其他遊戲">其他遊戲</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-lg font-black text-black mb-2">價格 (NT$)</label>
                                        <input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full border-4 border-black p-3 rounded-xl focus:ring-4 focus:ring-black/20 outline-none font-black text-2xl text-blue-900 bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-lg font-black text-black mb-2">庫存數量</label>
                                        <input required type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full border-4 border-black p-3 rounded-lg focus:ring-4 focus:ring-black/20 outline-none font-black text-xl text-black bg-white" />
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-lg font-black text-black mb-2">商品詳細描述</label>
                                    <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border-4 border-black p-4 rounded-xl h-48 focus:ring-4 focus:ring-black/20 outline-none text-lg font-medium leading-relaxed resize-none text-black bg-white"></textarea>
                                </div>
                            </div>

                            <div className="pt-8 flex justify-end gap-4 border-t-4 border-black">
                                <button type="button" onClick={closeModal} className="px-8 py-3 border-4 border-gray-400 rounded-xl hover:bg-gray-100 font-black text-gray-600 transition text-lg uppercase">取消</button>
                                <button type="submit" className="px-10 py-3 bg-black hover:bg-gray-900 text-white rounded-xl font-black flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] transition transform active:scale-95 text-lg uppercase tracking-wider border-4 border-transparent">
                                    <Save className="w-6 h-6" /> 儲存設定
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
