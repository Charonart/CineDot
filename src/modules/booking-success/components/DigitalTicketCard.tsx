/* Hallmark · genre: modern-minimal · macrostructure: Bento Grid · theme: White Minimal / Iris Cinema · nav: N5 · footer: Ft5 */
/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */
'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Ticket,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  Coffee,
  Sparkles,
  Calendar,
  Layers,
  Film,
  Maximize2,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DigitalTicketInfo } from '../types/booking-success.types';
import { QRCodeImage } from '@/shared/ui/QRCodeImage';

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
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [posterError, setPosterError] = useState(false);
  const displayCode = ticket.bookingCode || ticket.bookingId;

  return (
    <>
      <article
        aria-label={`Vé xem phim điện tử ${ticket.movieTitle}`}
        className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-[0_12px_45px_rgba(15,23,42,0.08)] border border-slate-200/90 flex flex-col overflow-hidden relative select-none transition-all hover:shadow-[0_20px_55px_rgba(124,111,232,0.14)] hover:border-[#7C6FE8]/40"
      >
        {/* Top Iridescent Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-[#7C6FE8] to-indigo-500 shadow-xs" />

        {/* 1. Cinematic Header Stub */}
        <div className="p-5 sm:p-7 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col gap-4 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#7C6FE8]/25 blur-3xl pointer-events-none" />

          {/* Top meta bar with verified badge and copyable code */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Vé Điện Tử Hợp Lệ</span>
            </div>

            <button
              type="button"
              onClick={() => onCopyCode && onCopyCode(displayCode)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-black text-amber-300 transition-all cursor-pointer active:scale-95 shadow-xs"
              title="Sao chép mã vé"
            >
              <span>#{displayCode}</span>
              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-70" />
              )}
            </button>
          </div>

          {/* Movie Poster & Title Row */}
          <div className="flex gap-4 items-start z-10 pt-1">
            <div className="w-20 sm:w-24 aspect-[2/3] rounded-2xl overflow-hidden bg-black shrink-0 ring-2 ring-white/20 shadow-lg relative group">
              {!posterError && ticket.posterUrl ? (
                <img
                  src={ticket.posterUrl}
                  alt={ticket.movieTitle}
                  onError={() => setPosterError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-2 text-center text-slate-400">
                  <Film className="w-6 h-6 text-slate-500 mb-1" />
                  <span className="text-[9px] font-bold line-clamp-2">{ticket.movieTitle}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-1.5 left-1.5 right-1.5 text-center px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[8px] font-black text-amber-300 uppercase tracking-wider">
                {ticket.movieFormat || 'IMAX 3D'}
              </span>
            </div>

            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-lg bg-[#7C6FE8] text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                  {ticket.movieFormat || 'GOLD CLASS'}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                  Khán giả {ticket.ageRating || 'P'}
                </span>
              </div>

              <h2 className="font-black text-lg sm:text-xl text-white leading-snug tracking-tight line-clamp-2">
                {ticket.movieTitle}
              </h2>
            </div>
          </div>
        </div>

        {/* 2. Middle Ticket Details Section */}
        <div className="p-5 sm:p-7 flex flex-col gap-3.5 text-xs text-slate-700 bg-white">
          {/* Cinema & Room */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-[#7C6FE8] shrink-0 mt-0.5 border border-purple-100">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-black text-sm sm:text-base text-slate-900 truncate">
                {ticket.cinemaName}
              </span>
              <span className="text-slate-500 font-bold text-xs">{ticket.roomName}</span>
            </div>
          </div>

          {/* Showtime Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium text-slate-600">
                Ngày: <strong className="text-slate-900 font-bold">{ticket.showDate}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium text-slate-600">
                Suất:{' '}
                <strong className="text-slate-900 font-black bg-slate-100 px-2 py-0.5 rounded-md text-xs">
                  {ticket.showTime}
                </strong>
              </span>
            </div>
          </div>

          {/* Seats Capsule */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2.5 bg-[#7C6FE8]/8 px-3.5 py-1.5 rounded-xl border border-[#7C6FE8]/20 w-fit">
              <Ticket className="w-4 h-4 text-[#7C6FE8]" />
              <span className="text-xs text-slate-700">
                Vị trí ghế:{' '}
                <strong className="text-[#7C6FE8] font-black text-sm tracking-wide">
                  {ticket.seatLabels}
                </strong>
              </span>
            </div>
          </div>

          {/* Combos list */}
          {ticket.combos && ticket.combos.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
              <span className="font-black text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-amber-600" />
                <span>Bắp nước F&B kèm theo:</span>
              </span>
              <div className="flex flex-col gap-1.5">
                {ticket.combos.map((combo, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-xs font-bold text-amber-950"
                  >
                    <span>{combo.name}</span>
                    <span className="font-black text-amber-700">x{combo.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
            <div className="flex flex-col">
              <span className="font-black text-[10px] text-slate-400 uppercase tracking-wider">
                Tổng thanh toán
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {ticket.paymentMethodName || 'Thanh toán trực tuyến'}
              </span>
            </div>
            <span className="font-black text-lg sm:text-xl text-slate-900 font-mono">
              {ticket.totalPaid.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>

        {/* 3. Perforated Punch Line Separator (Boarding Pass Notch) */}
        <div className="relative w-full flex items-center justify-between bg-white py-0.5">
          <div className="w-5 h-10 rounded-r-full bg-[#F8F9FD] border-r border-t border-b border-slate-200 -ml-1" />
          <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-4" />
          <div className="w-5 h-10 rounded-l-full bg-[#F8F9FD] border-l border-t border-b border-slate-200 -mr-1" />
        </div>

        {/* 4. Bottom Scannable QR Code Section */}
        <div className="p-6 sm:p-7 bg-slate-50/80 flex flex-col items-center text-center gap-3.5">
          <div
            onClick={() => setIsQrModalOpen(true)}
            className="group/qr relative w-36 h-36 sm:w-40 sm:h-40 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm hover:border-[#7C6FE8] hover:shadow-md transition-all cursor-pointer flex items-center justify-center"
          >
            <QRCodeImage
              value={ticket.qrCodeUrl || ticket.bookingId}
              size={144}
              alt={`QR Code ${displayCode}`}
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-[#7C6FE8]/15 backdrop-blur-[2px] rounded-2xl opacity-0 group-hover/qr:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-[#7C6FE8] font-black text-xs">
              <Maximize2 className="w-4 h-4" />
              <span>Phóng To</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 items-center">
            <span className="font-mono font-black text-slate-900 text-xs flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-[#7C6FE8]" />
              <span>MÃ VÉ: #{displayCode}</span>
            </span>
            <p className="text-[11px] text-slate-400 max-w-xs font-medium leading-relaxed">
              Chạm mã QR để mở toàn màn hình khi soát vé tại cổng rạp.
            </p>
          </div>
        </div>
      </article>

      {/* Enlarged QR Modal */}
      <AnimatePresence>
        {isQrModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQrModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-slate-100 flex flex-col items-center text-center gap-5"
            >
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Đóng mã QR"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center gap-1.5 pt-2">
                <span className="px-3 py-1 rounded-full bg-[#7C6FE8]/10 text-[#7C6FE8] text-[11px] font-black uppercase tracking-wider border border-[#7C6FE8]/20">
                  Thẻ Lên Phòng Chiếu CineDot
                </span>
                <h4 className="font-black text-xl text-slate-900 leading-tight">
                  {ticket.movieTitle}
                </h4>
                <span className="text-xs text-slate-500 font-bold">
                  {ticket.cinemaName} • {ticket.roomName}
                </span>
              </div>

              {/* Giant QR Pass */}
              <div className="p-4 bg-white rounded-3xl border-2 border-slate-900/10 shadow-xl flex items-center justify-center">
                <QRCodeImage
                  value={ticket.qrCodeUrl || ticket.bookingId}
                  size={230}
                  alt={`QR Check-in #${ticket.bookingId}`}
                  className="w-56 h-56 object-contain"
                />
              </div>

              <div className="flex flex-col gap-2 w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Mã đặt vé:</span>
                  <strong className="font-mono text-slate-900 font-black">#{displayCode}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Vị trí ghế:</span>
                  <strong className="text-[#7C6FE8] font-black text-sm">{ticket.seatLabels}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Suất chiếu:</span>
                  <strong className="text-slate-900 font-bold">
                    {ticket.showTime} - {ticket.showDate}
                  </strong>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                💡 Vui lòng tăng độ sáng màn hình điện thoại và đưa mã này vào máy quét tại cổng soát
                vé hoặc quầy bắp nước.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
