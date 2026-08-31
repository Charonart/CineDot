'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw, Maximize, Minimize, Film } from 'lucide-react';

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

function extractYouTubeId(urlOrId?: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  title = 'CineDot Trailer',
  autoPlay = true,
  muted = false,
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const youtubeId = extractYouTubeId(src);
  const isYouTube = !!youtubeId;

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedProgress, setBufferedProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reset when src changes
  useEffect(() => {
    setIsPlaying(autoPlay);
    setIsLoading(true);
    setCurrentTime(0);
    setBufferedProgress(0);
  }, [src, autoPlay]);

  // Sync controls overlay visibility timer for HTML5 player
  useEffect(() => {
    if (isYouTube) return;
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
  }, [isPlaying, isYouTube]);

  // Sync fullscreen change
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
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    const video = videoRef.current;
    if (!video) return;
    video.volume = vol;
    video.muted = vol === 0;
    setIsMuted(vol === 0);
  };

  const handleRewind = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.max(0, video.currentTime - 10);
    }
  };

  const handleForward = () => {
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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  // 1. Fallback when no valid source
  if (!src && !poster) {
    return (
      <div
        className={`w-full aspect-video rounded-2xl bg-slate-950 flex flex-col items-center justify-center text-center p-6 text-gray-400 gap-3 ${className}`}
        style={style}
      >
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
          <Film className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-white">Trailer đang được cập nhật</p>
        <p className="text-xs text-gray-400">Vui lòng quay lại sau</p>
      </div>
    );
  }

  // 2. YouTube Engine
  if (isYouTube && youtubeId) {
    const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&rel=0&modestbranding=1&enablejsapi=1`;

    return (
      <div
        ref={containerRef}
        className={`relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ${className}`}
        style={style}
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950 gap-3">
            <div className="w-10 h-10 rounded-full border-3 border-white/20 border-t-[#7C6FE8] animate-spin" />
            <span className="text-xs font-semibold text-gray-300">Đang tải trailer...</span>
          </div>
        )}
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full border-0 relative z-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      </div>
    );
  }

  // 3. HTML5 Video Engine
  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-video bg-black rounded-2xl overflow-hidden group shadow-2xl ${className}`}
      style={style}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        muted={isMuted}
        autoPlay={autoPlay}
        onTimeUpdate={handleTimeUpdate}
        onProgress={handleProgress}
        onLoadedMetadata={() => {
          const video = videoRef.current;
          if (video) {
            setDuration(video.duration);
            setIsLoading(false);
          }
        }}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
          <div className="w-10 h-10 rounded-full border-3 border-white/20 border-t-[#7C6FE8] animate-spin" />
        </div>
      )}

      {/* Controls Bar */}
      <div
        className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Timeline / Progress Bar */}
        <div
          role="slider"
          aria-label="Timeline"
          aria-valuenow={Math.round(currentTime)}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration || 100)}
          onClick={handleProgressClick}
          className="relative w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 group/timeline overflow-hidden"
        >
          <div
            className="absolute left-0 top-0 bottom-0 bg-white/30 rounded-full"
            style={{ width: `${bufferedProgress}%` }}
          />
          <div
            className="absolute left-0 top-0 bottom-0 bg-[#7C6FE8] rounded-full"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              type="button"
              onClick={togglePlay}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            {/* Skip -10s / +10s */}
            <button
              type="button"
              onClick={handleRewind}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              title="-10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleForward}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              title="+10s"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume / Mute */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-white/30 rounded-lg accent-[#7C6FE8] cursor-pointer"
              />
            </div>

            {/* Time display */}
            <span className="text-xs text-gray-300 font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Fullscreen */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
