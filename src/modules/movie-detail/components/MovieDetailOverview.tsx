import { MovieDetail } from '../types/movie-detail.type';
import { DollarSign, TrendingUp, Clapperboard } from 'lucide-react';

interface MovieDetailOverviewProps {
  movie: MovieDetail;
}

function formatCurrency(amount: number): string {
  if (amount === 0) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
}

export function MovieDetailOverview({ movie }: MovieDetailOverviewProps) {
  const stats = [
    {
      icon: <Clapperboard className="h-4 w-4" />,
      label: 'Status',
      value: movie.status,
    },
    {
      icon: <DollarSign className="h-4 w-4" />,
      label: 'Budget',
      value: formatCurrency(movie.budget),
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      label: 'Revenue',
      value: formatCurrency(movie.revenue),
    },
  ];

  return (
    <section aria-labelledby="overview-heading" className="space-y-6">
      <div>
        <h2
          id="overview-heading"
          className="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50"
        >
          Overview
        </h2>
        <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
          {movie.description}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800/60"
          >
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
              {stat.icon}
              {stat.label}
            </div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-50">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
