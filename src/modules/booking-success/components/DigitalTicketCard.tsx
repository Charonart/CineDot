/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · genre: modern-minimal · theme: White Minimal · component: DigitalTicketCard */
'use client';

import React from 'react';
import { MapPin, Clock, Ticket, QrCode, Copy, Check, ShieldCheck, Popcorn, Sparkles } from 'lucide-react';
import { DigitalTicketInfo } from '../types/booking-success.types';
import { QRCodeImage } from '@/shared/ui/QRCodeImage';
import { motion } from 'framer-motion';

interface DigitalTicketCardProps {
  ticket: DigitalTicketInfo;
  isCopied?: boolean;
  onCopyCode?: (code: string) => void;
}

export const DigitalTicketCard: React.FC<DigitalTicketCardProps> = ({
  ticket,
  isCopied = false,
  onCopyCode,
}) => {
  const displayCode = ticket.bookingCode || ticket.bookingId;

  return (
    <article
      aria-label={`Vé xem phim điện tử ${ticket.movieTitle}`}
      className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-[0_8px_36px_rgba(0,0,0,0.07)] border border-gray-200/90 flex flex-col overflow-hidden relative select-none transition-all"
    >
      {/* 1. Cinematic Header Stub */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-gray-950 via-gray-900 to-[#7C6FE8]/70 text-white flex flex-col gap-4 relative overflow-hidden">
        {/* Top bar with verified badge and copyable code */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Vé Hợp Lệ</span>
          </div>

          <button
            type="button"
            onClick={() => onCopyCode && onCopyCode(displayCode)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-mono font-bold text-amber-300 transition-colors cursor-pointer"
            title="Sao chép mã vé"
          >
            <span>#{displayCode}</span>
            {isCopied ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3 opacity-70" />
            )}
          </button>
        </div>

        {/* Movie Info Row */}
        <div className="flex gap-3.5 items-start z-10 pt-1">
          <div className="w-16 aspect-[2/3] rounded-xl overflow-hidden bg-black shrink-0 ring-2 ring-white/20 shadow-md">
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

            <h2 className="font-black text-base sm:text-lg text-white leading-snug line-clamp-2">
              {ticket.movieTitle}
            </h2>
          </div>
        </div>
      </div>

      {/* 2. Middle Ticket Details Section */}
      <div className="p-5 sm:p-6 flex flex-col gap-3 text-xs text-gray-700 bg-white">
        {/* Cinema & Room */}
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#EEECFB] flex items-center justify-center text-[#7C6FE8] shrink-0 mt-0.5">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-gray-950">{ticket.cinemaName}</span>
            <span className="text-gray-500 font-medium text-[11px]">{ticket.roomName}</span>
          </div>
        </div>

        {/* Showtime */}
        <div className="flex items-center gap-2.5 border-t border-gray-100 pt-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#EEECFB] flex items-center justify-center text-[#7C6FE8] shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span>
            Suất: <strong className="text-gray-950 font-bold">{ticket.showTime}</strong> — {ticket.showDate}
          </span>
        </div>

        {/* Seats */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#EEECFB] flex items-center justify-center text-[#7C6FE8] shrink-0">
              <Ticket className="w-3.5 h-3.5" />
            </div>
            <span>
              Ghế: <strong className="text-[#7C6FE8] font-black text-sm">{ticket.seatLabels}</strong>
            </span>
          </div>
        </div>

        {/* Combos list */}
        {ticket.combos && ticket.combos.length > 0 && (
          <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-2.5">
            <span className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Popcorn className="w-3 h-3 text-[#7C6FE8]" />
              <span>Bắp nước kèm theo:</span>
            </span>
            {ticket.combos.map((combo, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-200/60 text-xs font-semibold text-gray-900"
              >
                <span>{combo.name}</span>
                <span className="font-black text-[#7C6FE8]">x{combo.quantity}</span>
              </div>
            ))}
          </div>
        )}

        {/* Payment Summary */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
          <div className="flex flex-col">
            <span className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider">
              Tổng thanh toán
            </span>
            <span className="text-[10px] text-gray-400">{ticket.paymentMethodName}</span>
          </div>
          <span className="font-black text-lg text-[#7C6FE8]">
            {ticket.totalPaid.toLocaleString('vi-VN')}đ
          </span>
        </div>
      </div>

      {/* 3. Perforated Dashed Punch Line Separator */}
      <div className="relative w-full flex items-center justify-between bg-white py-1">
        <div className="w-4 h-8 rounded-r-full bg-[#FAFAFB] border-r border-t border-b border-gray-200/90 -ml-1" />
        <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-3" />
        <div className="w-4 h-8 rounded-l-full bg-[#FAFAFB] border-l border-t border-b border-gray-200/90 -mr-1" />
      </div>

      {/* 4. Bottom Scannable QR Code & Barcode Section */}
      <div className="p-5 sm:p-6 bg-gray-50/70 flex flex-col items-center text-center gap-3">
        <div className="w-36 h-36 bg-white p-2.5 rounded-2xl border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center">
          <QRCodeImage
            value={ticket.qrCodeUrl || ticket.bookingId}
            size={135}
            alt={`QR Code ${displayCode}`}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col gap-0.5 items-center">
          <span className="font-mono font-black text-gray-950 text-xs flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-[#7C6FE8]" />
            <span>MÃ VÉ: {displayCode}</span>
          </span>
          <p className="text-[10px] text-gray-400 max-w-xs font-medium">
            Xuất trình mã QR tại cửa soát vé để nhân viên rạp quét vé vào phòng chiếu.
          </p>
        </div>
      </div>
    </article>
  );
};


