import Image from 'next/image';
import { Credits } from '../types/movie-detail.type';
import { Users } from 'lucide-react';

interface MovieDetailCastProps {
  credits: Credits;
}

export function MovieDetailCast({ credits }: MovieDetailCastProps) {
  const director = credits.crew.find((m) => m.job === 'Director');
  const writers = credits.crew.filter((m) => ['Writer', 'Screenplay', 'Story'].includes(m.job)).slice(0, 2);
  const displayCast = credits.cast.slice(0, 12);

  if (displayCast.length === 0 && !director) return null;

  return (
    <section aria-labelledby="cast-heading" className="space-y-5">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 ring-1 ring-zinc-200">
          <Users className="h-4 w-4 text-zinc-600" aria-hidden />
        </div>
        <h2
          id="cast-heading"
          className="text-xl font-bold text-zinc-900"
        >
          Diễn viên &amp; Đoàn làm phim
        </h2>
      </div>

      {/* Director + Writers */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
        {director && (
          <p className="text-zinc-400">
            Đạo diễn:{' '}
            <span className="font-semibold text-white">{director.name}</span>
          </p>
        )}
        {writers.length > 0 && (
          <p className="text-zinc-400">
            Biên kịch:{' '}
            <span className="font-semibold text-white">{writers.map((w) => w.name).join(', ')}</span>
          </p>
        )}
      </div>

      {/* Horizontal scroll cast list */}
      <div
        className="flex gap-4 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Danh sách diễn viên"
      >
        {displayCast.map((member) => (
          <div
            key={`${member.id}-${member.character}`}
            className="flex w-[88px] shrink-0 flex-col items-center gap-2"
          >
            {/* Avatar */}
            <div className="relative h-[88px] w-[88px] overflow-hidden rounded-full bg-zinc-800 ring-2 ring-zinc-700">
              {member.profileUrl ? (
                <Image
                  src={member.profileUrl}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="88px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-zinc-500">
                  {member.name[0]}
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold leading-tight text-zinc-100">
                {member.name}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs leading-tight text-zinc-500">
                {member.character}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
