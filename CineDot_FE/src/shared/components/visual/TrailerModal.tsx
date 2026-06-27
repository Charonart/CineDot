'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { VideoPlayer } from './VideoPlayer';

export interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc?: string;
  poster?: string;
  title?: string;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  videoSrc,
  poster,
  title = 'CINE Trailer',
}) => {
  const [mounted, setMounted] = useState(false);

  // Set mounted state on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div 
      className="modal-overlay open" 
      id="trailerModal"
      onClick={onClose}
    >
      <div 
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          type="button"
          className="modal-close" 
          id="closeModal" 
          aria-label="Đóng"
          onClick={onClose}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Cinematic Video Player */}
        <VideoPlayer
          src={videoSrc}
          poster={poster}
          title={title}
          autoPlay={true}
          muted={false}
        />
      </div>
    </div>,
    document.body
  );
};
