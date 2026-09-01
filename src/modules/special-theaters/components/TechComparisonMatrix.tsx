'use client';

import React from 'react';
import { ComparisonMatrixRow } from '../types/special-theaters.types';
import { Sliders } from 'lucide-react';

interface TechComparisonMatrixProps {
  rows: ComparisonMatrixRow[];
}

export const TechComparisonMatrix: React.FC<TechComparisonMatrixProps> = ({ rows }) => {
  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col gap-6 mt-16">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-4 h-4" />
          <span>BẢNG SO SÁNH TRỰC QUAN</span>
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          So Sánh Tính Năng 6 Định Dạng Phòng Chiếu Hiện Đại
        </h3>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[840px]">
          <thead>
            <tr className="border-b border-gray-200 text-xs font-extrabold text-slate-900 uppercase tracking-wider bg-slate-50">
              <th className="p-3.5 rounded-l-2xl">Tính Năng / Đặc Quyền</th>
              <th className="p-3.5 text-amber-600">IMAX Laser</th>
              <th className="p-3.5 text-[#7C6FE8]">ScreenX 270°</th>
              <th className="p-3.5 text-purple-600">Dolby Cinema</th>
              <th className="p-3.5 text-cyan-600">Samsung Onyx</th>
              <th className="p-3.5 text-emerald-600">Gold Class</th>
              <th className="p-3.5 rounded-r-2xl text-blue-600">Digital 3D</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-semibold text-slate-700">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-purple-50/40 transition-colors">
                <td className="p-3.5 font-extrabold text-slate-900">{row.featureName}</td>
                <td className="p-3.5 font-bold text-amber-900">{row.imax}</td>
                <td className="p-3.5 font-bold text-[#7C6FE8]">{row.screenx}</td>
                <td className="p-3.5 font-bold text-purple-900">{row.dolbyCinema}</td>
                <td className="p-3.5 font-bold text-cyan-800">{row.onyxLed}</td>
                <td className="p-3.5 font-bold text-emerald-700">{row.goldClass}</td>
                <td className="p-3.5 text-slate-600">{row.standard3d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
