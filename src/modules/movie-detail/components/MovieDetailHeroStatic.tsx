/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface MovieDetailHeroStaticProps {
  backdrop: string;
  title: string;
  onPlayTrailer: () => void;
}

export const MovieDetailHeroStatic: React.FC<MovieDetailHeroStaticProps> = ({ backdrop, title, onPlayTrailer }) => {
  return (
    <section className="detail-hero">
      <div className="detail-hero-backdrop">
        <img src={backdrop} alt={`${title} Backdrop`} />
      </div>
      <div className="detail-hero-overlay"></div>
      <div className="detail-hero-content">
        <div className="trailer-play-wrapper fade-up in-view">
          <button 
            type="button"
            className="trailer-play-button" 
            id="openTrailerBtn" 
            aria-label="Xem trailer"
            onClick={onPlayTrailer}
          >
            <svg className="trailer-play-icon" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
