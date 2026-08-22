import { create } from 'zustand';

export interface TrailerVideoItem {
  id?: string | number;
  name: string;
  key: string;
  type?: string;
  site?: string;
  thumbnailUrl?: string;
}

interface TrailerState {
  isOpen: boolean;
  videoSrc: string;
  poster: string;
  title: string;
  videos: TrailerVideoItem[];
  currentVideoIndex: number;
  openTrailer: (
    videoSrc: string,
    poster: string,
    title: string,
    videos?: TrailerVideoItem[]
  ) => void;
  setVideo: (videoSrc: string, title?: string, index?: number) => void;
  closeTrailer: () => void;
}

export const useTrailerStore = create<TrailerState>((set) => ({
  isOpen: false,
  videoSrc: '',
  poster: '',
  title: '',
  videos: [],
  currentVideoIndex: 0,
  openTrailer: (videoSrc, poster, title, videos = []) =>
    set({
      isOpen: true,
      videoSrc,
      poster,
      title,
      videos,
      currentVideoIndex: 0,
    }),
  setVideo: (videoSrc, title, index = 0) =>
    set((state) => ({
      videoSrc,
      title: title || state.title,
      currentVideoIndex: index,
    })),
  closeTrailer: () =>
    set({
      isOpen: false,
      videoSrc: '',
      videos: [],
      currentVideoIndex: 0,
    }),
}));
