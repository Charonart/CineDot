'use client';

import React, { useState } from 'react';
import { ShoppingBag, Plus, CheckCircle2, X } from 'lucide-react';
import { MOCK_STAR_SHOP_PRODUCTS } from '@/modules/star-shop/mocks/mockStarShopData';

export interface AdminProductItem {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  imageUrl: string;
}

export function AdminConcessionsView() {
  const [products, setProducts] = useState<AdminProductItem[]>(
    MOCK_STAR_SHOP_PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      categoryName: p.categoryName || 'Star Shop',
      price: p.price,
      imageUrl: p.imageUrl,
    }))
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('bap-nuoc');
  const [price, setPrice] = useState(119000);
  const [imageUrl, setImageUrl] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProd: AdminProductItem = {
      id: 'sp-' + Date.now(),
      name: title.trim(),
      categoryName: category === 'bap-nuoc' ? 'Bắp & Nước' : 'Quà Tặng Điện Ảnh',
      price: Number(price),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=500&auto=format&fit=crop&q=80',
    };

    setProducts([newProd, ...products]);
    setStatusMsg(`Đã thêm vật phẩm "${title}" vào Star Shop!`);
    setTimeout(() => {
      setIsModalOpen(false);
      setTitle('');
      setStatusMsg('');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-black shadow-xs">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Quản Lý Star Shop & Combo Bắp Nước
            </h1>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>THÊM VẬT PHẨM MỚI</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex items-center gap-4 hover:border-[#7C6FE8] transition-colors"
          >
            <img
              src={p.imageUrl}
              alt={p.name}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400&auto=format&fit=crop&q=80';
              }}
              className="w-20 h-20 rounded-2xl object-cover border border-gray-200 shrink-0 bg-slate-100"
            />
            <div className="flex flex-col justify-between flex-1 gap-1">
              <span className="text-[10px] font-extrabold text-[#7C6FE8] uppercase">
                {p.categoryName}
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">{p.name}</h3>
              <span className="font-mono font-extrabold text-emerald-600 text-sm">
                {p.price.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal + Thêm Vật Phẩm Mới */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#7C6FE8]" />
                <h3 className="text-lg font-extrabold text-slate-900">Thêm Vật Phẩm Star Shop</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusMsg && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{statusMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Tên vật phẩm / Combo</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Combo Dual IMAX Popcorn 2026"
                  required
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Danh mục</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  >
                    <option value="bap-nuoc">Bắp & Nước</option>
                    <option value="qua-tang-dien-anh">Quà Tặng Điện Ảnh</option>
                    <option value="mo-hinh-mo-phong">Mô Hình Đồ Chơi</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Giá bán (VNĐ)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Đường dẫn Hình ảnh URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  LƯU VẬT PHẨM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
