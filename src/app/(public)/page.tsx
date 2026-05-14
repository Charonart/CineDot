'use client';

import { useTrendingMovies, usePopularMovies } from '@modules/movie/hooks/useMovies';
import { MovieCard } from '@modules/movie/components/MovieCard';
import { MovieCardSkeleton } from '@modules/movie/components/MovieCardSkeleton';
import { ErrorState } from '@shared/ui/ErrorState';
import { EmptyState } from '@shared/ui/EmptyState';
import Link from 'next/link';

export default function HomePage() {
  const { 
    data: trending, 
    isLoading: isTrendingLoading, 
    isError: isTrendingError,
    refetch: refetchTrending
  } = useTrendingMovies();

  const { 
    data: popular, 
    isLoading: isPopularLoading, 
    isError: isPopularError,
    refetch: refetchPopular
  } = usePopularMovies();

  if (isTrendingError || isPopularError) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <ErrorState onRetry={() => { refetchTrending(); refetchPopular(); }} />
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-12 px-4 py-8">
      {/* Trending Section */}
      <section aria-labelledby="trending-heading">
        <h2 id="trending-heading" className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Trending Today</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {isTrendingLoading ? (
            Array.from({ length: 5 }).map((_, i) => <MovieCardSkeleton key={i} />)
          ) : trending?.items.length === 0 ? (
            <EmptyState className="col-span-full" />
          ) : (
            trending?.items.map((movie) => (
              <Link key={movie.id} href={`/movies/${movie.id}`} className="focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 rounded-xl">
                <MovieCard movie={movie} />
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Popular Section */}
      <section aria-labelledby="popular-heading">
        <h2 id="popular-heading" className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Popular Movies</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {isPopularLoading ? (
            Array.from({ length: 3 }).map((_, i) => <MovieCardSkeleton key={i} variant="backdrop" />)
          ) : popular?.items.length === 0 ? (
            <EmptyState className="col-span-full" />
          ) : (
            popular?.items.map((movie) => (
              <Link key={movie.id} href={`/movies/${movie.id}`} className="focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 rounded-xl">
                <MovieCard movie={movie} variant="backdrop" />
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
