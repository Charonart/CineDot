import React, { useEffect, useRef, useState } from 'react';

export type CategoryType = 'now-showing' | 'coming-soon' | 'imax' | 'nationwide';

interface MoviesPageHeaderProps {
  activeTab: CategoryType;
  onChangeTab: (tab: CategoryType) => void;
}

const categoryHeaders = {
  'now-showing': {
    eyebrow: 'Khám phá phim chiếu rạp',
    title: (
      <>
        PHIM{' '}
        <span className="highlight-text" data-variant="underline" data-color="primary">
          ĐANG CHIẾU
        </span>
      </>
    ),
    desc: 'Cập nhật danh sách phim chiếu rạp mới nhất, bom tấn hành động đỉnh cao và thế giới đầy màu sắc tại CINE.'
  },
  'coming-soon': {
    eyebrow: 'Hóng bom tấn sắp đổ bộ',
    title: (
      <>
        PHIM{' '}
        <span className="highlight-text" data-variant="underline" data-color="primary">
          SẮP CHIẾU
        </span>
      </>
    ),
    desc: 'Điểm mặt những tác phẩm bom tấn, phim gia đình, và hoạt hình sắp sửa ra mắt khán giả Việt Nam tại hệ thống rạp CINE.'
  },
  'imax': {
    eyebrow: 'Trải nghiệm đỉnh cao công nghệ',
    title: (
      <>
        PHIM{' '}
        <span className="highlight-text" data-variant="underline" data-color="primary">
          IMAX SPECIAL
        </span>
      </>
    ),
    desc: 'Đắm chìm vào thế giới điện ảnh kỳ vĩ với màn hình khổng lồ, hệ thống âm thanh vòm đỉnh cao độc quyền chỉ có tại phòng chiếu IMAX.'
  },
  'nationwide': {
    eyebrow: 'Khám phá tất cả tác phẩm',
    title: (
      <>
        TOÀN BỘ{' '}
        <span className="highlight-text" data-variant="underline" data-color="primary">
          PHIM CINE
        </span>
      </>
    ),
    desc: 'Tìm kiếm nhanh chóng mọi tác phẩm điện ảnh bom tấn đang và sắp trình chiếu trên toàn bộ hệ thống rạp CINE toàn quốc.'
  }
};

export const MoviesPageHeader: React.FC<MoviesPageHeaderProps> = ({ activeTab, onChangeTab }) => {
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  
  const refNowShowing = useRef<HTMLButtonElement>(null);
  const refComingSoon = useRef<HTMLButtonElement>(null);
  const refImax = useRef<HTMLButtonElement>(null);
  const refNationwide = useRef<HTMLButtonElement>(null);

  const tabRefs = {
    'now-showing': refNowShowing,
    'coming-soon': refComingSoon,
    'imax': refImax,
    'nationwide': refNationwide
  };

  // Position indicator glow based on activeTab
  useEffect(() => {
    const activeBtn = 
      activeTab === 'now-showing' ? refNowShowing.current :
      activeTab === 'coming-soon' ? refComingSoon.current :
      activeTab === 'imax' ? refImax.current :
      activeTab === 'nationwide' ? refNationwide.current : null;

    if (activeBtn) {
      setIndicatorStyle({
        left: `${activeBtn.offsetLeft}px`,
        width: `${activeBtn.offsetWidth}px`
      });
    }
  }, [activeTab]);

  // Recalculate on window resize to avoid visual shifts
  useEffect(() => {
    const handleResize = () => {
      const activeBtn = 
        activeTab === 'now-showing' ? refNowShowing.current :
        activeTab === 'coming-soon' ? refComingSoon.current :
        activeTab === 'imax' ? refImax.current :
        activeTab === 'nationwide' ? refNationwide.current : null;

      if (activeBtn) {
        setIndicatorStyle({
          left: `${activeBtn.offsetLeft}px`,
          width: `${activeBtn.offsetWidth}px`
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);



  const metadata = categoryHeaders[activeTab] || categoryHeaders['now-showing'];

  return (
    <header className="movies-header fade-up in-view">
      <div className="container">
        <div className="movies-header-content">
          
          {/* Premium Visual Tab Switching */}
          <div className="tabs-nav-container" style={{ marginBottom: '24px', display: 'inline-flex' }}>
            <div className="tabs-nav" id="movieListingTabs" style={{ position: 'relative' }}>
              <button 
                ref={tabRefs['now-showing']}
                type="button"
                className={`tab-btn ${activeTab === 'now-showing' ? 'active' : ''}`}
                onClick={() => onChangeTab('now-showing')}
              >
                Đang chiếu
              </button>
              <button 
                ref={tabRefs['coming-soon']}
                type="button"
                className={`tab-btn ${activeTab === 'coming-soon' ? 'active' : ''}`}
                onClick={() => onChangeTab('coming-soon')}
              >
                Sắp chiếu
              </button>
              <button 
                ref={tabRefs['imax']}
                type="button"
                className={`tab-btn ${activeTab === 'imax' ? 'active' : ''}`}
                onClick={() => onChangeTab('imax')}
              >
                Phim IMAX
              </button>
              <button 
                ref={tabRefs['nationwide']}
                type="button"
                className={`tab-btn ${activeTab === 'nationwide' ? 'active' : ''}`}
                onClick={() => onChangeTab('nationwide')}
              >
                Toàn quốc
              </button>
              <span className="tab-glow-indicator" id="toolbarTabIndicator" style={indicatorStyle}></span>
            </div>
          </div>
          
          <p className="movies-eyebrow" id="pageEyebrow">{metadata.eyebrow}</p>
          
          <h1 className="movies-title" id="pageTitle" style={{ marginTop: '10px' }}>
            {metadata.title}
          </h1>
          
          <p className="movies-desc" id="pageDescription">
            {metadata.desc}
          </p>
        </div>
      </div>
    </header>
  );
};
