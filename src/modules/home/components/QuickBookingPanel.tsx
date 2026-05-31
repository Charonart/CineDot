'use client';

import React, { useState, useEffect, useRef } from 'react';

interface MovieOption {
  id: string;
  title: string;
  status: string;
}

interface CinemaOption {
  id: string;
  name: string;
}

interface DateOption {
  id: string;
  label: string;
}

const bookingDb = {
  movies: [
    { id: "movie_1", title: "Người Nhện: Phần 2", status: "now-showing" },
    { id: "movie_2", title: "Godzilla x Kong", status: "now-showing" },
    { id: "movie_3", title: "Ghostbusters: Frozen Empire", status: "now-showing" },
    { id: "movie_4", title: "Civil War", status: "now-showing" },
    { id: "movie_5", title: "Furiosa", status: "now-showing" },
    { id: "movie_6", title: "Inside Out 2", status: "now-showing" },
    { id: "movie_7", title: "Deadpool & Wolverine", status: "coming-soon" },
    { id: "movie_8", title: "Alien: Romulus", status: "coming-soon" }
  ] as MovieOption[],
  cinemas: [
    { id: "cinema_1", name: "CINE Landmark — Quận 1" },
    { id: "cinema_2", name: "CINE Crescent — Quận 7" },
    { id: "cinema_3", name: "CINE Aeon — Bình Dương" },
    { id: "cinema_4", name: "CINE Vincom — Quận 3" }
  ] as CinemaOption[],
  dates: [
    { id: "date_1", label: "Hôm nay — 27/05" },
    { id: "date_2", label: "Ngày mai — 28/05" },
    { id: "date_3", label: "Thứ Năm — 29/05" },
    { id: "date_4", label: "Thứ Sáu — 30/05" }
  ] as DateOption[],
  times: {
    "movie_1": ["10:15", "13:30", "16:45", "19:00", "21:30"],
    "movie_2": ["09:00", "11:45", "14:30", "17:15", "20:00", "22:45"],
    "movie_3": ["10:00", "12:30", "15:00", "18:30", "21:00"],
    "movie_4": ["11:00", "13:45", "16:30", "19:15", "22:00"],
    "movie_5": ["08:30", "11:00", "14:15", "17:00", "19:45", "22:30"],
    "movie_6": ["09:30", "12:00", "14:30", "17:00", "19:30", "21:45"]
  } as Record<string, string[]>
};

interface DropdownProps {
  label: string;
  placeholder: string;
  disabled: boolean;
  value: string;
  options: { value: string; label: string }[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (val: string) => void;
}

const CineReactDropdown: React.FC<DropdownProps> = ({
  label,
  placeholder,
  disabled,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onToggle();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div 
      ref={containerRef}
      className={`cine-dropdown ${disabled ? 'is-disabled' : ''} ${isOpen ? 'is-open is-open-down' : ''}`}
    >
      <button
        type="button"
        className="cine-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={onToggle}
      >
        <span className="cine-dropdown-label">{label}</span>
        <span className={`cine-dropdown-value ${!value ? 'is-placeholder' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="cine-dropdown-chevron">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="cine-dropdown-menu" role="listbox">
          <div className="cine-dropdown-list">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`cine-dropdown-item ${opt.value === value ? 'is-selected' : ''}`}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onSelect(opt.value);
                  onToggle();
                }}
              >
                <span>{opt.label}</span>
                <span className="cine-dropdown-check-icon">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const QuickBookingPanel: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedCinema, setSelectedCinema] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState<'movie' | 'cinema' | 'date' | 'time' | null>(null);

  // Auto reset dependent dropdown fields when upstream field changes
  const handleMovieSelect = (val: string) => {
    setSelectedMovie(val);
    setSelectedCinema('');
    setSelectedDate('');
    setSelectedTime('');
    setOpenDropdown('cinema'); // Auto cascade focus to cinema
  };

  const handleCinemaSelect = (val: string) => {
    setSelectedCinema(val);
    setSelectedDate('');
    setSelectedTime('');
    setOpenDropdown('date'); // Auto cascade focus to date
  };

  const handleDateSelect = (val: string) => {
    setSelectedDate(val);
    setSelectedTime('');
    setOpenDropdown('time'); // Auto cascade focus to time
  };

  const handleTimeSelect = (val: string) => {
    setSelectedTime(val);
    setOpenDropdown(null);
  };

  const handleToggle = (field: 'movie' | 'cinema' | 'date' | 'time') => {
    setOpenDropdown((current) => (current === field ? null : field));
  };

  // Submit action showing toast
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovie || !selectedCinema || !selectedDate || !selectedTime) return;

    const movieTitle = bookingDb.movies.find(m => m.id === selectedMovie)?.title;
    const cinemaName = bookingDb.cinemas.find(c => c.id === selectedCinema)?.name;
    const dateLabel = bookingDb.dates.find(d => d.id === selectedDate)?.label;

    alert(`🎬 Đặt vé thành công!\n${movieTitle}\n${cinemaName}\n${dateLabel} · Suất ${selectedTime}`);
  };

  // Options filtering based on cascade database
  const movieOptions = bookingDb.movies
    .filter(m => m.status === 'now-showing')
    .map(m => ({ value: m.id, label: m.title }));

  const cinemaOptions = selectedMovie 
    ? bookingDb.cinemas.map(c => ({ value: c.id, label: c.name }))
    : [];

  const dateOptions = selectedCinema 
    ? bookingDb.dates.map(d => ({ value: d.id, label: d.label }))
    : [];

  const timeOptions = selectedDate && selectedMovie
    ? (bookingDb.times[selectedMovie] || []).map(t => ({ value: t, label: t }))
    : [];

  const getFieldClassName = (disabled: boolean, value: string, fieldType: 'movie' | 'cinema' | 'date' | 'time') => {
    let base = "booking-field";
    if (disabled) base += " is-disabled";
    else if (value) base += " is-selected";
    else base += " is-active";
    if (openDropdown === fieldType) base += " is-open";
    return base;
  };

  const isFormComplete = selectedMovie && selectedCinema && selectedDate && selectedTime;

  return (
    <div className="booking-strip">
      <form onSubmit={handleSubmit} className="booking-card fade-up in-view">
        <div className="booking-fields">
          {/* PHIM DROPDOWN */}
          <div className={getFieldClassName(false, selectedMovie, 'movie')}>
            <CineReactDropdown
              label="Phim"
              placeholder="Chọn phim"
              disabled={false}
              value={selectedMovie}
              options={movieOptions}
              isOpen={openDropdown === 'movie'}
              onToggle={() => handleToggle('movie')}
              onSelect={handleMovieSelect}
            />
          </div>

          <div className="booking-divider"></div>

          {/* RẠP DROPDOWN */}
          <div className={getFieldClassName(!selectedMovie, selectedCinema, 'cinema')}>
            <CineReactDropdown
              label="Rạp"
              placeholder="Chọn rạp"
              disabled={!selectedMovie}
              value={selectedCinema}
              options={cinemaOptions}
              isOpen={openDropdown === 'cinema'}
              onToggle={() => handleToggle('cinema')}
              onSelect={handleCinemaSelect}
            />
          </div>

          <div className="booking-divider"></div>

          {/* NGÀY DROPDOWN */}
          <div className={getFieldClassName(!selectedCinema, selectedDate, 'date')}>
            <CineReactDropdown
              label="Ngày"
              placeholder="Chọn ngày"
              disabled={!selectedCinema}
              value={selectedDate}
              options={dateOptions}
              isOpen={openDropdown === 'date'}
              onToggle={() => handleToggle('date')}
              onSelect={handleDateSelect}
            />
          </div>

          <div className="booking-divider"></div>

          {/* SUẤT CHIẾU DROPDOWN */}
          <div className={getFieldClassName(!selectedDate, selectedTime, 'time')}>
            <CineReactDropdown
              label="Suất chiếu"
              placeholder="Chọn giờ"
              disabled={!selectedDate}
              value={selectedTime}
              options={timeOptions}
              isOpen={openDropdown === 'time'}
              onToggle={() => handleToggle('time')}
              onSelect={handleTimeSelect}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-primary btn-booking" 
          disabled={!isFormComplete}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            <path d="M13 5v2" />
            <path d="M13 17v2" />
            <path d="M13 11v2" />
          </svg>
          Đặt vé
        </button>
      </form>
    </div>
  );
};
