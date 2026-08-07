'use client';

import React from 'react';
import { Flag, Rocket } from 'lucide-react';
import { MOCK_ABOUT_TIMELINE } from '../mocks/mockAboutData';

export const AboutTimeline: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-8 mb-16 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1 text-center items-center">
        <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
          <Rocket className="w-4 h-4" />
          <span>LỊCH SỬ PHÁT TRIỂN</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Hành Trình Khai Phá Điện Ảnh
        </h2>
      </div>

      <div className="flex flex-col gap-6 relative before:absolute before:left-4 sm:before:left-1/2 before:top-0 before:bottom-0 before:w-0.5 before:bg-purple-100">
        {MOCK_ABOUT_TIMELINE.map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col sm:flex-row items-start gap-4 relative z-10 ${
              idx % 2 === 0 ? 'sm:flex-row-reverse' : ''
            }`}
          >
            {/* Year Badge Node */}
            <div className="w-8 h-8 rounded-full bg-[#7C6FE8] text-white font-black text-xs flex items-center justify-center border-4 border-white shadow-md shrink-0 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
              <Flag className="w-3.5 h-3.5" />
            </div>

            {/* Card Content */}
            <div className="w-full sm:w-[calc(50%-2rem)] p-6 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#7C6FE8] font-mono">
                  {item.year}
                </span>
                {item.badgeText && (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#7C6FE8] text-[10px] font-extrabold uppercase">
                    {item.badgeText}
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-base text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
