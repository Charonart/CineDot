'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCartStore } from '@/shared/store/useCartStore';
import { useAuthStore } from '@/shared/store/useAuthStore';

export function CartClientPage() {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { items, updateQuantity, removeFromCart, clearCart } = useCartStore();

  const [voucherCode, setVoucherCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [voucherSuccessMsg, setVoucherSuccessMsg] = useState('');

  const cartItemList = useMemo(() => Object.values(items), [items]);

  const subtotal = useMemo(() => {
    return cartItemList.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cartItemList]);

  const grandTotal = Math.max(0, subtotal - appliedDiscount);

  const handleApplyVoucher = () => {
    if (voucherCode.trim().toUpperCase() === 'STAR50K') {
      setAppliedDiscount(50000);
      setVoucherSuccessMsg('Đã áp dụng mã STAR50K - Giảm 50.000đ');
    } else {
      alert('Mã giảm giá không hợp lệ hoặc đã hết hạn! Thử nhập STAR50K');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      openAuthModal('login', 'Vui lòng đăng nhập để tiến hành thanh toán đơn hàng Star Shop');
      return;
    }
    router.push('/star-shop/payment');
  };

  return (
    <div className="w-full flex flex-col font-sans bg-[#F6F6F6] text-[#131413] min-h-screen pt-28 pb-20 selection:bg-[#7C6FE8] selection:text-white">
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
          {/* Header Link */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <ShoppingBag className="w-7 h-7 text-[#7C6FE8]" />
              <span>Giỏ Hàng Của Bạn ({cartItemList.length})</span>
            </h1>

            <Link href="/star-shop#products">
              <button className="text-xs font-bold text-[#7C6FE8] hover:text-[#685bc7] flex items-center gap-1.5 transition-colors cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                <span>Tiếp tục mua hàng</span>
              </button>
            </Link>
          </div>

          {cartItemList.length === 0 ? (
            <div className="w-full bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 text-center my-8">
              <div className="w-20 h-20 rounded-full bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-800">Giỏ hàng Star Shop của bạn đang trống</h2>
              <p className="text-xs text-slate-500 max-w-md">
                Hãy khám phá các mẫu mô hình Hot Toys, cốc đổi màu Venom Limited và nhiều vật phẩm điện ảnh độc quyền khác tại Star Shop.
              </p>
              <Link href="/star-shop#products">
                <button className="px-8 py-3.5 rounded-full bg-[#7C6FE8] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#685bc7] transition-all shadow-md cursor-pointer">
                  Khám Phá Star Shop Ngay
                </button>
              </Link>
            </div>
          ) : (
            /* Asymmetric 70/30 Grid Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: 70% Width (lg:col-span-8 - Cart Items List) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                  {/* Table Header */}
                  <div className="hidden sm:grid grid-cols-12 gap-4 pb-3 border-b border-gray-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <span className="col-span-6">Sản phẩm Star Shop</span>
                    <span className="col-span-3 text-center">Số lượng</span>
                    <span className="col-span-3 text-right">Thành tiền</span>
                  </div>

                  {/* Cart Item Rows */}
                  <div className="flex flex-col gap-4 divide-y divide-gray-100">
                    {cartItemList.map(({ product, quantity }) => (
                      <div key={product.id} className="pt-4 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                        {/* Product Info (Col 6) */}
                        <div className="col-span-6 w-full flex items-center gap-3.5">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-slate-900 border border-gray-100"
                          />
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-extrabold text-[#7C6FE8] uppercase">
                              {product.categoryName}
                            </span>
                            <h3 className="font-extrabold text-xs text-slate-800 line-clamp-2">
                              {product.name}
                            </h3>
                            <span className="text-xs font-bold text-slate-500 sm:hidden">
                              {product.price.toLocaleString('vi-VN')}đ
                            </span>
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="text-[11px] font-bold text-slate-400 hover:text-rose-600 flex items-center gap-1 w-fit mt-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Xóa</span>
                            </button>
                          </div>
                        </div>

                        {/* Quantity Selector (Col 3) */}
                        <div className="col-span-3 flex justify-center w-full">
                          <div className="flex items-center border border-gray-200 rounded-full bg-slate-50">
                            <button
                              onClick={() => updateQuantity(product.id, -1)}
                              className="px-3 py-1 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer rounded-l-full"
                            >
                              -
                            </button>
                            <span className="px-3 text-xs font-extrabold text-slate-800">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(product.id, 1)}
                              className="px-3 py-1 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer rounded-r-full"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Subtotal (Col 3) */}
                        <div className="col-span-3 text-right w-full sm:w-auto">
                          <span className="font-extrabold text-sm text-[#7C6FE8]">
                            {(product.price * quantity).toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                    <Link href="/star-shop#products">
                      <button className="text-xs font-bold text-[#7C6FE8] hover:text-[#685bc7] flex items-center gap-1 cursor-pointer">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Tiếp tục mua hàng</span>
                      </button>
                    </Link>

                    <button
                      onClick={clearCart}
                      className="text-xs font-bold text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: 30% Width (lg:col-span-4 - Order Summary Card) */}
              <div className="lg:col-span-4">
                <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-5 sticky top-28">
                  <h2 className="font-extrabold text-base text-slate-900 border-b border-gray-100 pb-3">
                    Tổng Đơn Hàng Star Shop
                  </h2>

                  {/* Voucher Promo Input Box */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#7C6FE8]" />
                      <span>Mã Giảm Giá Voucher</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nhập STAR50K"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-800 uppercase focus:outline-none focus:border-[#7C6FE8]"
                      />
                      <button
                        onClick={handleApplyVoucher}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase cursor-pointer"
                      >
                        Áp Dụng
                      </button>
                    </div>
                    {voucherSuccessMsg && (
                      <span className="text-[11px] font-bold text-emerald-600">{voucherSuccessMsg}</span>
                    )}
                  </div>

                  {/* Lines Breakdown */}
                  <div className="flex flex-col gap-2.5 border-t border-b border-gray-100 py-3 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Tạm tính tiền hàng</span>
                      <span className="font-bold text-slate-800">{subtotal.toLocaleString('vi-VN')}đ</span>
                    </div>

                    {appliedDiscount > 0 && (
                      <div className="flex justify-between font-bold text-emerald-600">
                        <span>Giảm giá Voucher</span>
                        <span>-{appliedDiscount.toLocaleString('vi-VN')}đ</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Phí giao hàng</span>
                      <span className="font-bold text-emerald-600">Miễn Phí tại Rạp</span>
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      Tổng Thanh Toán
                    </span>
                    <span className="text-2xl font-extrabold text-[#7C6FE8]">
                      {grandTotal.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  {/* Checkout Action Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#7C6FE8]/30 transition-all cursor-pointer"
                  >
                    <span>TIẾN HÀNH THANH TOÁN</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400 pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Thanh toán an toàn bảo mật 100% tại CineDot</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
