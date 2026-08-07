'use client';

import React from 'react';
import { Sofa, Tv, Utensils } from 'lucide-react';

export const CinemaAmenities: React.FC = () => {
  const amenities = [
    {
      icon: Sofa,
      title: 'Phòng Chờ Thương Gia',
      description: 'Không gian chờ sang trọng, yên tĩnh phục vụ đồ uống nhẹ miễn phí.',
    },
    {
      icon: Tv,
      title: 'Máy Chiếu Laser 4K',
      description: 'Trải nghiệm hình ảnh sống động sắc nét với độ sáng vượt trội.',
    },
    {
      icon: Utensils,
      title: 'Phục Vụ Tận Ghế',
      description: 'Đặt bắp nước trực tiếp qua app CineDot, nhân viên phục vụ tận nơi.',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4 pt-6 border-t border-gray-100">
      <h3 className="text-base font-bold text-[#131413]">Tiện Ích Nổi Bật Tại Rạp</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {amenities.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-gray-100 hover:border-[#7C6FE8]/40 shadow-xs hover:shadow-md transition-all flex flex-col gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#7C6FE8]/10 text-[#7C6FE8] group-hover:bg-[#7C6FE8] group-hover:text-white flex items-center justify-center transition-colors">
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="font-extrabold text-xs text-slate-800 group-hover:text-[#7C6FE8] transition-colors">
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
  );
};
