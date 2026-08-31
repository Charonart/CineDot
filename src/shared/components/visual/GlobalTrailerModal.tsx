'use client';

import React from 'react';
import { useTrailerStore } from '@/shared/store/trailerStore';
import { TrailerModal } from './TrailerModal';

export const GlobalTrailerModal: React.FC = () => {
  const {
    isOpen,
    videoSrc,
    poster,
    title,
    videos,
    images,
    mediaItems,
    currentIndex,
    setCurrentIndex,
    closeTrailer,
  } = useTrailerStore();

  return (
    <TrailerModal
      isOpen={isOpen}
      onClose={closeTrailer}
      videoSrc={videoSrc}
      poster={poster}
      title={title}
      videos={videos}
      images={images}
      mediaItems={mediaItems}
      currentIndex={currentIndex}
      onSelectIndex={(idx) => setCurrentIndex(idx)}
    />
  );
};
