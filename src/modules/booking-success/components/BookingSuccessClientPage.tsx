/* Hallmark · genre: modern-minimal · macrostructure: Physical Ticket Centerpiece · theme: White Minimal / Iris Cinema */
/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Download,
  Ticket,
  Home,
  Check,
  Calendar,
  Share2,
  Film,
} from 'lucide-react';
import { useBookingSuccess } from '../hooks/useBookingSuccess';
import { BookingStepWizard } from '@/modules/booking/components/BookingStepWizard';
import { DigitalTicketCard } from './DigitalTicketCard';
import { InvalidBookingState } from './InvalidBookingState';
import { Skeleton } from '@/shared/ui/Skeleton';
import { clearBookingSession } from '@/modules/booking/services/bookingSessionService';
import { resetBookingTimer } from '@/modules/booking/services/bookingTimerService';

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
    isInvalid,
    isDownloading,
    downloadSuccess,
    isCopied,
    isShared,
    handleDownloadPDF,
    handleCopyBookingCode,
    handleAddToCalendar,
    handleShareTicket,
  } = useBookingSuccess(
    bookingIdParam,
    movieParam,
    seatsParam,
    dateParam,
    timeParam,
    cinemaParam,
    totalParam,
    showtimeIdParam,
    statusParam
  );

  // Clean up booking session & prevent browser Back navigation into payment/holding steps
  useEffect(() => {
    if (!ticket) return;

    // 1. Clear temporary booking session in localStorage/sessionStorage
    clearBookingSession(showtimeIdParam || '');
    resetBookingTimer();

    // 2. Prevent browser Back button into previous payment/hold steps
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', window.location.href);

      const handlePopState = () => {
        window.history.pushState(null, '', window.location.href);
        window.location.replace('/profile?tab=tickets');
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [ticket, showtimeIdParam]);

  if (loading) {
    return (
      <div className="w-full pt-28 pb-16 bg-[#F8F9FD] min-h-screen">
        <div className="max-w-md mx-auto px-4 flex flex-col gap-6 items-center">
          <Skeleton variant="card" className="w-full h-12 rounded-full" />
          <Skeleton variant="card" className="w-full h-[540px] rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col font-sans bg-[#F8F9FD] text-[#0F172A] min-h-screen pt-20 sm:pt-24 pb-16 selection:bg-[#7C6FE8] selection:text-white relative overflow-x-clip">
      {/* Ambient subtle light glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#7C6FE8]/8 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main Content Container */}
      <main className="w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-5">
          {/* Top Booking Step Wizard */}
          {!isInvalid && ticket && (
            <div className="w-full max-w-2xl">
              <BookingStepWizard
                currentStep={5}
                showtimeId={showtimeIdParam}
                movieSlug={movieParam}
                seatsParam={seatsParam}
                dateParam={dateParam}
                timeParam={timeParam}
                cinemaParam={cinemaParam}
              />
            </div>
          )}

          {isInvalid || !ticket ? (
            /* Unverified / Invalid Booking State */
            <InvalidBookingState
              message={
                statusParam === 'failed' || statusParam === 'invalid_signature'
                  ? 'Giao dịch thanh toán chưa hoàn tất'
                  : 'Không tìm thấy thông tin đơn đặt vé hợp lệ'
              }
              subMessage={
                statusParam === 'failed' || statusParam === 'invalid_signature'
                  ? 'Giao dịch đã bị hủy hoặc xảy ra lỗi từ cổng thanh toán. Ghế đã được tự động giải phóng an toàn.'
                  : 'Đơn đặt vé này không tồn tại hoặc chưa được xác nhận thanh toán thành công. Vui lòng kiểm tra lại đơn hàng trong trang cá nhân.'
              }
            />
          ) : (
            /* Valid Verified Digital Ticket Confirmation Layout */
            <div className="w-full flex flex-col items-center gap-4">
              {/* Header Title Block */}
              <div className="flex flex-col items-center text-center gap-1.5 max-w-md">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span>Đặt Vé Thành Công</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Vé Điện Tử CineDot
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Xuất trình mã QR tại cửa soát vé hoặc quầy bắp nước để vào phòng chiếu.
                </p>
              </div>

              {/* Centerpiece: The Digital Cinema Boarding Pass Ticket */}
              <DigitalTicketCard
                ticket={ticket}
                isCopied={isCopied}
                onCopyCode={handleCopyBookingCode}
              />

              {/* Primary Action Buttons Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full max-w-[440px] pt-1">
                {/* Download Pass Button */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className={`w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                    downloadSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white active:scale-95'
                  }`}
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>ĐÃ TẢI VÉ</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>{isDownloading ? 'ĐANG TẢI…' : 'TẢI VÉ PASS'}</span>
                    </>
                  )}
                </motion.button>

                {/* View in My Tickets Link */}
                <Link href="/profile?tab=tickets" className="w-full sm:flex-1">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-4 rounded-xl bg-white border border-slate-200 hover:border-[#7C6FE8] text-slate-800 hover:text-[#7C6FE8] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Ticket className="w-4 h-4 text-[#7C6FE8]" />
                    <span>Xem Vé Của Tôi</span>
                  </motion.button>
                </Link>
              </div>

              {/* Secondary Utility Links */}
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={handleAddToCalendar}
                  className="hover:text-[#7C6FE8] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#7C6FE8]" />
                  <span>Thêm vào lịch</span>
                </button>

                <span className="text-slate-300">•</span>

                <button
                  type="button"
                  onClick={handleShareTicket}
                  className="hover:text-[#7C6FE8] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#7C6FE8]" />
                  <span>{isShared ? 'Đã sao chép link!' : 'Chia sẻ vé'}</span>
                </button>

                <span className="text-slate-300">•</span>

                <Link
                  href="/"
                  className="hover:text-[#7C6FE8] flex items-center gap-1 transition-colors"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Trang chủ</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
