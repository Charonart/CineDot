'use client';

import React, { useEffect, useRef } from 'react';
import { useQuickBooking } from '@modules/booking/hooks/useQuickBooking';
import { QuickBookingDropdown, SelectOption } from '@modules/booking/types/quick-booking.type';

interface DropdownProps {
  label: string;
  placeholder: string;
  disabled: boolean;
  value: string;
  options: SelectOption[];
  isOpen: boolean;
  emptyMessage: string;
  onToggle: () => void;
  onClose: () => void;
  onSelect: (val: string) => void;
}

const CineReactDropdown: React.FC<DropdownProps> = ({
  label,
  placeholder,
  disabled,
  value,
  options,
  isOpen,
  emptyMessage,
  onToggle,
  onClose,
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
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div
      ref={containerRef}
      className={`cine-dropdown ${disabled ? 'is-disabled' : ''} ${isOpen ? 'is-open is-open-down' : ''}`}
    >
      <button
        type="button"
        className="cine-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen && !disabled}
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

      {isOpen && !disabled && (
        <div className="cine-dropdown-menu" role="listbox">
          <div className="cine-dropdown-list">
            {options.length > 0 ? (
              options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`cine-dropdown-item ${opt.value === value ? 'is-selected' : ''}`}
                  role="option"
                  aria-selected={opt.value === value}
                  onClick={() => onSelect(opt.value)}
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
              ))
            ) : (
              <button
                type="button"
                className="cine-dropdown-item is-disabled"
                role="option"
                aria-selected={false}
                disabled
              >
                <span>{emptyMessage}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const QuickBookingPanel: React.FC = () => {
  const {
    selectedMovieId,
    selectedCinemaId,
    selectedDate,
    selectedShowtimeId,
    openDropdown,
    movieOptions,
    cinemaOptions,
    dateOptions,
    showtimeOptions,
    isMoviesLoading,
    isCinemasLoading,
    isDatesLoading,
    isShowtimesLoading,
    hasMoviesError,
    hasCinemasError,
    hasDatesError,
    hasShowtimesError,
    handleMovieSelect,
    handleCinemaSelect,
    handleDateSelect,
    handleShowtimeSelect,
    handleToggleDropdown,
    handleCloseDropdown,
    handleSubmit,
  } = useQuickBooking();

  const getFieldClassName = (
    disabled: boolean,
    value: string,
    fieldType: QuickBookingDropdown,
  ) => {
    let base = 'booking-field';
    if (disabled) base += ' is-disabled';
    else if (value) base += ' is-selected';
    else base += ' is-active';
    if (openDropdown === fieldType) base += ' is-open';
    return base;
  };

  const isMovieDisabled = isMoviesLoading || hasMoviesError;
  const isCinemaDisabled = !selectedMovieId || isCinemasLoading || hasCinemasError;
  const isDateDisabled = !selectedCinemaId || isDatesLoading || hasDatesError;
  const isShowtimeDisabled = !selectedDate || isShowtimesLoading || hasShowtimesError;

  return (
    <div className="booking-strip">
      <form onSubmit={handleSubmit} className="booking-card fade-up in-view">
        <div className="booking-fields">
          <div className={getFieldClassName(isMovieDisabled, selectedMovieId, 'movie')}>
            <CineReactDropdown
              label="PHIM"
              placeholder={isMoviesLoading ? 'Đang tải...' : hasMoviesError ? 'Không thể tải phim' : 'Chọn phim'}
              disabled={isMovieDisabled}
              value={selectedMovieId}
              options={movieOptions}
              isOpen={openDropdown === 'movie'}
              emptyMessage="Không có phim"
              onToggle={() => handleToggleDropdown('movie')}
              onClose={handleCloseDropdown}
              onSelect={handleMovieSelect}
            />
          </div>

          <div className="booking-divider"></div>

          <div className={getFieldClassName(isCinemaDisabled, selectedCinemaId, 'cinema')}>
            <CineReactDropdown
              label="RẠP"
              placeholder={isCinemasLoading ? 'Đang tải...' : hasCinemasError ? 'Không thể tải rạp' : 'Chọn rạp'}
              disabled={isCinemaDisabled}
              value={selectedCinemaId}
              options={cinemaOptions}
              isOpen={openDropdown === 'cinema'}
              emptyMessage="Không có rạp"
              onToggle={() => handleToggleDropdown('cinema')}
              onClose={handleCloseDropdown}
              onSelect={handleCinemaSelect}
            />
          </div>

          <div className="booking-divider"></div>

          <div className={getFieldClassName(isDateDisabled, selectedDate, 'date')}>
            <CineReactDropdown
              label="NGÀY"
              placeholder={isDatesLoading ? 'Đang tải...' : hasDatesError ? 'Không thể tải ngày' : 'Chọn ngày'}
              disabled={isDateDisabled}
              value={selectedDate}
              options={dateOptions}
              isOpen={openDropdown === 'date'}
              emptyMessage="Không có ngày"
              onToggle={() => handleToggleDropdown('date')}
              onClose={handleCloseDropdown}
              onSelect={handleDateSelect}
            />
          </div>

          <div className="booking-divider"></div>

          <div className={getFieldClassName(isShowtimeDisabled, selectedShowtimeId, 'showtime')}>
            <CineReactDropdown
              label="SUẤT CHIẾU"
              placeholder={isShowtimesLoading ? 'Đang tải...' : hasShowtimesError ? 'Không thể tải suất' : 'Chọn giờ'}
              disabled={isShowtimeDisabled}
              value={selectedShowtimeId}
              options={showtimeOptions}
              isOpen={openDropdown === 'showtime'}
              emptyMessage="Không có suất chiếu"
              onToggle={() => handleToggleDropdown('showtime')}
              onClose={handleCloseDropdown}
              onSelect={handleShowtimeSelect}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary btn-booking"
          disabled={!selectedShowtimeId}
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
