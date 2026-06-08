/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useNavbarMovies } from '@/modules/movie/hooks/useMovies';
import { Movie } from '@/modules/movie/types/movie.type';
import { appRoutes } from '@/shared/routes/appRoutes';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);

  const { data, isLoading, isError } = useNavbarMovies();

  const navbarRef = useRef<HTMLDivElement>(null);
  const timeoutRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Parse category movies
  const movies = data?.items || [];
  const nowShowingMovies = movies.filter(m => m.status === 'now-showing').slice(0, 4);
  const comingSoonMovies = movies.filter(m => m.status === 'coming-soon').slice(0, 4);

  // 1. Scroll Shadow listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Click outside & ESC key handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMouseEnter = (menuId: string) => {
    if (timeoutRefs.current[menuId]) {
      clearTimeout(timeoutRefs.current[menuId]);
      delete timeoutRefs.current[menuId];
    }
    setActiveDropdown(menuId);
  };

  const handleMouseLeave = (menuId: string) => {
    timeoutRefs.current[menuId] = setTimeout(() => {
      setActiveDropdown((current) => (current === menuId ? null : current));
      delete timeoutRefs.current[menuId];
    }, 150);
  };

  const toggleMobileDropdown = (menuId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMobileDropdown((current) => (current === menuId ? null : menuId));
  };

  const buttonResetStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    font: 'inherit',
    color: 'inherit',
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
    width: '100%',
  };

  const renderMegaMovieCard = (movie: Movie) => {
    const ageClass = movie.ageRating ? movie.ageRating.toLowerCase() : 'p';
    const genreText = movie.genres && movie.genres[0] ? movie.genres[0].name : 'Điện ảnh';
    const detailHref = movie.detailHref || appRoutes.movieDetail(String(movie.slug || movie.id));
    const bookingHref = movie.bookingHref || appRoutes.movieSchedule(String(movie.slug || movie.id));

    return (
      <div key={movie.id} className="mega-movie-card">
        <div className="mega-poster-wrap">
          <img src={movie.posterUrl} alt={movie.title} className="mega-poster" loading="lazy" />
          <div className="mega-badges-group">
            {movie.rating !== undefined && (
              <span className="mega-rating-badge">
                <span className="star">⭐</span> {Number(movie.rating).toFixed(1)}
              </span>
            )}
            {movie.ageRating && (
              <span className={`mega-age-badge ${ageClass}`}>{movie.ageRating}</span>
            )}
          </div>
          <div className="mega-overlay">
            <Link 
              href={bookingHref} 
              className="btn-primary mega-action-btn"
              onClick={() => {
                setActiveDropdown(null);
                setIsMobileMenuOpen(false);
              }}
            >
              Đặt vé
            </Link>
          </div>
        </div>
        <div className="mega-movie-info">
          <Link 
            href={detailHref} 
            className="mega-movie-title"
            onClick={() => {
              setActiveDropdown(null);
              setIsMobileMenuOpen(false);
            }}
          >
            {movie.title}
          </Link>
          <div className="mega-meta-row">
            <span>{genreText}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <header 
      ref={navbarRef}
      className={`navbar ${isScrolled ? 'scrolled' : ''}`} 
      id="navbar"
    >
      <div className="nav-inner">
        <Link href="/" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
          CINE
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          {/* PHIM MEGA DROPDOWN */}
          <div 
            className={`nav-item-dropdown ${activeDropdown === 'phim' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('phim')}
            onMouseLeave={() => handleMouseLeave('phim')}
          >
            <button 
              type="button" 
              className="nav-dropdown-trigger"
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'phim' ? 'true' : 'false'}
              style={buttonResetStyle}
            >
              Phim
            </button>
            <div className={`dropdown-content mega-dropdown ${activeDropdown === 'phim' ? 'open' : ''}`}>
              <div className="mega-dropdown-inner">
                {/* PHIM ĐANG CHIẾU */}
                <div className="mega-section">
                  <div className="mega-section-header">
                    <Link 
                      href={`${appRoutes.movies}?category=now-showing`} 
                      className="mega-section-title-link"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <h2>PHIM ĐANG CHIẾU <span className="arrow">→</span></h2>
                    </Link>
                  </div>
                  <div className="mega-movies-grid">
                    {isLoading ? (
                      <p style={{ padding: '20px', color: 'rgba(255,255,255,0.6)' }}>Đang tải phim...</p>
                    ) : isError ? (
                      <p style={{ padding: '20px', color: 'var(--color-accent)' }}>Không thể tải danh sách phim</p>
                    ) : nowShowingMovies.length > 0 ? (
                      nowShowingMovies.map(renderMegaMovieCard)
                    ) : (
                      <p style={{ padding: '20px', color: 'rgba(255,255,255,0.4)' }}>Không có phim đang chiếu</p>
                    )}
                  </div>
                </div>
                {/* PHIM SẮP CHIẾU */}
                <div className="mega-section">
                  <div className="mega-section-header">
                    <Link 
                      href={`${appRoutes.movies}?category=coming-soon`} 
                      className="mega-section-title-link"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <h2>PHIM SẮP CHIẾU <span className="arrow">→</span></h2>
                    </Link>
                  </div>
                  <div className="mega-movies-grid">
                    {isLoading ? (
                      <p style={{ padding: '20px', color: 'rgba(255,255,255,0.6)' }}>Đang tải phim...</p>
                    ) : isError ? (
                      <p style={{ padding: '20px', color: 'var(--color-accent)' }}>Không thể tải danh sách phim</p>
                    ) : comingSoonMovies.length > 0 ? (
                      comingSoonMovies.map(renderMegaMovieCard)
                    ) : (
                      <p style={{ padding: '20px', color: 'rgba(255,255,255,0.4)' }}>Không có phim sắp chiếu</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STAR SHOP */}
          <div 
            className={`nav-item-dropdown ${activeDropdown === 'starshop' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('starshop')}
            onMouseLeave={() => handleMouseLeave('starshop')}
          >
            <button 
              type="button" 
              className="nav-dropdown-trigger"
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'starshop' ? 'true' : 'false'}
              style={buttonResetStyle}
            >
              Star Shop
            </button>
            <div className={`dropdown-content small-dropdown ${activeDropdown === 'starshop' ? 'open' : ''}`}>
              <Link href={appRoutes.starShopCategory('movie-verse')} onClick={() => setActiveDropdown(null)}>Movie-verse</Link>
              <Link href={appRoutes.starShopCategory('fan-wibu')} onClick={() => setActiveDropdown(null)}>Fan Wibu</Link>
              <Link href={appRoutes.starShopCategory('inner-child')} onClick={() => setActiveDropdown(null)}>Inner Child</Link>
            </div>
          </div>

          {/* GÓC ĐIỆN ẢNH */}
          <div 
            className={`nav-item-dropdown ${activeDropdown === 'gocdienanh' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('gocdienanh')}
            onMouseLeave={() => handleMouseLeave('gocdienanh')}
          >
            <button 
              type="button" 
              className="nav-dropdown-trigger"
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'gocdienanh' ? 'true' : 'false'}
              style={buttonResetStyle}
            >
              Góc Điện Ảnh
            </button>
            <div className={`dropdown-content small-dropdown ${activeDropdown === 'gocdienanh' ? 'open' : ''}`}>
              <Link href={appRoutes.cinemaCornerCategory('reviews')} onClick={() => setActiveDropdown(null)}>Bình luận phim</Link>
              <Link href={appRoutes.cinemaCornerCategory('blog')} onClick={() => setActiveDropdown(null)}>Blog điện ảnh</Link>
              <Link href={appRoutes.cinemaCornerCategory('backstage')} onClick={() => setActiveDropdown(null)}>Hậu trường</Link>
            </div>
          </div>

          {/* SỰ KIỆN */}
          <div 
            className={`nav-item-dropdown ${activeDropdown === 'sukien' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('sukien')}
            onMouseLeave={() => handleMouseLeave('sukien')}
          >
            <button 
              type="button" 
              className="nav-dropdown-trigger"
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'sukien' ? 'true' : 'false'}
              style={buttonResetStyle}
            >
              Sự Kiện
            </button>
            <div className={`dropdown-content small-dropdown ${activeDropdown === 'sukien' ? 'open' : ''}`}>
              <Link href={appRoutes.eventCategory('now')} onClick={() => setActiveDropdown(null)}>Sự kiện đang diễn ra</Link>
              <Link href={appRoutes.eventCategory('promotions')} onClick={() => setActiveDropdown(null)}>Ưu đãi đặc biệt</Link>
              <Link href={appRoutes.eventCategory('news')} onClick={() => setActiveDropdown(null)}>Tin tức</Link>
            </div>
          </div>

          {/* RẠP/GIÁ VÉ */}
          <div 
            className={`nav-item-dropdown ${activeDropdown === 'rapgiave' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('rapgiave')}
            onMouseLeave={() => handleMouseLeave('rapgiave')}
          >
            <button 
              type="button" 
              className="nav-dropdown-trigger"
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'rapgiave' ? 'true' : 'false'}
              style={buttonResetStyle}
            >
              Rạp/Giá Vé
            </button>
            <div className={`dropdown-content small-dropdown ${activeDropdown === 'rapgiave' ? 'open' : ''}`}>
              <Link href={appRoutes.cinemaShowtimes} onClick={() => setActiveDropdown(null)}>Lịch chiếu theo rạp</Link>
              <Link href={appRoutes.cinemaPricing} onClick={() => setActiveDropdown(null)}>Giá vé</Link>
              <Link href={appRoutes.cinemas} onClick={() => setActiveDropdown(null)}>Danh sách rạp</Link>
            </div>
          </div>

          {/* RẠP ĐẶC BIỆT */}
          <div 
            className={`nav-item-dropdown ${activeDropdown === 'rapdacbiet' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('rapdacbiet')}
            onMouseLeave={() => handleMouseLeave('rapdacbiet')}
          >
            <button 
              type="button" 
              className="nav-dropdown-trigger"
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'rapdacbiet' ? 'true' : 'false'}
              style={buttonResetStyle}
            >
              Rạp Đặc Biệt
            </button>
            <div className={`dropdown-content small-dropdown ${activeDropdown === 'rapdacbiet' ? 'open' : ''}`}>
              <Link href={appRoutes.specialTheaterType('imax')} onClick={() => setActiveDropdown(null)}>IMAX</Link>
              <Link href={appRoutes.specialTheaterType('4dx')} onClick={() => setActiveDropdown(null)}>4DX</Link>
              <Link href={appRoutes.specialTheaterType('dolby-atmos')} onClick={() => setActiveDropdown(null)}>Dolby Atmos</Link>
              <Link href={appRoutes.specialTheaterType('kids')} onClick={() => setActiveDropdown(null)}>Cine de Kids</Link>
            </div>
          </div>
        </nav>

        {/* Actions Button Panel */}
        <div className="nav-actions">
          <button className="nav-icon-btn" aria-label="Tìm kiếm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <Link href="/coming-soon" className="nav-login">Đăng nhập</Link>
          <Link href={`${appRoutes.movies}?category=now-showing`} className="btn-primary">
            Đặt vé
          </Link>
        </div>

        {/* Hamburger Mobile Toggle */}
        <button 
          className={`nav-hamburger ${isMobileMenuOpen ? 'active' : ''}`}
          id="navHamburger"
          aria-label="Thực đơn"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div 
        className={`nav-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} 
        id="navMobileMenu"
      >
        {/* PHIM */}
        <div className={`nav-item-dropdown ${activeMobileDropdown === 'phim' ? 'active' : ''}`}>
          <button 
            type="button" 
            className="nav-dropdown-trigger"
            aria-expanded={activeMobileDropdown === 'phim'}
            onClick={(e) => toggleMobileDropdown('phim', e)}
            style={buttonResetStyle}
          >
            Phim
          </button>
          <div className="dropdown-content mega-dropdown">
            <div className="mega-dropdown-inner">
              <div className="mega-section">
                <div className="mega-section-header">
                  <h2>PHIM ĐANG CHIẾU</h2>
                  <Link href={`${appRoutes.movies}?category=now-showing`} className="view-all-link" onClick={() => setIsMobileMenuOpen(false)}>Xem tất cả</Link>
                </div>
                <div className="mega-movies-grid">
                  {isLoading ? (
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>Đang tải phim...</p>
                  ) : nowShowingMovies.map(renderMegaMovieCard)}
                </div>
              </div>
              <div className="mega-section">
                <div className="mega-section-header">
                  <h2>PHIM SẮP CHIẾU</h2>
                  <Link href={`${appRoutes.movies}?category=coming-soon`} className="view-all-link" onClick={() => setIsMobileMenuOpen(false)}>Xem tất cả</Link>
                </div>
                <div className="mega-movies-grid">
                  {isLoading ? (
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>Đang tải phim...</p>
                  ) : comingSoonMovies.map(renderMegaMovieCard)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STAR SHOP */}
        <div className={`nav-item-dropdown ${activeMobileDropdown === 'starshop' ? 'active' : ''}`}>
          <button 
            type="button" 
            className="nav-dropdown-trigger"
            aria-expanded={activeMobileDropdown === 'starshop'}
            onClick={(e) => toggleMobileDropdown('starshop', e)}
            style={buttonResetStyle}
          >
            Star Shop
          </button>
          <div className="dropdown-content small-dropdown">
            <Link href={appRoutes.starShopCategory('movie-verse')} onClick={() => setIsMobileMenuOpen(false)}>Movie-verse</Link>
            <Link href={appRoutes.starShopCategory('fan-wibu')} onClick={() => setIsMobileMenuOpen(false)}>Fan Wibu</Link>
            <Link href={appRoutes.starShopCategory('inner-child')} onClick={() => setIsMobileMenuOpen(false)}>Inner Child</Link>
          </div>
        </div>

        {/* GÓC ĐIỆN ẢNH */}
        <div className={`nav-item-dropdown ${activeMobileDropdown === 'gocdienanh' ? 'active' : ''}`}>
          <button 
            type="button" 
            className="nav-dropdown-trigger"
            aria-expanded={activeMobileDropdown === 'gocdienanh'}
            onClick={(e) => toggleMobileDropdown('gocdienanh', e)}
            style={buttonResetStyle}
          >
            Góc Điện Ảnh
          </button>
          <div className="dropdown-content small-dropdown">
            <Link href={appRoutes.cinemaCornerCategory('reviews')} onClick={() => setIsMobileMenuOpen(false)}>Bình luận phim</Link>
            <Link href={appRoutes.cinemaCornerCategory('blog')} onClick={() => setIsMobileMenuOpen(false)}>Blog điện ảnh</Link>
            <Link href={appRoutes.cinemaCornerCategory('backstage')} onClick={() => setIsMobileMenuOpen(false)}>Hậu trường</Link>
          </div>
        </div>

        {/* SỰ KIỆN */}
        <div className={`nav-item-dropdown ${activeMobileDropdown === 'sukien' ? 'active' : ''}`}>
          <button 
            type="button" 
            className="nav-dropdown-trigger"
            aria-expanded={activeMobileDropdown === 'sukien'}
            onClick={(e) => toggleMobileDropdown('sukien', e)}
            style={buttonResetStyle}
          >
            Sự Kiện
          </button>
          <div className="dropdown-content small-dropdown">
            <Link href={appRoutes.eventCategory('now')} onClick={() => setIsMobileMenuOpen(false)}>Sự kiện đang diễn ra</Link>
            <Link href={appRoutes.eventCategory('promotions')} onClick={() => setIsMobileMenuOpen(false)}>Ưu đãi đặc biệt</Link>
            <Link href={appRoutes.eventCategory('news')} onClick={() => setIsMobileMenuOpen(false)}>Tin tức</Link>
          </div>
        </div>

        {/* RẠP/GIÁ VÉ */}
        <div className={`nav-item-dropdown ${activeMobileDropdown === 'rapgiave' ? 'active' : ''}`}>
          <button 
            type="button" 
            className="nav-dropdown-trigger"
            aria-expanded={activeMobileDropdown === 'rapgiave'}
            onClick={(e) => toggleMobileDropdown('rapgiave', e)}
            style={buttonResetStyle}
          >
            Rạp/Giá Vé
          </button>
          <div className="dropdown-content small-dropdown">
            <Link href={appRoutes.cinemaShowtimes} onClick={() => setIsMobileMenuOpen(false)}>Lịch chiếu theo rạp</Link>
            <Link href={appRoutes.cinemaPricing} onClick={() => setIsMobileMenuOpen(false)}>Giá vé</Link>
            <Link href={appRoutes.cinemas} onClick={() => setIsMobileMenuOpen(false)}>Danh sách rạp</Link>
          </div>
        </div>

        {/* RẠP ĐẶC BIỆT */}
        <div className={`nav-item-dropdown ${activeMobileDropdown === 'rapdacbiet' ? 'active' : ''}`}>
          <button 
            type="button" 
            className="nav-dropdown-trigger"
            aria-expanded={activeMobileDropdown === 'rapdacbiet'}
            onClick={(e) => toggleMobileDropdown('rapdacbiet', e)}
            style={buttonResetStyle}
          >
            Rạp Đặc Biệt
          </button>
          <div className="dropdown-content small-dropdown">
            <Link href={appRoutes.specialTheaterType('imax')} onClick={() => setIsMobileMenuOpen(false)}>IMAX</Link>
            <Link href={appRoutes.specialTheaterType('4dx')} onClick={() => setIsMobileMenuOpen(false)}>4DX</Link>
            <Link href={appRoutes.specialTheaterType('dolby-atmos')} onClick={() => setIsMobileMenuOpen(false)}>Dolby Atmos</Link>
            <Link href={appRoutes.specialTheaterType('kids')} onClick={() => setIsMobileMenuOpen(false)}>Cine de Kids</Link>
          </div>
        </div>
      </div>
    </header>
  );
};
