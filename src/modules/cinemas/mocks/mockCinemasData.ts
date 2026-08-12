import { CinemaItem, CinemaPricingFormat } from '../types/cinemas.types';

export const MOCK_CITIES = ['TP.Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ'];

export const MOCK_CINEMAS: CinemaItem[] = [
  {
    id: 'cinema-1',
    slug: 'cinedot-landmark-81',
    name: 'CineDot Landmark 81',
    city: 'TP.Hồ Chí Minh',
    address: 'Tầng B1, TTTM Vincom Center Landmark 81, 720A Điện Biên Phủ, P.22, Q.Bình Thạnh',
    phone: '1900 6017',
    status: 'OPEN',
    isOpen: true,
    bannerUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1600&auto=format&fit=crop&q=80',
    mapUrl: 'https://maps.google.com/?q=Landmark+81',
    description: 'Cụm rạp flagship sang trọng hàng đầu Việt Nam sở hữu phòng chiếu IMAX Laser 12-Channel lớn nhất Đông Nam Á.',
  },
  {
    id: 'cinema-2',
    slug: 'cinedot-hanoi-centre',
    name: 'Galaxy CineX Hanoi Centre',
    city: 'Hà Nội',
    address: 'Tầng 5, TTTM Tràng Tiền Plaza, 24 Tràng Tiền, Q.Hoàn Kiếm, Hà Nội',
    phone: '1900 6018',
    status: 'OPEN',
    isOpen: true,
    bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop&q=80',
    mapUrl: 'https://maps.google.com/?q=Trang+Tien+Plaza',
    description: 'Trải nghiệm điện ảnh Onyx LED 4K kết hợp công nghệ âm thanh vòm Dolby Atmos đỉnh cao giữa lòng thủ đô.',
  },
  {
    id: 'cinema-3',
    slug: 'cinedot-nguyen-du',
    name: 'Galaxy Nguyễn Du',
    city: 'TP.Hồ Chí Minh',
    address: '116 Nguyễn Du, Quận 1, TP.Hồ Chí Minh',
    phone: '1900 6019',
    status: 'OPEN',
    isOpen: true,
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    mapUrl: 'https://maps.google.com/?q=Galaxy+Nguyen+Du',
    description: 'Cụm rạp truyền thống lâu đời được nâng cấp không gian thiết kế hiện đại bậc nhất dành cho giới trẻ Saigon.',
  },
  {
    id: 'cinema-4',
    slug: 'cinedot-danang-dragon',
    name: 'CineDot Đà Nẵng Dragon',
    city: 'Đà Nẵng',
    address: 'Tầng 3, Vincom Plaza Trần Phú, Q.Hải Châu, TP.Đà Nẵng',
    phone: '1900 6020',
    status: 'OPEN',
    isOpen: true,
    bannerUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600&auto=format&fit=crop&q=80',
    mapUrl: 'https://maps.google.com/?q=Danang+Dragon',
    description: 'Cụm rạp tiêu chuẩn quốc tế ven sông Hàn thơ mộng phục vụ khán giả thành phố biển.',
  },
];

export const MOCK_PRICING_DATA: Record<string, CinemaPricingFormat> = {
  '2d': {
    formatName: '2D Digital Standard',
    formatBadge: '2D Digital',
    categories: [
      {
        dayType: 'Ngày Thường (Thứ 2 - Thứ 5)',
        timeSlot: 'Trước 17:00',
        standardPrice: 75000,
        vipPrice: 85000,
        sweetboxPrice: 180000,
      },
      {
        dayType: 'Ngày Thường (Thứ 2 - Thứ 5)',
        timeSlot: 'Sau 17:00',
        standardPrice: 90000,
        vipPrice: 100000,
        sweetboxPrice: 210000,
      },
      {
        dayType: 'Cuối Tuần (Thứ 6 - Chủ Nhật)',
        timeSlot: 'Cả ngày',
        standardPrice: 110000,
        vipPrice: 120000,
        sweetboxPrice: 250000,
      },
      {
        dayType: 'Học Sinh - Sinh Viên / HSSV',
        timeSlot: 'Đồng giá T2-T6',
        standardPrice: 65000,
        vipPrice: 75000,
        sweetboxPrice: 160000,
      },
    ],
  },
  '3d': {
    formatName: '3D RealD Cinema',
    formatBadge: '3D Experience',
    categories: [
      {
        dayType: 'Ngày Thường (Thứ 2 - Thứ 5)',
        timeSlot: 'Trước 17:00',
        standardPrice: 100000,
        vipPrice: 115000,
        sweetboxPrice: 240000,
      },
      {
        dayType: 'Ngày Thường (Thứ 2 - Thứ 5)',
        timeSlot: 'Sau 17:00',
        standardPrice: 120000,
        vipPrice: 135000,
        sweetboxPrice: 280000,
      },
      {
        dayType: 'Cuối Tuần (Thứ 6 - Chủ Nhật)',
        timeSlot: 'Cả ngày',
        standardPrice: 140000,
        vipPrice: 155000,
        sweetboxPrice: 320000,
      },
    ],
  },
  'imax': {
    formatName: 'IMAX with Laser 12-Channel',
    formatBadge: 'IMAX Laser',
    categories: [
      {
        dayType: 'Ngày Thường (Thứ 2 - Thứ 5)',
        timeSlot: 'Trước 17:00',
        standardPrice: 160000,
        vipPrice: 180000,
        sweetboxPrice: 380000,
      },
      {
        dayType: 'Ngày Thường (Thứ 2 - Thứ 5)',
        timeSlot: 'Sau 17:00',
        standardPrice: 190000,
        vipPrice: 210000,
        sweetboxPrice: 440000,
      },
      {
        dayType: 'Cuối Tuần (Thứ 6 - Chủ Nhật)',
        timeSlot: 'Cả ngày',
        standardPrice: 220000,
        vipPrice: 240000,
        sweetboxPrice: 500000,
      },
    ],
  },
};
