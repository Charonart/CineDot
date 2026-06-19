export type HeroBannerItem = {
  id: string;
  image: string;
  alt: string;
  href?: string;
};

export const HERO_BANNERS: HeroBannerItem[] = [
  {
    id: 'banner_1',
    image: 'https://www.galaxycine.vn/media/2026/5/29/1135_1780026959498.jpg',
    alt: 'Dune: Cát Song - Phần Hai',
    href: '/movies/detail/dune-part-two'
  },
  {
    id: 'banner_2',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&q=80',
    alt: 'Ưu Đãi Thành Viên Cuối Tuần',
    href: '/movies'
  },
  {
    id: 'banner_3',
    image: 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/1800x/71252117777b696995f01934522c402d/1/9/1920x1080_1__1.jpg',
    alt: 'Godzilla x Kong: Đế Chế Mới',
    href: '/movies/detail/godzilla-x-kong'
  },
  {
    id: 'banner_4',
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=1600&q=80',
    alt: 'Mua 2 Vé Tặng 1 Bắp Rang Bơ',
    href: '/movies'
  },
  {
    id: 'banner_5',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=1600&q=80',
    alt: 'Couple Combo Special - Tiết Kiệm 25%',
    href: '/movies'
  },
  {
    id: 'banner_6',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80',
    alt: 'Doraemon: Lâu Đài Dưới Đáy Biển',
    href: '/movies/detail/doraemon-underwater'
  }
];
