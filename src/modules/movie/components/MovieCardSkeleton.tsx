import { Skeleton } from '@shared/ui/Skeleton';
import { cn } from '@shared/lib/utils';

interface MovieCardSkeletonProps {
  variant?: 'poster' | 'backdrop';
  className?: string;
}

export function MovieCardSkeleton({ 
  variant = 'poster', 
  className 
}: MovieCardSkeletonProps) {
  return (
    <Skeleton 
      className={cn(
        'rounded-xl',
        variant === 'poster' ? 'aspect-[2/3]' : 'aspect-video',
        className
      )} 
    />
  );
}
