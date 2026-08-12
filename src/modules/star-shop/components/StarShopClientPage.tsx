'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStarShop } from '../hooks/useStarShop';
import { useCartStore } from '@/shared/store/useCartStore';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { StarShopHeroBanner } from './StarShopHeroBanner';
import { StarShopTrustStrip } from './StarShopTrustStrip';
import { StarShopFlashSaleSection } from './StarShopFlashSaleSection';
import { StarShopCollectorSpotlight } from './StarShopCollectorSpotlight';
import { StarShopUniverseTabs, UniverseType } from './StarShopUniverseTabs';
import { StarShopCategoryFilter } from './StarShopCategoryFilter';
import { StarShopProductCard } from './StarShopProductCard';
import { Skeleton } from '@/shared/ui/Skeleton';

export function StarShopClientPage() {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { products, activeCategory, setActiveCategory, loading } = useStarShop();
  const { addToCart } = useCartStore();

  const [activeUniverse, setActiveUniverse] = useState<UniverseType>('ALL_UNIVERSE');
  const productsGridRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to #products if hash exists in URL
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#products') {
      setTimeout(() => {
        if (productsGridRef.current) {
          productsGridRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const handleAddToCart = (product: any) => {
    if (!isAuthenticated) {
      openAuthModal('login', 'Vui lòng đăng nhập tài khoản để thêm sản phẩm vào giỏ hàng Star Shop');
      return;
    }
    addToCart(product, 1);
  };

  const handleQuickBuy = (product: any) => {
    if (!isAuthenticated) {
      openAuthModal('login', 'Vui lòng đăng nhập tài khoản để tiến hành mua ngay vật phẩm Star Shop');
      return;
    }
    // Direct purchase isolation via buy_now URL param
    router.push(`/star-shop/payment?buy_now=${product.slug}:1`);
  };

  const handleExploreFlashSale = () => {
    if (productsGridRef.current) {
      productsGridRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter products by Universe if selected
  const displayedProducts = useMemo(() => {
    if (activeUniverse === 'ALL_UNIVERSE') return products;
    if (activeUniverse === 'MARVEL_DC') {
      return products.filter((p) => p.category === 'FIGURINE' || p.badge === 'LIMITED');
    }
    if (activeUniverse === 'ANIME') {
      return products.filter((p) => p.slug.includes('conan') || p.category === 'APPAREL');
    }
    if (activeUniverse === 'DISNEY') {
      return products.filter((p) => p.category === 'TUMBLER' || p.category === 'COMBO');
    }
    return products;
  }, [products, activeUniverse]);

  return (
    <div className="w-full flex flex-col font-sans bg-[#FEFEFE] text-[#131413] min-h-screen pt-28 pb-20 selection:bg-[#7C6FE8] selection:text-white relative">
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
          {/* 1. Hero Showcase Banner */}
          <StarShopHeroBanner />

          {/* 2. Trust Badges & Benefits Strip */}
          <StarShopTrustStrip />

          {/* 3. Sleek Flash Sale Luxury Strip */}
          <StarShopFlashSaleSection onExploreClick={handleExploreFlashSale} />

          {/* 4. Editorial 100% Light Mode Collector Spotlight */}
          <StarShopCollectorSpotlight onQuickBuy={handleQuickBuy} />

          {/* 5. Universe Movie Tabs */}
          <div className="flex flex-col gap-2 mb-4">
            <h2 className="text-xl font-extrabold text-[#131413] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#7C6FE8] rounded-full inline-block" />
              <span>Khám Phá Theo Vũ Trụ Điện Ảnh</span>
            </h2>
          </div>

          <StarShopUniverseTabs
            activeUniverse={activeUniverse}
            onSelectUniverse={setActiveUniverse}
          />

          {/* 6. Category Filter Pills */}
          <StarShopCategoryFilter
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* 7. Products Grid Anchor Section */}
          <div id="products" ref={productsGridRef} className="scroll-mt-32">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} variant="card" className="h-80 rounded-3xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedProducts.map((product) => (
                  <StarShopProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickBuy={handleQuickBuy}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
