'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Star, ShieldCheck, CheckCircle2, Truck, RefreshCw, Eye } from 'lucide-react';
import { StarShopProduct } from '../types/star-shop.types';
import { fetchProductBySlug, fetchStarShopProducts } from '../services/star-shop.service';
import { useCartStore } from '@/shared/store/useCartStore';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { StarShopProductCard } from './StarShopProductCard';
import { Skeleton } from '@/shared/ui/Skeleton';

interface ProductDetailClientPageProps {
  slug: string;
}

export function ProductDetailClientPage({ slug }: ProductDetailClientPageProps) {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { addToCart } = useCartStore();

  const [product, setProduct] = useState<StarShopProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<StarShopProduct[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const found = await fetchProductBySlug(slug);
        setProduct(found);
        if (found) {
          const all = await fetchStarShopProducts('ALL');
          setRelatedProducts(all.filter((p) => p.id !== found.id).slice(0, 4));
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full pt-28 pb-20 bg-[#FEFEFE] min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-6">
            <Skeleton variant="card" className="w-full aspect-square rounded-3xl" />
          </div>
          <div className="md:col-span-6 flex flex-col gap-4">
            <Skeleton variant="text" className="w-3/4 h-8" />
            <Skeleton variant="text" className="w-1/2 h-6" />
            <Skeleton variant="card" className="w-full h-40 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full pt-36 pb-20 bg-[#FEFEFE] min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="text-2xl font-extrabold text-slate-800">Không tìm thấy sản phẩm Star Shop này</h2>
        <p className="text-sm text-slate-500">Sản phẩm có thể đã hết hàng hoặc đường dẫn không khả dụng.</p>
        <Link href="/star-shop#products">
          <button className="px-6 py-2.5 rounded-full bg-[#7C6FE8] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#685bc7] transition-all cursor-pointer">
            Quay lại Cửa Hàng Star Shop
          </button>
        </Link>
      </div>
    );
  }

  // Gallery images list (using product image + variations)
  const images = [
    product.imageUrl,
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
  ];

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      openAuthModal('login', 'Vui lòng đăng nhập tài khoản để mua ngay sản phẩm Star Shop');
      return;
    }
    router.push(`/star-shop/payment?buy_now=${product.slug}:${quantity}`);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      openAuthModal('login', 'Vui lòng đăng nhập tài khoản để thêm sản phẩm vào giỏ hàng Star Shop');
      return;
    }
    addToCart(product, quantity);
  };

  return (
    <div className="w-full flex flex-col font-sans bg-[#FEFEFE] text-[#131413] min-h-screen pt-28 pb-20 selection:bg-[#7C6FE8] selection:text-white">
      <main className="w-full">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/star-shop#products">
              <button className="text-xs font-bold text-[#7C6FE8] hover:text-[#685bc7] flex items-center gap-1.5 transition-colors cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại Cửa Hàng Star Shop</span>
              </button>
            </Link>
          </div>

          {/* Main 2-Column Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
            {/* Left Column: Image Gallery (lg:col-span-6) */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="w-full aspect-square rounded-3xl overflow-hidden bg-slate-900 shadow-lg border border-gray-100 relative group">
                <img
                  src={images[activeImageIndex] || product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {product.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500 text-white font-extrabold text-xs uppercase shadow-md">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails Row */}
              <div className="flex items-center gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#7C6FE8] ring-2 ring-[#7C6FE8]/30 scale-105'
                        : 'border-gray-200 hover:border-gray-300 opacity-70'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Product Info & Buy CTA (lg:col-span-6) */}
            <div className="lg:col-span-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider">
                  {product.categoryName}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating} / 5.0 (Đánh giá tuyệt vời)</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Còn lại {product.stock} sản phẩm</span>
                </span>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 py-2 border-y border-gray-100">
                <span className="text-3xl font-extrabold text-[#7C6FE8]">
                  {product.price.toLocaleString('vi-VN')}đ
                </span>
                {product.originalPrice && (
                  <span className="text-base font-semibold text-slate-400 line-through">
                    {product.originalPrice.toLocaleString('vi-VN')}đ
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 py-2">
                <span className="text-xs font-extrabold text-slate-700">Số lượng:</span>
                <div className="flex items-center border border-gray-200 rounded-2xl bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-slate-200 text-slate-700 font-extrabold text-sm cursor-pointer rounded-l-2xl"
                  >
                    -
                  </button>
                  <span className="px-5 text-sm font-extrabold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-slate-200 text-slate-700 font-extrabold text-sm cursor-pointer rounded-r-2xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={handleBuyNow}
                  className="py-4 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#7C6FE8]/35 transition-all cursor-pointer"
                >
                  <span>MUA NGAY</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  className="py-4 rounded-full bg-slate-100 hover:bg-purple-50 text-[#7C6FE8] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#7C6FE8]/30 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>THÊM VÀO GIỎ</span>
                </button>
              </div>

              {/* Trust Badge Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 flex flex-col gap-2 text-xs text-slate-700 mt-2">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#7C6FE8]" />
                  <span>Cam kết từ CineDot Star Shop:</span>
                </span>
                <ul className="flex flex-col gap-1.5 text-slate-600 pl-6 list-disc">
                  <li>Sản phẩm chính hãng 100% ủy quyền từ Marvel & Disney Studios</li>
                  <li>Giao hàng miễn phí hoặc nhận trực tiếp tại quầy rạp CineDot</li>
                  <li>Đổi trả miễn phí 1 đổi 1 trong vòng 7 ngày nếu có lỗi từ nhà sản xuất</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Product Description Detailed Section */}
          <div className="border-t border-gray-100 pt-10 mb-16 flex flex-col gap-4">
            <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-wider">
              Mô Tả Sản Phẩm & Thông Số Kỹ Thuật
            </h2>
            <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-4xl">
              {product.description} Sản phẩm được hoàn thiện tỉ mỉ bằng công nghệ sơn mạ cao cấp, chống trầy xước và giữ màu bền bỉ theo thời gian. Mỗi hộp sản phẩm đều đính kèm mã QR Code xác thực độc bản bảo chứng chính hãng CineDot.
            </p>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-gray-100 pt-10 flex flex-col gap-6">
              <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#7C6FE8] rounded-full inline-block" />
                <span>Sản Phẩm Tương Tự</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((rel) => (
                  <StarShopProductCard
                    key={rel.id}
                    product={rel}
                    onAddToCart={(p) => {
                      if (!isAuthenticated) {
                        openAuthModal('login', 'Vui lòng đăng nhập tài khoản để thêm sản phẩm vào giỏ hàng Star Shop');
                        return;
                      }
                      addToCart(p, 1);
                    }}
                    onQuickBuy={(p) => {
                      if (!isAuthenticated) {
                        openAuthModal('login', 'Vui lòng đăng nhập tài khoản để mua sắm vật phẩm Star Shop');
                        return;
                      }
                      router.push(`/star-shop/payment?buy_now=${p.slug}:1`);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
