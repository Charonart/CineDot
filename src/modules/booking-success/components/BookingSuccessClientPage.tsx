/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · genre: modern-minimal · macrostructure: Workbench · theme: White Minimal · component: BookingSuccessClientPage */
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download, Ticket, Home, Check, Sparkles } from 'lucide-react';
import { useBookingSuccess } from '../hooks/useBookingSuccess';
import { BookingStepWizard } from '@/modules/booking/components/BookingStepWizard';
import { DigitalTicketCard } from './DigitalTicketCard';
import { InvalidBookingState } from './InvalidBookingState';
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

  if (loading) {
    return (
      <div className="w-full pt-24 pb-20 bg-[#FAFAFB] min-h-screen">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col gap-8 items-center">
          <Skeleton variant="card" className="w-full h-14 rounded-2xl" />
          <Skeleton variant="card" className="w-full max-w-md h-[560px] rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col font-sans bg-[#FAFAFB] text-gray-900 min-h-screen pt-24 sm:pt-28 pb-24 selection:bg-[#7C6FE8] selection:text-white">
      {/* Main Content Container */}
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-4 sm:py-6 flex flex-col items-center gap-6 sm:gap-8">
          {/* Top Booking Step Completed Ribbon */}
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
                  ? 'Giao dịch đã bị hủy hoặc xảy ra lỗi từ cổng thanh toán. Ghế đã được tự động giải phóng.'
                  : 'Đơn đặt vé này không tồn tại hoặc chưa được thanh toán. Vui lòng kiểm tra lại đơn hàng trong trang cá nhân.'
              }
            />
          ) : (
            /* Valid Verified Digital Ticket Confirmation */
            <>
              {/* Header Success Message */}
              <div className="flex flex-col items-center text-center gap-2 max-w-lg">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-black uppercase tracking-wider">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span>Thanh toán thành công</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
                  Vé Điện Tử CineDot Đã Sẵn Sàng
                </h1>
                <p className="text-xs text-gray-500 font-medium max-w-sm">
                  Thông tin vé đã được lưu vào tài khoản. Xuất trình mã QR trực tiếp tại cửa soát vé để vào phòng chiếu.
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
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md pt-1">
                {/* Download PDF Button */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className={`w-full sm:flex-1 py-3 px-5 rounded-full text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                    downloadSuccess
                      ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                      : 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-[0_4px_14px_rgba(124,111,232,0.3)]'
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
                      <span>{isDownloading ? 'Đang tạo file…' : 'Tải vé điện tử (PDF)'}</span>
                    </>
                  )}
                </motion.button>

                {/* View My Tickets Link */}
                <Link href="/profile" className="w-full sm:flex-1">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-5 rounded-full bg-white border border-gray-200 hover:border-gray-300 text-gray-800 hover:text-gray-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <Ticket className="w-4 h-4 text-[#7C6FE8]" />
                    <span>Xem vé của tôi</span>
                  </motion.button>
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}


