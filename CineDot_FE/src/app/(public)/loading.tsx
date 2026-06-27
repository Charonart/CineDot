import { Skeleton } from '@shared/ui/Skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto space-y-12 px-4 py-8">
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
