'use client';

import React, { useState, useMemo } from 'react';
import {
  History,
  RefreshCw,
  Search,
  Copy,
  Check,
  Film,
  Coffee,
  Ticket,
  Eye,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { RecentScanItem } from '../../types/adminTicketScanner.types';

interface TicketScannerHistoryTableProps {
  recentScans: RecentScanItem[];
  isLoadingRecent: boolean;
  onRefresh: () => void;
  onSelectScan: (bookingCode: string) => void;
}

export function TicketScannerHistoryTable({
  recentScans,
  isLoadingRecent,
  onRefresh,
  onSelectScan,
}: TicketScannerHistoryTableProps) {
  const [filterQuery, setFilterQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'combos'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Filter scans
  const filteredScans = useMemo(() => {
    return recentScans.filter((item) => {
      if (filterTab === 'combos' && item.combosCount === 0) return false;
      if (!filterQuery.trim()) return true;

      const q = filterQuery.toLowerCase().trim();
      return (
        item.bookingCode.toLowerCase().includes(q) ||
        item.movieTitle.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.cinemaName.toLowerCase().includes(q) ||
        item.roomName.toLowerCase().includes(q) ||
        item.seats.toLowerCase().includes(q)
      );
    });
  }, [recentScans, filterQuery, filterTab]);

  const handleCopyCode = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="p-4 sm:p-5 bg-white border-t border-gray-200 flex flex-col gap-3 font-sans select-none">
      {/* 1. Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-bold">
            <History className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-bold text-xs sm:text-sm text-slate-900">
            Lịch Sử Soát Vé & Nhật Ký Ca Làm Việc
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[#7C6FE8] text-[11px] font-bold">
            {recentScans.length} vé
          </span>
        </div>

        {/* Search & Filter Pill Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Tabs */}
          <div className="flex items-center rounded-md border border-gray-200 bg-slate-50 p-0.5 text-xs shadow-2xs">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                filterTab === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterTab('combos')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                filterTab === 'combos'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Coffee className="w-3 h-3 text-pink-500" />
              <span>Có Bắp Nước</span>
            </button>
          </div>

          {/* Search Filter Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Lọc mã vé, khách, phim..."
              className="pl-7 pr-3 py-1 text-xs bg-slate-50 border border-gray-200 rounded-md focus:outline-none focus:border-[#7C6FE8] focus:bg-white text-slate-800 w-40 sm:w-48 shadow-2xs"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoadingRecent}
            className="p-1 rounded-md border border-gray-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-[#7C6FE8] transition-colors cursor-pointer disabled:opacity-50"
            title="Làm mới lịch sử"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRecent ? 'animate-spin text-[#7C6FE8]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Audit Table */}
      {filteredScans.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 font-medium flex flex-col items-center justify-center gap-1">
          <Ticket className="w-6 h-6 text-slate-300" />
          <span>
            {filterQuery || filterTab !== 'all'
              ? 'Không tìm thấy vé phù hợp với bộ lọc tìm kiếm.'
              : 'Chưa có lượt soát vé nào được ghi nhận trong phiên làm việc này.'}
          </span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-gray-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Mã Đơn Vé</th>
                <th className="py-2.5 px-3">Bộ Phim</th>
                <th className="py-2.5 px-3">Phòng & Rạp</th>
                <th className="py-2.5 px-3">Vị Trí Ghế</th>
                <th className="py-2.5 px-3">Khách Hàng</th>
                <th className="py-2.5 px-3">Bắp Nước</th>
                <th className="py-2.5 px-3">Giờ Soát</th>
                <th className="py-2.5 px-3 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredScans.map((scan) => (
                <tr
                  key={scan.bookingId}
                  onClick={() => onSelectScan(scan.bookingCode)}
                  className="hover:bg-purple-50/40 transition-colors cursor-pointer group"
                >
                  {/* Booking Code with Quick Copy */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-bold text-slate-900 group-hover:text-[#7C6FE8] transition-colors">
                        {scan.bookingCode}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyCode(e, scan.bookingCode)}
                        className="p-0.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Sao chép mã vé"
                      >
                        {copiedCode === scan.bookingCode ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Movie Title */}
                  <td className="py-2 px-3 font-semibold text-slate-800 max-w-[180px] truncate">
                    <div className="flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{scan.movieTitle}</span>
                    </div>
                  </td>

                  {/* Room & Cinema */}
                  <td className="py-2 px-3 text-slate-600 font-medium">
                    <span>
                      {scan.roomName} • <span className="text-slate-400 text-[11px]">{scan.cinemaName}</span>
                    </span>
                  </td>

                  {/* Seats Badge */}
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-[#7C6FE8] font-mono font-bold text-[11px] border border-purple-100">
                      {scan.seats}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="py-2 px-3 text-slate-700 font-medium max-w-[130px] truncate">
                    {scan.customerName}
                  </td>

                  {/* Combos Indicator */}
                  <td className="py-2 px-3">
                    {scan.combosCount > 0 ? (
                      <span className="px-1.5 py-0.5 rounded bg-pink-50 text-pink-700 font-bold text-[10px] flex items-center gap-1 w-fit border border-pink-100">
                        <Coffee className="w-3 h-3" />
                        <span>{scan.combosCount} combo</span>
                      </span>
                    ) : (
                      <span className="text-slate-300 text-[11px]">—</span>
                    )}
                  </td>

                  {/* Checked in timestamp */}
                  <td className="py-2 px-3 font-mono text-slate-500 text-[11px]">
                    {scan.checkedInAtFormatted}
                  </td>

                  {/* Re-inspect action */}
                  <td className="py-2 px-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectScan(scan.bookingCode);
                      }}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-[#7C6FE8] hover:text-white text-slate-600 text-[11px] font-semibold flex items-center gap-1 ml-auto transition-colors"
                      title="Xem lại vé này"
                    >
                      <Eye className="w-3 h-3" />
                      <span className="hidden sm:inline">Xem vé</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
