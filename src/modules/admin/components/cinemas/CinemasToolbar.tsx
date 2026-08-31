'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Plus,
  MapPin,
  ChevronDown,
  Check,
  Search,
  X,
  Sparkles,
} from 'lucide-react';
import { AdminCinemaItem, ProvinceOption } from '../../types/adminCinema.types';

interface CinemasToolbarProps {
  cinemasList: AdminCinemaItem[];
  filteredCinemas: AdminCinemaItem[];
  currentCinema: AdminCinemaItem | null;
  provinces: ProvinceOption[];
  selectedProvinceId: number | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onProvinceChange: (provinceId: number | null) => void;
  onSelectCinema: (cinemaId: number) => void;
  onOpenAddCinema: () => void;
  onOpenSeatTypesStudio: () => void;
  isLoadingCinemas?: boolean;
}

export const CinemasToolbar: React.FC<CinemasToolbarProps> = ({
  cinemasList,
  filteredCinemas,
  currentCinema,
  provinces,
  selectedProvinceId,
  searchQuery,
  onSearchChange,
  onProvinceChange,
  onSelectCinema,
  onOpenAddCinema,
  onOpenSeatTypesStudio,
  isLoadingCinemas = false,
}) => {
  const [isCinemaDropdownOpen, setIsCinemaDropdownOpen] = useState(false);
  const cinemaDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cinemaDropdownRef.current && !cinemaDropdownRef.current.contains(event.target as Node)) {
        setIsCinemaDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-xl border border-gray-200/90 shadow-2xs">
      {/* Left: Brand & Selector */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-semibold shrink-0">
          <Building2 className="w-4 h-4" />
        </div>

        {/* Custom Cinema Combobox */}
        <div ref={cinemaDropdownRef} className="relative flex-1 max-w-sm">
          <button
            type="button"
            onClick={() => setIsCinemaDropdownOpen(!isCinemaDropdownOpen)}
            className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg border text-left text-xs font-semibold transition-colors cursor-pointer ${
              isCinemaDropdownOpen
                ? 'border-[#7C6FE8] bg-purple-50/50 text-[#7C6FE8]'
                : 'bg-slate-50/70 border-gray-200 text-slate-800 hover:bg-slate-100 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="truncate">
                {isLoadingCinemas
                  ? 'Đang tải cụm rạp…'
                  : currentCinema
                  ? currentCinema.name
                  : 'Chọn cụm rạp'}
              </span>
              {currentCinema && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200/70 text-slate-600 font-normal shrink-0">
                  {currentCinema.city}
                </span>
              )}
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-150 ${
                isCinemaDropdownOpen ? 'rotate-180 text-[#7C6FE8]' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {isCinemaDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.12 }}
                className="absolute left-0 top-full mt-1.5 w-80 bg-white border border-gray-200 rounded-xl p-1 shadow-lg z-50 flex flex-col max-h-72 overflow-y-auto"
              >
                {filteredCinemas.length === 0 ? (
                  <div className="px-3 py-4 text-center text-xs text-slate-400">
                    Không tìm thấy cụm rạp nào.
                  </div>
                ) : (
                  filteredCinemas.map((c) => {
                    const isSelected = c.id === currentCinema?.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          onSelectCinema(c.id);
                          setIsCinemaDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C6FE8]/10 text-[#7C6FE8] font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="truncate">{c.name}</span>
                          <span className="text-[11px] text-slate-400">
                            {c.city} • {c.rooms.length} phòng
                          </span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0 ml-2" />}
                      </button>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Province Filter */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-slate-50/70 text-xs text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedProvinceId !== null ? String(selectedProvinceId) : ''}
            onChange={(e) => {
              const val = e.target.value;
              onProvinceChange(val ? Number(val) : null);
            }}
            className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer pr-1"
          >
            <option value="">Tất cả tỉnh / thành</option>
            {provinces.map((p) => (
              <option key={p.id} value={String(p.id)}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Search & Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative flex items-center bg-slate-50/70 hover:bg-white focus-within:bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs w-48 sm:w-56 focus-within:border-[#7C6FE8] transition-colors">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm rạp, phòng..."
            className="w-full pl-2 bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none font-medium text-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Seat Types Button */}
        <button
          type="button"
          onClick={onOpenSeatTypesStudio}
          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 border border-gray-200 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#7C6FE8]" />
          <span>Loại ghế</span>
        </button>

        {/* Add Cinema */}
        <button
          type="button"
          onClick={onOpenAddCinema}
          className="px-3.5 py-1.5 rounded-lg bg-[#7C6FE8] hover:bg-[#6b5ed6] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm rạp</span>
        </button>
      </div>
    </div>
  );
};
