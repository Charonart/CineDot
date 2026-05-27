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
    <main className="min-h-screen bg-zinc-50 pb-24 text-zinc-900">
      {/* Hero — full bleed backdrop with play button */}
      <MovieDetailHero movie={movie} />

      {/* Main container with 2-column layout */}
      <div className="container mx-auto max-w-[1280px] px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[68%_minmax(0,1fr)]">
          
          {/* Left Column (68%) */}
          <div className="flex flex-col gap-16">
            {/* Movie info (Poster + Meta) & Description */}
            <MovieDetailOverview movie={movie} />

            {/* Showtimes — Client Component, không block SSR */}
            <div id="schedule" className="scroll-mt-24">
              <MovieShowtimes movieId={movieId} />
            </div>

            {/* Cast & Crew */}
            <MovieDetailCast credits={credits} />

            {/* Trailers / Videos */}
            <MovieDetailVideos videos={videos} />
          </div>

          {/* Right Column (32%) */}
          <div className="pt-12 lg:pt-0">
            {/* Similar movies as Sidebar */}
            <MovieDetailSimilar similar={similar} />
          </div>
          
        </div>
      </div>
    </main>
  );
}
