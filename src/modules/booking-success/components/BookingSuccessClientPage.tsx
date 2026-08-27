/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · genre: modern-minimal · macrostructure: Workbench · theme: White Minimal · component: BookingSuccessClientPage */
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
  showtimeIdParam?: string;
  statusParam?: string;
}

export function BookingSuccessClientPage({
  bookingIdParam,
  movieParam,
  seatsParam,
  dateParam,
  timeParam,
  cinemaParam,
  totalParam,
  showtimeIdParam,
  statusParam,
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
    totalParam,
    showtimeIdParam
  );

  if (loading || !ticket) {
    return (
      <div className="w-full pt-28 pb-20 bg-[#FAFAFB] min-h-screen">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col gap-8 items-center">
          <Skeleton variant="card" className="w-full h-14 rounded-2xl" />
          <Skeleton variant="card" className="w-full max-w-lg h-[540px] rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col font-sans bg-[#FAFAFB] text-gray-900 min-h-screen pt-20 pb-24 selection:bg-[#7C6FE8] selection:text-white">
      {/* 1. Step Wizard Bar (Step 5: Hoàn tất) */}
      <BookingStepWizard currentStep={5} />

      {/* 2. Main Content Container */}
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center gap-6 sm:gap-8">
          {/* Header Success / Error Message */}
          <div className="flex flex-col items-center text-center gap-2 max-w-lg">
            {statusParam === 'failed' || statusParam === 'invalid_signature' ? (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  <span>Giao dịch không thành công</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 tracking-tight">
                  Thanh toán chưa hoàn tất
                </h1>
                <p className="text-xs text-gray-500 font-normal">
                  Giao dịch của bạn đã bị gián đoạn hoặc hủy bỏ. Ghế đã được tự động mở lại.
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Giao dịch hoàn tất</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 tracking-tight">
                  Đặt vé thành công
                </h1>
                <p className="text-xs text-gray-500 font-normal">
                  Vé xem phim điện tử của bạn đã được khởi tạo. Xuất trình mã QR tại cửa soát vé để vào rạp.
                </p>
              </>
            )}
          </div>

          {/* Digital Ticket Stub Card */}
          {statusParam !== 'failed' && statusParam !== 'invalid_signature' && (
            <div className="w-full">
              <DigitalTicketCard ticket={ticket} />
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-lg pt-1">
            {/* Download PDF Button */}
            {statusParam !== 'failed' && statusParam !== 'invalid_signature' && (
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className={`w-full sm:flex-1 py-2.5 px-5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  downloadSuccess
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-xs'
                }`}
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Đã tải vé PDF</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{isDownloading ? 'Đang tạo PDF…' : 'Tải vé PDF'}</span>
                  </>
                )}
              </button>
            )}

            {/* View My Tickets Link */}
            <Link href="/profile" className="w-full sm:flex-1">
              <button
                type="button"
                className="w-full py-2.5 px-5 rounded-full bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-950 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <Ticket className="w-4 h-4 text-[#7C6FE8]" />
                <span>Vé của tôi</span>
              </button>
            </Link>
          </div>


          {/* Return Home Link */}
          <Link href="/">
            <button
              type="button"
              className="text-xs font-bold text-gray-500 hover:text-[#7C6FE8] flex items-center gap-1.5 transition-colors cursor-pointer pt-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Quay về Trang Chủ</span>
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}

