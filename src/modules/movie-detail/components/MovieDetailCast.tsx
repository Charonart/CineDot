import Image from 'next/image';
import { Credits } from '../types/movie-detail.type';
import { imageHelper } from '@shared/utils/imageHelper';
import { Users } from 'lucide-react';

interface MovieDetailCastProps {
  credits: Credits;
}

export function MovieDetailCast({ credits }: MovieDetailCastProps) {
  const director = credits.crew.find((m) => m.job === 'Director');
  const displayCast = credits.cast.slice(0, 12);

  if (displayCast.length === 0 && !director) return null;

  return (
    <section aria-labelledby="cast-heading" className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-zinc-400" />
        <h2
          id="cast-heading"
          className="text-xl font-bold text-zinc-900 dark:text-zinc-50"
        >
          Cast &amp; Crew
        </h2>
      </div>

      {director && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Directed by{' '}
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            {director.name}
          </span>
        </p>
      )}

      {/* Horizontal scroll cast list */}
      <div
        className="flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Cast members"
      >
        {displayCast.map((member) => (
          <div
            key={`${member.id}-${member.character}`}
            className="flex w-28 shrink-0 flex-col items-center gap-2"
          >
            {/* Avatar */}
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-zinc-200 ring-2 ring-zinc-200 dark:bg-zinc-700 dark:ring-zinc-700">
              {member.profileUrl ? (
                <Image
                  src={imageHelper.getProfileUrl(member.profileUrl, 'sm')}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-zinc-400 dark:text-zinc-500">
                  {member.name[0]}
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
                {member.name}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs leading-tight text-zinc-400 dark:text-zinc-500">
                {member.character}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
