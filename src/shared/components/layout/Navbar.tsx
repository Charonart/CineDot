'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { useCartStore } from '@/shared/store/useCartStore';
import { AuthModal } from '@/modules/auth/components/AuthModal';
import { PermissionGuard } from '@/shared/components/auth/PermissionGuard';
import { MoviesMegaDropdown } from './MoviesMegaDropdown';
import { CinemasMegaDropdown } from './CinemasMegaDropdown';
import { StarShopMegaDropdown } from './StarShopMegaDropdown';
import { User, LogOut, Ticket, ChevronDown, ShoppingBag } from 'lucide-react';

import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuthStore();

  // Reactive subscription to Zustand cart store items
  const items = useCartStore((state) => state.items);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMoviesDropdownOpen, setIsMoviesDropdownOpen] = useState(false);
  const [isCinemasDropdownOpen, setIsCinemasDropdownOpen] = useState(false);
  const [isStarShopDropdownOpen, setIsStarShopDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent SSR Hydration Mismatch by ensuring client-only state updates after mount
  useEffect(() => {
    setMounted(true);
    useAuthStore.getState().fetchMe();
  }, []);

  // Compute reactive cart list and total count directly from items
  const cartItemList = useMemo(() => Object.values(items), [items]);

  const totalCartCount = useMemo(() => {
    return cartItemList.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItemList]);

  const navLinks = [
    { name: 'Phim', href: '/movies', dropdownType: 'movies' },
    { name: 'Star Shop', href: '/star-shop', dropdownType: 'starshop' },
    // { name: 'Góc Điện Ảnh', href: '/cinema-corner' },
    { name: 'Sự Kiện', href: '/events' },
    { name: 'Rạp/Giá Vé', href: '/cinemas', dropdownType: 'cinemas' },
    { name: 'Rạp Đặc Biệt', href: '/special-theaters' },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[min(1480px,calc(100vw-48px))]">
        <div className="glass-nav rounded-full px-8 py-4 flex items-center justify-between shadow-sm border border-white/20 bg-white/80 backdrop-blur-md relative">
          {/* Logo */}
          <Logo height={44} />

          {/* Center Links */}
          <ul className="hidden xl:flex items-center space-x-7 text-sm font-medium text-slate-700">
            {navLinks.map((link) => {
              const isMovies = link.dropdownType === 'movies';
              const isCinemas = link.dropdownType === 'cinemas';
              const isStarShop = link.dropdownType === 'starshop';
              const isDropdown = isMovies || isCinemas || isStarShop;
              const isOpen = isMovies
                ? isMoviesDropdownOpen
                : isCinemas
                ? isCinemasDropdownOpen
                : isStarShop
                ? isStarShopDropdownOpen
                : false;

              return (
                <li
                  key={link.name}
                  className="relative py-1"
                  onMouseEnter={() => {
                    if (isMovies) setIsMoviesDropdownOpen(true);
                    if (isCinemas) setIsCinemasDropdownOpen(true);
                    if (isStarShop) setIsStarShopDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (isMovies) setIsMoviesDropdownOpen(false);
                    if (isCinemas) setIsCinemasDropdownOpen(false);
                    if (isStarShop) setIsStarShopDropdownOpen(false);
                  }}
                >
                  {isDropdown ? (
                    <Link
                      href={link.href}
                      className="hover:text-[#7C6FE8] transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#7C6FE8]' : ''
                        }`}
                      />
                    </Link>
                  ) : (
                    <Link
                      className="hover:text-[#7C6FE8] transition-colors flex items-center gap-1 font-semibold"
                      href={link.href}
                    >
                      <span>{link.name}</span>
                    </Link>
                  )}

                  {/* Individual Dropdown rendering aligned to item */}
                  <AnimatePresence>
                    {isCinemas && isCinemasDropdownOpen && (
                      <div
                        onMouseEnter={() => setIsCinemasDropdownOpen(true)}
                        onMouseLeave={() => setIsCinemasDropdownOpen(false)}
                      >
                        <CinemasMegaDropdown onClose={() => setIsCinemasDropdownOpen(false)} />
                      </div>
                    )}

                    {isStarShop && isStarShopDropdownOpen && (
                      <div
                        onMouseEnter={() => setIsStarShopDropdownOpen(true)}
                        onMouseLeave={() => setIsStarShopDropdownOpen(false)}
                      >
                        <StarShopMegaDropdown onClose={() => setIsStarShopDropdownOpen(false)} />
                      </div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Navbar Cart Icon Badge ONLY VISIBLE when (mounted && isAuthenticated && totalCartCount > 0) */}
            {mounted && isAuthenticated && totalCartCount > 0 && (
              <Link href="/star-shop/cart">
                <button
                  className="relative p-2.5 text-[#7C6FE8] hover:bg-[#7C6FE8]/10 rounded-full transition-all cursor-pointer flex items-center justify-center border border-[#7C6FE8]/20 bg-purple-50/50"
                  title="Xem trang Giỏ Hàng Star Shop"
                >
                  <ShoppingBag className="w-5 h-5 text-[#7C6FE8]" />
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
                    {totalCartCount}
                  </span>
                </button>
              </Link>
            )}

            {mounted && isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <PermissionGuard permissions={['admin', 'manage:cinemas', 'manage:movies', 'view:reports']}>
                  <Link href="/admin" className="text-xs font-bold text-[#7C6FE8] hover:text-[#5848c9] bg-purple-50 hover:bg-purple-100 transition-colors px-3 py-1.5 rounded-full border border-purple-200 shadow-sm hidden md:block">
                    Quản Trị Hệ Thống
                  </Link>
                </PermissionGuard>
                
                <Link href="/profile" className="flex items-center gap-2 hover:opacity-90 transition-opacity bg-slate-100/80 px-3 py-1.5 rounded-full border border-gray-200">
                  <div className="w-7 h-7 rounded-full bg-[#7C6FE8] text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <span className="text-xs font-extrabold text-slate-800 hidden md:block">
                    {user.name || user.username}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="text-[#131413] hover:text-[#7C6FE8] transition-colors hidden md:flex items-center gap-1.5 cursor-pointer font-bold text-xs"
              >
                <User className="w-4 h-4 text-[#7C6FE8]" />
                <span>Đăng nhập</span>
              </button>
            )}

            <Link
              className="bg-[#7C6FE8] text-white px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider hover:bg-[#685bc7] shadow-md shadow-[#7C6FE8]/30 transition-all inline-flex items-center justify-center cursor-pointer"
              href="/movies"
            >
              Đặt vé
            </Link>

            {/* Mobile hamburger */}
            <button
              className="xl:hidden text-[#131413] focus:outline-none p-1"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle navigation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Movies Mega Dropdown (Centered under nav) */}
        <AnimatePresence>
          {isMoviesDropdownOpen && (
            <div
              onMouseEnter={() => setIsMoviesDropdownOpen(true)}
              onMouseLeave={() => setIsMoviesDropdownOpen(false)}
            >
              <MoviesMegaDropdown onClose={() => setIsMoviesDropdownOpen(false)} />
            </div>
          )}
        </AnimatePresence>

        {/* Mobile Drawer */}
        {isMobileOpen && (
          <div className="xl:hidden mt-3 p-4 glass-card rounded-2xl border border-white/20 shadow-lg flex flex-col gap-2 bg-white/95">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {mounted && isAuthenticated ? (
              <Link
                href="/profile"
                onClick={() => setIsMobileOpen(false)}
                className="px-4 py-2.5 text-xs font-extrabold text-[#7C6FE8] hover:bg-purple-50 rounded-xl transition-colors flex items-center gap-2"
              >
                <Ticket className="w-4 h-4 text-[#7C6FE8]" />
                <span>Trang Cá Nhân & Vé Của Tôi</span>
              </Link>
            ) : (
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  openAuthModal('login');
                }}
                className="px-4 py-2.5 text-xs font-extrabold text-[#7C6FE8] hover:bg-purple-50 rounded-xl transition-colors flex items-center gap-2 text-left"
              >
                <User className="w-4 h-4 text-[#7C6FE8]" />
                <span>Đăng nhập tài khoản</span>
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Global Auth Modal Popup */}
      <AuthModal />
    </>
  );
};
