import Image from 'next/image';
import { MovieDetail } from '../types/movie-detail.type';
import { imageHelper } from '@shared/utils/imageHelper';
import { Star, Clock, Calendar, Globe } from 'lucide-react';

interface MovieDetailHeroProps {
  movie: MovieDetail;
}

export function MovieDetailHero({ movie }: MovieDetailHeroProps) {
  const releaseYear = movie.releaseDate?.split('-')[0] ?? '—';

  return (
    <div className="relative">
      {/* Backdrop full-bleed */}
      <div className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
        <Image
          src={imageHelper.getBackdropUrl(movie.backdropUrl, 'original')}
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

      {/* Content: Poster + Info nổi lên trên backdrop */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-36 flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
          {/* Poster */}
          <div className="relative hidden h-64 w-44 shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-2 ring-white/10 sm:block md:h-80 md:w-56">
            <Image
              src={imageHelper.getPosterUrl(movie.posterUrl, 'lg')}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="224px"
            />
          </div>

          {/* Title + Meta */}
          <div className="pb-2 text-white">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight drop-shadow-lg md:text-5xl">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="mt-2 text-base italic text-zinc-300/80 md:text-lg">
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}

            {/* Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-300">
              <div
                className="flex items-center gap-1.5 rounded-full bg-yellow-500/20 px-3 py-1 text-yellow-400 ring-1 ring-yellow-500/30"
                aria-label={`Rating: ${movie.rating.toFixed(1)}`}
              >
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="font-bold">{movie.rating.toFixed(1)}</span>
                <span className="text-xs text-zinc-400">/ 10</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-zinc-400" />
                <span>{releaseYear}</span>
              </div>

              {movie.runtime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-zinc-400" />
                  <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-zinc-400" />
                <span className="uppercase">{movie.originalLanguage}</span>
              </div>
            </div>

            {/* Genre chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20 backdrop-blur-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
