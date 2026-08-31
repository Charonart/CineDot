import { create } from 'zustand';

export interface TrailerVideoItem {
  id?: string | number;
  name: string;
  key: string;
  type?: string;
  site?: string;
  thumbnailUrl?: string;
}

export interface MediaGalleryItem {
  id?: string | number;
  type: 'video' | 'image';
  src: string;
  thumbnailUrl?: string;
  title: string;
  tag?: string;
  site?: string;
  key?: string;
}

interface TrailerState {
  isOpen: boolean;
  videoSrc: string;
  poster: string;
  title: string;
  videos: TrailerVideoItem[];
  images: string[];
  mediaItems: MediaGalleryItem[];
  currentIndex: number;
  openTrailer: (
    videoSrc: string,
    poster: string,
    title: string,
    videos?: TrailerVideoItem[],
    images?: string[]
  ) => void;
  openMediaModal: (params: {
    title: string;
    items: MediaGalleryItem[];
    initialIndex?: number;
  }) => void;
  setCurrentIndex: (index: number) => void;
  setVideo: (videoSrc: string, title?: string, index?: number) => void;
  closeTrailer: () => void;
}

export const useTrailerStore = create<TrailerState>((set) => ({
  isOpen: false,
  videoSrc: '',
  poster: '',
  title: '',
  videos: [],
  images: [],
  mediaItems: [],
  currentIndex: 0,

  openTrailer: (videoSrc, poster, title, videos = [], images = []) => {
    const items: MediaGalleryItem[] = [];

    // 1. Add video items
    if (videos && videos.length > 0) {
      videos.forEach((v, idx) => {
        const youtubeUrl = v.key ? `https://www.youtube.com/watch?v=${v.key}` : videoSrc;
        const thumb = v.thumbnailUrl || (v.key ? `https://img.youtube.com/vi/${v.key}/hqdefault.jpg` : poster);
        items.push({
          id: v.id || `video-${idx}`,
          type: 'video',
          src: youtubeUrl,
          thumbnailUrl: thumb,
          title: v.name || `${title} • Trailer ${idx + 1}`,
          tag: v.type || 'Trailer',
          site: v.site || 'YouTube',
          key: v.key,
        });
      });
    } else if (videoSrc) {
      items.push({
        id: 'primary-video',
        type: 'video',
        src: videoSrc,
        thumbnailUrl: poster,
        title: `${title} • Official Trailer`,
        tag: 'Trailer',
        site: 'YouTube',
      });
    }

    // 2. Add poster & images
    if (poster && !images.includes(poster)) {
      items.push({
        id: 'primary-poster',
        type: 'image',
        src: poster,
        thumbnailUrl: poster,
        title: `${title} • Poster Phim`,
        tag: 'Poster',
      });
    }

    if (images && images.length > 0) {
      images.forEach((imgUrl, idx) => {
        items.push({
          id: `image-${idx}`,
          type: 'image',
          src: imgUrl,
          thumbnailUrl: imgUrl,
          title: `${title} • Hình ảnh ${idx + 1}`,
          tag: 'Hình Ảnh',
        });
      });
    }

    set({
      isOpen: true,
      videoSrc: items.length > 0 && items[0].type === 'video' ? items[0].src : videoSrc,
      poster,
      title,
      videos,
      images,
      mediaItems: items,
      currentIndex: 0,
    });
  },

  openMediaModal: ({ title, items, initialIndex = 0 }) => {
    set({
      isOpen: true,
      title,
      mediaItems: items,
      currentIndex: initialIndex,
      videoSrc: items[initialIndex]?.type === 'video' ? items[initialIndex].src : '',
      poster: items[initialIndex]?.thumbnailUrl || '',
    });
  },

  setCurrentIndex: (index: number) => {
    set((state) => {
      const activeItem = state.mediaItems[index];
      return {
        currentIndex: index,
        videoSrc: activeItem?.type === 'video' ? activeItem.src : state.videoSrc,
        title: activeItem?.title || state.title,
      };
    });
  },

  setVideo: (videoSrc, title, index = 0) =>
    set((state) => ({
      videoSrc,
      title: title || state.title,
      currentIndex: index,
    })),

  closeTrailer: () =>
    set({
      isOpen: false,
      videoSrc: '',
      videos: [],
      images: [],
      mediaItems: [],
      currentIndex: 0,
    }),
}));
