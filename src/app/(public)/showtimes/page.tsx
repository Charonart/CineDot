import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Film, MapPin, Sparkles, Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lịch Chiếu Phim Hôm Nay - CineDot Rạp Phim IMAX',
  description:
    'Tra cứu lịch chiếu phim hôm nay mới nhất tại hệ thống rạp CineDot toàn quốc. Đặt vé xem phim trực tuyến nhanh chóng theo cụm rạp và theo phim.',
  alternates: {
    canonical: '/showtimes',
  },
  openGraph: {
    title: 'Lịch Chiếu Phim Hôm Nay - CineDot Rạp Phim IMAX',
    description:
      'Tra cứu lịch chiếu phim hôm nay mới nhất tại hệ thống rạp CineDot toàn quốc. Đặt vé xem phim trực tuyến nhanh chóng.',
    url: '/showtimes',
  },
};

export default function ShowtimesPage() {
  return (
    <div className="w-full flex flex-col font-sans bg-[#FAFAFB] text-gray-900 min-h-screen pt-28 pb-20 selection:bg-[#7C6FE8] selection:text-white">
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col gap-10">
          {/* Header Section */}
          <header className="flex flex-col gap-3">
            <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-widest">
              LỊCH CHIẾU CINEDOT
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
              Lịch Chiếu Phim Toàn Quốc
            </h1>
            <p className="text-sm text-gray-500 max-w-2xl">
              Cập nhật lịch chiếu phim mới nhất, các suất chiếu sớm đặc biệt và phòng chiếu định dạng IMAX Laser, ScreenX 270° tại tất cả cụm rạp CineDot.
            </p>
          </header>

          {/* Quick Selection Cards */}
          <section aria-label="Tra cứu lịch chiếu" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/movies"
              className="group p-8 rounded-3xl bg-white border border-gray-200/80 shadow-xs hover:shadow-lg hover:border-[#7C6FE8]/40 transition-all flex flex-col justify-between gap-6"
            >
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EEECFB] flex items-center justify-center text-[#7C6FE8] group-hover:scale-110 transition-transform">
                  <Film className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h2 className="text-xl font-bold text-gray-950 group-hover:text-[#7C6FE8] transition-colors">
                  Xem Lịch Chiếu Theo Phim
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Chọn bộ phim bạn yêu thích để xem tất cả khung giờ chiếu và các rạp đang khởi chiếu gần bạn nhất.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#7C6FE8]">
                <span>Khám phá danh sách phim</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/cinemas"
              className="group p-8 rounded-3xl bg-white border border-gray-200/80 shadow-xs hover:shadow-lg hover:border-[#7C6FE8]/40 transition-all flex flex-col justify-between gap-6"
            >
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EEECFB] flex items-center justify-center text-[#7C6FE8] group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h2 className="text-xl font-bold text-gray-950 group-hover:text-[#7C6FE8] transition-colors">
                  Xem Lịch Chiếu Theo Cụm Rạp
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Chọn cụm rạp CineDot tại thành phố của bạn để xem trọn vẹn danh sách phim và suất chiếu trong ngày.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#7C6FE8]">
                <span>Chọn cụm rạp gần bạn</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}