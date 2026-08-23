import React from 'react';
import { Smartphone, Globe, Store, PieChart, Sparkles } from 'lucide-react';
import { ChannelStatItem } from '../../types/adminReport.types';
import { motion } from 'framer-motion';

interface QuickStatsProps {
  channels: ChannelStatItem[];
}

export const QuickStats: React.FC<QuickStatsProps> = ({ channels }) => {
  const getChannelIcon = (id: string) => {
    switch (id) {
      case 'APP':
        return Smartphone;
      case 'WEB':
        return Globe;
      default:
        return Store;
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between gap-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-black">
            <PieChart className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-extrabold text-base text-slate-900">Kênh Phân Phối Vé</h3>
            <span className="text-xs text-slate-400 font-medium">Tỷ trọng giao dịch qua các nền tảng</span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-purple-50 text-[#7C6FE8] text-[11px] font-bold border border-purple-100">
          100% Khách
        </span>
      </div>

      {/* Progress Bars for each channel */}
      <div className="flex flex-col gap-4">
        {channels.map((ch) => {
          const IconComp = getChannelIcon(ch.id);
          return (
            <div key={ch.id} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2 text-slate-800">
                  <IconComp className="w-3.5 h-3.5 text-[#7C6FE8]" />
                  <span>{ch.label}</span>
                </span>
                <span className="font-mono text-slate-900 font-black">
                  {ch.percentage}% {ch.tickets > 0 && `(${ch.tickets.toLocaleString('vi-VN')} vé)`}
                </span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ch.percentage}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: ch.color || '#7C6FE8' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom info capsule */}
      <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs text-slate-600 font-medium flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
          <span>Kênh tăng trưởng cao nhất:</span>
        </span>
        <strong className="text-[#7C6FE8] font-black">Mobile App (+24.5%)</strong>
      </div>
    </div>
  );
};
