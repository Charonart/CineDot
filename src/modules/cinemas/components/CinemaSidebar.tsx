'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  ChevronDown,
  Check,
  Search,
  Film,
  Sparkles,
  Building2,
  X,
} from 'lucide-react';
import { CinemaItem } from '../types/cinemas.types';

interface CinemaSidebarProps {
  cities: string[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  cinemas: CinemaItem[];
  selectedCinema: CinemaItem | null;
  onSelectCinema: (cinema: CinemaItem) => void;
}

export const CinemaSidebar: React.FC<CinemaSidebarProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  cinemas,
  selectedCinema,
  onSelectCinema,
}) => {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCinemas = useMemo(() => {
    if (!searchQuery.trim()) return cinemas;
    const q = searchQuery.toLowerCase().trim();
    return cinemas.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
    );
  }, [cinemas, searchQuery]);

  // Extract unique tech tags from rooms if available
  const getCinemaTechTags = (cinema: CinemaItem): string[] => {
    if (!cinema.rooms || cinema.rooms.length === 0) return ['2D Digital', 'Laser'];
    const tags = new Set<string>();
    cinema.rooms.forEach((r) => {
      const type = (r.roomType || '').toUpperCase();
      if (type.includes('IMAX')) tags.add('IMAX');
      else if (type.includes('SCREENX')) tags.add('ScreenX');
      else if (type.includes('DOLBY')) tags.add('Dolby Atmos');
      else if (type.includes('ONYX')) tags.add('Onyx LED');
      else if (type.includes('GOLD') || type.includes('VIP')) tags.add('Gold Class');
    });
    if (tags.size === 0) tags.add('Laser 4K');
    return Array.from(tags).slice(0, 3);
  };

  return (
    <aside className="w-full flex flex-col gap-5 lg:sticky lg:top-28">
      {/* 1. Header Card with City Selector & Search */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-4">
        {/* City Selector */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#7C6FE8]" />
            <span>Khu vực / Thành phố</span>
          </label>

          <button
            type="button"
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-900 font-bold text-xs flex items-center justify-between transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7C6FE8]/20 focus:border-[#7C6FE8]"
          >
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
              <span className="truncate">{selectedCity}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                isCityDropdownOpen ? 'rotate-180 text-[#7C6FE8]' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {isCityDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-40 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200"
              >
                {cities.map((city) => {
                  const isSelected = selectedCity === city;
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        onSelectCity(city);
                        setIsCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#EEECFB] text-[#7C6FE8]'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{city}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#7C6FE8]" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm cụm rạp, quận huyện..."
            className="w-full pl-9.5 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#7C6FE8] focus:ring-2 focus:ring-[#7C6FE8]/20 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Cinema List Deck */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Cụm Rạp Khả Dụng ({filteredCinemas.length})
          </span>
          {selectedCity !== 'Tất cả thành phố' && (
            <span className="text-[10px] font-semibold text-[#7C6FE8] bg-[#EEECFB] px-2 py-0.5 rounded-full">
              {selectedCity}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 max-h-[calc(100vh-380px)] overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-slate-200">
          {filteredCinemas.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-dashed border-slate-200 text-center flex flex-col items-center justify-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <Film className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-700">
                Không tìm thấy cụm rạp phù hợp
              </p>
              <p className="text-[11px] text-slate-400">
                Thử tìm theo từ khóa khác hoặc chọn "Tất cả thành phố"
              </p>
            </div>
          ) : (
            filteredCinemas.map((cinema) => {
              const isSelected = selectedCinema?.id === cinema.id;
              const techTags = getCinemaTechTags(cinema);

              return (
                <button
                  key={cinema.id}
                  type="button"
                  onClick={() => onSelectCinema(cinema)}
                  className={`w-full p-4.5 rounded-2xl text-left transition-all cursor-pointer flex flex-col gap-2.5 group relative ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/15 ring-2 ring-[#7C6FE8]'
                      : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200/90 shadow-2xs hover:border-[#7C6FE8]/50 hover:shadow-sm'
                  }`}
                >
                  {/* Row 1: Name & Status Beacon */}
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      className={`font-extrabold text-xs sm:text-sm leading-snug line-clamp-1 transition-colors ${
                        isSelected ? 'text-white' : 'text-slate-900 group-hover:text-[#7C6FE8]'
                      }`}
                    >
                      {cinema.name}
                    </h4>

                    <div
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        isSelected
                          ? 'bg-white/15 text-emerald-300'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                      }`}
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                      </span>
                      <span>Mở cửa</span>
                    </div>
                  </div>

                  {/* Row 2: Address */}
                  <p
                    className={`text-[11px] font-medium leading-relaxed line-clamp-2 ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {cinema.address}
                  </p>

                  {/* Row 3: Meta & Technology Chips */}
                  <div
                    className={`flex items-center justify-between pt-2 border-t text-[10px] font-bold ${
                      isSelected ? 'border-white/10' : 'border-slate-100'
                    }`}
                  >
                    <span
                      className={`flex items-center gap-1 font-bold ${
                        isSelected ? 'text-[#D8D4F7]' : 'text-[#7C6FE8]'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      {cinema.rooms?.length || 4} phòng chiếu
                    </span>

                    <div className="flex items-center gap-1 flex-wrap justify-end">
                      {techTags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold tracking-wide uppercase ${
                            isSelected
                              ? 'bg-white/10 text-slate-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
};
