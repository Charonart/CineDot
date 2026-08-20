'use client';

import React, { useState } from 'react';
import { Ticket, Search, CheckCircle2, Clock, Eye, Printer, X } from 'lucide-react';
import { MOCK_RECENT_TRANSACTIONS } from '../mocks/mockAdminData';
import { AdminRecentTransaction } from '../types/admin.types';

export function AdminTicketsView() {
  const [transactions, setTransactions] = useState<AdminRecentTransaction[]>(MOCK_RECENT_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedTx, setSelectedTx] = useState<AdminRecentTransaction | null>(null);

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.movieTitle.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'ALL') return matchSearch;
    return matchSearch && t.status === filterStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-black shadow-xs">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Danh Sách Đơn Vé Đã Thanh Toán
            </h1>
          </div>
        </div>
      </div>

      {/* 4 Order Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-500">Tổng Số Đơn Hàng</span>
          <span className="text-2xl font-black text-slate-900 font-mono">1,240 Đơn</span>
          <span className="text-xs text-emerald-600 font-bold">100% Giao dịch trực tuyến</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-500">Doanh Thu Vé Trong Ngày</span>
          <span className="text-2xl font-black text-emerald-600 font-mono">84.500.000 đ</span>
          <span className="text-xs text-slate-500 font-medium">Cập nhật thời gian thực</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-500">Vé Đã Soát Tại Cổng</span>
          <span className="text-2xl font-black text-slate-900 font-mono">890 Vé</span>
          <span className="text-xs text-purple-600 font-bold">Tỷ lệ check-in 71.7%</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-500">Đơn Đã Hủy / Hoàn</span>
          <span className="text-2xl font-black text-rose-600 font-mono">2 Đơn</span>
          <span className="text-xs text-slate-500 font-medium">Theo chính sách 24h</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo Mã đơn, Khách hàng hoặc Phim..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'SUCCESS', 'CHECKED_IN'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#7C6FE8] text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 border border-gray-200 hover:bg-slate-100'
              }`}
            >
              {st === 'ALL' ? 'Tất Cả' : st === 'SUCCESS' ? 'Đã Thanh Toán' : 'Đã Soát Vé'}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col gap-4">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="p-3.5 rounded-l-xl">Mã Đơn / Khách Hàng</th>
                <th className="p-3.5">Phim & Cụm Rạp</th>
                <th className="p-3.5">Suất Chiếu</th>
                <th className="p-3.5">Số Vé</th>
                <th className="p-3.5">Tổng Tiền</th>
                <th className="p-3.5">Thanh Toán</th>
                <th className="p-3.5">Trạng Thái</th>
                <th className="p-3.5 rounded-r-xl text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-slate-700">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-purple-50/40 transition-colors">
                  <td className="p-3.5">
                    <div className="flex flex-col">
                      <span className="font-mono font-extrabold text-[#7C6FE8]">{tx.bookingCode}</span>
                      <span className="text-[11px] text-slate-900 font-bold">{tx.customerName}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 line-clamp-1">{tx.movieTitle}</span>
                      <span className="text-[10px] text-slate-500">{tx.cinemaName}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-600">{tx.showtime}</td>
                  <td className="p-3.5 font-bold text-slate-900">{tx.seatCount} vé</td>
                  <td className="p-3.5 font-mono font-extrabold text-emerald-600">
                    {tx.totalAmount.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="p-3.5">{tx.paymentMethod}</td>
                  <td className="p-3.5">
                    {tx.status === 'CHECKED_IN' ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>ĐÃ SOÁT VÉ</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-purple-50 text-[#7C6FE8] text-[10px] font-extrabold border border-purple-200 flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3 text-[#7C6FE8]" />
                        <span>THANH TOÁN</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="p-2 rounded-full hover:bg-purple-100 text-[#7C6FE8] transition-colors cursor-pointer"
                      title="Xem Chi Tiết / In Vé"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Chi Tiết Đơn Vé */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#7C6FE8]" />
                <h3 className="text-lg font-extrabold text-slate-900">Chi Tiết Đơn Vé #{selectedTx.bookingCode}</h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs text-slate-700 font-medium bg-slate-50 p-4 rounded-2xl border border-gray-200">
              <div className="flex justify-between">
                <span>Khách hàng:</span>
                <strong className="text-slate-900 font-extrabold">{selectedTx.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Tác phẩm:</span>
                <strong className="text-slate-900 font-extrabold">{selectedTx.movieTitle}</strong>
              </div>
              <div className="flex justify-between">
                <span>Cụm rạp:</span>
                <strong className="text-slate-900 font-extrabold">{selectedTx.cinemaName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Suất chiếu:</span>
                <strong className="text-slate-900 font-extrabold">{selectedTx.showtime}</strong>
              </div>
              <div className="flex justify-between">
                <span>Thanh toán:</span>
                <strong className="text-[#7C6FE8] font-extrabold">{selectedTx.paymentMethod}</strong>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-extrabold text-slate-900">
                <span>Tổng tiền:</span>
                <span className="text-emerald-600 font-mono">{selectedTx.totalAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs"
              >
                Đóng
              </button>
              <button
                onClick={() => alert(`Đang gửi lệnh in vé điện tử ${selectedTx.bookingCode} tới máy in nhiệt...`)}
                className="px-6 py-2.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>IN VÉ ĐIỆN TỬ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
