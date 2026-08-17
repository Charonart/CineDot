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
  showtimeIdParam?: string
) {
  const [ticket, setTicket] = useState<DigitalTicketInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadTicketData() {
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
        if (isMounted) setTicket(data);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadTicketData();
    return () => {
      isMounted = false;
    };
  }, [bookingIdParam, movieParam, seatsParam, dateParam, timeParam, cinemaParam, totalParam, showtimeIdParam]);

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1500);
  };

  return {
    ticket,
    loading,
    isDownloading,
    downloadSuccess,
    handleDownloadPDF,
  };
}
