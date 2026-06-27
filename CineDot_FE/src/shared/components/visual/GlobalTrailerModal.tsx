'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useTrailerStore } from '@/shared/store/trailerStore';

const DynamicTrailerModal = dynamic(
  () => import('./TrailerModal').then((mod) => mod.TrailerModal),
  { ssr: false }
);

export const GlobalTrailerModal: React.FC = () => {
  const { isOpen, videoSrc, poster, title, closeTrailer } = useTrailerStore();

  if (!isOpen) return null;

  return (
    <DynamicTrailerModal
      isOpen={isOpen}
      onClose={closeTrailer}
      videoSrc={videoSrc || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"}
      poster={poster}
      title={title}
    />
  );
};
