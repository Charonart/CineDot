'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MoviesPageHeader, CategoryType } from '@modules/movie/components/MoviesPageHeader';
import { MoviesListingCard } from '@modules/movie/components/MoviesListingCard';
import { CINE_MOVIES_DB, MovieListingItem } from '@modules/movie/data/moviesListingData';
import { TrailerModal } from '@/shared/components/visual';

export default function MoviesPageContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<CategoryType>('now-showing');
  const [activeTrailerMovie, setActiveTrailerMovie] = useState<MovieListingItem | null>(null);

  // Sync active tab with search parameter on initial load
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const supportedTabs: CategoryType[] = ['now-showing', 'coming-soon', 'imax', 'nationwide'];
    
    if (categoryParam && supportedTabs.includes(categoryParam as CategoryType)) {
      setActiveTab(categoryParam as CategoryType);
    } else {
      setActiveTab('now-showing');
    }
  }, [searchParams]);

  // Handle Tab Switch & URL parameter syncing dynamically (SPA mode)
  const handleTabChange = (tab: CategoryType) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined' && window.history.pushState) {
      const newUrl = `${window.location.pathname}?category=${tab}`;
      window.history.pushState({ category: tab }, '', newUrl);
    }
  };

  // Filter the central movie mock database
  const filteredMovies = CINE_MOVIES_DB.filter((movie) => {
    if (activeTab === 'nationwide') {
      return true; // Show all movies
    }
    return movie.category === activeTab;
  });

  return (
    <main className="movies-page">
      
      {/* PAGE HEADER & DYNAMIC CATEGORY TABS */}
      <MoviesPageHeader activeTab={activeTab} onChangeTab={handleTabChange} />

      {/* MOVIES CONTENT GRID SECTION */}
      <section className="movies-content-section fade-up in-view">
        <div className="container">
          
          <div className="movies-grid-container">
            {filteredMovies.length === 0 ? (
              <div className="movies-empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                  <line x1="7" y1="2" x2="7" y2="22" />
                  <line x1="17" y1="2" x2="17" y2="22" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <line x1="2" y1="7" x2="7" y2="7" />
                  <line x1="2" y1="17" x2="7" y2="17" />
                  <line x1="17" y1="17" x2="22" y2="17" />
                  <line x1="17" y1="7" x2="22" y2="7" />
                </svg>
                <h3>Không tìm thấy phim phù hợp</h3>
                <p>Thử đổi danh mục để tìm kiếm thêm phim chiếu rạp.</p>
              </div>
            ) : (
              <div className="movies-grid show" id="moviesGrid">
                {filteredMovies.map((movie) => (
                  <MoviesListingCard 
                    key={movie.id} 
                    movie={movie} 
                    onPlayTrailer={(selectedMovie) => setActiveTrailerMovie(selectedMovie)} 
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* CINEMATIC TRAILER MODAL */}
      <TrailerModal
        isOpen={!!activeTrailerMovie}
        onClose={() => setActiveTrailerMovie(null)}
        videoSrc={activeTrailerMovie?.trailerSrc}
        poster={activeTrailerMovie?.poster}
        title={activeTrailerMovie?.title || ''}
      />

    </main>
  );
}
