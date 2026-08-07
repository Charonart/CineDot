'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CinemaItem, PricingFormatTab, CinemaPricingFormat } from '../types/cinemas.types';
import { fetchCinemasByCity, fetchPricingFormat } from '../services/cinemas.service';

export function useCinemas() {
  const searchParams = useSearchParams();
  const urlCity = searchParams ? searchParams.get('city') : null;

  const [selectedCity, setSelectedCity] = useState<string>(urlCity || 'TP.Hồ Chí Minh');
  const [cinemas, setCinemas] = useState<CinemaItem[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<CinemaItem | null>(null);
  const [pricingTab, setPricingTab] = useState<PricingFormatTab>('2d');
  const [pricingFormat, setPricingFormat] = useState<CinemaPricingFormat | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync selectedCity when URL parameter changes
  useEffect(() => {
    if (urlCity) {
      setSelectedCity(urlCity);
    }
  }, [urlCity]);

  // Load cinemas when city changes
  useEffect(() => {
    let isMounted = true;
    async function loadCinemas() {
      setLoading(true);
      try {
        const data = await fetchCinemasByCity(selectedCity);
        if (isMounted) {
          setCinemas(data);
          if (data.length > 0) {
            setSelectedCinema(data[0]);
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
  }, [selectedCity]);

  // Load pricing when pricingTab changes
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

  return {
    selectedCity,
    setSelectedCity,
    cinemas,
    selectedCinema,
    setSelectedCinema,
    pricingTab,
    setPricingTab,
    pricingFormat,
    loading,
  };
}
