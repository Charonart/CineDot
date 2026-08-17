'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LayoutGrid, Package, CupSoda, Shirt, Gift } from 'lucide-react';

interface StarShopMegaDropdownProps {
  onClose?: () => void;
}

export const StarShopMegaDropdown: React.FC<StarShopMegaDropdownProps> = ({ onClose }) => {
  const menuItems = [
    {
      name: 'Tất Cả Các Sản Phẩm',
      desc: 'Khám phá trọn bộ vật phẩm',
      icon: LayoutGrid,
      href: '/star-shop',
      isHighlight: true,
    },
    {
      name: 'Mô Hình / Figurine',
      desc: 'Hot Toys, Marvel, DC 1:6',
      icon: Package,
      href: '/star-shop?category=figurine',
    },
    {
      name: 'Cốc Limited & Tumbler',
      desc: 'Venom 3D, IMAX Metallic',
      icon: CupSoda,
      href: '/star-shop?category=tumbler',
    },
    {
      name: 'Thời Trang & Phụ Kiện',
      desc: 'Áo Conan, Mũ Gladiator',
      icon: Shirt,
      href: '/star-shop?category=fashion',
    },
    {
      name: 'Combo Quà Tặng Hot',
      desc: 'Inside Out 2, Wicked Box',
      icon: Gift,
      href: '/star-shop?category=combo',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.18 }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-[110] w-[280px] bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-gray-100 flex flex-col gap-1 text-[#131413]"
    >
      {menuItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <Link
            key={index}
            href={item.href}
            onClick={onClose}
            className={`p-2.5 rounded-xl transition-all flex items-center gap-3 group cursor-pointer ${
              item.isHighlight
                ? 'bg-purple-50/80 hover:bg-[#7C6FE8] hover:text-white'
                : 'hover:bg-slate-100/80 text-slate-800'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                item.isHighlight
                  ? 'bg-[#7C6FE8] text-white group-hover:bg-white group-hover:text-[#7C6FE8]'
                  : 'bg-purple-50 text-[#7C6FE8] group-hover:bg-[#7C6FE8] group-hover:text-white'
              }`}
            >
              <IconComponent className="w-4 h-4 stroke-[2.2]" />
            </div>

            <div className="flex flex-col min-w-0">
              <span
                className={`font-extrabold text-xs leading-snug transition-colors ${
                  item.isHighlight
                    ? 'text-[#7C6FE8] group-hover:text-white'
                    : 'text-slate-800 group-hover:text-[#7C6FE8]'
                }`}
              >
                {item.name}
              </span>
              <span
                className={`text-[10px] font-semibold truncate transition-colors ${
                  item.isHighlight
                    ? 'text-purple-600 group-hover:text-purple-100'
                    : 'text-slate-400 group-hover:text-slate-500'
                }`}
              >
                {item.desc}
              </span>
            </div>
          </Link>
        );
      })}
    </motion.div>
  );
};
