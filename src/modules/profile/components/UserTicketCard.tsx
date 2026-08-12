'use client';

import React from 'react';
import { MapPin, Clock, Ticket, QrCode, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { UserTicketItem } from '../types/profile.types';

interface UserTicketCardProps {
  ticket: UserTicketItem;
}

export const UserTicketCard: React.FC<UserTicketCardProps> = ({ ticket }) => {
  const isUpcoming = ticket.status === 'UPCOMING';

  return (
    <div
      className={`w-full bg-white rounded-3xl p-6 border transition-all flex flex-col md:flex-row gap-6 items-center justify-between ${
        isUpcoming
          ? 'border-purple-200 shadow-[0_12px_40px_rgba(124,111,232,0.12)] ring-1 ring-[#7C6FE8]/20'
          : 'border-gray-200 opacity-80'
      }`}
    >
      {/* Left: Movie Poster & Details */}
      <div className="flex gap-4 items-start w-full md:w-auto flex-1">
        <div className="w-20 aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 shrink-0 shadow-md">
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
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
              Khán giả {ticket.ageRating}
            </span>
            {isUpcoming && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                Sắp chiếu
              </span>
            )}
          </div>

          <h4 className="font-extrabold text-base text-[#131413] leading-snug">
            {ticket.movieTitle}
          </h4>

          <div className="flex flex-col gap-1 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#7C6FE8]" />
              <strong>{ticket.cinemaName}</strong> - {ticket.roomName}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#7C6FE8]" />
              Suất: <strong>{ticket.showTime}</strong> - {ticket.showDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-[#7C6FE8]" />
              Ghế: <strong className="text-[#7C6FE8]">{ticket.seatLabels}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Dashed Line & QR Code Stub */}
      <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-dashed border-gray-200 pt-4 md:pt-0 md:pl-6">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-24 h-24 bg-slate-50 p-2 rounded-xl border border-gray-200 flex items-center justify-center shadow-2xs">
            <img
              src={ticket.qrCodeUrl}
              alt={`QR ${ticket.bookingId}`}
              className="w-full h-full object-contain"
            />
          </div>

          <span className="font-mono text-[11px] font-extrabold text-slate-700">
            #{ticket.bookingId}
          </span>
        </div>

        {/* View Details Action Link */}
        <Link
          href={`/booking/success?booking_id=${ticket.bookingId}&movie=${ticket.movieSlug}&seats=${ticket.seatLabels}&time=${ticket.showTime}&cinema=${encodeURIComponent(
            ticket.cinemaName
          )}`}
        >
          <button className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-[#7C6FE8] text-slate-700 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0">
            <span>Chi tiết vé</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );
};
