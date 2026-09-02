/* Hallmark · genre: modern-minimal · macrostructure: Physical Ticket Centerpiece · theme: White Minimal / Iris Cinema */
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
  Calendar,
  Film,
  Maximize2,
  X,
  Volume2,
  Timer,
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
        className="w-full max-w-[440px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-slate-200/90 flex flex-col overflow-hidden relative select-none transition-shadow hover:shadow-[0_24px_60px_rgba(124,111,232,0.14)]"
      >
        {/* 1. Cinematic Header (Obsidian IMAX Stage) */}
        <div className="p-5 bg-gradient-to-br from-slate-950 via-[#0D1322] to-[#171D32] text-white flex flex-col gap-3.5 relative overflow-hidden">
          {/* Subtle Ambient Accent Glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-[#7C6FE8]/25 blur-3xl pointer-events-none" />

          {/* Top Verification & Booking Code Pill */}
          <div className="flex items-center justify-between z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Vé Hợp Lệ</span>
            </div>

            <button
              type="button"
              onClick={() => onCopyCode && onCopyCode(displayCode)}
              className="group/code inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono font-bold text-amber-300 transition-colors cursor-pointer active:scale-95"
              title="Nhấn để sao chép mã vé"
            >
              <span>#{displayCode}</span>
              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-60 group-hover/code:opacity-100 transition-opacity" />
              )}
            </button>
          </div>

          {/* Movie Showcase Row */}
          <div className="flex gap-3.5 items-start z-10">
            {/* Poster Thumbnail */}
            <div className="w-[76px] aspect-[2/3] rounded-xl overflow-hidden bg-slate-900 shrink-0 ring-1 ring-white/20 shadow-md relative">
              {!posterError && ticket.posterUrl ? (
                <img
                  src={ticket.posterUrl}
                  alt={ticket.movieTitle}
                  onError={() => setPosterError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-1 text-center text-slate-400">
                  <Film className="w-5 h-5 text-slate-500 mb-0.5" />
                  <span className="text-[8px] font-bold line-clamp-2">{ticket.movieTitle}</span>
                </div>
              )}
            </div>

            {/* Movie Meta Info */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-[#7C6FE8] text-white text-[10px] font-black uppercase tracking-wider">
                  {ticket.movieFormat || 'IMAX Laser'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                  {ticket.ageRating || 'T16'}
                </span>
                {ticket.durationMinutes && (
                  <span className="text-[10px] text-slate-400 font-medium">
                    {ticket.durationMinutes} phút
                  </span>
                )}
              </div>

              <h2 className="font-bold text-base sm:text-lg text-white leading-snug line-clamp-2">
                {ticket.movieTitle}
              </h2>

              {ticket.audioFormat && (
                <div className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                  <Volume2 className="w-3 h-3 text-[#7C6FE8]" />
                  <span>{ticket.audioFormat}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Middle Ticket Details Section */}
        <div className="p-5 flex flex-col gap-3 text-xs text-slate-700 bg-white">
          {/* Cinema & Room */}
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-[#7C6FE8] shrink-0 mt-0.5 border border-purple-100">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-slate-900 truncate">
                {ticket.cinemaName}
              </span>
              <span className="text-slate-500 font-medium text-[11px]">{ticket.roomName}</span>
            </div>
          </div>

          {/* Showtime & Seat Matrix */}
          <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
            <div className="flex flex-col gap-0.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Suất Chiếu
              </span>
              <span className="text-slate-900 font-black text-sm">
                {ticket.showTime} <span className="text-xs font-normal text-slate-500">({ticket.showDate})</span>
              </span>
            </div>

            <div className="flex flex-col gap-0.5 p-2 rounded-xl bg-[#7C6FE8]/8 border border-[#7C6FE8]/20">
              <span className="text-[10px] font-bold text-[#7C6FE8] uppercase tracking-wider">
                Ghế Ngồi
              </span>
              <span className="text-[#7C6FE8] font-black text-sm">
                {ticket.seatLabels}
              </span>
            </div>
          </div>

          {/* Combos breakdown (if any) */}
          {ticket.combos && ticket.combos.length > 0 && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/8 border border-amber-400/20 text-xs text-amber-950 font-medium">
              <span className="truncate pr-2">{ticket.combos[0].name}</span>
              <span className="font-bold text-amber-700 shrink-0">x{ticket.combos[0].quantity}</span>
            </div>
          )}

          {/* Total Paid & Payment Method */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Tổng thanh toán
              </span>
              <span className="text-[11px] text-slate-500 truncate max-w-[180px]">
                {ticket.paymentMethodName || 'VNPAY'}
              </span>
            </div>
            <span className="font-black text-base text-slate-900 font-mono">
              {ticket.totalPaid.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>

        {/* 3. Perforated Ticket Notches */}
        <div className="relative w-full flex items-center justify-between bg-white py-0.5">
          <div className="w-4 h-8 rounded-r-full bg-[#F8F9FD] border-r border-t border-b border-slate-200/90 -ml-1" />
          <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-3" />
          <div className="w-4 h-8 rounded-l-full bg-[#F8F9FD] border-l border-t border-b border-slate-200/90 -mr-1" />
        </div>

        {/* 4. Bottom Scannable QR Code Stub */}
        <div className="p-5 bg-slate-50/90 flex flex-col items-center text-center gap-3">
          <div
            onClick={() => setIsQrModalOpen(true)}
            className="group/qr relative w-32 h-32 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#7C6FE8] hover:shadow-md transition-all cursor-pointer flex items-center justify-center"
            title="Nhấn để mở toàn màn hình quét vé"
          >
            <QRCodeImage
              value={ticket.qrCodeUrl || ticket.bookingId}
              size={116}
              alt={`QR Code #${displayCode}`}
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-[#7C6FE8]/10 backdrop-blur-[1px] rounded-2xl opacity-0 group-hover/qr:opacity-100 transition-opacity flex items-center justify-center text-[#7C6FE8] font-bold text-[11px]">
              <Maximize2 className="w-4 h-4 mr-1" />
              <span>Phóng To</span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5 items-center">
            <span className="font-mono font-bold text-slate-800 text-xs flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-[#7C6FE8]" />
              <span>MÃ VÉ: #{displayCode}</span>
            </span>
            <p className="text-[11px] text-slate-400 font-medium">
              Đưa mã QR vào máy quét tại cổng hoặc quầy bắp nước
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
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 border border-slate-100 flex flex-col items-center text-center gap-4"
            >
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Đóng mã QR"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center gap-1 pt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#7C6FE8]/10 text-[#7C6FE8] text-[10px] font-bold uppercase tracking-wider">
                  Thẻ Lên Phòng Chiếu
                </span>
                <h4 className="font-bold text-lg text-slate-900 leading-tight">
                  {ticket.movieTitle}
                </h4>
                <span className="text-xs text-slate-500 font-medium">
                  {ticket.cinemaName} • {ticket.roomName}
                </span>
              </div>

              {/* Giant QR Pass */}
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-md flex items-center justify-center">
                <QRCodeImage
                  value={ticket.qrCodeUrl || ticket.bookingId}
                  size={200}
                  alt={`QR Check-in #${displayCode}`}
                  className="w-48 h-48 object-contain"
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Mã vé:</span>
                  <strong className="font-mono text-slate-900 font-bold">#{displayCode}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Ghế ngồi:</span>
                  <strong className="text-[#7C6FE8] font-bold">{ticket.seatLabels}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Suất chiếu:</span>
                  <strong className="text-slate-900 font-medium">
                    {ticket.showTime} ({ticket.showDate})
                  </strong>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                💡 Vui lòng tăng độ sáng màn hình điện thoại khi quét tại cổng.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
