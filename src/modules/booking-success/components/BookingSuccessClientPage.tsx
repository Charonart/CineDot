/* Hallmark · genre: modern-minimal · macrostructure: Bento Grid · theme: White Minimal / Iris Cinema · nav: N5 · footer: Ft5 */
/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download, Ticket, Home, Check, Sparkles, Film, ArrowRight, Share2 } from 'lucide-react';
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
    handleDownloadPDF,
    handleCopyBookingCode,
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
        // When user presses browser Back, forward safely to My Tickets in Profile
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
      <div className="w-full pt-28 pb-20 bg-[#F8F9FD] min-h-screen">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col gap-8 items-center">
          <Skeleton variant="card" className="w-full h-14 rounded-full" />
          <Skeleton variant="card" className="w-full max-w-lg h-[620px] rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col font-sans bg-[#F8F9FD] text-[#0F172A] min-h-screen pt-24 sm:pt-28 pb-24 selection:bg-[#7C6FE8] selection:text-white relative overflow-x-clip">
      {/* Ambient Radial Mesh Glow */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[1100px] h-[450px] bg-gradient-to-b from-[#7C6FE8]/8 via-indigo-500/4 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main Content Container */}
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-4 sm:py-6 flex flex-col items-center gap-6 sm:gap-8">
          {/* Top Booking Step Completed Ribbon (Matching Exact Full-Width Container of Previous Steps) */}
          {!isInvalid && ticket && (
            <div className="w-full">
              <BookingStepWizard
                currentStep={5}
                showtimeId={showtimeIdParam}
                movieSlug={movieParam}
                seatsParam={seatsParam}
                dateParam={dateParam}
                timeParam={timeParam}
                cinemaParam={cinemaParam}
                className="mb-2"
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
                  : 'Đơn đặt vé này không tồn tại hoặc chưa được thanh toán thành công. Vui lòng kiểm tra lại đơn hàng trong trang cá nhân.'
              }
            />
          ) : (
            /* Valid Verified Digital Ticket Confirmation */
            <>
              {/* Header Success Message */}
              <div className="flex flex-col items-center text-center gap-2.5 max-w-lg">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider shadow-2xs">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>Thanh Toán Thành Công</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Vé Điện Tử CineDot Đã Sẵn Sàng
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md leading-relaxed">
                  Thông tin vé đã được lưu vào mục <strong>Vé Của Tôi</strong>. Xuất trình mã QR trực tiếp tại quầy hoặc cửa soát vé để vào phòng chiếu.
                </p>
              </div>

              {/* Digital Ticket Stub Card */}
              <div className="w-full">
                <DigitalTicketCard
                  ticket={ticket}
                  isCopied={isCopied}
                  onCopyCode={handleCopyBookingCode}
                />
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-lg pt-2">
                {/* Download PDF Button */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className={`w-full sm:flex-1 py-3.5 px-6 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                    downloadSuccess
                      ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-[#7C6FE8] to-indigo-600 hover:from-[#685bc7] hover:to-indigo-700 text-white shadow-[#7C6FE8]/30 active:scale-95'
                  }`}
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>ĐÃ TẢI VÉ PDF</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>{isDownloading ? 'ĐANG TẠO FILE…' : 'TẢI VÉ ĐIỆN TỬ (PDF)'}</span>
                    </>
                  )}
                </motion.button>

                {/* View My Tickets Link */}
                <Link href="/profile?tab=tickets" className="w-full sm:flex-1">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3.5 px-6 rounded-2xl bg-white border border-slate-200 hover:border-[#7C6FE8] text-slate-800 hover:text-[#7C6FE8] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow-md active:scale-95"
                  >
                    <Ticket className="w-4 h-4 text-[#7C6FE8]" />
                    <span>Xem Vé Của Tôi</span>
                  </motion.button>
                </Link>
              </div>

              {/* Extra Secondary Links Row */}
              <div className="flex items-center gap-6 pt-2 text-xs font-bold text-slate-500">
                <Link
                  href="/movies"
                  className="hover:text-[#7C6FE8] flex items-center gap-1.5 transition-colors"
                >
                  <Film className="w-3.5 h-3.5 text-[#7C6FE8]" />
                  <span>Đặt thêm vé phim khác</span>
                </Link>

                <span className="text-slate-300">•</span>

                <Link
                  href="/"
                  className="hover:text-[#7C6FE8] flex items-center gap-1.5 transition-colors"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Quay về Trang Chủ</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
