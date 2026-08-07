'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, CheckCircle2, ArrowRight, MapPin, CreditCard, Building2, User, Phone, FileText } from 'lucide-react';
import { useCartStore } from '@/shared/store/useCartStore';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { CustomSelectDropdown, SelectOption } from '@/shared/ui/CustomSelectDropdown';
import { MOCK_STAR_SHOP_PRODUCTS } from '../mocks/mockStarShopData';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  badge?: string;
  desc: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'MOMO',
    name: 'Ví Điện Tử MoMo',
    icon: 'https://images.unsplash.com/photo-1556742049-0a670e4a4591?w=100&auto=format&fit=crop&q=80',
    badge: 'KHUYÊN DÙNG',
    desc: 'Thanh toán tức thì qua ứng dụng MoMo QR Code',
  },
  {
    id: 'ZALOPAY',
    name: 'Ví ZaloPay',
    icon: 'https://images.unsplash.com/photo-1556742049-0a670e4a4591?w=100&auto=format&fit=crop&q=80',
    desc: 'Giảm 20.000đ cho đơn hàng Star Shop qua ZaloPay',
  },
  {
    id: 'VIETQR',
    name: 'Chuyển Khoản VietQR',
    icon: 'https://images.unsplash.com/photo-1556742049-0a670e4a4591?w=100&auto=format&fit=crop&q=80',
    desc: 'Quét mã QR từ mọi ứng dụng Ngân hàng Việt Nam',
  },
  {
    id: 'ATM',
    name: 'Thẻ ATM Nội Địa',
    icon: 'https://images.unsplash.com/photo-1556742049-0a670e4a4591?w=100&auto=format&fit=crop&q=80',
    desc: 'Hỗ trợ 42 ngân hàng NAPAS tại Việt Nam',
  },
  {
    id: 'VISA',
    name: 'Thẻ Quốc Tế Visa / Mastercard',
    icon: 'https://images.unsplash.com/photo-1556742049-0a670e4a4591?w=100&auto=format&fit=crop&q=80',
    desc: 'Thanh toán bảo mật quốc tế 3D-Secure',
  },
];

const CITY_OPTIONS: SelectOption[] = [
  { value: 'Hà Nội', label: 'Hà Nội' },
  { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng' },
  { value: 'Hải Phòng', label: 'Hải Phòng' },
  { value: 'Cần Thơ', label: 'Cần Thơ' },
];

const CINEMA_OPTIONS: SelectOption[] = [
  { value: 'Galaxy CineX Hanoi Centre', label: 'Galaxy CineX Hanoi Centre', subLabel: 'Tầng 3, 54 Liễu Giai, Hà Nội' },
  { value: 'CineDot Ba Đình Centre', label: 'CineDot Ba Đình Centre', subLabel: '29 Liễu Giai, Ba Đình, Hà Nội' },
  { value: 'CineDot Landmark 81 Saigon', label: 'CineDot Landmark 81 Saigon', subLabel: 'Tầng B1, 720A Điện Biên Phủ, TP.HCM' },
  { value: 'CineDot Đà Nẵng Premier', label: 'CineDot Đà Nẵng Premier', subLabel: '9 Phùng Hưng, Thanh Khê, Đà Nẵng' },
];

export function StarShopPaymentClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buyNowParam = searchParams.get('buy_now');

  const { user } = useAuthStore();
  const { items: cartItems, clearCart } = useCartStore();

  const [selectedMethod, setSelectedMethod] = useState('MOMO');
  const [city, setCity] = useState('Hà Nội');
  const [cinema, setCinema] = useState('Galaxy CineX Hanoi Centre');
  const [fullName, setFullName] = useState(user?.name || 'Nguyễn Văn Star');
  const [phone, setPhone] = useState('0988776655');
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Determine purchased items (Buy Now Direct vs Cart Items)
  const isDirectBuy = Boolean(buyNowParam);

  const purchasedItemList = useMemo(() => {
    if (buyNowParam) {
      const parts = buyNowParam.split(':');
      const slug = parts[0];
      const qty = parts[1] ? parseInt(parts[1], 10) : 1;
      const foundProduct = MOCK_STAR_SHOP_PRODUCTS.find((p) => p.slug === slug) || MOCK_STAR_SHOP_PRODUCTS[0];
      return [{ product: foundProduct, quantity: qty }];
    }
    return Object.values(cartItems);
  }, [buyNowParam, cartItems]);

  const subtotal = useMemo(() => {
    return purchasedItemList.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [purchasedItemList]);

  const grandTotal = subtotal;

  const handleConfirmPayment = async () => {
    if (purchasedItemList.length === 0) return;
    setIsProcessing(true);

    try {
      await new Promise((res) => setTimeout(res, 1200));
      const orderId = 'ST-' + Math.floor(100000 + Math.random() * 900000);

      // Only clear persistent cart if this checkout came from Cart page (not Buy Now)
      if (!isDirectBuy) {
        clearCart();
      }

      // Encode items JSON string to pass to success page dynamically
      const formattedItems = purchasedItemList.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
        image: i.product.imageUrl,
      }));

      const itemsJsonStr = encodeURIComponent(JSON.stringify(formattedItems));

      router.push(
        `/star-shop/success?order_id=${orderId}&total=${grandTotal}&cinema=${encodeURIComponent(
          cinema
        )}&items=${itemsJsonStr}`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (purchasedItemList.length === 0) {
    return (
      <div className="w-full pt-36 pb-20 bg-[#F6F6F6] min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="text-2xl font-extrabold text-slate-800">Không có đơn hàng Star Shop nào để thanh toán</h2>
        <p className="text-sm text-slate-500">Giỏ hàng của bạn đang trống. Hãy quay lại Cửa hàng Star Shop để chọn vật phẩm.</p>
        <Link href="/star-shop#products">
          <button className="px-8 py-3.5 rounded-full bg-[#7C6FE8] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#685bc7] transition-all cursor-pointer">
            Quay lại Star Shop
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col font-sans bg-[#F6F6F6] text-[#131413] min-h-screen pt-28 pb-20 selection:bg-[#7C6FE8] selection:text-white">
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
          {/* Breadcrumb Back Button */}
          <div className="mb-4 flex items-center justify-between">
            <Link href={isDirectBuy ? '/star-shop#products' : '/star-shop/cart'}>
              <button className="text-xs font-bold text-[#7C6FE8] hover:text-[#685bc7] flex items-center gap-1.5 transition-colors cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                <span>{isDirectBuy ? 'Quay lại Cửa Hàng Star Shop' : 'Quay lại Giỏ hàng Star Shop'}</span>
              </button>
            </Link>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
            Thanh Toán Đơn Hàng Star Shop
          </h1>

          {/* Asymmetric Grid 65% / 35% */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: 65% Width (lg:col-span-8 - Delivery Info & Payment Methods) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Section 1: Delivery / Pickup Info Card */}
              <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Building2 className="w-5 h-5 text-[#7C6FE8]" />
                  <h2 className="font-extrabold text-base text-slate-900">
                    1. Thông tin Nhận hàng tại Quầy Rạp CineDot
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#7C6FE8]" />
                      <span>Khu vực (Tỉnh/Thành phố)</span>
                    </label>
                    <CustomSelectDropdown
                      options={CITY_OPTIONS}
                      value={city}
                      onChange={setCity}
                      icon={<MapPin className="w-3.5 h-3.5 text-[#7C6FE8]" />}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-[#7C6FE8]" />
                      <span>Rạp nhận vật phẩm</span>
                    </label>
                    <CustomSelectDropdown
                      options={CINEMA_OPTIONS}
                      value={cinema}
                      onChange={setCinema}
                      icon={<Building2 className="w-3.5 h-3.5 text-[#7C6FE8]" />}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#7C6FE8]" />
                      <span>Họ và tên người nhận</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#7C6FE8]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#7C6FE8]" />
                      <span>Số điện thoại liên hệ</span>
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#7C6FE8]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-[#7C6FE8]" />
                    <span>Ghi chú cho nhân viên quầy rạp (Không bắt buộc)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Đóng gói hộp quà tặng mừng sinh nhật..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#7C6FE8]"
                  />
                </div>
              </div>

              {/* Section 2: Interactive Radio Payment Cards */}
              <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <CreditCard className="w-5 h-5 text-[#7C6FE8]" />
                  <h2 className="font-extrabold text-base text-slate-900">
                    2. Chọn Phương Thức Thanh Toán
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = selectedMethod === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'border-[#7C6FE8] bg-[#7C6FE8]/5 shadow-sm'
                            : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#7C6FE8] shrink-0 font-extrabold text-xs">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-slate-900">
                                {method.name}
                              </span>
                              {method.badge && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-extrabold uppercase">
                                  {method.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-medium text-slate-500">
                              {method.desc}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-[#7C6FE8] bg-[#7C6FE8] text-white'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: 35% Width (lg:col-span-4 - Sticky Order Summary Card) */}
            <div className="lg:col-span-4">
              <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-5 sticky top-28">
                <h2 className="font-extrabold text-base text-slate-900 border-b border-gray-100 pb-3">
                  Tóm Tắt Đơn Hàng ({purchasedItemList.length})
                </h2>

                {/* Compact Mini Cart Items */}
                <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
                  {purchasedItemList.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100"
                      />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-extrabold text-xs text-slate-800 truncate">
                          {product.name}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          x{quantity} • {(product.price * quantity).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Breakdown Lines */}
                <div className="flex flex-col gap-2.5 border-t border-b border-gray-100 py-3 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Tạm tính tiền hàng</span>
                    <span className="font-bold text-slate-800">{subtotal.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí nhận hàng tại rạp</span>
                    <span className="font-bold text-emerald-600">Miễn phí (0đ)</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-col">
                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      Tổng Thanh Toán
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      (Đã bao gồm VAT)
                    </span>
                  </div>
                  <span className="text-2xl font-extrabold text-[#7C6FE8]">
                    {grandTotal.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                {/* Confirm Payment CTA Button */}
                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-full font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                    isProcessing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                      : 'bg-[#7C6FE8] hover:bg-[#685bc7] text-[#FFFFFF] shadow-[#7C6FE8]/35'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isProcessing ? 'ĐANG XỬ LÝ GIAO DỊCH...' : 'XÁC NHẬN THANH TOÁN'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Giao dịch mã hóa an toàn 256-bit SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
