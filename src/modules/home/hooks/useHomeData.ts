'use client';

import { useState, useEffect } from 'react';
import { PromoBanner, MovieCardItem, ArticleItem, PromotionItem } from '../types/home.types';
import {
  fetchPromoBanners,
  fetchHomeMovies,
  fetchHomeArticles,
  fetchHomePromotions,
  fetchHomeCinemas,
  HomeCinemaOption,
} from '../services/home.service';

export function useHomeData() {
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [movies, setMovies] = useState<MovieCardItem[]>([]);
  const [cinemas, setCinemas] = useState<HomeCinemaOption[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAllData() {
      try {
        setLoading(true);
        const [bannersData, moviesData, cinemasData, articlesData, promotionsData] = await Promise.all([
          fetchPromoBanners(),
          fetchHomeMovies(),
          fetchHomeCinemas(),
          fetchHomeArticles(),
          fetchHomePromotions(),
        ]);
        if (isMounted) {
          setBanners(bannersData);
          setMovies(moviesData);
          setCinemas(cinemasData);
          setArticles(articlesData);
          setPromotions(promotionsData);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAllData();
    return () => {
      isMounted = false;
    };
  }, []);

  return { banners, movies, cinemas, articles, promotions, loading };
}
