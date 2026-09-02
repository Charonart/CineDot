'use client';

import React from 'react';
import {
  Sparkles,
  Tv,
  Volume2,
  Armchair,
  Popcorn,
  ShieldCheck,
} from 'lucide-react';

export const CinemaAmenities: React.FC = () => {
  const experiences = [
    {
      icon: Tv,
      title: 'Máy Chiếu Christie Laser 4K',
      description: 'Độ tương phản cao, tái hiện màu sắc sống động đạt chuẩn điện ảnh DCI-P3.',
      colorClass: 'bg-sky-50 text-sky-600',
    },
    {
      icon: Volume2,
      title: 'Âm Thanh Dolby Atmos 64-Ch',
      description: 'Hệ thống âm thanh vòm chuyển động 3D chân thực theo từng khung hình.',
      colorClass: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: Armchair,
      title: 'Ghế Da VIP & Sweetbox Cao Cấp',
      description: 'Khoảng cách giữa các hàng ghế rộng rãi, đệm êm ái cùng vách ngăn riêng tư.',
      colorClass: 'bg-purple-50 text-[#7C6FE8]',
    },
    {
      icon: Popcorn,
      title: 'Quầy Bắp Nước StarBar Express',
      description: 'Đặt bắp nước trực tiếp cùng vé online, lấy nhanh không cần xếp hàng.',
      colorClass: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <section className="w-full flex flex-col gap-4 pt-2">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-[#7C6FE8]" />
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
          Đặc Quyền Trải Nghiệm Tại CineDot
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {experiences.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#7C6FE8]/40 hover:shadow-sm transition-all flex flex-col gap-3 group"
            >
              <div
                className={`w-10 h-10 rounded-xl ${item.colorClass} flex items-center justify-center transition-transform group-hover:scale-105 shrink-0`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-[#7C6FE8] transition-colors leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
