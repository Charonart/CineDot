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
  }, [bookingIdParam, movieParam, seatsParam, dateParam, timeParam, cinemaParam, totalParam, showtimeIdParam, statusParam]);

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1500);
  };

  const handleCopyBookingCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return {
    ticket,
    loading,
    isInvalid: !loading && !ticket,
    isDownloading,
    downloadSuccess,
    isCopied,
    handleDownloadPDF,
    handleCopyBookingCode,
  };
}

