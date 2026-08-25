'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useTrailerStore } from '@/shared/store/trailerStore';

const DynamicTrailerModal = dynamic(
  () => import('./TrailerModal').then((mod) => mod.TrailerModal),
  { ssr: false }
);

export const GlobalTrailerModal: React.FC = () => {
  const {
    isOpen,
    videoSrc,
    poster,
    title,
    videos,
    currentVideoIndex,
    setVideo,
    closeTrailer,
  } = useTrailerStore();

  if (!isOpen) return null;

  return (
    <DynamicTrailerModal
      isOpen={isOpen}
      onClose={closeTrailer}
      videoSrc={videoSrc || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"}
      poster={poster}
      title={title}
      videos={videos}
      currentVideoIndex={currentVideoIndex}
      onSelectVideo={(vid, idx) => {
        const youtubeUrl = `https://www.youtube.com/watch?v=${vid.key}`;
        setVideo(youtubeUrl, `${vid.name}`, idx);
      }}
    />
  );
};
