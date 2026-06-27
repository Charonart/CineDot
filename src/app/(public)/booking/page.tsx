'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  useBookingSelectorShowtimes,
} from '@/modules/booking/hooks/useBookingSelector';
import { BookingSelectorCinema, BookingSelectorShowtime } from '@/modules/booking/types/bookingSelector.type';
import { useMoviesList } from '@/modules/movie/hooks/useMovies';
import { Movie } from '@/modules/movie/types/movie.type';
import { appRoutes } from '@/shared/routes/appRoutes';
import Image from 'next/image';

const daysOfWeek = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

const generateDates = () => {
  const baseDate = new Date('2026-05-18');
  const list = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = daysOfWeek[d.getDay()];
    const label = `${dayName}, ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    list.push({ date: dateStr, label });
  }
  return list;
};

const cinemasList: BookingSelectorCinema[] = [
  { cinemaId: 1, name: 'CineDot Galaxy - Q1', city: 'HCM' },
  { cinemaId: 2, name: 'CineDot Vincom - Q10', city: 'HCM' },
];

export default function BookingPage() {
  const router = useRouter();
  
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedCinema, setSelectedCinema] = useState<BookingSelectorCinema | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-18');

  const { data: moviesListData, isLoading: loadingMovies } = useMoviesList({ status: 'now-showing' });
  const movies = moviesListData?.items || [];
  
  const { data: showtimes, isLoading: loadingShowtimes } = useBookingSelectorShowtimes(
    selectedMovie?.slug || '',
    selectedDate
  );

  const dates = useMemo(() => generateDates(), []);

  const filteredShowtimes = useMemo(() => {
    if (!showtimes || !selectedCinema) return [];
    return showtimes.filter(st => st.cinema.cinemaId === selectedCinema.cinemaId);
  }, [showtimes, selectedCinema]);

  // Group filtered showtimes by room
  const showtimesByRoom = useMemo(() => {
    const groups: Record<string, { roomName: string; screenType: string; slots: BookingSelectorShowtime[] }> = {};
    filteredShowtimes.forEach(st => {
      const key = `${st.room.roomId}-${st.room.name}`;
      if (!groups[key]) {
        groups[key] = {
          roomName: st.room.name,
          screenType: st.room.screenType,
          slots: [],
        };
      }
      groups[key].slots.push(st);
    });
    // Sort slots by time
    Object.values(groups).forEach(g => {
      g.slots.sort((a, b) => a.time.startTime.localeCompare(b.time.startTime));
    });
    return Object.values(groups);
  }, [filteredShowtimes]);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setActiveStep(2);
  };

  const handleSelectCinema = (cinema: BookingSelectorCinema) => {
    setSelectedCinema(cinema);
    setActiveStep(3);
  };

  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    setActiveStep(4);
  };

  const handleSelectShowtimeSlot = (showtimeId: number) => {
    router.push(appRoutes.bookingSeats(showtimeId));
  };

  return (
    <main
      style={{
        background: '#0D0C1D',
        backgroundImage: 'radial-gradient(circle at 50% 0%, #1c1538 0%, #0d0c1d 80%)',
        minHeight: '100vh',
        padding: '120px 20px 80px 20px',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: '0 0 10px 0',
              background: 'linear-gradient(135deg, #ffffff 0%, #A594FD 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ĐẶT VÉ NHANH
          </h1>
          <p style={{ color: '#8F8CA3', fontSize: '15px', margin: 0 }}>
            Hệ thống đặt vé chuẩn Linear Funnel. Chọn phim, rạp, ngày chiếu và suất chiếu.
          </p>
        </div>

        {/* 4-Step collapsible wizard layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* STEP 1: CHỌN PHIM */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              overflow: 'hidden',
              transition: 'all 0.25s ease',
            }}
          >
            {/* Step summary / title header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderBottom: activeStep === 1 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                cursor: selectedMovie ? 'pointer' : 'default',
              }}
              onClick={() => selectedMovie && setActiveStep(1)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: activeStep === 1 ? '#6C5DD3' : 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  {selectedMovie && activeStep !== 1 ? '✓' : '1'}
                </span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Chọn Phim</h3>
                  {selectedMovie && activeStep !== 1 && (
                    <span style={{ fontSize: '13.5px', color: '#6C5DD3', fontWeight: 600 }}>
                      {selectedMovie.title}
                    </span>
                  )}
                </div>
              </div>
              {selectedMovie && activeStep !== 1 && (
                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#A594FD',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Thay đổi
                </button>
              )}
            </div>

            {/* Step Body */}
            {activeStep === 1 && (
              <div style={{ padding: '24px' }}>
                {loadingMovies ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#8F8CA3' }}>
                    Đang tải danh sách phim...
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                      gap: '20px',
                    }}
                  >
                    {movies?.map((movie) => (
                      <div
                        key={movie.id}
                        onClick={() => handleSelectMovie(movie)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: selectedMovie?.id === movie.id ? '2px solid #6C5DD3' : '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease, border-color 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.borderColor = 'rgba(108, 93, 211, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.borderColor = selectedMovie?.id === movie.id ? '#6C5DD3' : 'rgba(255, 255, 255, 0.08)';
                        }}
                      >
                        <div style={{ position: 'relative', width: '100%', height: '240px' }}>
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <span
                            style={{
                              position: 'absolute',
                              top: '8px',
                              left: '8px',
                              background: '#6C5DD3',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                            }}
                          >
                            {movie.ageRating}
                          </span>
                        </div>
                        <div style={{ padding: '12px' }}>
                          <h4
                            style={{
                              fontSize: '14.5px',
                              fontWeight: 700,
                              margin: '0 0 6px 0',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {movie.title}
                          </h4>
                          <span style={{ fontSize: '12px', color: '#8F8CA3' }}>
                            {movie.genres?.map(g => g.name).join(', ') || ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STEP 2: CHỌN RẠP */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              overflow: 'hidden',
              opacity: selectedMovie ? 1 : 0.5,
              pointerEvents: selectedMovie ? 'auto' : 'none',
              transition: 'all 0.25s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderBottom: activeStep === 2 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                cursor: selectedCinema ? 'pointer' : 'default',
              }}
              onClick={() => selectedCinema && setActiveStep(2)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: activeStep === 2 ? '#6C5DD3' : 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  {selectedCinema && activeStep !== 2 ? '✓' : '2'}
                </span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Chọn Rạp</h3>
                  {selectedCinema && activeStep !== 2 && (
                    <span style={{ fontSize: '13.5px', color: '#6C5DD3', fontWeight: 600 }}>
                      {selectedCinema.name}
                    </span>
                  )}
                </div>
              </div>
              {selectedCinema && activeStep !== 2 && (
                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#A594FD',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Thay đổi
                </button>
              )}
            </div>

            {activeStep === 2 && (
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cinemasList.map((cinema) => (
                  <div
                    key={cinema.cinemaId}
                    onClick={() => handleSelectCinema(cinema)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: selectedCinema?.cinemaId === cinema.cinemaId ? '2px solid #6C5DD3' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background 0.2s ease, border-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px 0' }}>{cinema.name}</h4>
                      <span style={{ fontSize: '13px', color: '#8F8CA3' }}>TP. Hồ Chí Minh</span>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: '#8F8CA3' }}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STEP 3: CHỌN NGÀY */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              overflow: 'hidden',
              opacity: selectedCinema ? 1 : 0.5,
              pointerEvents: selectedCinema ? 'auto' : 'none',
              transition: 'all 0.25s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderBottom: activeStep === 3 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                cursor: selectedDate ? 'pointer' : 'default',
              }}
              onClick={() => selectedDate && setActiveStep(3)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: activeStep === 3 ? '#6C5DD3' : 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  {selectedDate && activeStep !== 3 ? '✓' : '3'}
                </span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Chọn Ngày Chiếu</h3>
                  {selectedDate && activeStep !== 3 && (
                    <span style={{ fontSize: '13.5px', color: '#6C5DD3', fontWeight: 600 }}>
                      {dates.find(d => d.date === selectedDate)?.label || selectedDate}
                    </span>
                  )}
                </div>
              </div>
              {selectedDate && activeStep !== 3 && (
                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#A594FD',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Thay đổi
                </button>
              )}
            </div>

            {activeStep === 3 && (
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                  {dates.map((d) => {
                    const isSelected = selectedDate === d.date;
                    return (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => handleSelectDate(d.date)}
                        style={{
                          flex: '0 0 auto',
                          padding: '14px 20px',
                          background: isSelected ? '#6C5DD3' : 'rgba(255, 255, 255, 0.03)',
                          border: isSelected ? '1px solid #6C5DD3' : '1px solid rgba(255, 255, 255, 0.08)',
                          color: '#ffffff',
                          borderRadius: '12px',
                          fontWeight: 600,
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'center',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        }}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* STEP 4: CHỌN SUẤT CHIẾU */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              overflow: 'hidden',
              opacity: selectedDate ? 1 : 0.5,
              pointerEvents: selectedDate ? 'auto' : 'none',
              transition: 'all 0.25s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px 24px',
                borderBottom: activeStep === 4 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: activeStep === 4 ? '#6C5DD3' : 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  4
                </span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Chọn Suất Chiếu</h3>
                </div>
              </div>
            </div>

            {activeStep === 4 && (
              <div style={{ padding: '24px' }}>
                {loadingShowtimes ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#8F8CA3' }}>
                    Đang tìm lịch chiếu...
                  </div>
                ) : showtimesByRoom.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#8F8CA3' }}>
                    Rất tiếc, không tìm thấy lịch chiếu phù hợp cho ngày này. Vui lòng chọn ngày khác hoặc chọn phim khác.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {showtimesByRoom.map((group) => (
                      <div
                        key={group.roomName}
                        style={{
                          background: 'rgba(255, 255, 255, 0.01)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '12px',
                          padding: '20px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>{group.roomName}</h4>
                          <span
                            style={{
                              background: 'rgba(108, 93, 211, 0.15)',
                              color: '#A594FD',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            {group.screenType}
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                          {group.slots.map((slot) => {
                            const isSoldOut = slot.status === 'sold_out' || slot.seatSummary.availableSeats === 0;
                            const timeStr = slot.time.startTime.split('T')[1].substring(0, 5);
                            return (
                              <button
                                key={slot.showtimeId}
                                type="button"
                                disabled={isSoldOut}
                                onClick={() => handleSelectShowtimeSlot(slot.showtimeId)}
                                style={{
                                  padding: '12px 18px',
                                  background: 'rgba(255, 255, 255, 0.03)',
                                  border: '1px solid rgba(255, 255, 255, 0.08)',
                                  color: isSoldOut ? '#5A586B' : '#ffffff',
                                  borderRadius: '8px',
                                  cursor: isSoldOut ? 'not-allowed' : 'pointer',
                                  transition: 'all 0.2s ease',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSoldOut) {
                                    e.currentTarget.style.background = '#6C5DD3';
                                    e.currentTarget.style.borderColor = '#6C5DD3';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSoldOut) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                  }
                                }}
                              >
                                <span style={{ fontSize: '16px', fontWeight: 700 }}>{timeStr}</span>
                                <span style={{ fontSize: '11px', opacity: 0.8 }}>
                                  {isSoldOut ? 'Hết vé' : `${slot.pricing.basePrice.toLocaleString('vi-VN')}đ`}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}
