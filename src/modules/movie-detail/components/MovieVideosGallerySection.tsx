'use client';

import React from 'react';
import { Play, Video as VideoIcon, Sparkles } from 'lucide-react';
import { MovieVideoItem } from '../types/movie-detail.types';
import { useTrailerStore } from '@/shared/store/trailerStore';

interface MovieVideosGallerySectionProps {
  videos?: MovieVideoItem[];
  movieTitle: string;
  posterUrl: string;
  defaultTrailerUrl?: string;
}

export const MovieVideosGallerySection: React.FC<MovieVideosGallerySectionProps> = ({
  videos = [],
  movieTitle,
  posterUrl,
  defaultTrailerUrl,
}) => {
  const openTrailer = useTrailerStore((state) => state.openTrailer);

  // If no specific videos, but has defaultTrailerUrl, create a fallback item
  const displayVideos: MovieVideoItem[] = videos.length > 0
    ? videos
    : defaultTrailerUrl
    ? [
        {
          videoId: 'default-trailer',
          name: `Official Trailer: ${movieTitle}`,
          key: defaultTrailerUrl.includes('v=')
            ? defaultTrailerUrl.split('v=')[1]?.split('&')[0]
            : 'cqGjhVJWtEg',
          site: 'YouTube',
          type: 'Trailer',
          official: true,
          thumbnailUrl: `https://img.youtube.com/vi/${defaultTrailerUrl.includes('v=') ? defaultTrailerUrl.split('v=')[1]?.split('&')[0] : 'cqGjhVJWtEg'}/hqdefault.jpg`,
        },
      ]
    : [];

  if (displayVideos.length === 0) {
    return null;
  }

  const handlePlayVideo = (video: MovieVideoItem) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${video.key}`;
    const formattedVideos = displayVideos.map((v) => ({
      id: v.videoId,
      name: v.name,
      key: v.key,
      type: v.type,
      site: v.site,
      thumbnailUrl: v.thumbnailUrl,
    }));
    openTrailer(youtubeUrl, posterUrl, `${movieTitle} • ${video.name}`, formattedVideos, [posterUrl]);
  };

  return (
    <div className="py-8 border-b border-gray-200 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#7C6FE8] rounded-full shadow-[0_0_10px_rgba(124,111,232,0.6)]" />
          <h3 className="text-lg font-bold text-[#131413] uppercase tracking-wider flex items-center gap-2">
            <span>Trailers, Teasers & Video Hậu Trường</span>
            <Sparkles className="w-4 h-4 text-[#7C6FE8]" />
          </h3>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {displayVideos.length} video
        </span>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {displayVideos.map((vid, idx) => {
          const thumb = vid.thumbnailUrl || (vid.key ? `https://img.youtube.com/vi/${vid.key}/hqdefault.jpg` : posterUrl);
          const typeBadgeColor =
            vid.type === 'Trailer'
              ? 'bg-[#7C6FE8] text-white'
              : vid.type === 'Teaser'
              ? 'bg-amber-500 text-white'
              : 'bg-emerald-600 text-white';

          return (
            <div
              key={vid.videoId || idx}
              onClick={() => handlePlayVideo(vid)}
              className="group cursor-pointer flex flex-col gap-2.5 rounded-2xl overflow-hidden bg-white border border-gray-200 hover:border-purple-300 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={thumb}
                  alt={vid.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#7C6FE8]/90 group-hover:bg-[#7C6FE8] text-white flex items-center justify-center shadow-lg shadow-purple-900/50 group-hover:scale-115 transition-all duration-300">
                    <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md shadow-xs ${typeBadgeColor}`}>
                    {vid.type || 'VIDEO'}
                  </span>
                  {vid.official && (
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/20">
                      CHÍNH THỨC
                    </span>
                  )}
                </div>
              </div>

              {/* Video Title & Meta */}
              <div className="p-3.5 pt-1 flex flex-col gap-1">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#7C6FE8] transition-colors line-clamp-2 leading-snug">
                  {vid.name}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <VideoIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{vid.site || 'YouTube'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
