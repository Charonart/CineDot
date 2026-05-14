import Image from 'next/image';
import { Movie } from '../types/movie.type';
import { cn } from '@shared/lib/utils';
import { imageHelper, ImageSize } from '@shared/utils/imageHelper';
import { Star } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  variant?: 'poster' | 'backdrop';
  size?: ImageSize;
  className?: string;
}

export function MovieCard({ 
  movie, 
  variant = 'poster', 
  size = 'md', 
  className 
}: MovieCardProps) {
  const imageUrl = variant === 'poster' 
    ? imageHelper.getPosterUrl(movie.posterUrl, size)
    : imageHelper.getBackdropUrl(movie.backdropUrl, size);

  return (
    <div className={cn(
      'group relative overflow-hidden rounded-xl bg-zinc-100 transition-all hover:scale-105 dark:bg-zinc-900',
      variant === 'poster' ? 'aspect-[2/3]' : 'aspect-video',
      className
    )}>
      <Image
        src={imageUrl}
        alt={movie.title}
        fill
        className="object-cover transition-opacity group-hover:opacity-80"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      
      {/* Overlay info */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
        <h3 className="line-clamp-1 text-sm font-bold text-white">{movie.title}</h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-300">
          <span>{movie.releaseDate.split('-')[0]}</span>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="h-3 w-3 fill-current" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
