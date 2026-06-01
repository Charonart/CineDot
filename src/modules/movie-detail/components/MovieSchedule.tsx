import React, { useState, useMemo } from 'react';
import { CinemaSchedule, ShowtimeItem } from '../data/movieDetailData';
import { ScrollTextSlideLeft, HighlightText } from '@/shared/components/visual';

interface MovieScheduleProps {
  cinemas: CinemaSchedule[];
}

export const MovieSchedule: React.FC<MovieScheduleProps> = ({ cinemas }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCinemaFilter, setSelectedCinemaFilter] = useState<string>('all');
  
  // Track currently selected showtime to display CTA
  const [selectedShowtime, setSelectedShowtime] = useState<{
    cinemaName: string;
    time: string;
    scheduleId: string;
  } | null>(null);

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

  const handleShowtimeClick = (cinemaName: string, time: string, scheduleId: string) => {
    setSelectedShowtime({ cinemaName, time, scheduleId });
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
        {/* Date slider */}
        <button 
          type="button" 
          className="date-nav prev" 
          aria-label="Ngày trước"
          onClick={() => {
            const el = document.querySelector('.date-slider');
            el?.scrollBy({ left: -240, behavior: 'smooth' });
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className="date-slider">
          {dateTabs.map(({ dayLabel, formattedDate, dateStr }) => (
            <button
              key={dateStr}
              type="button"
              className={`date-tab ${selectedDate === dateStr ? 'active' : ''}`}
              onClick={() => {
                setSelectedDate(dateStr);
                setSelectedShowtime(null); // Clear selected seat CTA on date switch
              }}
            >
              <span>{dayLabel}</span>
              <strong>{formattedDate}</strong>
            </button>
          ))}
        </div>

        <button 
          type="button" 
          className="date-nav next" 
          aria-label="Ngày tiếp theo"
          onClick={() => {
            const el = document.querySelector('.date-slider');
            el?.scrollBy({ left: 240, behavior: 'smooth' });
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {/* Dropdown Filters */}
        <div className="schedule-filters">
          <select 
            className="filter-select" 
            id="filterRegion" 
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setSelectedShowtime(null);
            }}
            aria-label="Chọn khu vực"
          >
            <option value="all">Toàn quốc</option>
            <option value="hcm">Hồ Chí Minh</option>
            <option value="hanoi">Hà Nội</option>
            <option value="danang">Đà Nẵng</option>
          </select>
          
          <select 
            className="filter-select" 
            id="filterCinema" 
            value={selectedCinemaFilter}
            onChange={(e) => {
              setSelectedCinemaFilter(e.target.value);
              setSelectedShowtime(null);
            }}
            aria-label="Chọn rạp"
          >
            <option value="all">Tất cả rạp</option>
            <option value="galaxy">Galaxy CineX - Hanoi Centre</option>
            <option value="landmark">CINE Landmark - Q1</option>
            <option value="crescent">CINE Crescent - Q7</option>
          </select>
        </div>
      </div>

      {/* Cinema Listings */}
      {filteredCinemas.length === 0 ? (
        <div className="movies-empty-state" style={{ padding: '40px 0', border: '1px dashed var(--color-surface-muted)', borderRadius: '12px', marginTop: '20px' }}>
          <p>Không có lịch chiếu phù hợp với bộ lọc khu vực và rạp.</p>
        </div>
      ) : (
        filteredCinemas.map((cinema) => {
          const hasSelectedInThisCinema = selectedShowtime?.cinemaName === cinema.name;

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
                        const isCurrentSelected = selectedShowtime?.scheduleId === item.scheduleId;

                        return (
                          <button
                            key={item.scheduleId}
                            type="button"
                            className={`${className} ${isCurrentSelected ? 'selected' : ''}`}
                            disabled={disabled}
                            title={title}
                            onClick={() => handleShowtimeClick(cinema.name, item.time, item.scheduleId)}
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

              {/* Dynamic Next Step seat selection CTA inside the active cinema box */}
              {hasSelectedInThisCinema && selectedShowtime && (
                <div id="nextStepCtaWrap" className="showtime-next-step" style={{ marginTop: '20px', borderTop: '1px solid var(--color-surface-muted)', paddingTop: '16px' }}>
                  <button 
                    type="button"
                    className="btn-primary btn-large" 
                    onClick={() => {
                      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
                      const movieSlug = pathname.split('/').pop() || 'dune-part-two';
                      window.location.href = `/booking/seats?movie=${movieSlug}&cinema=${encodeURIComponent(selectedShowtime.cinemaName)}&date=${selectedDate}&time=${selectedShowtime.time}`;
                    }}
                  >
                    Tiếp tục chọn ghế ({selectedShowtime.time})
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </section>
  );
};
