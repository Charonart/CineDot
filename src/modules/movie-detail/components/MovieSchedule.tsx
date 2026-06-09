'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CinemaSchedule, ShowtimeItem } from '../data/movieDetailData';
import { ScrollTextSlideLeft, HighlightText } from '@/shared/components/visual';

interface MovieScheduleProps {
  cinemas: CinemaSchedule[];
}

interface ScheduleDropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
  className?: string;
}

const ScheduleDropdown: React.FC<ScheduleDropdownProps> = ({
  label,
  value,
  options,
  onChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div 
      ref={containerRef}
      className={`cine-dropdown ${isOpen ? 'is-open is-open-down' : ''} ${className}`}
    >
      <button
        type="button"
        className="cine-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        style={{ minHeight: '44px', height: '44px', padding: '4px 16px' }}
      >
        <span className="cine-dropdown-label" style={{ fontSize: '9px', marginBottom: '1px', lineHeight: '1.2' }}>{label}</span>
        <span className="cine-dropdown-value" style={{ fontSize: '13px', lineHeight: '1.2' }}>
          {selectedOption ? selectedOption.label : 'Chọn...'}
        </span>
        <span className="cine-dropdown-chevron">
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
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="cine-dropdown-menu" role="listbox" style={{ top: 'calc(100% + 4px)' }}>
          <div className="cine-dropdown-list">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`cine-dropdown-item ${opt.value === value ? 'is-selected' : ''}`}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                <span>{opt.label}</span>
                {opt.value === value && (
                  <span className="cine-dropdown-check-icon" style={{ display: 'inline' }}>
                    <svg
                      width="12"
                      height="12"
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
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const MovieSchedule: React.FC<MovieScheduleProps> = ({ cinemas }) => {
  const router = useRouter();
  const params = useParams();
  const movieSlug = (params?.slug as string) || '';

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCinemaFilter, setSelectedCinemaFilter] = useState<string>('all');

  const regionOptions = useMemo(() => [
    { value: 'all', label: 'Toàn quốc' },
    { value: 'hcm', label: 'Hồ Chí Minh' },
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'danang', label: 'Đà Nẵng' },
  ], []);

  const cinemaOptions = useMemo(() => [
    { value: 'all', label: 'Tất cả rạp' },
    { value: 'galaxy', label: 'Galaxy CineX - Hanoi Centre' },
    { value: 'landmark', label: 'CINE Landmark - Q1' },
    { value: 'crescent', label: 'CINE Crescent - Q7' },
  ], []);

  // Generate 7 days (today + next 6 days) dynamically
  const dateTabs = useMemo(() => {
    const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const current = new Date();
      current.setDate(today.getDate() + i);
      const day = String(current.getDate()).padStart(2, '0');
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const formattedDate = `${day}/${month}`;
      const dayOfWeek = weekdays[current.getDay()];
      const dayLabel = i === 0 ? 'Hôm nay' : dayOfWeek;
      const dateStr = `${current.getFullYear()}-${month}-${day}`;
      return { dayLabel, formattedDate, dateStr };
    });
  }, []);

  // Initialize selectedDate to today if empty
  React.useEffect(() => {
    if (dateTabs.length > 0 && !selectedDate) {
      setSelectedDate(dateTabs[0].dateStr);
    }
  }, [dateTabs, selectedDate]);

  // Filter cinemas based on Region & Cinema select filters
  const filteredCinemas = useMemo(() => {
    return cinemas.filter((cinema) => {
      // 1. Region Filter
      if (selectedRegion === 'hcm' && !cinema.name.includes('Landmark') && !cinema.name.includes('Crescent')) {
        return false;
      }
      if (selectedRegion === 'hanoi' && !cinema.name.includes('Galaxy')) {
        return false;
      }
      
      // 2. Cinema Filter
      if (selectedCinemaFilter === 'galaxy' && !cinema.name.includes('Galaxy')) {
        return false;
      }
      if (selectedCinemaFilter === 'landmark' && !cinema.name.includes('Landmark')) {
        return false;
      }
      if (selectedCinemaFilter === 'crescent' && !cinema.name.includes('Crescent')) {
        return false;
      }

      return true;
    });
  }, [cinemas, selectedRegion, selectedCinemaFilter]);

  // Helper to resolve button classes and attributes based on status
  const getShowtimeBtnProps = (status: ShowtimeItem['status']) => {
    switch (status) {
      case 'past':
        return { className: 'time-btn is-past', disabled: true, title: 'Đã qua giờ chiếu', label: 'Đã qua' };
      case 'locked':
        return { className: 'time-btn is-locked', disabled: true, title: 'Tạm khóa', label: 'Tạm khóa' };
      case 'sold-out':
        return { className: 'time-btn is-sold-out', disabled: true, title: 'Suất chiếu đã hết vé', label: 'Hết vé' };
      case 'almost-full':
        return { className: 'time-btn is-almost-full', disabled: false, title: 'Gần hết vé', label: null };
      default:
        return { className: 'time-btn', disabled: false, title: undefined, label: null };
    }
  };

  const handleShowtimeClick = (cinemaName: string, time: string) => {
    const bookingParams = new URLSearchParams({
      movie: movieSlug,
      cinema: cinemaName,
      date: selectedDate,
      time: time,
    });
    router.push(`/booking/seats?${bookingParams.toString()}`);
  };

  return (
    <section className="section-detail-content fade-up in-view" id="schedule">
      <ScrollTextSlideLeft as="h2" className="detail-section-title">
        Lịch{' '}
        <HighlightText variant="underline" color="primary">
          chiếu
        </HighlightText>
      </ScrollTextSlideLeft>

      <div className="schedule-toolbar">
        {/* Date Selector Wrapper */}
        <div className="schedule-date-nav">
          <button 
            type="button" 
            className="schedule-nav-btn" 
            aria-label="Ngày trước"
            onClick={() => {
              const el = document.querySelector('.schedule-date-list');
              el?.scrollBy({ left: -240, behavior: 'smooth' });
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="schedule-date-list">
            {dateTabs.map(({ dayLabel, formattedDate, dateStr }) => (
              <button
                key={dateStr}
                type="button"
                className={`schedule-date-item ${selectedDate === dateStr ? 'is-active active' : ''}`}
                onClick={() => {
                  setSelectedDate(dateStr);
                }}
              >
                <span className="schedule-date-label">{dayLabel}</span>
                <span className="schedule-date-value">{formattedDate}</span>
              </button>
            ))}
          </div>

          <button 
            type="button" 
            className="schedule-nav-btn" 
            aria-label="Ngày sau"
            onClick={() => {
              const el = document.querySelector('.schedule-date-list');
              el?.scrollBy({ left: 240, behavior: 'smooth' });
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="schedule-filters">
          <ScheduleDropdown
            label="Khu vực"
            value={selectedRegion}
            options={regionOptions}
            onChange={(val) => {
              setSelectedRegion(val);
            }}
            className="schedule-filter-city"
          />
          
          <ScheduleDropdown
            label="Rạp chiếu"
            value={selectedCinemaFilter}
            options={cinemaOptions}
            onChange={(val) => {
              setSelectedCinemaFilter(val);
            }}
            className="schedule-filter-cinema"
          />
        </div>
      </div>

      {/* Cinema Listings */}
      {filteredCinemas.length === 0 ? (
        <div className="movies-empty-state" style={{ padding: '40px 0', border: '1px dashed var(--color-surface-muted)', borderRadius: '12px', marginTop: '20px' }}>
          <p>Không có lịch chiếu phù hợp với bộ lọc khu vực và rạp.</p>
        </div>
      ) : (
        filteredCinemas.map((cinema) => {
          return (
            <div key={cinema.name} className="cinema-schedule-box" style={{ marginBottom: '24px' }}>
              <h3 className="cinema-group-title">{cinema.name}</h3>

              <div className="showtime-rows">
                {cinema.formats.map((format) => (
                  <div key={format.name} className="showtime-row">
                    <h4 className="format-title">{format.name}</h4>
                    <div className="time-grid">
                      {format.times.map((item) => {
                        const { className, disabled, title, label } = getShowtimeBtnProps(item.status);

                        return (
                          <button
                            key={item.scheduleId}
                            type="button"
                            className={className}
                            disabled={disabled}
                            title={title}
                            onClick={() => handleShowtimeClick(cinema.name, item.time)}
                          >
                            <span>{item.time}</span>
                            {label && <small>{label}</small>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </section>
  );
};
