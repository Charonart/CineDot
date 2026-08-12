'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { MOCK_FAQ_ITEMS } from '../mocks/mockAboutData';

export const AboutFaqAccordion: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full flex flex-col gap-8 mb-16 max-w-3xl mx-auto">
      <div className="flex flex-col gap-1 text-center items-center">
        <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4" />
          <span>HỎI ĐÁP KHÁCH HÀNG</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Câu Hỏi Thường Gặp
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {MOCK_FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="w-full rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-xs transition-all"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#7C6FE8] text-[10px] font-extrabold shrink-0">
                    {item.category}
                  </span>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                    {item.question}
                  </h3>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#7C6FE8]' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden bg-slate-50/70 border-t border-gray-100"
                  >
                    <div className="p-4 sm:p-5 text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
