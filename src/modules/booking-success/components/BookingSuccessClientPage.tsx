'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, Ticket, Home, Check } from 'lucide-react';
import { useBookingSuccess } from '../hooks/useBookingSuccess';
import { BookingStepWizard } from '@/modules/booking/components/BookingStepWizard';
import { DigitalTicketCard } from './DigitalTicketCard';
import { Skeleton } from '@/shared/ui/Skeleton';

interface BookingSuccessClientPageProps {
  bookingIdParam?: string;
  movieParam?: string;
  seatsParam?: string;
  dateParam?: string;
  timeParam?: string;
  cinemaParam?: string;
  totalParam?: string;
}

export function BookingSuccessClientPage({
  bookingIdParam,
  movieParam,
  seatsParam,
  dateParam,
  timeParam,
  cinemaParam,
  totalParam,
}: BookingSuccessClientPageProps) {
  const {
    ticket,
    loading,
    isDownloading,
    downloadSuccess,
    handleDownloadPDF,
  } = useBookingSuccess(
    bookingIdParam,
    movieParam,
    seatsParam,
    dateParam,
    timeParam,
    cinemaParam,
    totalParam
  );

  if (loading || !ticket) {
    return (
      <div className="w-full pt-24 pb-20 bg-[#FEFEFE] min-h-screen">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col gap-8 items-center">
          <Skeleton variant="card" className="w-full h-14 rounded-2xl" />
          <Skeleton variant="card" className="w-full max-w-lg h-[600px] rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col font-sans bg-[#FEFEFE] text-[#131413] min-h-screen pt-24 pb-20 selection:bg-[#7C6FE8] selection:text-white">
      {/* 1. Step Wizard Bar (Step 5: Hoàn tất ACTIVE, 100% progress) */}
      <BookingStepWizard currentStep={5} />

      {/* 2. Main Content Container */}
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-8 flex flex-col items-center gap-8">
          {/* Header Success Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center gap-3"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131413] tracking-tight">
              Thanh Toán Thành Công!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md font-medium">
              Cảm ơn bạn đã lựa chọn CineDot. Vé xem phim điện tử của bạn đã được xuất thành công và sẵn sàng sử dụng.
            </p>
          </motion.div>

          {/* Digital Ticket Stub Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full"
          >
            <DigitalTicketCard ticket={ticket} />
          </motion.div>

          {/* Action Buttons Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg pt-2"
          >
            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className={`w-full sm:flex-1 py-3.5 px-6 rounded-full font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-lg shadow-[#7C6FE8]/35'
              }`}
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>ĐÃ TẢI VÉ PDF THÀNH CÔNG</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? 'ĐANG TẠO VÉ PDF...' : 'TẢI VÉ VỀ MÁY (PDF)'}</span>
                </>
              )}
            </button>

            {/* View My Tickets Link (Page 5: /profile) */}
            <Link href="/profile" className="w-full sm:flex-1">
              <button className="w-full py-3.5 px-6 rounded-full bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-700 hover:text-[#7C6FE8] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs">
                <Ticket className="w-4 h-4 text-[#7C6FE8]" />
                <span>Xem tất cả Vé của tôi</span>
              </button>
            </Link>
          </motion.div>

          {/* Return Home Link */}
          <Link href="/">
            <button className="text-xs font-bold text-slate-500 hover:text-[#7C6FE8] flex items-center gap-1.5 transition-colors cursor-pointer pt-2">
              <Home className="w-3.5 h-3.5" />
              <span>Quay về Trang Chủ</span>
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
