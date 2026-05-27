import Image from 'next/image';
import { MovieDetail } from '../types/movie-detail.type';

interface MovieDetailHeroProps {
  movie: MovieDetail;
}

export function MovieDetailHero({ movie }: MovieDetailHeroProps) {
  return (
    <section className="relative flex h-[420px] items-center justify-center overflow-hidden bg-zinc-200 pt-20 sm:h-[580px]">
      {/* Backdrop */}
      <div className="absolute inset-0 z-0 opacity-65">
        <Image
          src={movie.backdropUrl}
          alt={movie.title}
          fill
          className="scale-[1.02] object-cover object-[center_25%] blur-[2px]"
          priority
          sizes="100vw"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-50 via-zinc-50/35 to-zinc-100/60" />

      {/* Content: Play Button */}
      <div className="relative z-20 flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            className="group flex h-20 w-20 items-center justify-center rounded-full border border-red-200 bg-white/90 text-red-600 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-red-500 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500 sm:h-24 sm:w-24"
            aria-label="Xem trailer"
          >
            <svg
              className="ml-1 h-8 w-8 fill-current transition-colors sm:h-10 sm:w-10"
              viewBox="0 0 24 24"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
