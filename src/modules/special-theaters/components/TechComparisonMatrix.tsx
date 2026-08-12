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
          So Sánh Tính Năng Các Định Dạng Phòng Chiếu
        </h3>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-200 text-xs font-extrabold text-slate-900 uppercase tracking-wider bg-slate-50">
              <th className="p-4 rounded-l-2xl">Tính Năng / Đặc Quyền</th>
              <th className="p-4 text-[#7C6FE8]">IMAX 3D Laser</th>
              <th className="p-4 text-purple-600">4DX Motion</th>
              <th className="p-4 text-emerald-600">Gold Class VIP</th>
              <th className="p-4 rounded-r-2xl text-indigo-600">Dolby Atmos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-semibold text-slate-700">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-purple-50/40 transition-colors">
                <td className="p-4 font-extrabold text-slate-900">{row.featureName}</td>
                <td className="p-4 font-bold text-slate-800">{row.imax}</td>
                <td className="p-4">{row.fourDx}</td>
                <td className="p-4 font-bold text-emerald-700">{row.goldClass}</td>
                <td className="p-4">{row.dolbyAtmos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
