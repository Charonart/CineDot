'use client';

import React, { useState } from 'react';
import { QrCode, Search, CheckCircle2, XCircle, Ticket, ShieldCheck } from 'lucide-react';

export function AdminTicketScannerView() {
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    code?: string;
    movieTitle?: string;
    showtime?: string;
    seats?: string;
    customerName?: string;
    itemType?: 'TICKET' | 'STAR_SHOP';
    message: string;
  } | null>(null);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    const query = scanInput.trim().toUpperCase();

    if (query.startsWith('CND-') || query.length >= 6) {
      setScanResult({
        success: true,
        code: query,
        movieTitle: 'Dune: Part Two (Hành Tinh Cát 2)',
        showtime: '19:30 • Phòng IMAX 3D Laser 01',
        seats: 'Ghế VIP F12, F13',
        customerName: 'Hoàng Minh Tuấn',
        itemType: 'TICKET',
        message: 'XÁC THỰC VÉ PHIM HỢP LỆ! MỜI KHÁCH VÀO PHÒNG CHIẾU.',
      });
    } else {
      setScanResult({
        success: false,
        message: 'MÃ QR CODE KHÔNG HỢP LỆ HOẶC ĐÃ ĐƯỢC SỬ DỤNG TRƯỚC ĐÓ!',
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1 text-center items-center">
        <span className="px-3.5 py-1.5 rounded-full bg-purple-50 text-[#7C6FE8] text-xs font-extrabold uppercase border border-purple-100 flex items-center gap-1.5">
          <QrCode className="w-4 h-4 text-[#7C6FE8]" />
          <span>KIOSK SOÁT VÉ TẠI CỔNG RẠP</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Cổng Quét Mã QR Code Soát Vé
        </h1>
        <p className="text-xs text-slate-500 font-medium max-w-lg">
          Nhập mã đặt vé hoặc sử dụng máy quét mã QR Code điện tử để kiểm duyệt khách vào phòng chiếu.
        </p>
      </div>

      {/* Scanner Box */}
      <div className="p-8 rounded-3xl bg-white border border-gray-200/80 shadow-md flex flex-col gap-6 items-center">
        {/* Mock Scanner Viewport */}
        <div className="w-64 h-64 rounded-3xl bg-purple-50/50 border-2 border-dashed border-[#7C6FE8] relative flex flex-col items-center justify-center gap-3 overflow-hidden shadow-inner group">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#7C6FE8] to-transparent absolute top-0 animate-pulse" />
          <QrCode className="w-20 h-20 text-[#7C6FE8] opacity-80 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
            SẴN SÀNG QUÉT QR
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleScan} className="w-full max-w-md flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              placeholder="Nhập mã đơn vé (Ví dụ: CND-892401)"
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider shadow-md shrink-0 cursor-pointer"
          >
            QUÉT VÉ
          </button>
        </form>

        {/* Result Container */}
        {scanResult && (
          <div
            className={`w-full p-6 rounded-3xl border flex flex-col gap-4 ${
              scanResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-3">
              {scanResult.success ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
              )}
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-base leading-snug">
                  {scanResult.message}
                </span>
                {scanResult.code && (
                  <span className="text-xs font-mono font-bold text-slate-700">Mã Đơn: {scanResult.code}</span>
                )}
              </div>
            </div>

            {scanResult.success && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-emerald-200 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-emerald-600" />
                  <span>Phim: <strong className="text-slate-900 font-extrabold">{scanResult.movieTitle}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Khách: <strong className="text-slate-900 font-extrabold">{scanResult.customerName}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Suất: <strong className="text-slate-900 font-extrabold">{scanResult.showtime}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Vị trí: <strong className="text-purple-700 font-extrabold">{scanResult.seats}</strong></span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
