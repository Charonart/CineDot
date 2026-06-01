export interface ShowtimeItem {
  time: string;
  status: 'past' | 'available' | 'almost-full' | 'locked' | 'sold-out';
  scheduleId: string;
}

export interface FormatItem {
  name: string;
  times: ShowtimeItem[];
}

export interface CinemaSchedule {
  name: string;
  formats: FormatItem[];
}

export interface MovieRecommendation {
  id: string;
  title: string;
  poster: string;
  rating: number;
  ageRating: string;
}

export interface MovieDetail {
  slug: string;
  title: string;
  originalTitle?: string;
  poster: string;
  backdrop: string;
  rating: number;
  voteCount: number;
  runtime: number;
  releaseDate: string;
  country: string;
  producer: string;
  genres: string[];
  director: string;
  cast: string[];
  overview: string;
  trailerUrl: string;
  recommendations: MovieRecommendation[];
  cinemas: CinemaSchedule[];
}

// Centrally shared mock movie recommendations
export const MOCK_RECOMMENDATIONS: MovieRecommendation[] = [
  {
    id: "lat-mat-7",
    title: "Lật Mặt 7: Một Điều Ước",
    poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80",
    rating: 8.9,
    ageRating: "K"
  },
  {
    id: "inside-out-2",
    title: "Inside Out 2: Những Mảnh Ghép Cảm Xúc",
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80",
    rating: 8.5,
    ageRating: "P"
  },
  {
    id: "exhuma",
    title: "Exhuma: Quật Mộ Trùng Tang",
    poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&q=80",
    rating: 8.3,
    ageRating: "T16"
  }
];

// Central standard showtimes structure matching template
export const DEFAULT_CINEMAS: CinemaSchedule[] = [
  {
    name: "Galaxy CineX - Hanoi Centre",
    formats: [
      {
        name: "Onyx x Dolby Atmos 2D Lồng Tiếng",
        times: [
          { time: "10:00", status: "past", scheduleId: "301" },
          { time: "12:00", status: "available", scheduleId: "302" },
          { time: "14:00", status: "almost-full", scheduleId: "303" },
          { time: "16:00", status: "available", scheduleId: "304" },
          { time: "18:00", status: "locked", scheduleId: "305" },
          { time: "20:00", status: "sold-out", scheduleId: "306" }
        ]
      },
      {
        name: "2D Lồng Tiếng",
        times: [
          { time: "10:30", status: "past", scheduleId: "307" },
          { time: "12:30", status: "available", scheduleId: "308" },
          { time: "14:30", status: "available", scheduleId: "309" },
          { time: "16:30", status: "almost-full", scheduleId: "310" },
          { time: "18:30", status: "available", scheduleId: "311" },
          { time: "20:30", status: "sold-out", scheduleId: "312" }
        ]
      },
      {
        name: "Cine de Kids 2D Lồng Tiếng",
        times: [
          { time: "11:00", status: "past", scheduleId: "313" },
          { time: "13:00", status: "available", scheduleId: "314" },
          { time: "15:00", status: "available", scheduleId: "315" },
          { time: "17:00", status: "available", scheduleId: "316" },
          { time: "19:00", status: "almost-full", scheduleId: "317" },
          { time: "21:00", status: "available", scheduleId: "318" }
        ]
      },
      {
        name: "VIP - AQUALIS 2D Lồng Tiếng",
        times: [
          { time: "11:30", status: "past", scheduleId: "319" },
          { time: "13:30", status: "available", scheduleId: "320" },
          { time: "17:30", status: "almost-full", scheduleId: "321" },
          { time: "19:30", status: "available", scheduleId: "322" },
          { time: "21:30", status: "sold-out", scheduleId: "323" }
        ]
      }
    ]
  },
  {
    name: "CINE Landmark - Q1",
    formats: [
      {
        name: "IMAX 2D Phụ Đề",
        times: [
          { time: "09:00", status: "past", scheduleId: "401" },
          { time: "11:45", status: "available", scheduleId: "402" },
          { time: "14:30", status: "available", scheduleId: "403" },
          { time: "17:15", status: "almost-full", scheduleId: "404" },
          { time: "20:00", status: "available", scheduleId: "405" },
          { time: "22:45", status: "available", scheduleId: "406" }
        ]
      },
      {
        name: "2D Phụ Đề",
        times: [
          { time: "10:00", status: "past", scheduleId: "407" },
          { time: "13:00", status: "available", scheduleId: "408" },
          { time: "16:00", status: "available", scheduleId: "409" },
          { time: "19:00", status: "almost-full", scheduleId: "410" },
          { time: "22:00", status: "available", scheduleId: "411" }
        ]
      }
    ]
  }
];

// Rich datasets for key movies
export const MOVIE_DETAILS_DB: Record<string, MovieDetail> = {
  "dune-part-two": {
    slug: "dune-part-two",
    title: "Dune: Cát Song - Phần Hai",
    originalTitle: "Dune: Part Two",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&q=80",
    rating: 8.7,
    voteCount: 456,
    runtime: 166,
    releaseDate: "15/03/2026",
    country: "Mỹ",
    producer: "Legendary Pictures / Warner Bros.",
    genres: ["Khoa học viễn tưởng", "Phiêu lưu", "Kịch tính"],
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
    overview: "Dune: Cát Song - Phần Hai tiếp tục cuộc hành trình kỳ vĩ của Paul Atreides khi anh đồng hành cùng Chani và người Fremen trên sa mạc Arrakis, tìm kiếm sự trả thù chống lại những kẻ mưu hại gia tộc mình. Đối mặt với những lựa chọn giữa tình yêu của đời mình và số phận của vũ trụ, Paul cố gắng ngăn chặn một tương lai khủng khiếp mà chỉ anh mới có thể thấy trước.",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    recommendations: MOCK_RECOMMENDATIONS,
    cinemas: DEFAULT_CINEMAS
  },
  "godzilla-x-kong": {
    slug: "godzilla-x-kong",
    title: "Godzilla x Kong: Đế Chế Mới",
    originalTitle: "Godzilla x Kong: The New Empire",
    poster: "https://images.unsplash.com/photo-1620421680010-0766ff230392?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&q=80",
    rating: 7.2,
    voteCount: 289,
    runtime: 115,
    releaseDate: "29/03/2026",
    country: "Mỹ",
    producer: "Legendary Pictures",
    genres: ["Hành động", "Viễn tưởng", "Kỳ ảo"],
    director: "Adam Wingard",
    cast: ["Rebecca Hall", "Brian Tyree Henry", "Dan Stevens"],
    overview: "Cuộc chiến điện ảnh kỳ vĩ tiếp diễn! Godzilla và Kong sẽ phải gạt bỏ những bất hòa để cùng nhau chống lại một mối đe dọa khổng lồ mới ẩn sâu trong lòng Trái Đất, đe dọa sự tồn vong của cả loài Titan lẫn nhân loại.",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    recommendations: MOCK_RECOMMENDATIONS,
    cinemas: DEFAULT_CINEMAS
  },
  "ghostbusters-frozen": {
    slug: "ghostbusters-frozen",
    title: "Ghostbusters: Kỷ Nguyên Băng Giá",
    originalTitle: "Ghostbusters: Frozen Empire",
    poster: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1513794761617-07c574043f6e?w=1600&q=80",
    rating: 6.9,
    voteCount: 154,
    runtime: 115,
    releaseDate: "12/04/2026",
    country: "Mỹ",
    producer: "Columbia Pictures",
    genres: ["Hài hước", "Phiêu lưu", "Kỳ ảo"],
    director: "Gil Kenan",
    cast: ["Paul Rudd", "Carrie Coon", "Finn Wolfhard"],
    overview: "Trong Ghostbusters: Kỷ Nguyên Băng Giá, gia đình Spengler quay trở lại nơi mọi thứ bắt đầu - trạm cứu hỏa mang tính biểu tượng ở thành phố New York - để hợp tác với các cựu thành viên Biệt đội săn ma gốc, những người đã phát triển một phòng thí nghiệm nghiên cứu tối mật. Nhưng khi một cổ vật cổ xưa giải phóng một thế lực tà ác, những Ghostbusters mới và cũ phải hợp lực để bảo vệ ngôi nhà của họ và cứu thế giới khỏi Kỷ băng hà thứ hai.",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    recommendations: MOCK_RECOMMENDATIONS,
    cinemas: DEFAULT_CINEMAS
  }
};

// Fallback Default Movie Detail (Doraemon: Lâu Đài Dưới Đáy Biển)
export const DEFAULT_MOVIE_DETAIL: MovieDetail = {
  slug: "doraemon-underwater",
  title: "Doraemon: Nobita Và Lâu Đài Dưới Đáy Biển",
  originalTitle: "Doraemon: Nobita and the Castle of the Undersea Devil",
  poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&q=80",
  backdrop: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  rating: 9.3,
  voteCount: 335,
  runtime: 115,
  releaseDate: "15/05/2026",
  country: "Nhật Bản",
  producer: "Shin-Ei Animation",
  genres: ["Hoạt Hình", "Gia Đình", "Phiêu Lưu"],
  director: "Yajima Tetsuo",
  cast: ["Mizuta Wasabi", "Megumi Oohara", "Yumi Kakazu"],
  overview: "Phim Điện Ảnh Doraemon: Nobita Và Lâu Đài Dưới Đáy Biển kể về cuộc phiêu lưu mới đầy phi thường của Doraemon, Nobita và nhóm bạn thân thiết. Bước vào kỳ nghỉ hè, Nobita và các bạn đã quyết định tham gia chuyến dã ngoại dưới đáy đại dương bao la đầy kỳ thú bằng những bảo bối thần kỳ của Doraemon. Tuy nhiên, chuyến đi vui vẻ nhanh chóng biến thành một hành trình phiêu lưu bất ngờ đầy thử thách khi họ tình cờ phát hiện ra bí mật kinh hoàng về một lâu đài cổ kính nằm sâu thẳm dưới đại dương lạnh giá.",
  trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  recommendations: MOCK_RECOMMENDATIONS,
  cinemas: DEFAULT_CINEMAS
};

export function getMovieDetailBySlug(slug: string): MovieDetail {
  // Normalize slug or mapping some slugs to database key
  const key = slug.toLowerCase();
  if (MOVIE_DETAILS_DB[key]) {
    return MOVIE_DETAILS_DB[key];
  }
  // Try mapping some standard movie list slugs
  if (key.includes("dune")) return MOVIE_DETAILS_DB["dune-part-two"];
  if (key.includes("godzilla")) return MOVIE_DETAILS_DB["godzilla-x-kong"];
  if (key.includes("ghostbusters")) return MOVIE_DETAILS_DB["ghostbusters-frozen"];
  
  // Custom generate basic movie details if they are in standard database listing but not detailed yet
  return {
    ...DEFAULT_MOVIE_DETAIL,
    slug: slug,
    title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  };
}
