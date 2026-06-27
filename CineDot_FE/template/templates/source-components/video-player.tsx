"use client";
 
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Maximize,
  Maximize2,
  Minimize,
  MoreVertical,
  Pause,
  PictureInPicture2,
  Play,
  Repeat,
  RotateCcw,
  RotateCw,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
 
interface QualitySource {
  quality: string;
  src: string;
}
 
interface CaptionTrack {
  src: string;
  label: string;
  srcLang: string;
  default?: boolean;
}
 
interface Chapter {
  title: string;
  startTime: number;
  endTime: number;
}
 
export interface VideoPlayerProps {
  src: string | QualitySource[];
  tracks?: CaptionTrack[];
  poster?: string;
  title?: string;
  description?: string;
  compact?: boolean;
  chapters?: Chapter[];
  onTimeUpdate?: (time: number) => void;
  onNextVideo?: () => void;
  onPrevVideo?: () => void;
  currentVideoIndex?: number;
  totalVideos?: number;
}
 
export interface VideoPlayerRef {
  seek: (time: number) => void;
  play: () => void;
  pause: () => void;
}
 
export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  (
    {
      src,
      tracks = [],
      poster,
      title: _title,
      description: _description,
      compact: _compact = false,
      chapters = [],
      onTimeUpdate,
      onNextVideo,
      onPrevVideo,
      currentVideoIndex = 0,
      totalVideos = 1,
    },
    ref,
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
 
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [activeDialog, setActiveDialog] = useState<
      "settings" | "options" | "captions" | null
    >(null);
    const [volume, setVolume] = useState(1);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [quality, setQuality] = useState("auto");
    const [availableQualities, setAvailableQualities] = useState<string[]>([]);
    const [currentSrc, setCurrentSrc] = useState("");
    const [speed, setSpeed] = useState(1);
    const [isPictureInPicture, setIsPictureInPicture] = useState(false);
    const [currentCaption, setCurrentCaption] = useState<string | null>(null);
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
 
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [buffered, setBuffered] = useState(0);
 
    // Hover state for timeline
    const [hoverTime, setHoverTime] = useState<number | null>(null);
    const [hoverPosition, setHoverPosition] = useState<number | null>(null);
 
    // Double tap state
    const [doubleTapAction, setDoubleTapAction] = useState<{
      side: "left" | "right";
      id: number;
    } | null>(null);
    const lastTapRef = useRef<{ time: number; x: number } | null>(null);
    const tapTimeoutRef = useRef<NodeJS.Timeout>(undefined);
 
    const controlsTimeoutRef = useRef<NodeJS.Timeout>(undefined);
 
    const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
      const time = Date.now();
      const clientX = e.clientX;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
 
      const x = clientX - rect.left;
      const width = rect.width;
      const isLeft = x < width * 0.3;
      const isRight = x > width * 0.7;
 
      if (!isLeft && !isRight) {
        togglePlay();
        return;
      }
 
      if (lastTapRef.current && time - lastTapRef.current.time < 300) {
        if (tapTimeoutRef.current) {
          clearTimeout(tapTimeoutRef.current);
        }
 
        if (isLeft) {
          handleSkip(-10);
          setDoubleTapAction({ side: "left", id: time });
        } else {
          handleSkip(10);
          setDoubleTapAction({ side: "right", id: time });
        }
        lastTapRef.current = null;
      } else {
        lastTapRef.current = { time, x };
        tapTimeoutRef.current = setTimeout(() => {
          togglePlay();
          lastTapRef.current = null;
        }, 300);
      }
    };
 
    useEffect(() => {
      if (doubleTapAction) {
        const timeout = setTimeout(() => {
          setDoubleTapAction(null);
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }, [doubleTapAction]);
 
    useImperativeHandle(ref, () => ({
      seek: (time: number) => {
        if (videoRef.current) {
          videoRef.current.currentTime = time;
          setCurrentTime(time);
        }
      },
      play: () => {
        videoRef.current?.play();
      },
      pause: () => {
        videoRef.current?.pause();
      },
    }));
 
    useEffect(() => {
      if (Array.isArray(src)) {
        const qualities = src.map((s) => s.quality);
        setAvailableQualities(["auto", ...qualities]);
        setCurrentSrc(src[0]?.src || "");
      } else {
        setAvailableQualities(["auto"]);
        setCurrentSrc(src);
      }
    }, [src]);
 
    const formatTime = (time: number) => {
      if (!time || Number.isNaN(time)) return "0:00";
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = Math.floor(time % 60);
 
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };
 
    const togglePlay = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };
 
    const handleVolumeChange = (value: number[]) => {
      const newVolume = value[0] ?? 1;
      setVolume(newVolume);
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
      }
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    };
 
    const toggleMute = () => {
      if (videoRef.current) {
        if (isMuted) {
          videoRef.current.volume = volume || 0.5;
          setIsMuted(false);
        } else {
          videoRef.current.volume = 0;
          setIsMuted(true);
        }
      }
    };
 
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!videoRef.current || !duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    };
 
    const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const time = Math.max(0, Math.min(percent * duration, duration));
      setHoverTime(time);
      setHoverPosition(percent * 100);
    };
 
    const handleProgressLeave = () => {
      setHoverTime(null);
      setHoverPosition(null);
    };
 
    const toggleFullscreen = () => {
      if (!containerRef.current) return;
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    };
 
    const handleQualityChange = (newQuality: string) => {
      if (!videoRef.current) return;
      const currentTime = videoRef.current.currentTime;
      const wasPlaying = !videoRef.current.paused;
      setQuality(newQuality);
      if (Array.isArray(src)) {
        let newSrc = "";
        if (newQuality === "auto") {
          newSrc = src[0]?.src || "";
        } else {
          const source = src.find((s) => s.quality === newQuality);
          if (source) newSrc = source.src;
        }
        if (newSrc && newSrc !== currentSrc) {
          setCurrentSrc(newSrc);
        }
      }
    };
 
    const handleSpeedChange = (newSpeed: number) => {
      setSpeed(newSpeed);
      if (videoRef.current) {
        videoRef.current.playbackRate = newSpeed;
      }
    };
 
    const handleSkip = (seconds: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime += seconds;
      }
    };
 
    const handleToggleLoop = () => {
      if (videoRef.current) {
        videoRef.current.loop = !videoRef.current.loop;
        setIsLooping(!isLooping);
      }
    };
 
    const handleLoadedMetadata = () => {
      setDuration(videoRef.current?.duration || 0);
      setIsLoading(false);
    };
 
    const handleTimeUpdate = () => {
      setCurrentTime(videoRef.current?.currentTime || 0);
      if (onTimeUpdate) {
        onTimeUpdate(videoRef.current?.currentTime || 0);
      }
    };
 
    return (
      <div ref={containerRef} className="group relative w-full overflow-hidden rounded-lg bg-black">
        <div className="relative w-full aspect-video">
          <video
            ref={videoRef}
            src={currentSrc}
            poster={poster}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    );
  },
);
VideoPlayer.displayName = "VideoPlayer";
