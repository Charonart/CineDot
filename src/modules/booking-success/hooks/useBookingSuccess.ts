'use client';

import { useState, useEffect } from 'react';
import { DigitalTicketInfo } from '../types/booking-success.types';
import { fetchDigitalTicket } from '../services/booking-success.service';

export function useBookingSuccess(
  bookingIdParam?: string,
  movieParam?: string,
  seatsParam?: string,
  dateParam?: string,
  timeParam?: string,
  cinemaParam?: string,
  totalParam?: string,
  showtimeIdParam?: string,
  statusParam?: string
) {
  const [ticket, setTicket] = useState<DigitalTicketInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadTicketData() {
      // If status explicitly failed or signature invalid
      if (statusParam === 'failed' || statusParam === 'invalid_signature') {
        if (isMounted) {
          setTicket(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const data = await fetchDigitalTicket(
          bookingIdParam,
          movieParam,
          seatsParam,
          dateParam,
          timeParam,
          cinemaParam,
          totalParam,
          showtimeIdParam
        );
        if (isMounted) {
          setTicket(data);
        }
      } catch {
        if (isMounted) setTicket(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTicketData();
    return () => {
      isMounted = false;
    };
  }, [
    bookingIdParam,
    movieParam,
    seatsParam,
    dateParam,
    timeParam,
    cinemaParam,
    totalParam,
    showtimeIdParam,
    statusParam,
  ]);

  const handleDownloadPDF = () => {
    if (!ticket) return;
    setIsDownloading(true);

    // Simulate instant secure digital ticket generation
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);

      // Trigger automatic printable view if desired or generate simple pass
      if (typeof window !== 'undefined') {
        const blob = new Blob(
          [
            `==============================================
CINEDOT IMAX DIGITAL PASS - VÉ XEM PHIM ĐIỆN TỬ
==============================================
Mã Đặt Vé: #${ticket.bookingCode || ticket.bookingId}
Phim: ${ticket.movieTitle} (${ticket.movieFormat})
Rạp: ${ticket.cinemaName} - ${ticket.roomName}
Địa chỉ: ${ticket.cinemaAddress || 'CineDot Cinema Vietnam'}
Suất Chiếu: ${ticket.showTime} - ${ticket.showDate}
Vị Trí Ghế: ${ticket.seatLabels}
Tổng Thanh Toán: ${ticket.totalPaid.toLocaleString('vi-VN')} VND (${ticket.paymentMethodName})
Mã Giao Dịch: ${ticket.transactionNo || 'VNPAY-VERIFIED'}
Trạng Thái: ĐÃ THANH TOÁN (HỢP LỆ)
==============================================
Hướng dẫn: Vui lòng xuất trình mã QR trên điện thoại
tại quầy soát vé trước giờ chiếu 15 phút.
==============================================`,
          ],
          { type: 'text/plain;charset=utf-8' }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CineDot_Pass_${ticket.bookingCode || ticket.bookingId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, 1200);
  };

  const handleCopyBookingCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleAddToCalendar = () => {
    if (!ticket || typeof window === 'undefined') return;

    // Create an iCalendar (.ics) string
    const title = `🎬 Xem phim: ${ticket.movieTitle} tại ${ticket.cinemaName}`;
    const description = `Vé xem phim CineDot IMAX\\nPhòng: ${ticket.roomName}\\nGhế: ${ticket.seatLabels}\\nMã vé: #${ticket.bookingCode || ticket.bookingId}\\nTổng tiền: ${ticket.totalPaid.toLocaleString('vi-VN')}đ`;
    const location = `${ticket.cinemaName}, ${ticket.cinemaAddress || ''}`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CineDot//Cinema Ticketing//VI',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CineDot_${ticket.bookingCode || 'Ticket'}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShareTicket = () => {
    if (!ticket || typeof window === 'undefined') return;

    const shareData = {
      title: `Vé xem phim ${ticket.movieTitle} - CineDot`,
      text: `Mình đã đặt vé xem phim "${ticket.movieTitle}" tại ${ticket.cinemaName} lúc ${ticket.showTime} ngày ${ticket.showDate}. Ghế: ${ticket.seatLabels}!`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `🎬 Vé Xem Phim CineDot: ${ticket.movieTitle} | ${ticket.showTime} ${ticket.showDate} | Ghế: ${ticket.seatLabels} | ${window.location.href}`
      );
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return {
    ticket,
    loading,
    isInvalid: !loading && !ticket,
    isDownloading,
    downloadSuccess,
    isCopied,
    isShared,
    handleDownloadPDF,
    handleCopyBookingCode,
    handleAddToCalendar,
    handleShareTicket,
    handlePrint,
  };
}
