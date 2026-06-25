import { create } from 'zustand';

interface TrailerState {
  isOpen: boolean;
  videoSrc: string;
  poster: string;
  title: string;
  openTrailer: (videoSrc: string, poster: string, title: string) => void;
  closeTrailer: () => void;
}

export const useTrailerStore = create<TrailerState>((set) => ({
  isOpen: false,
  videoSrc: '',
  poster: '',
  title: '',
  openTrailer: (videoSrc, poster, title) =>
    set({ isOpen: true, videoSrc, poster, title }),
  closeTrailer: () => set({ isOpen: false }),
}));
