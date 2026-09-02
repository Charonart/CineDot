'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { useCartStore } from '@/shared/store/useCartStore';
import { AuthModal } from '@/modules/auth/components/AuthModal';
import { MoviesMegaDropdown } from './MoviesMegaDropdown';
import { CinemasMegaDropdown } from './CinemasMegaDropdown';
import { StarShopMegaDropdown } from './StarShopMegaDropdown';
import { UserNavMenu } from './UserNavMenu';
import { ExpandableSearchBar } from '@/shared/ui/ExpandableSearchBar';
import { Logo } from './Logo';
import {
  User,
  Ticket,
  ChevronDown,
  ShoppingBag,
  Film,
  Sparkles,
  Calendar,
  MapPin,
  Menu,
  X,
  Search,
  Shield,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, openAuthModal, hasPermission } = useAuthStore();
  const items = useCartStore((state) => state.items);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'movies' | 'cinemas' | 'starshop' | null>(null);
  const [mounted, setMounted] = useState(false);

  const isAdmin = Boolean(
    user &&
      (user.role_name === 'admin' ||
        user.role_name === 'super_admin' ||
        user.role_name === 'SUPER_ADMIN' ||
        user.role_name === 'ADMIN' ||
        (user as any).role === 'SUPER_ADMIN' ||
        (user as any).role === 'ADMIN' ||
        hasPermission('*'))
  );

  // Prevent SSR Hydration Mismatch & initialize session check
  useEffect(() => {
    setMounted(true);
    useAuthStore.getState().initAuthStore();
    useAuthStore.getState().fetchMe();

    const handleScroll = () => {
      if (window.scrollY > 24) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute reactive cart list and count
  const cartItemList = useMemo(() => Object.values(items), [items]);
  const totalCartCount = useMemo(() => {
    return cartItemList.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItemList]);

  const navLinks = [
    {
      name: 'Phim',
      href: '/movies',
      dropdownType: 'movies' as const,
      icon: Film,
    },
    {
      name: 'Star Shop',
      href: '/star-shop',
      dropdownType: 'starshop' as const,
      icon: ShoppingBag,
    },
    {
      name: 'Sự Kiện',
      href: '/events',
      icon: Calendar,
    },
    {
      name: 'Rạp & Giá Vé',
      href: '/cinemas',
      dropdownType: 'cinemas' as const,
      icon: MapPin,
    },
    {
      name: 'Rạp Đặc Biệt',
      href: '/special-theaters',
      icon: Sparkles,
    },
  ];

  const handleSearchSubmit = (val: string) => {
    if (val.trim()) {
      router.push(`/movies?search=${encodeURIComponent(val.trim())}`);
    }
  };

  return (
    <>
      {/* Hallmark N10/N1b Hybrid Floating Nav Bar */}
      <header
        className={`fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-[100] w-[min(1180px,calc(100vw-24px))] transition-all duration-300 ${
          isScrolled ? 'top-3 sm:top-4' : 'top-4 sm:top-5'
        }`}
      >
        <div
          className={`rounded-full px-4 sm:px-6 flex items-center justify-between border transition-all duration-300 relative text-slate-900 ${
            isScrolled
              ? 'py-2 sm:py-2.5 bg-white/95 backdrop-blur-2xl border-gray-200/90 shadow-[0_12px_36px_-6px_rgba(15,23,42,0.12),0_0_0_1px_rgba(255,255,255,0.8)]'
              : 'py-2.5 sm:py-3 bg-white/90 backdrop-blur-xl border-gray-200/70 shadow-[0_6px_24px_-4px_rgba(15,23,42,0.06)]'
          }`}
        >
          {/* Left Brand Identity: Logo 44px */}
          <Logo height={44} onClick={() => setActiveDropdown(null)} />

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-xs font-bold text-slate-700">
            {navLinks.map((link) => {
              const isDropdown = Boolean(link.dropdownType);
              const isOpen = activeDropdown === link.dropdownType;

              return (
                <div
                  key={link.name}
                  className="relative py-1"
                  onMouseEnter={() => {
                    if (link.dropdownType) setActiveDropdown(link.dropdownType);
                  }}
                  onMouseLeave={() => {
                    if (link.dropdownType) setActiveDropdown(null);
                  }}
                >
                  <Link
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
                      isOpen
                        ? 'bg-purple-50 text-[#7C6FE8]'
                        : 'hover:bg-gray-100/80 hover:text-[#7C6FE8] text-slate-700'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isDropdown && (
                      <ChevronDown
                        className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#7C6FE8]' : ''
                        }`}
                      />
                    )}
                  </Link>

                  {/* Mega Dropdowns aligned to trigger */}
                  <AnimatePresence>
                    {link.dropdownType === 'cinemas' && isOpen && (
                      <div
                        onMouseEnter={() => setActiveDropdown('cinemas')}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <CinemasMegaDropdown onClose={() => setActiveDropdown(null)} />
                      </div>
                    )}

                    {link.dropdownType === 'starshop' && isOpen && (
                      <div
                        onMouseEnter={() => setActiveDropdown('starshop')}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <StarShopMegaDropdown onClose={() => setActiveDropdown(null)} />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Right Action Hub */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Pill Trigger */}
            <div className="hidden sm:block">
              <ExpandableSearchBar
                placeholder="Tìm phim, rạp chiếu..."
                onSubmit={handleSearchSubmit}
              />
            </div>

            {/* Admin Portal Quick Access Button */}
            {mounted && isAuthenticated && isAdmin && (
              <Link href="/admin">
                <button
                  type="button"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#7C6FE8] to-indigo-600 hover:from-[#685bc7] hover:to-indigo-700 text-white text-xs font-black shadow-xs shadow-[#7C6FE8]/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title="Truy cập Bảng Quản Trị Hệ Thống"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Quản Trị</span>
                </button>
              </Link>
            )}

            {/* StarShop Cart Button */}
            {mounted && isAuthenticated && totalCartCount > 0 && (
              <Link href="/star-shop/cart">
                <button
                  className="relative p-2.5 text-[#7C6FE8] hover:bg-purple-50 rounded-full transition-all cursor-pointer flex items-center justify-center border border-[#7C6FE8]/20 bg-purple-50/50 hover:scale-105 active:scale-95"
                  title="Xem giỏ hàng Star Shop"
                >
                  <ShoppingBag className="w-4 h-4 text-[#7C6FE8]" />
                  <span className="absolute -top-1 -right-1 bg-[#7C6FE8] text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                    {totalCartCount}
                  </span>
                </button>
              </Link>
            )}

            {/* Authenticated User Popover Menu / Unauthenticated Sign In */}
            {mounted && isAuthenticated && user ? (
              <UserNavMenu />
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="text-slate-700 hover:text-[#7C6FE8] transition-colors hidden md:flex items-center gap-1.5 cursor-pointer font-bold text-xs px-3 py-1.5 rounded-full hover:bg-gray-100/80"
              >
                <User className="w-4 h-4 text-[#7C6FE8]" />
                <span>Đăng nhập</span>
              </button>
            )}

            {/* Primary CTA: Đặt vé ngay */}
            <Link
              className="bg-[#7C6FE8] text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs font-black uppercase tracking-wider hover:bg-[#685bc7] shadow-sm shadow-[#7C6FE8]/30 transition-all inline-flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 shrink-0"
              href="/movies"
            >
              <Ticket className="w-3.5 h-3.5 fill-white hidden sm:inline-block" />
              <span>Đặt vé</span>
            </Link>

            {/* Mobile Hamburger Trigger */}
            <button
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-full hover:bg-gray-100 focus:outline-none transition-colors cursor-pointer"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Mở menu điều hướng"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Movies Mega Dropdown (Centered under nav bar) */}
        <AnimatePresence>
          {activeDropdown === 'movies' && (
            <div
              onMouseEnter={() => setActiveDropdown('movies')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <MoviesMegaDropdown onClose={() => setActiveDropdown(null)} />
            </div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-2.5 p-4 rounded-3xl bg-white/98 backdrop-blur-2xl border border-gray-200/90 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.2)] flex flex-col gap-2.5 text-slate-900"
            >
              {/* Mobile Search input */}
              <div className="relative flex items-center mb-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm phim, rạp chiếu..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit((e.target as HTMLInputElement).value);
                      setIsMobileOpen(false);
                    }
                  }}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-100 text-xs font-semibold text-slate-800 rounded-2xl border border-transparent focus:border-[#7C6FE8] outline-none"
                />
              </div>

              {/* Mobile Links */}
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="px-3.5 py-2.5 text-xs font-bold text-slate-800 hover:bg-purple-50 hover:text-[#7C6FE8] rounded-2xl transition-colors flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-[#7C6FE8]" />
                        <span>{link.name}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="h-px bg-gray-100 my-1" />

              {/* Mobile User Profile / Sign In */}
              {mounted && isAuthenticated && user ? (
                <div className="flex flex-col gap-1">
                  <Link
                    href="/profile?tab=tickets"
                    onClick={() => setIsMobileOpen(false)}
                    className="px-3.5 py-2.5 text-xs font-extrabold text-[#7C6FE8] bg-purple-50 rounded-2xl transition-colors flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2.5">
                      <Ticket className="w-4 h-4" />
                      <span>Vé Của Tôi & Lịch Đặt</span>
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#7C6FE8] text-white">
                      {user.total_points || 0} pts
                    </span>
                  </Link>

                  <Link
                    href="/profile?tab=overview"
                    onClick={() => setIsMobileOpen(false)}
                    className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-gray-100 rounded-2xl transition-colors flex items-center gap-2.5"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    <span>Trang Cá Nhân ({user.name || user.username})</span>
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    openAuthModal('login');
                  }}
                  className="w-full px-3.5 py-2.5 text-xs font-extrabold text-[#7C6FE8] bg-purple-50 hover:bg-purple-100 rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Đăng nhập tài khoản</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Auth Modal Popup */}
      <AuthModal />
    </>
  );
};
