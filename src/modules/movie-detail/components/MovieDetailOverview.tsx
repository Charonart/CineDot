import Image from 'next/image';
import { MovieDetail } from '../types/movie-detail.type';
import { Star } from 'lucide-react';
import { ScrollText } from '@/shared/ui/ScrollText';
import { HighlightText } from '@/shared/ui/HighlightText';

interface MovieDetailOverviewProps {
  movie: MovieDetail;
}

export function MovieDetailOverview({ movie }: MovieDetailOverviewProps) {
  return (
    <div className="flex flex-col gap-16">
      <section className="relative z-30 -mt-20 sm:-mt-28 md:-mt-32">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-10">
          <div className="relative aspect-[2/3] w-48 shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 md:w-60">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 192px, 240px"
            />
            <span className="absolute left-3 top-3 rounded-md bg-zinc-950 px-3 py-1.5 text-xs font-bold tracking-wider text-white">
              2D
            </span>
          </div>

          <div className="flex flex-col gap-4 text-center md:text-left">
            <h1 className="text-3xl font-extrabold leading-tight text-zinc-900 md:text-4xl lg:text-5xl">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-2.5 text-sm text-zinc-600 md:justify-start">
              <span className="flex items-center gap-1 font-semibold text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                {movie.rating.toFixed(1)}
                <small className="font-normal text-zinc-600">
                  ({movie.voteCount.toLocaleString('vi-VN')} bình chọn)
                </small>
              </span>
              <span className="opacity-40">·</span>
              <span>{movie.formattedRuntime || 'N/A'}</span>
              <span className="opacity-40">·</span>
              <span>{movie.releaseYear || 'N/A'}</span>
            </div>

            <div className="mt-2 flex flex-col gap-2.5 text-[15px] leading-relaxed">
              {movie.countries.length > 0 && (
                <div className="flex flex-col md:flex-row md:items-start">
                  <span className="w-32 shrink-0 font-medium text-zinc-500">Quốc gia:</span>
                  <span className="font-semibold text-zinc-900">
                    {movie.countries.map((c) => c.name).join(', ')}
                  </span>
                </div>
              )}
              {movie.productionCompanies.length > 0 && (
                <div className="flex flex-col md:flex-row md:items-start">
                  <span className="w-32 shrink-0 font-medium text-zinc-500">Nhà sản xuất:</span>
                  <span className="font-semibold text-zinc-900">
                    {movie.productionCompanies.map((c) => c.name).join(', ')}
                  </span>
                </div>
              )}
              {movie.genres.length > 0 && (
                <div className="flex flex-col md:flex-row md:items-start">
                  <span className="w-32 shrink-0 font-medium text-zinc-500">Thể loại:</span>
                  <div className="flex flex-wrap justify-center gap-1.5 md:justify-start">
                    {movie.genres.map((g) => (
                      <span
                        key={g.id}
                        className="inline-block rounded-md border border-zinc-200 bg-white px-3 py-1 text-[13px] font-medium text-zinc-700"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
              <a
                href="#schedule"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-[15px] font-semibold tracking-wide text-black transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                Đặt vé ngay
              </a>
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-8 py-3.5 text-[15px] font-semibold text-zinc-800 backdrop-blur-md transition-colors hover:bg-zinc-100 sm:w-auto">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                Xem trailer
              </button>
            </div>
          </div>
        </div>
      </section>

      {movie.description && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 md:p-10">
          <ScrollText effect="slideLeft">
            <h2 className="mb-6 border-l-4 border-red-500 pl-4 text-2xl font-extrabold tracking-wide text-zinc-900">
              Nội dung <HighlightText variant="underline" color="destructive">phim</HighlightText>
            </h2>
          </ScrollText>
          <div className="text-[15px] leading-relaxed text-zinc-700">
            <p>{movie.description}</p>
          </div>
        </section>
      )}
    </div>
  );
}
