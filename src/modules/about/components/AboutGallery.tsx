'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { MOCK_GALLERY_ITEMS } from '../mocks/mockAboutData';

export const AboutGallery: React.FC = () => {
  return (
    <div className="w-full bg-slate-50/80 rounded-3xl p-8 sm:p-12 border border-gray-100 mb-16 flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
          <Camera className="w-4 h-4" />
          <span>BÊN TRONG CINEDOT</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Không Gian Kiến Trúc Độc Bản
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_GALLERY_ITEMS.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.03 }}
            className="w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md border border-gray-100 relative group aspect-[4/3] cursor-pointer"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
              <h4 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors">
                {item.title}
              </h4>
              <span className="text-[11px] text-slate-300 font-medium line-clamp-1">
                {item.subtitle}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
