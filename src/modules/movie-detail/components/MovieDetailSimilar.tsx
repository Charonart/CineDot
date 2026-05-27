import Link from 'next/link';
import Image from 'next/image';
import { MovieList } from '@modules/movie/types/movie.type';
import { ScrollText } from '@/shared/ui/ScrollText';
import { HighlightText } from '@/shared/ui/HighlightText';

interface MovieDetailSimilarProps {
  similar: MovieList;
}

export function MovieDetailSimilar({ similar }: MovieDetailSimilarProps) {
  if (similar.items.length === 0) return null;

  return (
    <aside className="sticky top-[110px]">
      <ScrollText effect="slideLeft">
        <h2 className="mb-6 border-l-4 border-red-500 pl-3 text-lg font-extrabold tracking-wide text-zinc-900">
          Phim <HighlightText variant="underline" color="destructive">đang chiếu</HighlightText>
        </h2>
      </ScrollText>

      <div className="flex flex-col gap-5">
        {similar.items.slice(0, 6).map((movie) => (
          <div
            key={movie.id}
            className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-200"
          >
            <div className="relative h-[125px] w-[90px] shrink-0 overflow-hidden rounded-lg">
              <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" sizes="90px" />
              <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                ★ {movie.rating.toFixed(1)}
              </span>
              <span className="absolute bottom-1.5 right-1.5 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                T16
              </span>
            </div>

            <div className="flex flex-col justify-between py-1">
              <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-zinc-900">{movie.title}</h3>
              <Link
                href={`/movies/${movie.id}`}
                className="mt-2 inline-flex w-fit items-center justify-center rounded-full border border-zinc-300 px-4 py-1.5 text-xs font-semibold text-zinc-800 transition-colors hover:bg-zinc-100"
                aria-label={`Chi tiết phim ${movie.title}`}
              >
                Chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
