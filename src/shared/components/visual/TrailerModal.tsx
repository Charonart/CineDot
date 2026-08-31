'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoPlayer } from './VideoPlayer';
import { X, Play, Image as ImageIcon, ChevronLeft, ChevronRight, Film } from 'lucide-react';
import { MediaGalleryItem, TrailerVideoItem } from '@/shared/store/trailerStore';

export interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc?: string;
  poster?: string;
  title?: string;
  videos?: TrailerVideoItem[];
  images?: string[];
  mediaItems?: MediaGalleryItem[];
  currentIndex?: number;
  onSelectIndex?: (index: number) => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  videoSrc,
  poster,
  title = 'CineDot Media',
  videos = [],
  images = [],
  mediaItems = [],
  currentIndex = 0,
  onSelectIndex,
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'image'>('all');
  const [internalIndex, setInternalIndex] = useState(currentIndex);
  const filmstripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setInternalIndex(currentIndex);
  }, [currentIndex, isOpen]);

  // Combine items into consolidated media list if mediaItems is empty
  const allItems: MediaGalleryItem[] = useMemo(() => {
    if (mediaItems && mediaItems.length > 0) {
      return mediaItems;
    }

    const list: MediaGalleryItem[] = [];

    // 1. Videos
    if (videos && videos.length > 0) {
      videos.forEach((v, idx) => {
        list.push({
          id: v.id || `v-${idx}`,
          type: 'video',
          src: v.key ? `https://www.youtube.com/watch?v=${v.key}` : videoSrc || '',
          thumbnailUrl: v.thumbnailUrl || (v.key ? `https://img.youtube.com/vi/${v.key}/hqdefault.jpg` : poster),
          title: v.name || `${title} • Video ${idx + 1}`,
          tag: v.type || 'Trailer',
        });
      });
    } else if (videoSrc) {
      list.push({
        id: 'main-video',
        type: 'video',
        src: videoSrc,
        thumbnailUrl: poster,
        title: `${title} • Official Trailer`,
        tag: 'Trailer',
      });
    }

    // 2. Poster / Backdrop / Images
    if (poster) {
      list.push({
        id: 'main-poster',
        type: 'image',
        src: poster,
        thumbnailUrl: poster,
        title: `${title} • Poster`,
        tag: 'Poster',
      });
    }

    if (images && images.length > 0) {
      images.forEach((img, idx) => {
        if (img !== poster) {
          list.push({
            id: `img-${idx}`,
            type: 'image',
            src: img,
            thumbnailUrl: img,
            title: `${title} • Hình ảnh ${idx + 1}`,
            tag: 'Hình ảnh',
          });
        }
      });
    }

    return list;
  }, [mediaItems, videos, images, videoSrc, poster, title]);

  const videoCount = useMemo(() => allItems.filter((i) => i.type === 'video').length, [allItems]);
  const imageCount = useMemo(() => allItems.filter((i) => i.type === 'image').length, [allItems]);

  // Filter items by active tab
  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return allItems;
    return allItems.filter((item) => item.type === activeTab);
  }, [allItems, activeTab]);

  const safeIndex = Math.min(Math.max(0, internalIndex), Math.max(0, filteredItems.length - 1));
  const activeItem = filteredItems[safeIndex] || allItems[0];

  const handleSelect = (idx: number) => {
    setInternalIndex(idx);
    if (onSelectIndex) {
      onSelectIndex(idx);
    }
  };

  const handlePrev = () => {
    const nextIdx = safeIndex > 0 ? safeIndex - 1 : filteredItems.length - 1;
    handleSelect(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = safeIndex < filteredItems.length - 1 ? safeIndex + 1 : 0;
    handleSelect(nextIdx);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
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
  }, [isOpen, safeIndex, filteredItems.length, onClose]);

  // Auto-scroll filmstrip to active item
  useEffect(() => {
    if (filmstripRef.current) {
      const activeEl = filmstripRef.current.children[safeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [safeIndex]);

  if (!mounted) return null;

  const showTabs = videoCount > 0 && imageCount > 0;
  const showFilmstrip = filteredItems.length > 1;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/92 backdrop-blur-2xl p-2 sm:p-6 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-5xl flex flex-col gap-3 my-auto text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar: Tabs & Close Action */}
            <div className="flex items-center justify-between px-1.5 py-1">
              {/* Left: Title & Tabs */}
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7C6FE8] shadow-[0_0_10px_rgba(124,111,232,0.8)] shrink-0" />
                <h3 className="text-xs sm:text-sm font-bold text-gray-100 truncate tracking-tight">
                  {title}
                </h3>

                {/* Filter Pills */}
                {showTabs && (
                  <div className="hidden sm:flex items-center gap-1 bg-white/10 p-1 rounded-full border border-white/10 shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('all');
                        setInternalIndex(0);
                      }}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                        activeTab === 'all' ? 'bg-[#7C6FE8] text-white shadow-xs' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Tất cả ({allItems.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('video');
                        setInternalIndex(0);
                      }}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        activeTab === 'video' ? 'bg-[#7C6FE8] text-white shadow-xs' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      <Film className="w-3 h-3" />
                      <span>Trailers ({videoCount})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('image');
                        setInternalIndex(0);
                      }}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        activeTab === 'image' ? 'bg-[#7C6FE8] text-white shadow-xs' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-3 h-3" />
                      <span>Hình ảnh ({imageCount})</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Right: Counter & Close Button */}
              <div className="flex items-center gap-3 shrink-0">
                {filteredItems.length > 1 && (
                  <span className="text-xs font-mono font-semibold text-gray-400">
                    {safeIndex + 1} / {filteredItems.length}
                  </span>
                )}

                <button
                  type="button"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-[#7C6FE8] text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label="Đóng"
                  onClick={onClose}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Stage (16:9 Cinema Box) */}
            <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.95)] border border-white/15 bg-black flex items-center justify-center group">
              {activeItem?.type === 'video' ? (
                <VideoPlayer
                  key={activeItem.src}
                  src={activeItem.src}
                  poster={activeItem.thumbnailUrl}
                  title={activeItem.title}
                  autoPlay={true}
                  muted={false}
                  className="w-full h-full"
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none">
                  {activeItem?.src && (
                    <img
                      src={activeItem.src}
                      alt={activeItem.title}
                      className="w-full h-full object-contain"
                    />
                  )}
                  {/* Bottom caption overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-xs font-medium text-gray-300">
                    <span className="font-bold text-white">{activeItem?.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider">
                      {activeItem?.tag || 'Hình Ảnh'}
                    </span>
                  </div>
                </div>
              )}

              {/* Prev & Next Floating Chevrons (when > 1 item) */}
              {filteredItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#7C6FE8] text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer z-30"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#7C6FE8] text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer z-30"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Filmstrip Reel */}
            {showFilmstrip && (
              <div
                ref={filmstripRef}
                className="flex items-center gap-2.5 overflow-x-auto py-1 px-1 scrollbar-thin scroll-smooth"
              >
                {filteredItems.map((item, idx) => {
                  const isActive = idx === safeIndex;
                  return (
                    <button
                      key={item.id || idx}
                      type="button"
                      onClick={() => handleSelect(idx)}
                      className={`relative shrink-0 w-24 sm:w-28 aspect-video rounded-xl overflow-hidden border transition-all cursor-pointer group ${
                        isActive
                          ? 'border-[#7C6FE8] ring-2 ring-[#7C6FE8]/60 scale-105 shadow-md opacity-100'
                          : 'border-white/10 opacity-55 hover:opacity-100 hover:border-white/30'
                      }`}
                    >
                      {item.thumbnailUrl && (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Icon Overlay Badge */}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform ${
                            isActive ? 'bg-[#7C6FE8] text-white' : 'bg-black/60 text-white group-hover:bg-[#7C6FE8]'
                          }`}
                        >
                          {item.type === 'video' ? (
                            <Play className="w-3 h-3 fill-current ml-0.5" />
                          ) : (
                            <ImageIcon className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
