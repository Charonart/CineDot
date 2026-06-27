'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Video } from '../types/movie-detail.type';
import { Play, X, Clapperboard } from 'lucide-react';

interface MovieDetailVideosProps {
  videos: Video[];
}

export function MovieDetailVideos({ videos }: MovieDetailVideosProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Hiển thị trailer official trước, sau đó teaser
  const sorted = [...videos].sort((a, b) => {
    if (a.official && !b.official) return -1;
    if (!a.official && b.official) return 1;
    if (a.type === 'Trailer' && b.type !== 'Trailer') return -1;
    return 0;
  });

  if (sorted.length === 0) return null;

  return (
    <section aria-labelledby="videos-heading" className="space-y-4">
      <div className="flex items-center gap-2">
        <Clapperboard className="h-5 w-5 text-zinc-400" />
        <h2
          id="videos-heading"
          className="text-xl font-bold text-zinc-900 dark:text-zinc-50"
        >
          Videos
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((video) => (
          <div key={video.id} className="group relative">
            {activeKey === video.key ? (
              /* Embedded YouTube player */
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${video.key}?autoplay=1`}
                  title={video.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
                <button
                  onClick={() => setActiveKey(null)}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black"
                  aria-label="Close video"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              /* Thumbnail */
              <button
                onClick={() => setActiveKey(video.key)}
                className="relative block w-full overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                aria-label={`Play ${video.name}`}
              >
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-zinc-200 dark:bg-zinc-800">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="rounded-full bg-white/90 p-4 shadow-xl">
                    <Play className="h-6 w-6 fill-current text-zinc-900" />
                  </div>
                </div>
                {/* Badge */}
                <span className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                  {video.type}
                </span>
              </button>
            )}
            <p className="mt-2 line-clamp-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {video.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
