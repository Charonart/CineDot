'use client';

import { useState, useEffect } from 'react';
import { MovieListingItem, MovieListingTab } from '../types/movies-listing.types';
import { fetchMoviesListing } from '../services/movies-listing.service';
import { masterDataService, GenreItem } from '@/shared/services/masterData.service';

export function useMoviesListing(initialTab: MovieListingTab = 'now-showing') {
  const [activeTab, setActiveTab] = useState<MovieListingTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenreId, setSelectedGenreId] = useState<string | number>('all');
  const [genres, setGenres] = useState<GenreItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [movies, setMovies] = useState<MovieListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load genres list
  useEffect(() => {
    let isMounted = true;
    async function loadGenres() {
      try {
        const data = await masterDataService.getGenres();
        if (isMounted && data.length > 0) {
          setGenres(data);
        }
      } catch {
        // Fallback
      }
    }
    loadGenres();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetchMoviesListing(activeTab, searchQuery, selectedGenreId, page);
        if (isMounted) {
          setMovies(res.movies);
          setTotalPages(res.totalPages);
          setTotalResults(res.totalResults);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [activeTab, searchQuery, selectedGenreId, page]);

  return {
    activeTab,
    setActiveTab: (t: MovieListingTab) => {
      setActiveTab(t);
      setPage(1);
    },
    searchQuery,
    setSearchQuery: (q: string) => {
      setSearchQuery(q);
      setPage(1);
    },
    selectedGenreId,
    setSelectedGenreId: (g: string | number) => {
      setSelectedGenreId(g);
      setPage(1);
    },
    genres,
    page,
    setPage,
    totalPages,
    totalResults,
    movies,
    loading,
  };
}
