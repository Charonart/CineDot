'use client';

import React, { useState, useMemo } from 'react';
import { Search, MapPin, Film, X } from 'lucide-react';
import { CinemaItem } from '../types/cinemas.types';

interface CinemaBranchSwitcherProps {
  cities: string[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  cinemas: CinemaItem[];
  selectedCinema: CinemaItem | null;
  onSelectCinema: (cinema: CinemaItem) => void;
}

export const CinemaBranchSwitcher: React.FC<CinemaBranchSwitcherProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  cinemas,
  selectedCinema,
  onSelectCinema,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCinemas = useMemo(() => {
    let list = cinemas;
    if (selectedCity && selectedCity !== 'Tất cả thành phố') {
      list = list.filter((c) =>
        c.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
        selectedCity.toLowerCase().includes(c.city.toLowerCase())
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q)
      );
    }
    return list;
  }, [cinemas, selectedCity, searchQuery]);

  const getCinemaTechTags = (cinema: CinemaItem): string[] => {
    if (!cinema.rooms || cinema.rooms.length === 0) return ['2D Digital', 'Laser 4K'];
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
    <div className="w-full flex flex-col gap-4">
      {/* City Filters & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {cities.map((city) => {
            const isActive = selectedCity === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => onSelectCity(city)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên rạp, địa chỉ..."
            className="w-full pl-9 pr-8 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#7C6FE8] focus:ring-2 focus:ring-[#7C6FE8]/20 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Cinema Cards Strip */}
      <div className="flex items-stretch gap-3.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
        {filteredCinemas.length === 0 ? (
          <div className="w-full py-8 px-4 rounded-2xl bg-white border border-dashed border-slate-200 text-center flex flex-col items-center justify-center gap-1.5">
            <Film className="w-5 h-5 text-slate-400" />
            <p className="text-xs font-bold text-slate-700">
              Không tìm thấy cụm rạp phù hợp
            </p>
            <p className="text-[11px] text-slate-400">
              Vui lòng chọn khu vực khác hoặc tìm kiếm lại từ khóa
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
                className={`w-[270px] sm:w-[300px] shrink-0 p-3.5 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between gap-3 group relative ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-lg ring-2 ring-[#7C6FE8]'
                    : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200/90 shadow-2xs hover:border-[#7C6FE8]/40 hover:shadow-xs'
                }`}
              >
                {/* Top Row: Thumbnail + Title & Status */}
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                    <img
                      src={cinema.bannerUrl}
                      alt={cinema.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-1.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide truncate ${
                          isSelected ? 'text-[#D8D4F7]' : 'text-[#7C6FE8]'
                        }`}
                      >
                        {cinema.city}
                      </span>
                      <span
                        className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                          isSelected ? 'bg-emerald-400' : 'bg-emerald-500'
                        }`}
                      />
                    </div>
                    <h4
                      className={`font-extrabold text-xs sm:text-sm leading-snug line-clamp-1 transition-colors ${
                        isSelected ? 'text-white' : 'text-slate-900 group-hover:text-[#7C6FE8]'
                      }`}
                    >
                      {cinema.name}
                    </h4>
                    <p
                      className={`text-[11px] font-medium truncate ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {cinema.address}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Tech Tags & Room Count */}
                <div
                  className={`pt-2 border-t flex items-center justify-between text-[10px] font-bold ${
                    isSelected ? 'border-white/10' : 'border-slate-100'
                  }`}
                >
                  <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>
                    {cinema.rooms?.length || 4} phòng chiếu
                  </span>

                  <div className="flex items-center gap-1">
                    {techTags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-wide uppercase ${
                          isSelected
                            ? 'bg-white/15 text-slate-200'
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
  );
};
