import { Skeleton } from '@shared/ui/Skeleton';

export function MovieDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero backdrop */}
      <Skeleton className="h-[55vh] min-h-[380px] w-full rounded-none" />

      <div className="container mx-auto px-4">
        {/* Poster + title row */}
        <div className="-mt-36 flex flex-col gap-6 pb-8 sm:flex-row sm:items-end sm:gap-8">
          <Skeleton className="hidden h-80 w-56 shrink-0 rounded-2xl sm:block" />
          <div className="space-y-3 pb-2">
            <Skeleton className="h-10 w-72 rounded-lg" />
            <Skeleton className="h-5 w-48 rounded-lg" />
            <div className="flex gap-3">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>

        <div className="space-y-12 py-8">
          {/* Overview */}
          <div className="space-y-3">
            <Skeleton className="h-7 w-32 rounded-lg" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-4/6 rounded" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>

          {/* Cast */}
          <div className="space-y-4">
            <Skeleton className="h-7 w-36 rounded-lg" />
            <div className="flex gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex w-28 shrink-0 flex-col items-center gap-2">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Videos */}
          <div className="space-y-4">
            <Skeleton className="h-7 w-24 rounded-lg" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="aspect-video rounded-xl" />
              ))}
            </div>
          </div>

          {/* Similar */}
          <div className="space-y-4">
            <Skeleton className="h-7 w-36 rounded-lg" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
