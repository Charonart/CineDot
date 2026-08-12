'use client';

import { useState, useEffect } from 'react';
import { MovieDetail, DateOption } from '../types/movie-detail.types';
import { fetchMovieDetail } from '../services/movie-detail.service';
import { MOCK_DATE_OPTIONS, MOCK_CINEMA_GROUPS } from '../mocks/mockMovieDetailData';

export function useMovieDetailData(slug: string) {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [dateOptions, setDateOptions] = useState<DateOption[]>(MOCK_DATE_OPTIONS);
  const [selectedDate, setSelectedDate] = useState<string>('2026-07-30');
  const [cinemas, setCinemas] = useState(MOCK_CINEMA_GROUPS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchMovieDetail(slug);
        if (isMounted) setMovie(data);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  return {
    movie,
    dateOptions,
    selectedDate,
    setSelectedDate,
    cinemas,
    recommended: [],
    loading,
  };
}
