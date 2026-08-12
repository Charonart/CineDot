'use client';

import React from 'react';
import { ShieldCheck, Rocket, Gift, RefreshCw } from 'lucide-react';

export const StarShopTrustStrip: React.FC = () => {
  const benefits = [
    {
      icon: ShieldCheck,
      title: '100% Chính Hãng',
      desc: 'Ủy quyền bản quyền từ Marvel, DC & Disney Studios',
    },
    {
      icon: Rocket,
      title: 'Nhận Hàng Tại Rạp 2H',
      desc: 'Đặt online nhận trực tiếp tại quầy rạp khi xem phim',
    },
    {
      icon: Gift,
      title: 'Hộp Quà Collector Box',
      desc: 'Đóng gói quà tặng cao cấp chống va đập móp méo',
    },
    {
      icon: RefreshCw,
      title: 'Bảo Hành 1 Đổi 1',
      desc: 'Đổi mới 100% trong 7 ngày nếu lỗi từ nhà sản xuất',
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {benefits.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center gap-3.5 hover:border-[#7C6FE8]/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[#7C6FE8]/10 text-[#7C6FE8] flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h4 className="font-extrabold text-xs text-slate-800">{item.title}</h4>
              <p className="text-[11px] font-medium text-slate-500 leading-tight">
                {item.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
