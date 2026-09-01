'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { SpecialTheaterSpec, TheaterFormat, ComparisonMatrixRow } from '../types/special-theaters.types';
import { fetchSpecialTheaters, fetchComparisonMatrix } from '../services/special-theaters.service';
import { SpecialTheatersHero } from './SpecialTheatersHero';
import { SpecialTheaterCard } from './SpecialTheaterCard';
import { TechComparisonMatrix } from './TechComparisonMatrix';
import { Skeleton } from '@/shared/ui/Skeleton';

const FORMAT_TABS: { id: TheaterFormat; label: string }[] = [
  { id: 'ALL', label: 'Tất Cả Định Dạng' },
  { id: 'IMAX', label: 'IMAX Laser 3D' },
  { id: 'SCREENX', label: 'ScreenX 270°' },
  { id: 'DOLBY_CINEMA', label: 'Dolby Cinema' },
  { id: 'ONYX_LED', label: 'Samsung Onyx LED' },
  { id: 'GOLD_CLASS', label: 'Gold Class VIP' },
  { id: 'STANDARD_3D', label: 'Digital 3D Atmos' },
];

export function SpecialTheatersClientPage() {
  const [activeFormat, setActiveFormat] = useState<TheaterFormat>('ALL');
  const [theaters, setTheaters] = useState<SpecialTheaterSpec[]>([]);
  const [matrixRows, setMatrixRows] = useState<ComparisonMatrixRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [list, matrix] = await Promise.all([
          fetchSpecialTheaters('ALL'),
          fetchComparisonMatrix(),
        ]);
        setTheaters(list);
        setMatrixRows(matrix);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredTheaters = useMemo(() => {
    if (activeFormat === 'ALL') return theaters;
    return theaters.filter((th) => th.format === activeFormat);
  }, [theaters, activeFormat]);

  return (
    <div className="w-full flex flex-col font-sans bg-[#FEFEFE] text-[#131413] min-h-screen pt-28 pb-20 selection:bg-[#7C6FE8] selection:text-white">
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
          {/* Header Title */}
          <div className="flex flex-col gap-2 mb-8">
            <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#7C6FE8] rounded-full inline-block" />
              <span>Định Dạng Phòng Chiếu Đặc Biệt</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Công Nghệ Chiếu Đỉnh Cao
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl">
              Khám phá hệ thống rạp xem phim tiêu chuẩn quốc tế đỉnh cao tại CineDot.
            </p>
          </div>

          {/* 1. Hero Showcase Section */}
          <SpecialTheatersHero />

          {/* 2. Format Filter Tabs */}
          <div className="w-full flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
            {FORMAT_TABS.map((tab) => {
              const isActive = activeFormat === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFormat(tab.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/30 scale-105'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 3. Interactive Special Theater Cards */}
          {loading ? (
            <div className="flex flex-col gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="card" className="h-80 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredTheaters.map((spec) => (
                <SpecialTheaterCard key={spec.id} spec={spec} />
              ))}
            </div>
          )}

          {/* 4. Tech Comparison Matrix Table */}
          {!loading && matrixRows.length > 0 && <TechComparisonMatrix rows={matrixRows} />}
        </div>
      </main>
    </div>
  );
}
