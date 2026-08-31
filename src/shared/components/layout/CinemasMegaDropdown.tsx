'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Search, ChevronRight, Building2, Sparkles, Navigation } from 'lucide-react';
import { masterDataService, ProvinceItem } from '@/shared/services/masterData.service';
import { Skeleton } from '@/shared/ui/Skeleton';

interface CinemasMegaDropdownProps {
  onClose?: () => void;
}

export const CinemasMegaDropdown: React.FC<CinemasMegaDropdownProps> = ({ onClose }) => {
  const router = useRouter();
  const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadProvinces() {
      try {
        const list = await masterDataService.getProvinces();
        if (isMounted) {
          setProvinces(list);
        }
      } catch (e) {
        console.error('Failed to load provinces in dropdown', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadProvinces();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectCity = (city: string) => {
    if (onClose) onClose();
    router.push(`/cinemas?city=${encodeURIComponent(city)}`);
  };

  const filteredProvinces = useMemo(() => {
    if (!searchQuery.trim()) return provinces;
    const q = searchQuery.toLowerCase().trim();
    return provinces.filter((p) => p.province_name.toLowerCase().includes(q));
  }, [provinces, searchQuery]);

  const topCities = ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[340px] bg-white/95 backdrop-blur-2xl rounded-3xl p-3.5 shadow-[0_24px_60px_-12px_rgba(15,23,42,0.18),0_0_0_1px_rgba(229,231,235,0.8)] border border-white/60 z-[110] text-slate-900 selection:bg-[#7C6FE8] selection:text-white flex flex-col gap-2.5"
    >
      {/* Header with Search Input */}
      <div className="flex flex-col gap-2 px-1 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#7C6FE8]" />
            <span>Chọn Khu Vực Rạp</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#7C6FE8]">
            {provinces.length} Tỉnh thành
          </span>
        </div>

        {/* Quick Filter Search Input */}
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tỉnh/thành phố..."
            className="w-full pl-8 pr-3 py-2 bg-gray-100/80 hover:bg-gray-100 focus:bg-white text-xs font-semibold text-slate-800 placeholder:text-gray-400 rounded-xl border border-transparent focus:border-[#7C6FE8]/40 focus:ring-2 focus:ring-[#7C6FE8]/10 outline-none transition-all"
          />
        </div>

        {/* Top Cities Fast Quick Chips */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {topCities.map((city) => (
              <button
                key={city}
                onClick={() => handleSelectCity(city)}
                className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-gray-100 hover:bg-[#7C6FE8] hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full h-px bg-gray-100 my-0.5" />

      {/* Provinces Scroll List */}
      <div className="max-h-[220px] overflow-y-auto pr-1 flex flex-col gap-1 scrollbar-thin scrollbar-thumb-gray-200">
        {isLoading ? (
          <div className="flex flex-col gap-1.5 p-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="text" className="w-full h-8 rounded-xl" />
            ))}
          </div>
        ) : filteredProvinces.length === 0 ? (
          <div className="py-6 text-center text-xs text-gray-400 font-medium">
            Không tìm thấy tỉnh thành phù hợp
          </div>
        ) : (
          filteredProvinces.map((prov) => {
            const cityName = prov.province_name;
            return (
              <button
                key={prov.province_id || cityName}
                onClick={() => handleSelectCity(cityName)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-purple-50/80 hover:text-[#7C6FE8] transition-all flex items-center justify-between group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#7C6FE8] transition-colors" />
                  <span>{cityName}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#7C6FE8] group-hover:translate-x-0.5 transition-all" />
              </button>
            );
          })
        )}
      </div>

      {/* Footer link to all cinemas map */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between px-1">
        <Link
          href="/cinemas"
          onClick={onClose}
          className="text-xs font-extrabold text-[#7C6FE8] hover:text-[#685bc7] transition-colors inline-flex items-center gap-1"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Xem bản đồ tất cả rạp</span>
        </Link>
        <Link
          href="/special-theaters"
          onClick={onClose}
          className="text-[11px] font-bold text-gray-500 hover:text-slate-800 transition-colors"
        >
          Rạp IMAX →
        </Link>
      </div>
    </motion.div>
  );
};
