'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown, CheckCircle2 } from 'lucide-react';
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

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. Location Dropdown Selector */}
      <div className="flex flex-col gap-2 relative">
        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#7C6FE8]" />
          <span>Khu vực / Thành phố</span>
        </label>

        <button
          onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
          className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-800 font-bold text-xs flex items-center justify-between shadow-xs transition-colors cursor-pointer"
        >
          <span>{selectedCity}</span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
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
              className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-30 overflow-hidden max-h-[300px] overflow-y-auto scrollbar-none"
            >
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    onSelectCity(city);
                    setIsCityDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCity === city
                      ? 'bg-[#7C6FE8]/10 text-[#7C6FE8]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{city}</span>
                  {selectedCity === city && <CheckCircle2 className="w-3.5 h-3.5 text-[#7C6FE8]" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Cinema List */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Danh sách rạp ({cinemas.length})
        </span>

        <div className="flex flex-col gap-2.5">
          {cinemas.map((cinema) => {
            const isSelected = selectedCinema?.id === cinema.id;

            return (
              <button
                key={cinema.id}
                onClick={() => onSelectCinema(cinema)}
                className={`w-full p-4 rounded-2xl text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-[#7C6FE8] text-white shadow-lg shadow-[#7C6FE8]/30 scale-[1.01]'
                    : 'bg-white hover:bg-[#7C6FE8]/5 text-slate-800 border border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-extrabold text-xs sm:text-sm line-clamp-1">
                    {cinema.name}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    }`}
                  >
                    🟢 Đang mở cửa
                  </span>
                </div>

                <p
                  className={`text-[11px] font-medium leading-relaxed line-clamp-2 ${
                    isSelected ? 'text-purple-100' : 'text-slate-500'
                  }`}
                >
                  {cinema.address}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
