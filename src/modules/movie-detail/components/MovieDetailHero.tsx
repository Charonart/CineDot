import Image from 'next/image';
import { MovieDetail } from '../types/movie-detail.type';
import { Star, Clock, Calendar, MapPin, Building2 } from 'lucide-react';

interface MovieDetailHeroProps {
  movie: MovieDetail;
}

export function MovieDetailHero({ movie }: MovieDetailHeroProps) {
  return (
    <div className="relative">
      {/* Backdrop full-bleed */}
      <div className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
        <Image
          src={movie.backdropUrl}
          alt={movie.title}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent" />
      </div>

      {/* Content: Poster + Info — nổi lên trên backdrop */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-44 flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
          {/* Poster */}
          <div className="relative hidden h-72 w-48 shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-2 ring-white/10 sm:block md:h-80 md:w-56">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="224px"
            />
          </div>

          {/* Title + Meta */}
          <div className="flex flex-col gap-4 pb-4 text-white">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight drop-shadow-lg md:text-4xl lg:text-5xl">
                {movie.title}
              </h1>
              {movie.originalTitle && movie.originalTitle !== movie.title && (
                <p className="mt-1 text-base text-zinc-400">{movie.originalTitle}</p>
              )}
              {movie.tagline && (
                <p className="mt-2 text-base italic text-zinc-300/80 md:text-lg">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}
            </div>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300">
              {/* Rating */}
              <div
                className="flex items-center gap-1.5 rounded-full bg-yellow-500/20 px-3 py-1 text-yellow-400 ring-1 ring-yellow-500/30"
                aria-label={`Đánh giá: ${movie.rating.toFixed(1)}/10`}
              >
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="font-bold">{movie.rating.toFixed(1)}</span>
                <span className="text-xs text-zinc-400">/ 10</span>
                <span className="text-xs text-zinc-500">({movie.voteCount.toLocaleString('vi-VN')})</span>
              </div>

              {/* Release year */}
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-zinc-400" />
                <span>{movie.releaseYear}</span>
              </div>

              {/* Runtime */}
              {movie.formattedRuntime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-zinc-400" />
                  <span>{movie.formattedRuntime}</span>
                </div>
              )}

              {/* Country */}
              {movie.countries.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-zinc-400" />
                  <span>{movie.countries.map((c) => c.name).join(', ')}</span>
                </div>
              )}
            </div>

            {/* Genre chips */}
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20 backdrop-blur-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Production companies */}
            {movie.productionCompanies.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span>{movie.productionCompanies.map((c) => c.name).join(' · ')}</span>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="#schedule"
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-500 hover:shadow-red-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label="Đặt vé ngay"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" />
                  <path d="M15 3h6v6" /><path d="M10 14 21 3" />
                </svg>
                Đặt vé ngay
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
