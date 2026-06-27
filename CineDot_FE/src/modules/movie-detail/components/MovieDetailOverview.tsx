import { MovieDetail } from '../types/movie-detail.type';
import { FileText } from 'lucide-react';

interface MovieDetailOverviewProps {
  movie: MovieDetail;
}

export function MovieDetailOverview({ movie }: MovieDetailOverviewProps) {
  return (
    <section aria-labelledby="overview-heading" className="space-y-6">
      {/* Info rows — theo layout test.html */}
      <div className="rounded-2xl bg-zinc-900/50 p-6 ring-1 ring-white/5">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-[auto_1fr]">

          {/* Quốc gia */}
          {movie.countries.length > 0 && (
            <>
              <span className="text-sm font-medium text-zinc-400">Quốc gia:</span>
              <span className="text-sm text-white">
                {movie.countries.map((c) => c.name).join(', ')}
              </span>
            </>
          )}

          {/* Nhà sản xuất */}
          {movie.productionCompanies.length > 0 && (
            <>
              <span className="text-sm font-medium text-zinc-400">Nhà sản xuất:</span>
              <span className="text-sm text-white">
                {movie.productionCompanies.map((c) => c.name).join(', ')}
              </span>
            </>
          )}

          {/* Ngôn ngữ */}
          {movie.languages.length > 0 && (
            <>
              <span className="text-sm font-medium text-zinc-400">Ngôn ngữ:</span>
              <span className="text-sm text-white">
                {movie.languages.map((l) => l.name).join(', ')}
              </span>
            </>
          )}

          {/* Thể loại */}
          {movie.genres.length > 0 && (
            <>
              <span className="text-sm font-medium text-zinc-400">Thể loại:</span>
              <div className="flex flex-wrap gap-1.5">
                {movie.genres.map((g) => (
                  <span
                    key={g.id}
                    className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white ring-1 ring-white/15"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Trạng thái */}
          <span className="text-sm font-medium text-zinc-400">Trạng thái:</span>
          <span className="text-sm text-white">{movie.status}</span>

          {/* Bộ sưu tập */}
          {movie.collection && (
            <>
              <span className="text-sm font-medium text-zinc-400">Phần phim:</span>
              <span className="text-sm text-white">{movie.collection.name}</span>
            </>
          )}
        </div>
      </div>

      {/* Nội dung phim */}
      {movie.description && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 ring-1 ring-white/10">
              <FileText className="h-4 w-4 text-zinc-400" aria-hidden />
            </div>
            <h2
              id="overview-heading"
              className="text-xl font-bold text-white"
            >
              Nội dung phim
            </h2>
          </div>
          <p className="leading-relaxed text-zinc-300">
            {movie.description}
          </p>
        </div>
      )}
    </section>
  );
}
