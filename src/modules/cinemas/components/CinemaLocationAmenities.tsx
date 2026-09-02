'use client';

import React from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  Car,
  ShieldCheck,
  Tv,
  Volume2,
  Armchair,
  Popcorn,
  ExternalLink,
} from 'lucide-react';
import { CinemaItem } from '../types/cinemas.types';

interface CinemaLocationAmenitiesProps {
  cinema: CinemaItem;
}

export const CinemaLocationAmenities: React.FC<CinemaLocationAmenitiesProps> = ({
  cinema,
}) => {
  const experiences = [
    {
      icon: Tv,
      title: 'Máy Chiếu Christie Laser 4K',
      description: 'Độ tương phản cao, tái hiện màu sắc chuẩn điện ảnh DCI-P3.',
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
    <section className="w-full flex flex-col gap-6">
      {/* 1. Map & Address Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Address & Directions Card (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#7C6FE8]" />
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Vị Trí & Chỉ Đường
              </h3>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Địa chỉ chi tiết
                </span>
                <span className="text-xs font-bold text-slate-900 leading-snug">
                  {cinema.address}
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Hotline rạp
                </span>
                <a
                  href={`tel:${cinema.phone.replace(/\s+/g, '')}`}
                  className="text-xs font-extrabold text-[#7C6FE8] hover:underline"
                >
                  {cinema.phone} (1.000đ/phút)
                </a>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Giờ mở cửa
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  08:00 – 24:00 (Tất cả các ngày trong tuần, bao gồm Lễ & Tết)
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Hướng dẫn gửi xe
                </span>
                <span className="text-xs font-semibold text-slate-700 leading-relaxed">
                  Quý khách có thể gửi xe tại hầm B2 và B3 của tòa nhà. Có lối đi thang máy thẳng lên sảnh rạp tại tầng 5.
                </span>
              </div>
            </div>
          </div>

          <a
            href={cinema.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-[#A594F9]" />
            <span>Mở Chỉ Đường Trên Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

        {/* Right: Map Visual Banner Container (7 cols) */}
        <div className="lg:col-span-7 relative min-h-[260px] rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xs bg-slate-950 flex flex-col justify-end p-6">
          <img
            src={cinema.bannerUrl}
            alt={cinema.name}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          <div className="relative z-10 flex flex-col gap-2 max-w-lg">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A594F9]">
              {cinema.city}
            </span>
            <h4 className="text-xl font-extrabold text-white">
              {cinema.name}
            </h4>
            <p className="text-xs text-slate-300 font-medium leading-relaxed line-clamp-2">
              {cinema.description}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Signature Experience Amenities Grid */}
      <div className="flex flex-col gap-3.5 pt-2">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
          Tiện Ích & Dịch Vụ Nổi Bật
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {experiences.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#7C6FE8]/40 hover:shadow-xs transition-all flex flex-col gap-3 group"
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
      </div>
    </section>
  );
};
