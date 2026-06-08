/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExpandableSearchBar } from '@shared/ui/ExpandableSearchBar';

interface Movie {
  id: string;
  title: string;
  poster: string;
  rating?: number;
  ageRating?: string;
  genre: string;
}

const nowShowingMovies: Movie[] = [
  {
    id: "dune-part-two",
    title: "Dune: Cát Song - Phần Hai",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&q=80",
    rating: 8.7,
    ageRating: "T16",
    genre: "Khoa học viễn tưởng / Phiêu lưu"
  },
  {
    id: "godzilla-x-kong",
    title: "Godzilla x Kong: Đế Chế Mới",
    poster: "https://images.unsplash.com/photo-1620421680010-0766ff230392?w=400&q=80",
    rating: 7.2,
    ageRating: "T13",
    genre: "Hành động / Viễn tưởng"
  },
  {
    id: "ghostbusters-frozen",
    title: "Ghostbusters: Kỷ Nguyên Băng Giá",
    poster: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&q=80",
    rating: 6.9,
    ageRating: "T13",
    genre: "Hài hước / Phiêu lưu"
  },
  {
    id: "civil-war",
    title: "Civil War: Ngày Tàn Của Đế Quốc",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
    rating: 7.5,
    ageRating: "T18",
    genre: "Hành động / Tâm lý"
  }
];

const comingSoonMovies: Movie[] = [
  {
    id: "deadpool-wolverine",
    title: "Deadpool & Wolverine",
    poster: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=400&q=80",
    rating: 8.8,
    ageRating: "T18",
    genre: "Hành động / Hài hước"
  },
  {
    id: "alien-romulus",
    title: "Alien: Romulus",
    poster: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=400&q=80",
    rating: 8.0,
    ageRating: "T18",
    genre: "Kinh dị / Viễn tưởng"
  },
  {
    id: "joker-two",
    title: "Joker: Folie à Deux",
    poster: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=400&q=80",
    rating: 8.2,
    ageRating: "T18",
    genre: "Tâm lý / Nhạc kịch"
  },
  {
    id: "gladiator-two",
    title: "Võ Sĩ Giác Đấu II",
    poster: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80",
    rating: 7.9,
    ageRating: "T18",
    genre: "Hành động / Sử thi"
  }
];

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);

  const navbarRef = useRef<HTMLDivElement>(null);
  const timeoutRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});

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

  const renderMegaMovieCard = (movie: Movie) => {
    const ageClass = movie.ageRating ? movie.ageRating.toLowerCase() : 'p';
    const genreText = movie.genre.split(' / ')[0];

    return (
      <div key={movie.id} className="mega-movie-card">
        <div className="mega-poster-wrap">
          <img src={movie.poster} alt={movie.title} className="mega-poster" loading="lazy" />
          <div className="mega-badges-group">
            {movie.rating && (
              <span className="mega-rating-badge">
                <span className="star">⭐</span> {movie.rating.toFixed(1)}
              </span>
            )}
            {movie.ageRating && (
              <span className={`mega-age-badge ${ageClass}`}>{movie.ageRating}</span>
            )}
          </div>
          <div className="mega-overlay">
            <Link href={`/movies/detail/${movie.id}#schedule`} className="btn-primary mega-action-btn">
              Đặt vé
            </Link>
          </div>
        </div>
        <div className="mega-movie-info">
          <Link href={`/movies/detail/${movie.id}`} className="mega-movie-title">
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
        <Link href="/" className="nav-logo">
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
            <a 
              href="#" 
              className="nav-dropdown-trigger"
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'phim' ? 'true' : 'false'}
            >
              Phim
            </a>
            <div className={`dropdown-content mega-dropdown ${activeDropdown === 'phim' ? 'open' : ''}`}>
              <div className="mega-dropdown-inner">
                {/* PHIM ĐANG CHIẾU */}
                <div className="mega-section">
                  <div className="mega-section-header">
                    <Link href="/movies?category=now-showing" className="mega-section-title-link">
                      <h2>PHIM ĐANG CHIẾU <span className="arrow">→</span></h2>
                    </Link>
                  </div>
                  <div className="mega-movies-grid">
                    {nowShowingMovies.map(renderMegaMovieCard)}
                  </div>
                </div>
                {/* PHIM SẮP CHIẾU */}
                <div className="mega-section">
                  <div className="mega-section-header">
                    <Link href="/movies?category=coming-soon" className="mega-section-title-link">
                      <h2>PHIM SẮP CHIẾU <span className="arrow">→</span></h2>
                    </Link>
                  </div>
                  <div className="mega-movies-grid">
                    {comingSoonMovies.map(renderMegaMovieCard)}
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
            <a 
              href="#" 
              className="nav-dropdown-trigger"
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'starshop' ? 'true' : 'false'}
            >
              Star Shop
            </a>
            <div className={`dropdown-content small-dropdown ${activeDropdown === 'starshop' ? 'open' : ''}`}>
              <a href="#">Movie-verse</a>
              <a href="#">Fan Wibu</a>
              <a href="#">Inner Child</a>
            </div>
          </div>

          {/* GÓC ĐIỆN ẢNH */}
          <div 
            className={`nav-item-dropdown ${activeDropdown === 'gocdienanh' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('gocdienanh')}
            onMouseLeave={() => handleMouseLeave('gocdienanh')}
          >
            <a 
              href="#" 
              className="nav-dropdown-trigger"
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'gocdienanh' ? 'true' : 'false'}
            >
              Góc Điện Ảnh
            </a>
            <div className={`dropdown-content small-dropdown ${activeDropdown === 'gocdienanh' ? 'open' : ''}`}>
              <a href="#">Bình luận phim</a>
              <a href="#">Blog điện ảnh</a>
              <a href="#">Hậu trường</a>
            </div>
          </div>

          {/* SỰ KIỆN */}
          <div 
            className={`nav-item-dropdown ${activeDropdown === 'sukien' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('sukien')}
            onMouseLeave={() => handleMouseLeave('sukien')}
          >
            <a 
              href="#" 
              className="nav-dropdown-trigger"
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'sukien' ? 'true' : 'false'}
            >
              Sự Kiện
            </a>
            <div className={`dropdown-content small-dropdown ${activeDropdown === 'sukien' ? 'open' : ''}`}>
              <a href="#">Sự kiện đang diễn ra</a>
              <a href="#">Ưu đãi đặc biệt</a>
              <a href="#">Tin tức</a>
            </div>
          </div>

          {/* RẠP/GIÁ VÉ */}
          <div 
            className={`nav-item-dropdown ${activeDropdown === 'rapgiave' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('rapgiave')}
            onMouseLeave={() => handleMouseLeave('rapgiave')}
          >
            <a 
              href="#" 
              className="nav-dropdown-trigger"
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'rapgiave' ? 'true' : 'false'}
            >
              Rạp/Giá Vé
            </a>
            <div className={`dropdown-content small-dropdown ${activeDropdown === 'rapgiave' ? 'open' : ''}`}>
              <a href="#">Lịch chiếu theo rạp</a>
              <a href="#">Giá vé</a>
              <a href="#">Danh sách rạp</a>
            </div>
          </div>

          {/* RẠP ĐẶC BIỆT */}
          <div 
            className={`nav-item-dropdown ${activeDropdown === 'rapdacbiet' ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter('rapdacbiet')}
            onMouseLeave={() => handleMouseLeave('rapdacbiet')}
          >
            <a 
              href="#" 
              className="nav-dropdown-trigger"
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'rapdacbiet' ? 'true' : 'false'}
            >
              Rạp Đặc Biệt
            </a>
            <div className={`dropdown-content small-dropdown ${activeDropdown === 'rapdacbiet' ? 'open' : ''}`}>
              <a href="#">IMAX</a>
              <a href="#">4DX</a>
              <a href="#">Dolby Atmos</a>
              <a href="#">Cine de Kids</a>
            </div>
          </div>
        </nav>

        {/* Actions Button Panel */}
        <div className="nav-actions">
          <ExpandableSearchBar
            placeholder="Tìm phim..."
            expandedWidth="min(260px, 28vw)"
            onSubmit={(value) => {
              const trimmed = value.trim();
              if (trimmed) {
                router.push(`/search?q=${encodeURIComponent(trimmed)}`);
              }
            }}
          />
          <a href="#" className="nav-login">Đăng nhập</a>
          <Link href="/movies?category=now-showing" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
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
          <a 
            href="#" 
            className="nav-dropdown-trigger"
            aria-expanded={activeMobileDropdown === 'phim'}
            onClick={(e) => toggleMobileDropdown('phim', e)}
          >
            Phim
          </a>
          <div className="dropdown-content mega-dropdown">
            <div className="mega-dropdown-inner">
              <div className="mega-section">
                <div className="mega-section-header">
                  <h2>PHIM ĐANG CHIẾU</h2>
                  <Link href="/movies?category=now-showing" className="view-all-link">Xem tất cả</Link>
                </div>
                <div className="mega-movies-grid">
                  {nowShowingMovies.map(renderMegaMovieCard)}
                </div>
              </div>
              <div className="mega-section">
                <div className="mega-section-header">
                  <h2>PHIM SẮP CHIẾU</h2>
                  <Link href="/movies?category=coming-soon" className="view-all-link">Xem tất cả</Link>
                </div>
                <div className="mega-movies-grid">
                  {comingSoonMovies.map(renderMegaMovieCard)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STAR SHOP */}
        <div className={`nav-item-dropdown ${activeMobileDropdown === 'starshop' ? 'active' : ''}`}>
          <a 
            href="#" 
            className="nav-dropdown-trigger"
            aria-expanded={activeMobileDropdown === 'starshop'}
            onClick={(e) => toggleMobileDropdown('starshop', e)}
          >
            Star Shop
          </a>
          <div className="dropdown-content small-dropdown">
            <a href="#">Movie-verse</a>
            <a href="#">Fan Wibu</a>
            <a href="#">Inner Child</a>
          </div>
        </div>

        {/* GÓC ĐIỆN ẢNH */}
        <div className={`nav-item-dropdown ${activeMobileDropdown === 'gocdienanh' ? 'active' : ''}`}>
          <a 
            href="#" 
            className="nav-dropdown-trigger"
            aria-expanded={activeMobileDropdown === 'gocdienanh'}
            onClick={(e) => toggleMobileDropdown('gocdienanh', e)}
          >
            Góc Điện Ảnh
          </a>
          <div className="dropdown-content small-dropdown">
            <a href="#">Bình luận phim</a>
            <a href="#">Blog điện ảnh</a>
            <a href="#">Hậu trường</a>
          </div>
        </div>

        {/* SỰ KIỆN */}
        <div className={`nav-item-dropdown ${activeMobileDropdown === 'sukien' ? 'active' : ''}`}>
          <a 
            href="#" 
            className="nav-dropdown-trigger"
            aria-expanded={activeMobileDropdown === 'sukien'}
            onClick={(e) => toggleMobileDropdown('sukien', e)}
          >
            Sự Kiện
          </a>
          <div className="dropdown-content small-dropdown">
            <a href="#">Sự kiện đang diễn ra</a>
            <a href="#">Ưu đãi đặc biệt</a>
            <a href="#">Tin tức</a>
          </div>
        </div>

        {/* RẠP/GIÁ VÉ */}
        <div className={`nav-item-dropdown ${activeMobileDropdown === 'rapgiave' ? 'active' : ''}`}>
          <a 
            href="#" 
            className="nav-dropdown-trigger"
            aria-expanded={activeMobileDropdown === 'rapgiave'}
            onClick={(e) => toggleMobileDropdown('rapgiave', e)}
          >
            Rạp/Giá Vé
          </a>
          <div className="dropdown-content small-dropdown">
            <a href="#">Lịch chiếu theo rạp</a>
            <a href="#">Giá vé</a>
            <a href="#">Danh sách rạp</a>
          </div>
        </div>

        {/* RẠP ĐẶC BIỆT */}
        <div className={`nav-item-dropdown ${activeMobileDropdown === 'rapdacbiet' ? 'active' : ''}`}>
          <a 
            href="#" 
            className="nav-dropdown-trigger"
            aria-expanded={activeMobileDropdown === 'rapdacbiet'}
            onClick={(e) => toggleMobileDropdown('rapdacbiet', e)}
          >
            Rạp Đặc Biệt
          </a>
          <div className="dropdown-content small-dropdown">
            <a href="#">IMAX</a>
            <a href="#">4DX</a>
            <a href="#">Dolby Atmos</a>
            <a href="#">Cine de Kids</a>
          </div>
        </div>
      </div>
    </header>
  );
};
