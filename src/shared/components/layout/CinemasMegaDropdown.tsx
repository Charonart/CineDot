'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { masterDataService, ProvinceItem } from '@/shared/services/masterData.service';
import { Skeleton } from '@/shared/ui/Skeleton';

interface CinemasMegaDropdownProps {
  onClose?: () => void;
}

export const CinemasMegaDropdown: React.FC<CinemasMegaDropdownProps> = ({ onClose }) => {
  const router = useRouter();
  const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[240px] max-h-[340px] overflow-y-auto scrollbar-none bg-white/98 backdrop-blur-2xl rounded-2xl p-2 shadow-[0_16px_40px_rgba(0,0,0,0.15)] border border-gray-200/80 z-[110] text-slate-800 selection:bg-[#7C6FE8] selection:text-white flex flex-col gap-1"
    >
      <div className="px-3 py-2 border-b border-gray-100 mb-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-[#7C6FE8]" />
          <span>Chọn Tỉnh / Thành phố</span>
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="text" className="w-full h-7 rounded-lg" />
            ))}
          </div>
        ) : (
          provinces.map((prov) => {
            const cityName = prov.province_name;
            return (
              <button
                key={prov.province_id || cityName}
                onClick={() => handleSelectCity(cityName)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-extrabold text-slate-700 hover:bg-[#7C6FE8]/10 hover:text-[#7C6FE8] transition-all flex items-center justify-between cursor-pointer"
              >
                <span>{cityName}</span>
              </button>
            );
          })
        )}
      </div>
    </motion.div>
  );
};
