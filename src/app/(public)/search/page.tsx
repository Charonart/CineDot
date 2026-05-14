'use client';

import { useState } from 'react';
import { useSearchMovies } from '@modules/movie/hooks/useMovies';
import { useDebounce } from '@shared/hooks/useDebounce';
import { MovieCard } from '@modules/movie/components/MovieCard';
import { MovieCardSkeleton } from '@modules/movie/components/MovieCardSkeleton';
import { EmptyState } from '@shared/ui/EmptyState';
import { ErrorState } from '@shared/ui/ErrorState';
import { Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const { data, isLoading, isError, refetch } = useSearchMovies(debouncedQuery);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">Search Movies</h1>

      {/* Search Input */}
      <div className="relative mb-12 max-w-2xl">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <SearchIcon className="h-5 w-5 text-zinc-400" />
        </div>
        <input
          type="text"
          className="block w-full rounded-2xl border-none bg-zinc-100 p-4 pl-12 text-sm text-zinc-900 focus:ring-2 focus:ring-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-zinc-50"
          placeholder="Type movie name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search movies"
        />
      </div>

      {/* Results */}
      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => <MovieCardSkeleton key={i} />)}
        </div>
      ) : !debouncedQuery ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-zinc-500">Enter at least 2 characters to start searching.</p>
        </div>
      ) : data?.items.length === 0 ? (
        <EmptyState title="No movies found" description={`We couldn't find any results for "${debouncedQuery}"`} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {data?.items.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`}>
              <MovieCard movie={movie} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
