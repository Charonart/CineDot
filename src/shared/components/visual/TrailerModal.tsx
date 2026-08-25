'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoPlayer } from './VideoPlayer';
import { Play, Video as VideoIcon, Film, X } from 'lucide-react';
import { TrailerVideoItem } from '@/shared/store/trailerStore';

export interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc?: string;
  poster?: string;
  title?: string;
  videos?: TrailerVideoItem[];
  currentVideoIndex?: number;
  onSelectVideo?: (video: TrailerVideoItem, index: number) => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  videoSrc,
  poster,
  title = 'CineDot Trailer',
  videos = [],
  currentVideoIndex = 0,
  onSelectVideo,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const hasMultipleVideos = videos && videos.length > 1;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-5xl rounded-3xl bg-[#0F1015] border border-white/15 overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8)] flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/90 border-b border-white/10">
              <div className="flex items-center gap-2.5 min-w-0 pr-4">
                <div className="w-8 h-8 rounded-xl bg-[#7C6FE8] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#7C6FE8]/30">
                  <Film className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-white truncate">
                  {title}
                </h3>
              </div>

              <button
                type="button"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#7C6FE8] text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer shrink-0"
                aria-label="Đóng"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player Box with generous standard 16:9 height */}
            <div className="w-full aspect-video min-h-[340px] sm:min-h-[460px] md:min-h-[540px] lg:min-h-[580px] bg-black flex items-center justify-center overflow-hidden">
              <VideoPlayer
                src={videoSrc}
                poster={poster}
                title={title}
                autoPlay={true}
                muted={false}
                className="w-full h-full"
              />
            </div>

            {/* Bottom Video Playlist Selector (Appears when movie has multiple videos) */}
            {hasMultipleVideos && (
              <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#7C6FE8] flex items-center gap-1.5">
                    <VideoIcon className="w-3.5 h-3.5" />
                    <span>DANH SÁCH TRAILERS & CLIP HẬU TRƯỜNG ({videos.length})</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {videos.map((vid, idx) => {
                    const isSelected = idx === currentVideoIndex;
                    const thumb = vid.thumbnailUrl || (vid.key ? `https://img.youtube.com/vi/${vid.key}/hqdefault.jpg` : poster);

                    return (
                      <div
                        key={vid.id || idx}
                        onClick={() => onSelectVideo && onSelectVideo(vid, idx)}
                        className={`group shrink-0 w-44 sm:w-52 p-2 rounded-2xl flex flex-col gap-1.5 cursor-pointer border transition-all ${
                          isSelected
                            ? 'bg-purple-950/60 border-[#7C6FE8] ring-2 ring-[#7C6FE8]/50'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-300'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900">
                          <img
                            src={thumb}
                            alt={vid.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md ${
                              isSelected ? 'bg-[#7C6FE8] text-white' : 'bg-black/60 text-white group-hover:bg-[#7C6FE8]'
                            }`}>
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            </div>
                          </div>
                          {vid.type && (
                            <span className="absolute top-1.5 left-1.5 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/70 text-white backdrop-blur-xs">
                              {vid.type}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <span className={`text-[11px] font-bold truncate ${
                          isSelected ? 'text-[#7C6FE8]' : 'text-slate-300 group-hover:text-white'
                        }`}>
                          {vid.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
