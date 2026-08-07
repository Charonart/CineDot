import {
  AboutStatCounter,
  AboutCoreValue,
  AboutTimelineItem,
  AboutFaqItem,
  AboutGalleryItem,
} from '../types/about.types';

export const MOCK_ABOUT_STATS: AboutStatCounter[] = [
  { label: 'Cụm rạp toàn quốc', value: '50+', icon: 'Building2' },
  { label: 'Lượt khách hàng', value: '10M+', icon: 'Users' },
  { label: 'Công nghệ màn chiếu', value: 'IMAX 3D Laser', icon: 'Tv' },
];

export const MOCK_CORE_VALUES: AboutCoreValue[] = [
  {
    id: 'val-1',
    title: 'Công Nghệ Tiên Phong',
    subtitle: 'Đỉnh Cao Thị Giác & Thính Giác',
    description: 'Trang bị hệ thống máy chiếu Dual 4K Laser, màn cong khổng lồ IMAX 22m và âm thanh vòm không gian 64 loa Dolby Atmos đạt chuẩn Hollywood.',
    icon: 'Film',
  },
  {
    id: 'val-2',
    title: 'Dịch Vụ Thượng Lưu 5 Sao',
    subtitle: 'Tận Hưởng Sự Khác Biệt',
    description: 'Ghế da ngả lưng điện 180 độ cao cấp Gold Class, sảnh chờ VIP Lounge riêng biệt và đội ngũ phục vụ ẩm thực tại chỗ chu đáo.',
    icon: 'Sparkles',
  },
  {
    id: 'val-3',
    title: 'Star Shop Gourmet & Souvenir',
    subtitle: 'Ẩm Thực Đỉnh Cao & Vật Phẩm Độc Quyền',
    description: 'Thực đơn bắp rang bơ vị Truffle đặc biệt, combo bắp nước giới hạn theo bom tấn và các bộ sưu tầm Collector Box chính hãng Marvel/Disney.',
    icon: 'ShoppingBag',
  },
];

export const MOCK_ABOUT_TIMELINE: AboutTimelineItem[] = [
  {
    year: '2020',
    title: 'Khởi Đầu Hành Trình Điện Ảnh',
    description: 'Ra mắt cụm rạp CineDot đầu tiên tại TP.HCM với tiêu chuẩn thiết kế kiến trúc hiện đại và hệ thống âm thanh vòm Dolby 7.1.',
    badgeText: 'KHỞI ĐẦU',
  },
  {
    year: '2022',
    title: 'Tiên Phong Công Nghệ IMAX 3D Laser',
    description: 'Chính thức hợp tác cùng tập đoàn IMAX Corporation ra mắt phòng chiếu Dual 4K Laser thương mại đầu tiên tại Việt Nam.',
    badgeText: 'BƯỚC NGOẶT',
  },
  {
    year: '2024',
    title: 'Cột Mốc 50 Cụm Rạp Toàn Quốc',
    description: 'Cột mốc bùng nổ mở rộng hệ thống 50 cụm rạp chiếu phim cao cấp trải dài tại các thành phố trọng điểm, phục vụ hơn 10 triệu lượt khách.',
    badgeText: 'BÙNG NỔ',
  },
  {
    year: '2026',
    title: 'Nền Tảng Đặt Vé Số Hóa AI',
    description: 'Tiên phong ra mắt hệ thống đặt vé xem phim thông minh, giao diện 100% Light Mode cá nhân hóa trải nghiệm độc bản dành cho người dùng.',
    badgeText: 'HIỆN TẠI',
  },
];

export const MOCK_FAQ_ITEMS: AboutFaqItem[] = [
  {
    id: 'faq-1',
    question: 'Làm sao để hủy hoặc đổi thời gian vé phim đã thanh toán thành công?',
    answer: 'Theo quy định chung của ngành điện ảnh, vé xem phim đã được thanh toán thành công trên hệ thống không thể hủy hoặc hoàn lại tiền mặt. Tuy nhiên, nếu bạn sở hữu tài khoản thành viên hạng Platinum, bạn được quyền hỗ trợ đổi suất chiếu trước giờ chiếu ít nhất 60 phút qua Hotline 1900 1234.',
    category: 'VÉ PHIM',
  },
  {
    id: 'faq-2',
    question: 'Quy định về độ tuổi xem phim (C13, C16, C18, P, K) như thế nào?',
    answer: 'CineDot tuân thủ nghiêm ngặt quy định phân loại phim của Bộ Văn hóa, Thể thao và Du lịch:\n- P: Phim phổ biến mọi lứa tuổi.\n- K: Phim cho người dưới 13 tuổi với điều kiện xem cùng cha mẹ/người giám hộ.\n- C13: Phim cấm phổ biến cho người dưới 13 tuổi.\n- C16: Phim cấm phổ biến cho người dưới 16 tuổi.\n- C18: Phim cấm phổ biến cho người dưới 18 tuổi.\nVui lòng mang theo Căn cước công dân hoặc giấy tờ tùy thân có ảnh khi nhận vé tại quầy.',
    category: 'QUY ĐỊNH',
  },
  {
    id: 'faq-3',
    question: 'Trẻ em có được miễn phí vé xem phim tại rạp CineDot không?',
    answer: 'Trẻ em có chiều cao dưới 0.7m khi đi cùng người lớn sẽ được miễn phí vé (ngồi chung ghế với người lớn đi kèm). Trẻ em từ 0.7m đến 1.3m áp dụng mức giá vé Trẻ Em giảm 20% so với vé người lớn.',
    category: 'VÉ PHIM',
  },
  {
    id: 'faq-4',
    question: 'Làm sao để tích điểm CinePoints và đổi voucher quà tặng?',
    answer: 'Mỗi giao dịch mua vé phim hoặc vật phẩm Star Shop thành công khi đã đăng nhập tài khoản sẽ được tích lũy 5% giá trị đơn hàng thành CinePoints. Bạn có thể kiểm tra số điểm và đổi mã giảm giá trực tiếp tại trang Cá Nhân > Điểm Thưởng CinePoints.',
    category: 'THÀNH VIÊN',
  },
  {
    id: 'faq-5',
    question: 'Tôi có thể mua vật phẩm Star Shop mà không cần xem phim được không?',
    answer: 'Hoàn toàn được! Bạn có thể đặt mua các mô hình Hot Toys, cốc tumbler limited hoặc quà tặng sưu tầm trực tiếp tại trang Star Shop và chọn nhận hàng tại quầy bất kỳ cụm rạp CineDot nào mà không bắt buộc phải mua vé xem phim.',
    category: 'STAR SHOP',
  },
];

export const MOCK_GALLERY_ITEMS: AboutGalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Phòng Chiếu IMAX 3D Laser',
    subtitle: 'Màn cong khổng lồ 22m & Âm thanh 12 kênh',
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'gal-2',
    title: 'Sảnh Thương Gia Premium Lounge',
    subtitle: 'Không gian thư giãn sang trọng phục vụ đồ uống',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'gal-3',
    title: 'Ghế Đôi Sweetbox Riêng Tư',
    subtitle: 'Không gian xem phim ấm cúng dành cho cặp đôi',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'gal-4',
    title: 'Quầy Star Shop & Kiosk Tự Động',
    subtitle: 'Đặt bắp nước & vật phẩm sưu tầm 1-click',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
  },
];
