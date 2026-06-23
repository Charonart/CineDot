'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Ticket,
  MapPin,
  Loader2,
  AlertCircle,
  ChevronDown,
  Clock,
  Users,
} from 'lucide-react';
import { useShowtimes } from '../hooks/useShowtime';
import { showtimeMapper, buildDateRange, formatDateLabel } from '../mappers/showtime.mapper';
import { Showtime, ShowtimeCinemaGroup } from '../types/showtime.type';

// ─── Props ────────────────────────────────────────────────────────────────────

interface MovieShowtimesProps {
  movieId: number | string;
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
  const today = buildDateRange(0)[0];
  const isToday = dateStr === today;

  return (
    <button
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={`Xem suất chiếu ngày ${dayDate}`}
      className={[
        'flex min-w-[72px] flex-col items-center gap-0.5 rounded-xl px-4 py-2.5',
        'border text-sm font-medium transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500',
        isSelected
          ? 'border-red-500 bg-red-500 text-white shadow-md shadow-red-500/30'
          : 'border-white/10 bg-white/5 text-zinc-300 hover:border-red-500/40 hover:bg-white/10',
      ].join(' ')}
    >
      <span
        className={[
          'text-[10px] font-semibold uppercase tracking-wider',
          isSelected ? 'text-red-100' : isToday ? 'text-red-400' : 'text-zinc-400',
        ].join(' ')}
      >
        {isToday ? 'HÔM NAY' : dayName}
      </span>
      <span className="text-sm font-bold">{dayDate}</span>
    </button>
  );
}

/** Nút giờ chiếu — theo layout test.html */
function TimeButton({
  showtime,
  onClick,
}: {
  showtime: Showtime;
  onClick: () => void;
}) {
  const occupancyColorClass = {
    green: 'text-emerald-400',
    orange: 'text-orange-400',
    red: 'text-red-400',
  }[showtime.occupancyColor];

  if (showtime.isSoldOut) {
    return (
      <div
        title="Hết vé"
        aria-label={`Suất ${showtime.formattedTime} — Hết vé`}
        className="flex flex-col items-center gap-1 rounded-xl border border-white/5 bg-white/3 px-4 py-2.5 opacity-50 cursor-not-allowed"
      >
        <span className="text-sm font-bold tabular-nums text-zinc-500 line-through">
          {showtime.formattedTime}
        </span>
        <span className="text-[10px] font-medium text-red-500 uppercase tracking-wide">Hết vé</span>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-label={`Chọn suất ${showtime.formattedTime} — còn ${showtime.availableSeats} ghế`}
      className={[
        'group flex flex-col items-center gap-1 rounded-xl border px-4 py-2.5',
        'border-white/10 bg-white/5 transition-all duration-200',
        'hover:border-red-500/60 hover:bg-red-500/10 hover:shadow-md hover:shadow-red-500/10',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500',
      ].join(' ')}
    >
      <span className="text-sm font-bold tabular-nums text-white group-hover:text-red-300 transition-colors">
        {showtime.formattedTime}
      </span>
      <span className={['text-[10px] font-medium', occupancyColorClass].join(' ')}>
        {showtime.availableSeats} ghế
      </span>
    </button>
  );
}

/** Một nhóm rạp — gồm nhiều format rows */
function CinemaGroup({
  group,
  onSelectShowtime,
}: {
  group: ShowtimeCinemaGroup;
  onSelectShowtime: (showtimeId: number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-zinc-900/40 backdrop-blur-sm">
      {/* Cinema header */}
      <div className="flex items-center gap-3 border-b border-white/8 bg-zinc-800/60 px-5 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/15 ring-1 ring-red-500/30">
          <MapPin className="h-4 w-4 text-red-400" aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="truncate text-base font-bold text-white">
            {group.cinemaName}
          </h3>
          <p className="text-xs text-zinc-400">{group.city}</p>
        </div>
        <span className="shrink-0 rounded-full bg-zinc-700/60 px-2.5 py-0.5 text-xs text-zinc-300 ring-1 ring-white/10">
          {group.totalAvailable} suất còn vé
        </span>
      </div>

      {/* Format rows */}
      <div className="divide-y divide-white/5">
        {group.formatGroups.map((fmtGroup) => (
          <div key={fmtGroup.format} className="px-5 py-4 space-y-3">
            {/* Format label */}
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-700/60">
                <Clock className="h-3.5 w-3.5 text-zinc-400" aria-hidden />
              </div>
              <h4 className="text-sm font-semibold text-zinc-200">
                {fmtGroup.format}
              </h4>
            </div>

            {/* Time button grid */}
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label={`Chọn giờ chiếu cho định dạng ${fmtGroup.format}`}
            >
              {fmtGroup.showtimes.map((st) => (
                <TimeButton
                  key={st.showtimeId}
                  showtime={st}
                  onClick={() => onSelectShowtime(st.showtimeId)}
                />
              ))}
            </div>

            {/* Price hint */}
            <p className="text-xs text-zinc-500">
              Từ{' '}
              <span className="font-medium text-zinc-400">
                {fmtGroup.showtimes[0]?.formattedPrice}
              </span>
              {' '}/ vé
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MovieShowtimes({ movieId }: MovieShowtimesProps) {
  const router = useRouter();
  const dateRange = buildDateRange(7);
  const [selectedDate, setSelectedDate] = useState<string>(dateRange[0]);
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterCinema, setFilterCinema] = useState<string>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, error } = useShowtimes(movieId, {
    date: selectedDate,
  });

  // Build cinema groups từ data
  const allGroups = data && !data.isEmpty
    ? showtimeMapper.toCinemaGroups(data.items)
    : null;

  // Danh sách thành phố cho filter
  const cities = allGroups
    ? [...new Set(allGroups.map((g) => g.city))].sort()
    : [];

  // Filter groups
  const filteredGroups = allGroups
    ? allGroups.filter((g) => {
      if (filterCity !== 'all' && g.city !== filterCity) return false;
      if (filterCinema !== 'all' && String(g.cinemaId) !== filterCinema) return false;
      return true;
    })
    : null;

  // Reset cinema filter khi đổi city
  useEffect(() => {
    setFilterCinema('all');
  }, [filterCity]);

  const handleSelectShowtime = (showtimeId: number) => {
    router.push(`/booking/${showtimeId}`);
  };

  const isEmpty = !isLoading && !isError && (!filteredGroups || filteredGroups.length === 0);

  return (
    <section
      id="schedule"
      aria-labelledby="showtimes-heading"
      className="scroll-mt-20 space-y-6"
    >
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 ring-1 ring-red-500/30">
          <Ticket className="h-4.5 w-4.5 text-red-400" aria-hidden />
        </div>
        <h2 id="showtimes-heading" className="text-xl font-bold text-white">
          Lịch chiếu
        </h2>
      </div>

      {/* ── Date tabs — horizontal scroll ── */}
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

      {/* ── Filter dropdowns ── */}
      {allGroups && allGroups.length > 0 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          {/* City filter */}
          <div className="relative">
            <select
              id="filterCity"
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              aria-label="Lọc theo thành phố"
              className={[
                'w-full appearance-none rounded-xl border border-white/10 bg-zinc-800/80',
                'px-4 py-2.5 pr-9 text-sm text-white',
                'focus:border-red-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500',
                'sm:w-auto sm:min-w-[160px]',
              ].join(' ')}
            >
              <option value="all">Toàn quốc</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden />
          </div>

          {/* Cinema filter */}
          <div className="relative">
            <select
              id="filterCinema"
              value={filterCinema}
              onChange={(e) => setFilterCinema(e.target.value)}
              aria-label="Lọc theo rạp"
              className={[
                'w-full appearance-none rounded-xl border border-white/10 bg-zinc-800/80',
                'px-4 py-2.5 pr-9 text-sm text-white',
                'focus:border-red-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500',
                'sm:w-auto sm:min-w-[220px]',
              ].join(' ')}
            >
              <option value="all">Tất cả rạp</option>
              {(filterCity === 'all' ? allGroups : allGroups.filter((g) => g.city === filterCity))
                .map((g) => (
                  <option key={g.cinemaId} value={String(g.cinemaId)}>
                    {g.cinemaName}
                  </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden />
          </div>
        </div>
      )}

      {/* ── Content area ── */}
      <div className="min-h-[160px]">
        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-16 text-zinc-400">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            <span className="text-sm">Đang tải lịch chiếu...</span>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 py-12 text-center">
            <AlertCircle className="h-8 w-8 text-red-400" aria-hidden />
            <div>
              <p className="text-sm font-medium text-red-300">Không thể tải lịch chiếu</p>
              <p className="mt-1 text-xs text-zinc-500">
                {error instanceof Error ? error.message : 'Vui lòng thử lại sau'}
              </p>
            </div>
          </div>
        )}

        {/* Empty */}
        {isEmpty && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/5 bg-white/3 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 ring-1 ring-white/10">
              <Users className="h-6 w-6 text-zinc-600" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Không có suất chiếu</p>
              <p className="mt-1 text-xs text-zinc-600">Chưa có lịch chiếu cho ngày này</p>
            </div>
          </div>
        )}

        {/* Cinema groups */}
        {filteredGroups && filteredGroups.length > 0 && (
          <div className="space-y-4">
            {filteredGroups.map((group) => (
              <CinemaGroup
                key={group.cinemaId}
                group={group}
                onSelectShowtime={handleSelectShowtime}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
