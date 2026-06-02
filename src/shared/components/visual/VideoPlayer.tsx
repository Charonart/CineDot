'use client';

import React, { useRef, useState, useEffect } from 'react';

export interface VideoPlayerProps {
  src?: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  title = 'CINE Trailer',
  autoPlay = false,
  muted = false,
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedProgress, setBufferedProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(!!src);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isYouTube = src ? (src.includes('youtube.com') || src.includes('youtu.be') || src.includes('youtube/embed')) : false;

  // Reset state when src changes
  useEffect(() => {
    setIsPlaying(autoPlay);
    setHasError(false);
    setIsLoading(!!src && !isYouTube);
    setCurrentTime(0);
    setBufferedProgress(0);
  }, [src, autoPlay, isYouTube]);

  // Sync state if autoPlay changes for HTML5 video
  useEffect(() => {
    const video = videoRef.current;
    if (video && !isYouTube) {
      if (isPlaying) {
        video.play().catch(() => {
          // Prevent autoplay policy exceptions from throwing errors
        });
      } else {
        video.pause();
      }
    }
  }, [isPlaying, isYouTube]);

  // Sync controls overlay visibility timer
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleActivity = () => {
      setShowControls(true);
      clearTimeout(timeoutId);
      if (isPlaying) {
        timeoutId = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleActivity);
      container.addEventListener('click', handleActivity);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleActivity);
        container.removeEventListener('click', handleActivity);
      }
      clearTimeout(timeoutId);
    };
  }, [isPlaying]);

  // Sync fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const formatTime = (time: number) => {
    if (isNaN(time) || time === Infinity) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (isYouTube) {
      setIsPlaying(!isPlaying);
      setIsLoading(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (isYouTube) {
      setIsMuted(!isMuted);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);

    if (isYouTube) {
      setIsMuted(vol === 0);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    video.volume = vol;
    if (vol === 0) {
      video.muted = true;
      setIsMuted(true);
    } else {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const handleRewind = () => {
    if (isYouTube) return;
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.max(0, video.currentTime - 10);
    }
  };

  const handleForward = () => {
    if (isYouTube) return;
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
    }
  };

  const handleProgress = () => {
    const video = videoRef.current;
    if (video && video.buffered.length > 0 && video.duration) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      setBufferedProgress((bufferedEnd / video.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
      setIsLoading(false);
      setHasError(false);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isYouTube) return;
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // 1. Fallback UI when src is completely missing or loading failed
  if (!src || hasError) {
    return (
      <div 
        className={`cine-video-player movies-empty-state ${className}`} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          flexDirection: 'column', 
          background: '#0a0a0a',
          backgroundImage: poster ? `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.85)), url('${poster}')` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '24px',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
          position: 'relative',
          ...style
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
          borderRadius: '20px',
          pointerEvents: 'none'
        }} />
        <div style={{ zIndex: 1, position: 'relative' }}>
          <button 
            type="button" 
            className="cine-center-play-btn" 
            aria-label="Play Disabled"
            style={{ 
              marginBottom: '16px', 
              opacity: 0.6, 
              cursor: 'not-allowed', 
              transform: 'none',
              background: 'rgba(255, 255, 255, 0.05)'
            }}
            disabled
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </button>
          <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: '#FFF' }}>
            {hasError ? 'Trailer đang được cập nhật' : 'Không tìm thấy liên kết video trailer'}
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
            Vui lòng thử lại sau hoặc liên hệ hỗ trợ
          </p>
        </div>
      </div>
    );
  }

  // Generate YouTube clean embed URL if it is a YouTube trailer
  const getYouTubeEmbedUrl = (rawSrc: string) => {
    let embedUrl = rawSrc;
    if (rawSrc.includes('youtube.com/watch?v=')) {
      const videoId = rawSrc.split('v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (rawSrc.includes('youtu.be/')) {
      const videoId = rawSrc.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    return embedUrl;
  };

  const finalYouTubeSrc = isYouTube ? getYouTubeEmbedUrl(src) : '';

  return (
    <div 
      ref={containerRef}
      className={`cine-video-player ${isLoading ? 'is-loading' : ''} ${showControls ? 'show-controls' : ''} ${className}`}
      style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        ...style
      }}
    >
      {/* Spinner - Only active during HTML5 load or when isLoading is true */}
      {isLoading && !hasError && (
        <div className="cine-video-spinner" style={{ opacity: 1, pointerEvents: 'auto' }}>
          <div className="cine-spinner-icon"></div>
        </div>
      )}

      {/* Poster / Center Play Overlay */}
      <div 
        className={`cine-poster-overlay ${isPlaying ? 'is-hidden' : ''}`} 
        style={{ 
          backgroundImage: poster ? `url('${poster}')` : undefined,
          zIndex: 6
        }}
        onClick={togglePlay}
      >
        <button 
          type="button" 
          className="cine-center-play-btn" 
          aria-label="Play"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </button>
      </div>

      {/* DUAL MODE ENGINE: YouTube IFrame or HTML5 Video */}
      {isYouTube ? (
        isPlaying ? (
          <iframe
            className="cine-video-element"
            src={`${finalYouTubeSrc}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&rel=0&modestbranding=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 'none', background: '#000', zIndex: 1 }}
            onLoad={() => setIsLoading(false)}
          />
        ) : (
          <div className="cine-video-element" style={{ background: '#000' }}></div>
        )
      ) : (
        <video
          ref={videoRef}
          className="cine-video-element"
          src={src}
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onProgress={handleProgress}
          onLoadedMetadata={handleLoadedMetadata}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => setIsLoading(false)}
          onError={handleVideoError}
          onClick={togglePlay}
          title={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}

      {/* Custom Controls Bar - Only for direct HTML5 video because YouTube iframe has its own robust embedded overlay controls */}
      {!isYouTube && (
        <>
          {/* Controls Overlay */}
          <div className="cine-controls-overlay" onClick={togglePlay}></div>

          <div className="cine-controls-bar">
            {/* Progress Area */}
            <div 
              className="cine-progress-area" 
              role="slider" 
              aria-label="Timeline" 
              aria-valuenow={Math.round(currentTime)}
              aria-valuemin={0}
              aria-valuemax={Math.round(duration || 100)}
              onClick={handleProgressClick}
            >
              <div className="cine-progress-buffered" style={{ width: `${bufferedProgress}%` }}></div>
              <div className="cine-progress-fill" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}></div>
              <div className="cine-progress-scrubber" style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}></div>
            </div>

            {/* Controls Row */}
            <div className="cine-controls-row">
              {/* Left Controls */}
              <div className="cine-controls-left">
                {/* Play/Pause */}
                <button 
                  type="button" 
                  className="cine-control-btn cine-play-btn" 
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  onClick={togglePlay}
                >
                  {!isPlaying ? (
                    <svg viewBox="0 0 24 24" className="play-icon" fill="currentColor">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="pause-icon" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  )}
                </button>

                {/* Skip Back 10s */}
                <button 
                  type="button" 
                  className="cine-control-btn cine-rewind-btn" 
                  aria-label="Rewind 10s"
                  onClick={handleRewind}
                >
                  <svg viewBox="0 0 24 24" className="stroke-only" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0-.57-8.38l.41.81" />
                  </svg>
                </button>

                {/* Skip Forward 10s */}
                <button 
                  type="button" 
                  className="cine-control-btn cine-forward-btn" 
                  aria-label="Forward 10s"
                  onClick={handleForward}
                >
                  <svg viewBox="0 0 24 24" className="stroke-only" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1 .57-8.38l-.41.81" />
                  </svg>
                </button>

                {/* Volume Control */}
                <div className="cine-volume-container">
                  <button 
                    type="button" 
                    className="cine-control-btn cine-mute-btn" 
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    onClick={toggleMute}
                  >
                    {isMuted || volume === 0 ? (
                      <svg viewBox="0 0 24 24" className="volume-mute-icon" fill="currentColor">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="volume-up-icon" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                      </svg>
                    )}
                  </button>
                  <input 
                    type="range" 
                    className="cine-volume-slider" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={isMuted ? 0 : volume} 
                    aria-label="Volume"
                    onChange={handleVolumeChange}
                  />
                </div>

                {/* Time Display */}
                <span className="cine-time-display">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right Controls */}
              <div className="cine-controls-right">
                {/* Fullscreen */}
                <button 
                  type="button" 
                  className="cine-control-btn cine-fullscreen-btn" 
                  aria-label="Fullscreen"
                  onClick={toggleFullscreen}
                >
                  {!isFullscreen ? (
                    <svg viewBox="0 0 24 24" className="stroke-only expand-icon" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="stroke-only shrink-icon" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 14h6v6m10-6h-6v6M4 10h6V4m10 6h-6V4" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
