import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { movieService } from '@modules/movie/services/movie.service';
import { imageHelper } from '@shared/utils/imageHelper';
import { Star, Clock, Calendar } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * SEO Strategy: Generate Dynamic Metadata for Movie Detail
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await movieService.getMovieDetail(Number(id));
    return {
      title: `${movie.title} | CineDot`,
      description: movie.description,
      openGraph: {
        title: movie.title,
        description: movie.description,
        images: [imageHelper.getBackdropUrl(movie.backdropUrl, 'lg')],
      },
    };
  } catch {
    return { title: 'Movie Not Found | CineDot' };
  }
}

/**
 * SSR Strategy: Server Component for initial data fetching
 */
export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  
  let movie;
  try {
    movie = await movieService.getMovieDetail(Number(id));
  } catch (error) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Backdrop */}
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={imageHelper.getBackdropUrl(movie.backdropUrl, 'original')}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="relative hidden aspect-[2/3] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 md:block">
          <Image
            src={imageHelper.getPosterUrl(movie.posterUrl, 'lg')}
            alt={movie.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">{movie.title}</h1>
          
          <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2" aria-label={`Rating: ${movie.rating.toFixed(1)}`}>
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span className="font-bold text-zinc-900 dark:text-zinc-50">{movie.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{movie.releaseDate}</span>
            </div>
            {movie.runtime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{movie.runtime} min</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span 
                key={genre.id} 
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">Overview</h2>
            <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">{movie.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
