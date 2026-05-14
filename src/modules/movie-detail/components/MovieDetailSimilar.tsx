import Link from 'next/link';
import { MovieList } from '@modules/movie/types/movie.type';
import { MovieCard } from '@modules/movie/components/MovieCard';
import { Film } from 'lucide-react';

interface MovieDetailSimilarProps {
  similar: MovieList;
}

export function MovieDetailSimilar({ similar }: MovieDetailSimilarProps) {
  if (similar.items.length === 0) return null;

  return (
    <section aria-labelledby="similar-heading" className="space-y-4">
      <div className="flex items-center gap-2">
        <Film className="h-5 w-5 text-zinc-400" />
        <h2
          id="similar-heading"
          className="text-xl font-bold text-zinc-900 dark:text-zinc-50"
        >
          More Like This
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {similar.items.slice(0, 8).map((movie) => (
          <Link
            key={movie.id}
            href={`/movies/${movie.id}`}
            className="rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
            aria-label={`View details for ${movie.title}`}
          >
            <MovieCard movie={movie} />
          </Link>
        ))}
      </div>
    </section>
  );
}
