'use client';

import React from 'react';
import { MapPin, Clock, Ticket, QrCode, Sparkles } from 'lucide-react';
import { DigitalTicketInfo } from '../types/booking-success.types';

interface DigitalTicketCardProps {
  ticket: DigitalTicketInfo;
}

export const DigitalTicketCard: React.FC<DigitalTicketCardProps> = ({ ticket }) => {
  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-[0_20px_60px_rgba(124,111,232,0.18)] border border-gray-100 flex flex-col overflow-hidden relative">
      {/* Top Header Section */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-[#7C6FE8]/40 text-white flex flex-col gap-6 relative overflow-hidden">
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VÉ XEM PHIM ĐIỆN TỬ</span>
          </div>

          <span className="font-mono text-xs font-bold text-amber-300 tracking-wider">
            MÃ VÉ: #{ticket.bookingId}
          </span>
        </div>

        {/* Movie Info Row */}
        <div className="flex gap-4 items-start z-10 pt-1">
          <div className="w-20 aspect-[2/3] rounded-2xl overflow-hidden bg-slate-950 shrink-0 ring-2 ring-white/20 shadow-lg">
            <img
              src={ticket.posterUrl}
              alt={ticket.movieTitle}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#7C6FE8] text-white text-[10px] font-bold uppercase">
                {ticket.movieFormat}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                Khán giả {ticket.ageRating}
              </span>
            </div>

            <h3 className="font-extrabold text-lg text-white leading-tight">
              {ticket.movieTitle}
            </h3>
          </div>
        </div>
      </div>

      {/* Middle Ticket Details Section */}
      <div className="p-6 sm:p-8 flex flex-col gap-4 text-xs text-slate-700 bg-white">
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-[#7C6FE8] shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="font-bold text-sm text-[#131413]">{ticket.cinemaName}</span>
            <span className="text-slate-500">{ticket.roomName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 border-t border-gray-100 pt-3">
          <Clock className="w-4 h-4 text-[#7C6FE8] shrink-0" />
          <span>Suất chiếu: <strong>{ticket.showTime}</strong> - {ticket.showDate}</span>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2.5">
            <Ticket className="w-4 h-4 text-[#7C6FE8] shrink-0" />
            <span>Ghế đã chọn: <strong className="text-[#7C6FE8] text-sm">{ticket.seatLabels}</strong></span>
          </div>
        </div>

        {ticket.combos && ticket.combos.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
            <span className="font-bold text-xs text-slate-500">Đồ ăn / Thức uống kèm theo:</span>
            {ticket.combos.map((combo, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-800">
                <span className="font-semibold">{combo.name}</span>
                <span className="font-bold text-[#7C6FE8]">x{combo.quantity}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="font-bold text-xs text-slate-500 uppercase">Tổng Thanh Toán</span>
          <span className="font-extrabold text-lg text-[#7C6FE8]">
            {ticket.totalPaid.toLocaleString()}đ
          </span>
        </div>
      </div>

      {/* Curved Cutout Dashed Separator Line */}
      <div className="relative w-full flex items-center justify-between bg-white">
        <div className="w-5 h-10 rounded-r-full bg-[#FEFEFE] border-r border-t border-b border-gray-200 -ml-1" />
        <div className="flex-1 border-t-2 border-dashed border-gray-300 mx-2" />
        <div className="w-5 h-10 rounded-l-full bg-[#FEFEFE] border-l border-t border-b border-gray-200 -mr-1" />
      </div>

      {/* Bottom Scannable QR Code Section */}
      <div className="p-6 sm:p-8 bg-slate-50 flex flex-col items-center text-center gap-4">
        <div className="w-44 h-44 bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center">
          <img
            src={ticket.qrCodeUrl}
            alt={`QR Code ${ticket.bookingId}`}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col gap-1 items-center">
          <span className="font-mono font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-[#7C6FE8]" />
            <span>MÃ VÉ QUÉT RẠP: {ticket.bookingId}</span>
          </span>
          <p className="text-[11px] text-slate-500 max-w-xs">
            Vui lòng xuất trình mã QR này cho nhân viên rạp để quét vé vào phòng chiếu.
          </p>
        </div>
      </div>
    </div>
  );
};
