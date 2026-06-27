/* ============================================================
   CINE Database — Centralized Movie Mock Data
   assets/js/data/movies-data.js
   ============================================================ */

const CINE_MOVIES_DB = [
  // --- PHIM ĐANG CHIẾU (16 phim) ---
  {
    id: "dune-part-two",
    title: "Dune: Cát Song - Phần Hai",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&q=80",
    rating: 8.7,
    ageRating: "T16",
    category: "now-showing",
    genre: "Khoa học viễn tưởng / Phiêu lưu",
    format: "IMAX 2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "godzilla-x-kong",
    title: "Godzilla x Kong: Đế Chế Mới",
    poster: "https://images.unsplash.com/photo-1620421680010-0766ff230392?w=400&q=80",
    rating: 7.2,
    ageRating: "T13",
    category: "now-showing",
    genre: "Hành động / Viễn tưởng",
    format: "3D 4DX",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "ghostbusters-frozen",
    title: "Ghostbusters: Kỷ Nguyên Băng Giá",
    poster: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&q=80",
    rating: 6.9,
    ageRating: "T13",
    category: "now-showing",
    genre: "Hài hước / Phiêu lưu",
    format: "2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "civil-war",
    title: "Civil War: Ngày Tàn Của Đế Quốc",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
    rating: 7.5,
    ageRating: "T18",
    category: "now-showing",
    genre: "Hành động / Tâm lý",
    format: "2D Dolby",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "furiosa",
    title: "Furiosa: Câu Chuyện Từ Max Điên",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80",
    rating: 8.1,
    ageRating: "T18",
    category: "now-showing",
    genre: "Hành động / Kịch tính",
    format: "IMAX 2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "inside-out-2",
    title: "Inside Out 2: Những Mảnh Ghép Cảm Xúc",
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80",
    rating: 8.5,
    ageRating: "P",
    category: "now-showing",
    genre: "Hoạt hình / Hài hước",
    format: "2D lồng tiếng",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "doraemon-symphony",
    title: "Nobita Và Bản Giao Hưởng Địa Cầu",
    poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80",
    rating: 7.9,
    ageRating: "P",
    category: "now-showing",
    genre: "Hoạt hình / Gia đình",
    format: "2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "kungfu-panda-4",
    title: "Kung Fu Panda 4",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80",
    rating: 6.8,
    ageRating: "P",
    category: "now-showing",
    genre: "Hoạt hình / Hài hước",
    format: "2D lồng tiếng",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "lat-mat-7",
    title: "Lật Mặt 7: Một Điều Ước",
    poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80",
    rating: 8.9,
    ageRating: "K",
    category: "now-showing",
    genre: "Tâm lý / Gia đình",
    format: "2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "mai-movie",
    title: "Mai - Phim Điện Ảnh Trấn Thành",
    poster: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80",
    rating: 8.2,
    ageRating: "T18",
    category: "now-showing",
    genre: "Tâm lý / Tình cảm",
    format: "2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "exhuma",
    title: "Exhuma: Quật Mộ Trùng Tang",
    poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&q=80",
    rating: 8.3,
    ageRating: "T16",
    category: "now-showing",
    genre: "Kinh dị / Kỳ bí",
    format: "2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "trung-so-movie",
    title: "Bỗng Dưng Trúng Số",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80",
    rating: 8.4,
    ageRating: "T13",
    category: "now-showing",
    genre: "Hài hước / Hành động",
    format: "2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "demon-slayer",
    title: "Demon Slayer: Đường Đến Làng Rèn Gươm",
    poster: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=400&q=80",
    rating: 7.8,
    ageRating: "T16",
    category: "now-showing",
    genre: "Hoạt hình / Hành động",
    format: "2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "haikyu-battle",
    title: "Haikyu!!: Trận Chiến Bãi Phế Liệu",
    poster: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80",
    rating: 8.6,
    ageRating: "T13",
    category: "now-showing",
    genre: "Hoạt hình / Thể thao",
    format: "2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "tarot-death",
    title: "Tarot: Lá Bài Tử Thần",
    poster: "https://images.unsplash.com/photo-1513794761617-07c574043f6e?w=400&q=80",
    rating: 6.2,
    ageRating: "T16",
    category: "now-showing",
    genre: "Kinh dị / Giật gân",
    format: "2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "challengers",
    title: "Challengers: Những Kẻ Thách Đấu",
    poster: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400&q=80",
    rating: 7.4,
    ageRating: "T18",
    category: "now-showing",
    genre: "Tâm lý / Thể thao",
    format: "2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },

  // --- PHIM SẮP CHIẾU (20 phim) ---
  {
    id: "deadpool-wolverine",
    title: "Deadpool & Wolverine",
    poster: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=400&q=80",
    rating: 8.8,
    ageRating: "T18",
    category: "coming-soon",
    genre: "Hành động / Hài hước",
    format: "IMAX 3D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "alien-romulus",
    title: "Alien: Romulus",
    poster: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=400&q=80",
    rating: 8.0,
    ageRating: "T18",
    category: "coming-soon",
    genre: "Kinh dị / Viễn tưởng",
    format: "IMAX 2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "joker-two",
    title: "Joker: Folie à Deux",
    poster: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=400&q=80",
    rating: 8.2,
    ageRating: "T18",
    category: "coming-soon",
    genre: "Tâm lý / Nhạc kịch",
    format: "IMAX 2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "gladiator-two",
    title: "Võ Sĩ Giác Đấu II",
    poster: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80",
    rating: 7.9,
    ageRating: "T18",
    category: "coming-soon",
    genre: "Hành động / Sử thi",
    format: "2D Dolby Cinema",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "wicked-part-one",
    title: "Wicked: Phần Một",
    poster: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=400&q=80",
    rating: 8.3,
    ageRating: "T13",
    category: "coming-soon",
    genre: "Thần thoại / Nhạc kịch",
    format: "IMAX 2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "moana-2",
    title: "Hành Trình Của Moana 2",
    poster: "https://images.unsplash.com/photo-1547891654-e66ed7edd96c?w=400&q=80",
    rating: 8.1,
    ageRating: "P",
    category: "coming-soon",
    genre: "Hoạt hình / Phiêu lưu",
    format: "2D lồng tiếng",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "mufasa-lion-king",
    title: "Mufasa: Vua Sư Tử",
    poster: "https://images.unsplash.com/photo-1602491453979-53a98b672392?w=400&q=80",
    rating: 7.8,
    ageRating: "P",
    category: "coming-soon",
    genre: "Phiêu lưu / Gia đình",
    format: "2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "despicable-me-4",
    title: "Kẻ Trộm Mặt Trăng 4",
    poster: "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=400&q=80",
    rating: 7.7,
    ageRating: "P",
    category: "coming-soon",
    genre: "Hoạt hình / Hài hước",
    format: "2D lồng tiếng",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "sonic-3",
    title: "Sonic The Hedgehog 3",
    poster: "https://images.unsplash.com/photo-1608889174681-33df45f448c4?w=400&q=80",
    rating: 7.6,
    ageRating: "P",
    category: "coming-soon",
    genre: "Hành động / Phiêu lưu",
    format: "2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "beetlejuice-two",
    title: "Ma Siêu Quậy Beetlejuice II",
    poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80",
    rating: 7.3,
    ageRating: "T13",
    category: "coming-soon",
    genre: "Kinh dị / Hài đen",
    format: "2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "venom-last-dance",
    title: "Venom: Kèo Cuối",
    poster: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=80",
    rating: 8.0,
    ageRating: "T13",
    category: "coming-soon",
    genre: "Hành động / Viễn tưởng",
    format: "IMAX 2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "red-one",
    title: "Red One: Mật Mã Đỏ",
    poster: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80",
    rating: 7.1,
    ageRating: "T13",
    category: "coming-soon",
    genre: "Hành động / Phiêu lưu",
    format: "2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "a-complete-unknown",
    title: "A Complete Unknown",
    poster: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
    rating: 8.4,
    ageRating: "T13",
    category: "coming-soon",
    genre: "Tâm lý / Tiểu sử",
    format: "2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "kraven-hunter",
    title: "Kraven: Thợ Săn Thủ Lĩnh",
    poster: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&q=80",
    rating: 7.2,
    ageRating: "T18",
    category: "coming-soon",
    genre: "Hành động / Giật gân",
    format: "2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "paddington-peru",
    title: "Paddington Tại Peru",
    poster: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
    rating: 8.5,
    ageRating: "P",
    category: "coming-soon",
    genre: "Phiêu lưu / Gia đình",
    format: "2D lồng tiếng",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "nosferatu",
    title: "Ma Cà Rồng Nosferatu",
    poster: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&q=80",
    rating: 8.1,
    ageRating: "T18",
    category: "coming-soon",
    genre: "Kinh dị / Tâm lý",
    format: "2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "cap-america-four",
    title: "Captain America: Thế Giới Mới",
    poster: "https://images.unsplash.com/photo-1559893088-c0787ebfc084?w=400&q=80",
    rating: 7.7,
    ageRating: "T13",
    category: "coming-soon",
    genre: "Hành động / Phiêu lưu",
    format: "IMAX 2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "karate-kid-new",
    title: "The Karate Kid (2025)",
    poster: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80",
    rating: 7.5,
    ageRating: "T13",
    category: "coming-soon",
    genre: "Hành động / Võ thuật",
    format: "2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "snow-white-live",
    title: "Bạch Tuyết (Live-Action)",
    poster: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80",
    rating: 7.0,
    ageRating: "P",
    category: "coming-soon",
    genre: "Thần thoại / Gia đình",
    format: "2D lồng tiếng",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "elio-space",
    title: "Elio: Cậu Bé Đến Từ Trái Đất",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80",
    rating: 7.9,
    ageRating: "P",
    category: "coming-soon",
    genre: "Hoạt hình / Viễn tưởng",
    format: "2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },

  // --- PHIM IMAX (8 phim) ---
  {
    id: "dune-part-two-imax",
    title: "Dune: Cát Song - Phần Hai",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&q=80",
    rating: 8.7,
    ageRating: "T16",
    category: "imax",
    genre: "Khoa học viễn tưởng / Phiêu lưu",
    format: "IMAX 2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "furiosa-imax",
    title: "Furiosa: Câu Chuyện Từ Max Điên",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80",
    rating: 8.1,
    ageRating: "T18",
    category: "imax",
    genre: "Hành động / Kịch tính",
    format: "IMAX 2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "deadpool-wolverine-imax",
    title: "Deadpool & Wolverine",
    poster: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=400&q=80",
    rating: 8.8,
    ageRating: "T18",
    category: "imax",
    genre: "Hành động / Hài hước",
    format: "IMAX 3D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "alien-romulus-imax",
    title: "Alien: Romulus",
    poster: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=400&q=80",
    rating: 8.0,
    ageRating: "T18",
    category: "imax",
    genre: "Kinh dị / Viễn tưởng",
    format: "IMAX 2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "joker-two-imax",
    title: "Joker: Folie à Deux",
    poster: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=400&q=80",
    rating: 8.2,
    ageRating: "T18",
    category: "imax",
    genre: "Tâm lý / Nhạc kịch",
    format: "IMAX 2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "oppenheimer-imax",
    title: "Oppenheimer: Kẻ Hủy Diệt Thế Giới",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80",
    rating: 8.9,
    ageRating: "T18",
    category: "imax",
    genre: "Tâm lý / Lịch sử",
    format: "IMAX 2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "avatar-way-water-imax",
    title: "Avatar: Dòng Chảy Của Nước",
    poster: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&q=80",
    rating: 7.8,
    ageRating: "T13",
    category: "imax",
    genre: "Hành động / Thần thoại",
    format: "IMAX 3D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "interstellar-imax",
    title: "Hố Đen Vũ Trụ (Interstellar)",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80",
    rating: 8.6,
    ageRating: "T13",
    category: "imax",
    genre: "Khoa học viễn tưởng / Tâm lý",
    format: "IMAX 2D",
    trailerSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  }
];

// Support global binding for page usage
if (typeof window !== 'undefined') {
  window.CINE_MOVIES_DB = CINE_MOVIES_DB;
}
