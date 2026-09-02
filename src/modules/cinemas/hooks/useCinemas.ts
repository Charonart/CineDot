'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CinemaItem,
  PricingFormatTab,
  CinemaPricingFormat,
  CinemaMovieShowtime,
} from '../types/cinemas.types';
import {
  fetchCities,
  fetchCinemasByCity,
  fetchCinemaDetail,
  fetchPricingFormat,
  fetchCinemaShowtimes,
} from '../services/cinemas.service';

export function useCinemas() {
  const searchParams = useSearchParams();
  const urlCity = searchParams ? searchParams.get('city') : null;
  const urlCinema = searchParams ? searchParams.get('cinema') : null;

  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>(urlCity || 'Tất cả thành phố');
  const [cinemas, setCinemas] = useState<CinemaItem[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<CinemaItem | null>(null);
  const [pricingTab, setPricingTab] = useState<PricingFormatTab>('2d');
  const [pricingFormat, setPricingFormat] = useState<CinemaPricingFormat | null>(null);
  const [showtimes, setShowtimes] = useState<CinemaMovieShowtime[]>([]);
  const [showtimeDate, setShowtimeDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingShowtimes, setLoadingShowtimes] = useState<boolean>(false);

  // 1. Load city options once
  useEffect(() => {
    let isMounted = true;
    async function loadCityList() {
      const cityList = await fetchCities();
      if (isMounted) {
        setCities(cityList);
      }
    }
    loadCityList();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Sync selectedCity when URL parameter changes
  useEffect(() => {
    if (urlCity) {
      setSelectedCity(urlCity);
    }
  }, [urlCity]);

  // 3. Load cinemas when city changes
  useEffect(() => {
    let isMounted = true;
    async function loadCinemas() {
      setLoading(true);
      try {
        const data = await fetchCinemasByCity(selectedCity);
        if (isMounted) {
          setCinemas(data);
          if (data.length > 0) {
            // Check if urlCinema matches any
            const matched = urlCinema ? data.find((c) => c.slug === urlCinema) : null;
            setSelectedCinema(matched || data[0]);
          } else {
            setSelectedCinema(null);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadCinemas();
    return () => {
      isMounted = false;
    };
  }, [selectedCity, urlCinema]);

  // 3.5. Load cinema rooms and details when selectedCinema changes
  useEffect(() => {
    if (!selectedCinema?.slug) return;
    let isMounted = true;
    async function loadDetail() {
      const detail = await fetchCinemaDetail(selectedCinema!.slug);
      if (isMounted && detail && detail.rooms && detail.rooms.length > 0) {
        setSelectedCinema((prev) => (prev ? { ...prev, ...detail } : detail));
      }
    }
    if (!selectedCinema.rooms || selectedCinema.rooms.length === 0) {
      loadDetail();
    }
    return () => {
      isMounted = false;
    };
  }, [selectedCinema?.slug]);

  // 4. Load pricing when pricingTab changes
  useEffect(() => {
    let isMounted = true;
    async function loadPricing() {
      const data = await fetchPricingFormat(pricingTab);
      if (isMounted) setPricingFormat(data);
    }
    loadPricing();
    return () => {
      isMounted = false;
    };
  }, [pricingTab]);

  // 5. Load showtimes when selectedCinema or showtimeDate changes
  useEffect(() => {
    if (!selectedCinema?.slug) {
      setShowtimes([]);
      return;
    }

    let isMounted = true;
    async function loadShowtimes() {
      setLoadingShowtimes(true);
      try {
        const data = await fetchCinemaShowtimes(selectedCinema!.slug, showtimeDate);
        if (isMounted) setShowtimes(data);
      } finally {
        if (isMounted) setLoadingShowtimes(false);
      }
    }
    loadShowtimes();
    return () => {
      isMounted = false;
    };
  }, [selectedCinema?.slug, showtimeDate]);

  return {
    cities,
    selectedCity,
    setSelectedCity,
    cinemas,
    selectedCinema,
    setSelectedCinema,
    pricingTab,
    setPricingTab,
    pricingFormat,
    showtimes,
    showtimeDate,
    setShowtimeDate,
    loading,
    loadingShowtimes,
  };
}
