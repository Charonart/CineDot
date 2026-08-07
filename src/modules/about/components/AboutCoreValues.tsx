'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Film, Sparkles, ShoppingBag, ShieldCheck } from 'lucide-react';
import { MOCK_CORE_VALUES } from '../mocks/mockAboutData';

export const AboutCoreValues: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-8 mb-16">
      <div className="flex flex-col gap-2 text-center items-center max-w-2xl mx-auto">
        <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>GIÁ TRỊ CỐT LÕI</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Trải Nghiệm Điện Ảnh 5 Sao Đẳng Cấp
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          CineDot không chỉ chiếu phim, chúng tôi kiến tạo không gian giải trí nghệ thuật vượt ngoài kỳ vọng.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_CORE_VALUES.map((val) => (
          <motion.div
            key={val.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col gap-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 group-hover:bg-[#7C6FE8] text-[#7C6FE8] group-hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-xs">
              {val.icon === 'Film' && <Film className="w-6 h-6" />}
              {val.icon === 'Sparkles' && <Sparkles className="w-6 h-6" />}
              {val.icon === 'ShoppingBag' && <ShoppingBag className="w-6 h-6" />}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-[#7C6FE8] uppercase tracking-wider">
                {val.subtitle}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#7C6FE8] transition-colors">
                {val.title}
              </h3>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {val.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
