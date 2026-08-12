'use client';

import { useState, useEffect } from 'react';
import { MovieDetail } from '../types/movie-detail.types';
import { fetchMovieDetail } from '../services/movie-detail.service';

export function useMovieDetail(slug: string) {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
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

  return { movie, loading };
}
