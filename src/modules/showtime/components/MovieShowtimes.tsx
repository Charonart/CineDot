'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Ticket, MapPin, Users, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { useShowtimes } from '../hooks/useShowtime';
import { buildDateRange, formatDateLabel } from '../mappers/showtime.mapper';
import { Showtime } from '../types/showtime.type';

// ─── Props ────────────────────────────────────────────────────────────────────

interface MovieShowtimesProps {
  movieId: number;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DateTab({
  dateStr,
  isSelected,
  onClick,
}: {
  dateStr: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { dayName, dayDate } = formatDateLabel(dateStr);
  const isToday = dateStr === buildDateRange(0)[0];

  return (
    <button
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={`Xem suất chiếu ngày ${dayDate}`}
      className={[
        'flex min-w-[64px] flex-col items-center gap-0.5 rounded-xl px-3 py-2.5',
        'border text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500',
        isSelected
          ? 'border-red-500 bg-red-500 text-white shadow-md shadow-red-500/30'
          : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10',
      ].join(' ')}
    >
      <span className={['text-[10px] font-semibold uppercase tracking-wider', isSelected ? 'text-red-100' : 'text-zinc-400'].join(' ')}>
        {isToday && !isSelected ? 'HÔM NAY' : dayName}
      </span>
      <span className="text-sm font-bold">{dayDate}</span>
    </button>
  );
}

function ShowtimeCard({ showtime }: { showtime: Showtime }) {
  const availabilityPercent = Math.round((showtime.availableSeats / showtime.totalSeats) * 100);
  const availabilityColor =
    showtime.isSoldOut
      ? 'text-red-400'
      : availabilityPercent <= 20
        ? 'text-orange-400'
        : 'text-emerald-400';

  return (
    <Link
      href={`/booking/${showtime.showtimeId}`}
      aria-label={`Chọn suất ${showtime.formattedTime} tại ${showtime.roomName}`}
      className={[
        'group relative flex items-center justify-between rounded-xl border p-4',
        'transition-all duration-200',
        showtime.isSoldOut
          ? 'cursor-not-allowed border-white/5 bg-white/3 opacity-50'
          : 'border-white/10 bg-white/5 hover:border-red-500/40 hover:bg-white/10 hover:shadow-lg hover:shadow-red-500/5',
      ].join(' ')}
      onClick={(e) => showtime.isSoldOut && e.preventDefault()}
      tabIndex={showtime.isSoldOut ? -1 : undefined}
    >
      {/* Left: Time + Room */}
      <div className="flex items-center gap-4">
        {/* Time badge */}
        <div className="flex min-w-[52px] flex-col items-center rounded-lg bg-zinc-800/80 px-2 py-2 ring-1 ring-white/10">
          <span className="text-lg font-bold leading-none text-white tabular-nums">
            {showtime.formattedTime}
          </span>
        </div>

        {/* Room + Cinema info */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-white">{showtime.roomName}</span>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="line-clamp-1">{showtime.cinemaName}</span>
          </div>
        </div>
      </div>

      {/* Right: Seats + Price + Arrow */}
      <div className="flex flex-col items-end gap-1.5">
        {/* Price */}
        <span className="text-sm font-bold text-white">{showtime.formattedPrice}</span>

        {/* Seat availability */}
        <div className={['flex items-center gap-1 text-xs font-medium', availabilityColor].join(' ')}>
          <Users className="h-3 w-3" />
          {showtime.isSoldOut ? (
            <span>Hết vé</span>
          ) : (
            <span>{showtime.availableSeats} ghế trống</span>
          )}
        </div>

        {/* Arrow indicator */}
        {!showtime.isSoldOut && (
          <ChevronRight
            className="h-4 w-4 text-zinc-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-red-400"
          />
        )}
      </div>

      {/* Sold out badge */}
      {showtime.isSoldOut && (
        <div className="absolute right-3 top-3 rounded-full bg-red-900/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-300">
          Hết vé
        </div>
      )}
    </Link>
  );
}

// Group showtimes theo cinema
function groupByCinema(showtimes: Showtime[]): Map<string, Showtime[]> {
  return showtimes.reduce((map, st) => {
    const key = st.cinemaName;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(st);
    return map;
  }, new Map<string, Showtime[]>());
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MovieShowtimes({ movieId }: MovieShowtimesProps) {
  // Luôn lấy hôm nay làm ngày mặc định
  const dateRange = buildDateRange(7);
  const [selectedDate, setSelectedDate] = useState<string>(dateRange[0]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, error } = useShowtimes({
    movieId,
    date: selectedDate,
  });

  // Auto-scroll date tabs về đầu khi đổi ngày
  useEffect(() => {
    scrollRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  }, []);

  const cinemaGroups = data && !data.isEmpty ? groupByCinema(data.items) : null;

  return (
    <section aria-labelledby="showtimes-heading" className="space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 ring-1 ring-red-500/30">
          <Ticket className="h-4.5 w-4.5 text-red-400" aria-hidden />
        </div>
        <h2
          id="showtimes-heading"
          className="text-xl font-bold text-white"
        >
          Chọn Suất Chiếu
        </h2>
      </div>

      {/* Date picker — horizontal scroll */}
      <div
        ref={scrollRef}
        role="tablist"
        aria-label="Chọn ngày xem phim"
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {dateRange.map((dateStr) => (
          <DateTab
            key={dateStr}
            dateStr={dateStr}
            isSelected={selectedDate === dateStr}
            onClick={() => setSelectedDate(dateStr)}
          />
        ))}
      </div>

      {/* Content area */}
      <div className="min-h-[120px]">
        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-12 text-zinc-400">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            <span className="text-sm">Đang tải suất chiếu...</span>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 py-10 text-center">
            <AlertCircle className="h-8 w-8 text-red-400" aria-hidden />
            <div>
              <p className="text-sm font-medium text-red-300">Không thể tải suất chiếu</p>
              <p className="mt-1 text-xs text-zinc-500">
                {error instanceof Error ? error.message : 'Vui lòng thử lại sau'}
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && data?.isEmpty && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-white/5 bg-white/3 py-12 text-center">
            <Ticket className="h-8 w-8 text-zinc-600" aria-hidden />
            <div>
              <p className="text-sm font-medium text-zinc-400">Không có suất chiếu</p>
              <p className="mt-1 text-xs text-zinc-600">Chưa có lịch chiếu cho ngày này</p>
            </div>
          </div>
        )}

        {/* Showtime list — grouped by cinema */}
        {cinemaGroups && (
          <div className="space-y-6">
            {[...cinemaGroups.entries()].map(([cinemaName, showtimes]) => (
              <div key={cinemaName} className="space-y-2.5">
                {/* Cinema header */}
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
                  <span>{cinemaName}</span>
                  <span className="ml-auto text-xs font-normal text-zinc-500">
                    {showtimes.filter((s) => !s.isSoldOut).length} suất còn vé
                  </span>
                </div>

                {/* Showtime cards */}
                <div className="space-y-2">
                  {showtimes
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((st) => (
                      <ShowtimeCard key={st.showtimeId} showtime={st} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
