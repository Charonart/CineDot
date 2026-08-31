'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LayoutGrid, Package, CupSoda, Shirt, Gift, ArrowRight, ShoppingBag } from 'lucide-react';

interface StarShopMegaDropdownProps {
  onClose?: () => void;
}

export const StarShopMegaDropdown: React.FC<StarShopMegaDropdownProps> = ({ onClose }) => {
  const menuCategories = [
    {
      name: 'Tất Cả Sản Phẩm',
      desc: 'Khám phá trọn bộ vật phẩm độc quyền',
      icon: LayoutGrid,
      href: '/star-shop',
    },
    {
      name: 'Mô Hình / Figurine',
      desc: 'Mô hình điện ảnh tỉ lệ 1:6 chính hãng',
      icon: Package,
      href: '/star-shop?category=figurine',
    },
    {
      name: 'Ly & Cốc Sưu Tầm',
      desc: 'Ly bắp, tumbler giữ nhiệt phiên bản phim',
      icon: CupSoda,
      href: '/star-shop?category=tumbler',
    },
    {
      name: 'Thời Trang & Phụ Kiện',
      desc: 'Áo thun, áo khoác, nón và phụ kiện',
      icon: Shirt,
      href: '/star-shop?category=fashion',
    },
    {
      name: 'Combo Quà Tặng & Box Set',
      desc: 'Hộp quà sưu tầm đặc biệt',
      icon: Gift,
      href: '/star-shop?category=combo',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[340px] bg-white/95 backdrop-blur-2xl rounded-3xl p-3.5 shadow-[0_24px_60px_-12px_rgba(15,23,42,0.18),0_0_0_1px_rgba(229,231,235,0.8)] border border-white/60 z-[110] text-slate-900 selection:bg-[#7C6FE8] selection:text-white flex flex-col gap-2"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-purple-50 text-[#7C6FE8]">
            <ShoppingBag className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Star Shop
            </h4>
            <p className="text-[11px] text-gray-500 font-medium">Vật phẩm điện ảnh chính hãng</p>
          </div>
        </div>

        <Link
          href="/star-shop"
          onClick={onClose}
          className="text-[11px] font-bold text-[#7C6FE8] hover:text-[#685bc7] transition-colors"
        >
          Xem tất cả →
        </Link>
      </div>

      {/* Category List */}
      <div className="flex flex-col gap-1 py-1">
        {menuCategories.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={index}
              href={item.href}
              onClick={onClose}
              className="p-2 rounded-2xl hover:bg-purple-50/70 transition-all flex items-center justify-between group cursor-pointer border border-transparent hover:border-purple-100"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gray-100 group-hover:bg-[#7C6FE8] text-slate-700 group-hover:text-white flex items-center justify-center shrink-0 transition-all shadow-2xs">
                  <IconComponent className="w-4 h-4 stroke-[2]" />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-xs text-slate-800 group-hover:text-[#7C6FE8] transition-colors truncate">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-gray-400 group-hover:text-gray-600 truncate transition-colors">
                    {item.desc}
                  </span>
                </div>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#7C6FE8] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};
