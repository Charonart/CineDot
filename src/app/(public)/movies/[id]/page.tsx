import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { movieDetailService } from '@modules/movie-detail/services/movie-detail.service';
import { MovieDetailHero } from '@modules/movie-detail/components/MovieDetailHero';
import { MovieDetailOverview } from '@modules/movie-detail/components/MovieDetailOverview';
import { MovieDetailCast } from '@modules/movie-detail/components/MovieDetailCast';
import { MovieDetailVideos } from '@modules/movie-detail/components/MovieDetailVideos';
import { MovieDetailSimilar } from '@modules/movie-detail/components/MovieDetailSimilar';
import { MovieShowtimes } from '@modules/showtime/components/MovieShowtimes';

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * SSR Strategy: Generate Dynamic Metadata for SEO
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await movieDetailService.getMovieDetail(Number(id));
    return {
      title: `${movie.title} | CineDot`,
      description: movie.description,
      openGraph: {
        title: movie.title,
        description: movie.description ?? '',
        images: [movie.backdropUrl],
      },
    };
  } catch {
    return { title: 'Movie Not Found | CineDot' };
  }
}

/**
 * SSR: Fetch tất cả data song song để tối ưu TTFB
 */
export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  const movieId = Number(id);

  let movie, credits, videos, similar;

  try {
    // Fetch song song (parallel) để tối ưu
    [movie, credits, videos, similar] = await Promise.all([
      movieDetailService.getMovieDetail(movieId),
      movieDetailService.getCredits(movieId),
      movieDetailService.getVideos(movieId),
      movieDetailService.getSimilar(movieId),
    ]);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Hero — full bleed backdrop */}
      <MovieDetailHero movie={movie} />

      {/* Main content */}
      <div className="container mx-auto space-y-12 px-4 py-10">
        {/* Movie info + description */}
        <MovieDetailOverview movie={movie} />

        {/* Showtimes — Client Component, không block SSR */}
        <MovieShowtimes movieId={movieId} />

        {/* Cast & Crew */}
        <MovieDetailCast credits={credits} />

        {/* Trailers / Videos */}
        <MovieDetailVideos videos={videos} />

        {/* Similar movies */}
        <MovieDetailSimilar similar={similar} />
      </div>
    </main>
  );
}
