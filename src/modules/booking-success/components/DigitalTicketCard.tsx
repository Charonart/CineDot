/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · theme: White Minimal · component: DigitalTicketCard */
'use client';

import React from 'react';
import { MapPin, Clock, Ticket, QrCode, Sparkles } from 'lucide-react';
import { DigitalTicketInfo } from '../types/booking-success.types';
import { QRCodeImage } from '@/shared/ui/QRCodeImage';

interface DigitalTicketCardProps {
  ticket: DigitalTicketInfo;
}

export const DigitalTicketCard: React.FC<DigitalTicketCardProps> = ({ ticket }) => {
  return (
    <article
      aria-label={`Vé xem phim điện tử ${ticket.movieTitle}`}
      className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-gray-200/90 flex flex-col overflow-hidden relative select-none transition-colors"
    >
      {/* Top Header Section */}
      <div className="p-6 sm:p-7 bg-gradient-to-br from-gray-950 via-gray-900 to-[#7C6FE8]/60 text-white flex flex-col gap-5 relative overflow-hidden">
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            <span>Vé xem phim điện tử</span>
          </div>

          <span className="font-mono text-xs font-bold text-amber-300 tracking-wider">
            Mã: #{ticket.bookingId}
          </span>
        </div>


        {/* Movie Info Row */}
        <div className="flex gap-4 items-start z-10 pt-1">
          <div className="w-18 aspect-[2/3] rounded-xl overflow-hidden bg-black shrink-0 ring-2 ring-white/20 shadow-md">
            <img
              src={ticket.posterUrl}
              alt={ticket.movieTitle}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-[#7C6FE8] text-white text-[9px] font-black uppercase tracking-wider">
                {ticket.movieFormat}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-400/30">
                Khán giả {ticket.ageRating}
              </span>
            </div>

            <h2 className="font-black text-base sm:text-lg text-white leading-tight">
              {ticket.movieTitle}
            </h2>
          </div>
        </div>
      </div>

      {/* Middle Ticket Details Section */}
      <div className="p-6 sm:p-7 flex flex-col gap-3.5 text-xs text-gray-700 bg-white">
        <div className="flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-lg bg-[#EEECFB] flex items-center justify-center text-[#7C6FE8] shrink-0 mt-0.5">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-gray-950">{ticket.cinemaName}</span>
            <span className="text-gray-500 font-medium">{ticket.roomName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 border-t border-gray-100 pt-3">
          <div className="w-5 h-5 rounded-lg bg-[#EEECFB] flex items-center justify-center text-[#7C6FE8] shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span>Suất chiếu: <strong className="text-gray-950 font-bold">{ticket.showTime}</strong> — {ticket.showDate}</span>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-lg bg-[#EEECFB] flex items-center justify-center text-[#7C6FE8] shrink-0">
              <Ticket className="w-3.5 h-3.5" />
            </div>
            <span>Ghế đã chọn: <strong className="text-[#7C6FE8] text-sm font-black">{ticket.seatLabels}</strong></span>
          </div>
        </div>

        {ticket.combos && ticket.combos.length > 0 && (
          <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-3">
            <span className="font-extrabold text-[11px] text-gray-400 uppercase tracking-wider">Đồ ăn / Thức uống kèm theo:</span>
            {ticket.combos.map((combo, idx) => (
              <div key={idx} className="flex items-center justify-between text-gray-900 font-medium">
                <span>{combo.name}</span>
                <span className="font-black text-[#7C6FE8]">x{combo.quantity}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="font-extrabold text-xs text-gray-500 uppercase tracking-wider">Tổng Thanh Toán</span>
          <span className="font-black text-lg sm:text-xl text-[#7C6FE8]">
            {ticket.totalPaid.toLocaleString('vi-VN')}đ
          </span>
        </div>
      </div>

      {/* Perforated Dashed Punch Line Separator */}
      <div className="relative w-full flex items-center justify-between bg-white">
        <div className="w-4 h-8 rounded-r-full bg-[#FAFAFB] border-r border-t border-b border-gray-200/90 -ml-1" />
        <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-3" />
        <div className="w-4 h-8 rounded-l-full bg-[#FAFAFB] border-l border-t border-b border-gray-200/90 -mr-1" />
      </div>

      {/* Bottom Scannable QR Code Section */}
      <div className="p-6 sm:p-7 bg-gray-50/70 flex flex-col items-center text-center gap-3.5">
        <div className="w-40 h-40 bg-white p-3 rounded-2xl border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center">
          <QRCodeImage
            value={ticket.qrCodeUrl || ticket.bookingId}
            size={150}
            alt={`QR Code ${ticket.bookingId}`}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col gap-0.5 items-center">
          <span className="font-mono font-black text-gray-950 text-xs flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-[#7C6FE8]" />
            <span>MÃ VÉ: {ticket.bookingId}</span>
          </span>
          <p className="text-[11px] text-gray-500 max-w-xs font-medium">
            Xuất trình mã QR này cho nhân viên tại rạp để quét vé vào phòng chiếu.
          </p>
        </div>
      </div>
    </article>
  );
};

