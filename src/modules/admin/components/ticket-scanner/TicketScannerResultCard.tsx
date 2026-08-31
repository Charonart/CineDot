'use client';

import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Film,
  MapPin,
  Clock,
  User,
  Coffee,
  Ticket,
  Check,
  Loader2,
  UserCheck,
  Sparkles,
  Phone,
  AlertTriangle,
  Receipt,
  CheckCheck,
} from 'lucide-react';
import { ScannedTicketDetail } from '../../types/adminTicketScanner.types';

interface TicketScannerResultCardProps {
  lastScannedResult: {
    success: boolean;
    message: string;
    ticket?: ScannedTicketDetail;
  } | null;

  onConfirmCheckIn: () => void;
  isCheckingIn: boolean;

  onClaimFnb: (bookingComboId: number) => void;
  isClaimingFnb: boolean;

  onBatchClaimAllFnb?: () => void;
  isBatchClaimingFnb?: boolean;
}

export function TicketScannerResultCard({
  lastScannedResult,
  onConfirmCheckIn,
  isCheckingIn,
  onClaimFnb,
  isClaimingFnb,
  onBatchClaimAllFnb,
  isBatchClaimingFnb = false,
}: TicketScannerResultCardProps) {
  // Empty State when no ticket is scanned yet
  if (!lastScannedResult) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-center gap-3 bg-white font-sans select-none">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center shadow-2xs border border-purple-100/60">
          <Ticket className="w-7 h-7" />
        </div>
        <div className="flex flex-col gap-1 max-w-sm">
          <h3 className="text-sm font-bold text-slate-800">
            Sẵn Sàng Tiếp Nhận Vé Khách Hàng
          </h3>
          <p className="text-xs text-slate-400">
            Quét mã QR từ điện thoại của khách hoặc nhập mã đặt vé vào ô bên trái để kiểm tra và xác nhận vào phòng chiếu.
          </p>
        </div>

        <div className="flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs text-slate-600 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#7C6FE8]" />
          <span>Hỗ trợ quét vé điện tử, vé in quầy và mã nhận combo bắp nước</span>
        </div>
      </div>
    );
  }

  // Error State (Invalid Code, Cancelled Booking, etc.)
  if (!lastScannedResult.success) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center text-center gap-4 bg-white font-sans select-none">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-2xs border border-rose-100">
          <XCircle className="w-7 h-7" />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
            Không Thể Xác Thực Vé
          </span>
          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {lastScannedResult.message}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Vui lòng kiểm tra lại mã đơn vé hoặc hướng dẫn khách hàng liên hệ quầy vé (Box Office) để được hỗ trợ.
          </p>
        </div>
      </div>
    );
  }

  const { ticket } = lastScannedResult;
  if (!ticket) return null;

  const hasUnclaimedCombos = ticket.combos.some((c) => !c.isClaimed);
  const unclaimedCount = ticket.combos.filter((c) => !c.isClaimed).length;

  return (
    <div className="p-4 sm:p-6 bg-white flex flex-col gap-4 font-sans select-none overflow-y-auto">
      {/* 1. Status Announcement Alert Banner */}
      <div
        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 shadow-2xs ${
          ticket.isCheckedIn
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            : 'bg-purple-50/80 border-purple-200 text-purple-950'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {ticket.isCheckedIn ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <Ticket className="w-5 h-5 text-[#7C6FE8] shrink-0" />
          )}
          <div className="flex flex-col">
            <span className="font-bold text-xs sm:text-sm leading-tight">
              {ticket.isCheckedIn
                ? 'VÉ HỢP LỆ — KHÁCH ĐÃ VÀO PHÒNG CHIẾU'
                : 'VÉ HỢP LỆ — SẴN SÀNG CHO KHÁCH VÀO PHÒNG'}
            </span>
            <span className="text-[11px] font-mono text-slate-600">
              Mã vé: <strong>{ticket.bookingCode}</strong>
              {ticket.checkedInAt ? ` • Soát lúc: ${ticket.checkedInAt}` : ''}
            </span>
          </div>
        </div>

        {ticket.isCheckedIn ? (
          <span className="px-2.5 py-1 rounded-md bg-emerald-200/80 text-emerald-900 text-[10px] font-extrabold uppercase tracking-wider shrink-0">
            ĐÃ SOÁT VÉ
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-md bg-purple-200/80 text-purple-900 text-[10px] font-extrabold uppercase tracking-wider shrink-0">
            CHỜ VÀO CỬA
          </span>
        )}
      </div>

      {/* 2. Cinema Boarding Pass Ticket Stub Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-2xs overflow-hidden flex flex-col">
        {/* Top Header: Movie Details & Format */}
        <div className="p-4 flex flex-col sm:flex-row items-start gap-4 border-b border-gray-100 bg-slate-50/30">
          {ticket.moviePoster ? (
            <img
              src={ticket.moviePoster}
              alt={ticket.movieTitle}
              className="w-18 h-24 object-cover rounded-lg shadow-2xs border border-gray-200 shrink-0"
            />
          ) : (
            <div className="w-18 h-24 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-[#7C6FE8] shrink-0">
              <Film className="w-6 h-6" />
            </div>
          )}

          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-1.5 py-0.5 rounded bg-purple-100 text-[#7C6FE8] font-black text-[10px] uppercase">
                {ticket.ageRating || 'P'}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                {ticket.roomType || '2D Standard'}
              </span>
              {ticket.durationMinutes > 0 && (
                <span className="text-[11px] text-slate-400 font-medium font-mono">
                  {ticket.durationMinutes} phút
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {ticket.movieTitle}
            </h2>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
              <span>
                {ticket.cinemaName} • <strong className="text-slate-900">{ticket.roomName}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Perforated Notch Divider Line */}
        <div className="relative flex items-center">
          <div className="w-3 h-6 bg-slate-100 rounded-r-full border-r border-t border-b border-gray-200 -ml-px" />
          <div className="flex-1 border-b border-dashed border-gray-300 mx-2" />
          <div className="w-3 h-6 bg-slate-100 rounded-l-full border-l border-t border-b border-gray-200 -mr-px" />
        </div>

        {/* Mid Section: Showtime & Seats Matrix */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white">
          {/* Showtime Box */}
          <div className="p-3 rounded-lg bg-slate-50/80 border border-gray-200/80 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#7C6FE8]" />
              <span>Suất Chiếu</span>
            </span>
            <span className="font-bold text-xs sm:text-sm text-slate-900">
              {ticket.showtimeFormatted}
            </span>
          </div>

          {/* Seats Box */}
          <div className="p-3 rounded-lg bg-purple-50/60 border border-purple-100 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1">
              <Ticket className="w-3 h-3 text-[#7C6FE8]" />
              <span>Vị Trí Ghế ({ticket.seats.length} vé)</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {ticket.seats.length > 0 ? (
                ticket.seats.map((seat, idx) => (
                  <span
                    key={seat.id || idx}
                    className="px-2 py-0.5 rounded bg-white text-[#7C6FE8] font-mono font-bold text-xs border border-purple-200 shadow-2xs"
                  >
                    {seat.seatCode}
                  </span>
                ))
              ) : (
                <span className="font-mono font-bold text-xs text-[#7C6FE8]">
                  {ticket.seatsFormatted}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Customer & Billing Strip */}
        <div className="px-4 py-3 bg-slate-50/50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-500 shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-800">{ticket.customerName}</span>
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>{ticket.customerPhone || ticket.customerEmail || 'Khách tại quầy'}</span>
              </span>
            </div>
          </div>

          {ticket.finalAmount > 0 && (
            <div className="flex sm:flex-col items-center sm:items-end justify-between text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Tổng Thanh Toán</span>
              <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                  ticket.finalAmount
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Primary Check-in Confirmation Action */}
      {!ticket.isCheckedIn ? (
        <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#7C6FE8] text-white flex items-center justify-center shadow-xs shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-xs sm:text-sm text-slate-900">
                Khách Hàng Đang Chờ Tại Cổng Rạp
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Kiểm tra đúng phòng và suất chiếu rồi bấm xác nhận để mời khách vào phòng.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onConfirmCheckIn}
            disabled={isCheckingIn}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xs shadow-emerald-600/20 cursor-pointer disabled:opacity-50 transition-all active:scale-98 shrink-0"
          >
            {isCheckingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>XÁC NHẬN VÀO PHÒNG [Space]</span>
          </button>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-2xs shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs text-emerald-950">
                Khách Đã Được Xác Nhận Vào Phòng Chiếu
              </span>
              <span className="text-[11px] text-emerald-700 font-mono">
                Thời gian soát vé: {ticket.checkedInAt}
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded bg-emerald-200 text-emerald-900 text-[10px] font-bold uppercase tracking-wider shrink-0">
            HỢP LỆ
          </span>
        </div>
      )}

      {/* 4. F&B Combos Claim Checklist */}
      {ticket.combos.length > 0 && (
        <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-2xs flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-[#7C6FE8]" />
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                Combo Bắp Nước Đi Kèm ({ticket.combos.length})
              </h3>
            </div>

            {hasUnclaimedCombos && onBatchClaimAllFnb && (
              <button
                type="button"
                onClick={onBatchClaimAllFnb}
                disabled={isBatchClaimingFnb || isClaimingFnb}
                className="px-2.5 py-1 rounded-md bg-purple-50 hover:bg-purple-100 text-[#7C6FE8] text-[11px] font-bold flex items-center gap-1 border border-purple-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isBatchClaimingFnb ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
                <span>Trả Tất Cả ({unclaimedCount})</span>
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {ticket.combos.map((combo) => (
              <div
                key={combo.id}
                className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                  combo.isClaimed
                    ? 'bg-slate-50/70 border-gray-200/80 text-slate-500'
                    : 'bg-white border-gray-200 text-slate-900 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs font-mono ${
                      combo.isClaimed
                        ? 'bg-slate-200 text-slate-600'
                        : 'bg-pink-100 text-pink-600'
                    }`}
                  >
                    x{combo.quantity}
                  </div>
                  <span className="font-bold text-xs">{combo.name}</span>
                </div>

                {combo.isClaimed ? (
                  <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>ĐÃ TRẢ BẮP NƯỚC</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onClaimFnb(combo.id)}
                    disabled={isClaimingFnb || isBatchClaimingFnb}
                    className="px-3 py-1 rounded-md bg-[#7C6FE8] hover:bg-[#6b5edb] text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-2xs cursor-pointer disabled:opacity-50 transition-all active:scale-98"
                  >
                    {isClaimingFnb ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    <span>XÁC NHẬN TRẢ</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
