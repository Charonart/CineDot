'use client';

import { useState, useEffect } from 'react';
import { MovieListingItem, MovieListingTab } from '../types/movies-listing.types';
import { fetchMoviesListing } from '../services/movies-listing.service';

export function useMoviesListing(initialTab: MovieListingTab = 'now-showing') {
  const [activeTab, setActiveTab] = useState<MovieListingTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<MovieListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchMoviesListing(activeTab, searchQuery);
        if (isMounted) setMovies(data);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [activeTab, searchQuery]);

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    movies,
    loading,
  };
}
