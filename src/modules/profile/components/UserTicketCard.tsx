/* Hallmark · component: UserTicketCard · genre: modern-minimal · theme: White Minimal / Iris Cinema
 * states: default · hover · focus · active · disabled · loading · error · success
 * contrast: pass (46–50)
 */
'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Ticket,
  QrCode,
  ArrowUpRight,
  Maximize2,
  X,
  AlertTriangle,
  Sparkles,
  Calendar,
  Layers,
  Coffee,
  Hourglass,
  Copy,
  Check,
  Film,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { UserTicketItem } from '../types/profile.types';
import { AgeRatingBadge } from '@/shared/components/ui/AgeRatingBadge';
import { QRCodeImage } from '@/shared/ui/QRCodeImage';

interface UserTicketCardProps {
  ticket: UserTicketItem;
  onCancel?: (ticketId: string) => void;
  isCancelling?: boolean;
}

export const UserTicketCard: React.FC<UserTicketCardProps> = ({
  ticket,
  onCancel,
  isCancelling = false,
}) => {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [posterError, setPosterError] = useState(false);

  const isUpcoming = ticket.status === 'UPCOMING';
  const isCancelled = ticket.status === 'CANCELLED';

  const bookingCode = ticket.bookingCode || `#CINEMA-${ticket.bookingId.slice(-6).toUpperCase()}`;

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ticket.bookingCode || ticket.bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      confirm(
        `Bạn có chắc chắn muốn hủy vé ${bookingCode} phim "${ticket.movieTitle}" không? Tiền sẽ được hoàn trả theo chính sách CineDot.`
      )
    ) {
      onCancel?.(ticket.bookingId);
    }
  };

  return (
    <>
      {/* Luxury Perforated Cinema Pass Container */}
      <div
        className={`group relative w-full rounded-3xl transition-all duration-300 overflow-hidden bg-white border ${
          isCancelled
            ? 'border-rose-200/80 bg-rose-50/15 opacity-75'
            : isUpcoming
            ? 'border-slate-200 shadow-[0_10px_35px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_45px_rgba(124,111,232,0.12)] hover:border-[#7C6FE8]/50'
            : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md opacity-95'
        }`}
      >
        {/* Top Iridescent Accent Bar for Upcoming Tickets */}
        {isUpcoming && (
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-[#7C6FE8] to-indigo-500 shadow-xs" />
        )}

        <div className="flex flex-col lg:flex-row items-stretch justify-between">
          {/* Main Ticket Body (Left 68%) */}
          <div className="flex-1 p-5 sm:p-6 lg:p-7 flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
            {/* Movie Poster with Aspect 2/3 & Format Badge */}
            <div className="relative w-28 sm:w-32 aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 shrink-0 shadow-md ring-1 ring-black/5 group-hover:scale-[1.02] transition-transform duration-300">
              {!posterError && ticket.posterUrl ? (
                <img
                  src={ticket.posterUrl}
                  alt={ticket.movieTitle}
                  onError={() => setPosterError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-2 text-center text-slate-400">
                  <Film className="w-8 h-8 text-slate-600 mb-1" />
                  <span className="text-[10px] font-bold leading-tight line-clamp-2">
                    {ticket.movieTitle}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-2 left-2 right-2 text-center px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[9px] font-black text-amber-300 uppercase tracking-widest border border-white/10">
                {ticket.movieFormat || '2D DIGITAL'}
              </span>
            </div>

            {/* Movie & Showtime Info */}
            <div className="flex-1 flex flex-col justify-between h-full gap-3.5 min-w-0 w-full">
              <div className="flex flex-col gap-2.5">
                {/* Meta Badges Row */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 text-[#7C6FE8] text-[10px] font-black tracking-wider uppercase border border-purple-200">
                    {ticket.movieFormat || 'GOLD CLASS'}
                  </span>

                  {ticket.duration ? (
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200 flex items-center gap-1">
                      <Hourglass className="w-3 h-3 text-slate-500" />
                      <span>{ticket.duration} phút</span>
                    </span>
                  ) : null}

                  <AgeRatingBadge ageRating={ticket.ageRating} size="xs" variant="soft" />

                  {isCancelled ? (
                    <span className="px-2.5 py-0.5 rounded-lg bg-rose-100 text-rose-700 text-[10px] font-extrabold border border-rose-200">
                      Đã Hủy Vé
                    </span>
                  ) : isUpcoming ? (
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Vé Sắp Chiếu
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
                      Đã Thưởng Thức
                    </span>
                  )}
                </div>

                {/* Movie Title */}
                <h3 className="font-black text-lg sm:text-xl text-slate-900 leading-snug tracking-tight hover:text-[#7C6FE8] transition-colors line-clamp-2">
                  <Link href={`/movies/${ticket.movieSlug}`}>{ticket.movieTitle}</Link>
                </h3>

                {/* Ticket Details Grid (2x2) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-1 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#7C6FE8] shrink-0" />
                    <span className="truncate">
                      <strong>{ticket.cinemaName}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#7C6FE8] shrink-0" />
                    <span className="truncate">
                      Phòng: <strong className="text-slate-900">{ticket.roomName}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#7C6FE8] shrink-0" />
                    <span>
                      Ngày: <strong className="text-slate-900">{ticket.showDate}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#7C6FE8] shrink-0" />
                    <span>
                      Suất chiếu:{' '}
                      <strong className="text-slate-900 text-xs sm:text-sm font-black tracking-tight bg-slate-100 px-2 py-0.5 rounded-md">
                        {ticket.showTime}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Combos & F&B Row (if any) */}
              {ticket.combosSummary && (
                <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-400/25 text-amber-900 w-fit max-w-full">
                  <Coffee className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-xs text-amber-900 truncate">
                    Bắp nước:{' '}
                    <strong className="font-extrabold text-amber-950">
                      {ticket.combosSummary}
                    </strong>
                  </span>
                </div>
              )}

              {/* Bottom Row: Seat Labels & Price */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-1">
                <div className="flex items-center gap-2 bg-[#7C6FE8]/8 px-3.5 py-1.5 rounded-xl border border-[#7C6FE8]/20">
                  <Ticket className="w-4 h-4 text-[#7C6FE8]" />
                  <span className="text-xs text-slate-700">
                    Vị trí ghế:{' '}
                    <strong className="text-[#7C6FE8] font-black text-sm tracking-wide">
                      {ticket.seatLabels}
                    </strong>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none mb-1">
                    Tổng thanh toán
                  </span>
                  <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
                    {ticket.totalPaid.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Perforation Tear Notch Line */}
          <div className="relative flex lg:flex-col items-center justify-between">
            {/* Top Notch Circle Cutout */}
            <div className="hidden lg:block absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FAFAFB] border border-slate-200 z-10" />

            {/* Vertical Perforated Dashed Line */}
            <div className="hidden lg:block w-px h-full border-r-2 border-dashed border-slate-200/90 mx-auto" />

            {/* Horizontal Line for Mobile View */}
            <div className="lg:hidden w-full h-px border-b-2 border-dashed border-slate-200/90" />

            {/* Bottom Notch Circle Cutout */}
            <div className="hidden lg:block absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FAFAFB] border border-slate-200 z-10" />
          </div>

          {/* QR Stub & Quick Actions (Right 32%) */}
          <div className="p-5 sm:p-6 lg:p-7 bg-slate-50/70 lg:w-72 flex flex-col items-center justify-between gap-4 shrink-0 text-center">
            <div className="flex flex-col items-center gap-2.5 w-full">
              {/* QR Code Pass Box (Click to enlarge) */}
              <div
                onClick={() => setIsQrModalOpen(true)}
                className="group/qr relative p-3 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-[#7C6FE8] hover:shadow-md transition-all cursor-pointer flex flex-col items-center"
              >
                <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                  <QRCodeImage
                    value={ticket.qrCodeUrl || ticket.bookingId}
                    size={128}
                    alt={`QR Code booking #${ticket.bookingId}`}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="absolute inset-0 bg-[#7C6FE8]/15 backdrop-blur-[2px] rounded-2xl opacity-0 group-hover/qr:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-[#7C6FE8] font-black text-xs">
                  <Maximize2 className="w-4 h-4" />
                  <span>Phóng To Mã QR</span>
                </div>
              </div>

              {/* Booking Code with 1-Click Copy */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 hover:border-[#7C6FE8] text-xs font-mono font-black text-slate-800 transition-all cursor-pointer active:scale-95"
                  title="Sao chép mã đơn đặt vé"
                >
                  <span>{bookingCode}</span>
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>
                <span className="text-[10px] text-slate-400 font-medium">
                  {copied ? 'Đã sao chép mã đơn!' : 'Chạm mã QR để mở toàn màn hình'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 w-full">
              <Link
                href={`/booking/success?booking_id=${ticket.bookingId}&movie=${ticket.movieSlug}&seats=${ticket.seatLabels}&time=${ticket.showTime}&cinema=${encodeURIComponent(
                  ticket.cinemaName
                )}`}
                className="w-full"
              >
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#7C6FE8] text-slate-800 hover:text-white border border-slate-200 hover:border-[#7C6FE8] font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-md hover:shadow-[#7C6FE8]/25 cursor-pointer"
                >
                  <span>Chi tiết vé</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>

              {/* Cancel Button */}
              {isUpcoming && ticket.canCancel && onCancel && (
                <button
                  type="button"
                  onClick={handleCancelClick}
                  disabled={isCancelling}
                  className="w-full py-2 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  <span>{isCancelling ? 'Đang xử lý...' : 'Hủy vé & Hoàn tiền'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enlarged QR Code Inspection Modal for Rapid Scanner Check-In */}
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
              {/* Close Button */}
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
                  <strong className="font-mono text-slate-900 font-black">{bookingCode}</strong>
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
                {ticket.combosSummary ? (
                  <div className="flex justify-between items-start text-slate-600 pt-1.5 border-t border-slate-200/60">
                    <span className="shrink-0 text-amber-900 font-bold">🍿 Bắp nước:</span>
                    <strong className="text-amber-900 text-right">{ticket.combosSummary}</strong>
                  </div>
                ) : null}
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
