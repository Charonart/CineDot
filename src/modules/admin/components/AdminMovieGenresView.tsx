'use client';

import React, { useState } from 'react';
import { Tag, Sparkles, Lightbulb, Plus, Edit3, Film, ArrowUpRight, Flame, Layers, Check, X, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface GenreCardItem {
  id: string;
  name: string;
  slug: string;
  gradientBg: string;
  textColor: string;
  revenueShare: string;
  moviesCount: number;
  ticketsSold: string;
  badge: string;
  badgeType: 'hot' | 'active';
  posters: string[];
  isActive: boolean;
}

const INITIAL_GENRES: GenreCardItem[] = [
  {
    id: 'g-1',
    name: 'HÀNH ĐỘNG',
    slug: '/hanh-dong',
    gradientBg: 'from-[#FF2E93] to-[#FF8A00]',
    textColor: 'text-white',
    revenueShare: '34.5% Doanh Thu',
    moviesCount: 12,
    ticketsSold: '184.200 Vé Bán',
    badge: '🔥 HOT TRENDING',
    badgeType: 'hot',
    posters: [
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=80',
    ],
    isActive: true,
  },
  {
    id: 'g-2',
    name: 'VIỄN TƯỞNG',
    slug: '/vien-tuong',
    gradientBg: 'from-[#00F2FE] to-[#4FACFE]',
    textColor: 'text-white',
    revenueShare: '28.2% Doanh Thu',
    moviesCount: 8,
    ticketsSold: '142.000 Vé Bán',
    badge: 'ACTIVE',
    badgeType: 'active',
    posters: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80',
    ],
    isActive: true,
  },
  {
    id: 'g-3',
    name: 'KINH DỊ',
    slug: '/kinh-di',
    gradientBg: 'from-[#8A0000] to-[#1A0000]',
    textColor: 'text-white',
    revenueShare: '15.8% Doanh Thu',
    moviesCount: 5,
    ticketsSold: '89.400 Vé Bán',
    badge: 'ACTIVE',
    badgeType: 'active',
    posters: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    ],
    isActive: true,
  },
  {
    id: 'g-4',
    name: 'HOẠT HÌNH & ANIME',
    slug: '/anime',
    gradientBg: 'from-[#FF9A9E] to-[#FECFEF]',
    textColor: 'text-slate-900',
    revenueShare: '12.5% Doanh Thu',
    moviesCount: 6,
    ticketsSold: '76.100 Vé Bán',
    badge: '🔥 TRENDING',
    badgeType: 'hot',
    posters: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=80',
    ],
    isActive: true,
  },
  {
    id: 'g-5',
    name: 'LÃNG MẠN',
    slug: '/lang-man',
    gradientBg: 'from-[#FAD0C4] to-[#FFD1FF]',
    textColor: 'text-slate-900',
    revenueShare: '9.0% Doanh Thu',
    moviesCount: 4,
    ticketsSold: '42.000 Vé Bán',
    badge: 'ACTIVE',
    badgeType: 'active',
    posters: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    ],
    isActive: true,
  },
];

export function AdminMovieGenresView() {
  const [genres, setGenres] = useState<GenreCardItem[]>(INITIAL_GENRES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGenreName, setNewGenreName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleToggleGenreActive = (id: string) => {
    setGenres(
      genres.map((g) => (g.id === id ? { ...g, isActive: !g.isActive } : g))
    );
  };

  const handleAddGenre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGenreName.trim()) return;

    const newGenre: GenreCardItem = {
      id: 'g-' + Date.now(),
      name: newGenreName.trim().toUpperCase(),
      slug: newSlug.trim() || '/' + newGenreName.toLowerCase().replace(/ /g, '-'),
      gradientBg: 'from-purple-600 to-indigo-600',
      textColor: 'text-white',
      revenueShare: '0.0% Doanh Thu',
      moviesCount: 0,
      ticketsSold: '0 Vé Bán',
      badge: 'NEW',
      badgeType: 'active',
      posters: [
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80',
      ],
      isActive: true,
    };

    setGenres([...genres, newGenre]);
    setSuccessMsg(`Đã tạo thành công thể loại "${newGenreName}"!`);
    setTimeout(() => {
      setIsModalOpen(false);
      setNewGenreName('');
      setNewSlug('');
      setSuccessMsg('');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8 font-sans">
      {/* 2.1 Top Section: Header Title */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
          <Tag className="w-4 h-4" />
          <span>PHÂN TÍCH & QUẢN LÝ THỂ LOẠI PHIM</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Phân Tích & Quản Lý Thể Loại Phim
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Theo dõi thị phần doanh thu, số lượng vé bán ra và xu hướng khán giả theo từng thể loại.
        </p>
      </div>

      {/* Market Share Distribution Bar */}
      <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#7C6FE8]" />
            <span>Thị Phần Doanh Thu Theo Thể Loại (Q3/2026)</span>
          </h3>
          <span className="text-xs font-bold text-[#7C6FE8] bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            Tổng 100% Doanh Thu
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="w-full h-4 rounded-full bg-slate-100 flex overflow-hidden shadow-inner">
          <div style={{ width: '42%' }} className="bg-[#FF2E93] h-full" title="Hành Động: 42%" />
          <div style={{ width: '28%' }} className="bg-[#00F2FE] h-full" title="Viễn Tưởng: 28%" />
          <div style={{ width: '15%' }} className="bg-amber-500 h-full" title="Hoạt Hình & Anime: 15%" />
          <div style={{ width: '10%' }} className="bg-[#8A0000] h-full" title="Kinh Dị: 10%" />
          <div style={{ width: '5%' }} className="bg-pink-300 h-full" title="Lãng Mạn: 5%" />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-extrabold text-slate-700 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF2E93]" />
            <span>Hành Động (42%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#00F2FE]" />
            <span>Viễn Tưởng (28%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Hoạt Hình (15%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#8A0000]" />
            <span>Kinh Dị (10%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-pink-300" />
            <span>Lãng Mạn (5%)</span>
          </div>
        </div>
      </div>

      {/* AI Smart Insight Banner */}
      <div className="p-5 rounded-3xl bg-[#F3E8FF] border border-[#C084FC] text-slate-900 flex items-start gap-3.5 shadow-sm">
        <div className="w-9 h-9 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center shrink-0 shadow-md">
          <Lightbulb className="w-5 h-5 text-amber-300" />
        </div>
        <div className="flex flex-col gap-0.5 text-xs">
          <span className="font-extrabold text-[#7C3AED] uppercase tracking-wider">AI Market Insight</span>
          <p className="font-medium text-slate-800 leading-relaxed">
            Thể loại <strong className="text-slate-900 font-extrabold">Phim Anime</strong> đang có tỉ lệ lấp đầy ghế tăng <strong className="text-emerald-700 font-extrabold">+28%</strong> trong tháng này. Khuyến nghị nhập thêm phim & xếp thêm suất chiếu giờ vàng!
          </p>
        </div>
      </div>

      {/* 2.2 Main Section: Visual Genre Cards Grid (3D Poster Stacks) */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">Danh Mục Thể Loại Phim</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Thêm Thể Loại Mới</span>
          </button>
        </div>

        {/* 3-Column Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {genres.map((g) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-3xl bg-gradient-to-br ${g.gradientBg} ${g.textColor} p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px] transition-transform hover:-translate-y-1`}
            >
              {/* 3D Overlapping Poster Stacks */}
              <div className="absolute right-3 top-3 flex items-center -space-x-4 pointer-events-none opacity-90">
                {g.posters.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="poster"
                    className="w-14 h-20 rounded-xl object-cover border-2 border-white/60 shadow-xl transform rotate-6 hover:rotate-0 transition-transform"
                    style={{ transform: `rotate(${idx === 0 ? '-6deg' : '6deg'})` }}
                  />
                ))}
              </div>

              {/* Card Header & Badge */}
              <div className="flex flex-col gap-1 relative z-10 pr-20">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider w-fit border border-white/30">
                  {g.badge}
                </span>
                <h3 className="text-2xl font-black tracking-tight mt-2">{g.name}</h3>
                <span className="text-xs font-semibold opacity-80 font-mono">{g.slug}</span>
              </div>

              {/* Card Metrics & Actions */}
              <div className="flex items-center justify-between pt-6 relative z-10 border-t border-white/20 text-xs font-extrabold">
                <div className="flex flex-col">
                  <span>{g.revenueShare}</span>
                  <span className="text-[10px] opacity-80 font-normal">{g.moviesCount} Phim • {g.ticketsSold}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleGenreActive(g.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold border transition-all cursor-pointer ${
                      g.isActive
                        ? 'bg-white text-slate-900 border-white shadow-xs'
                        : 'bg-black/30 text-white border-white/40 opacity-60'
                    }`}
                  >
                    {g.isActive ? 'BẬT' : 'TẮT'}
                  </button>
                  <button
                    onClick={() => alert(`Đang sửa thể loại ${g.name}`)}
                    className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors cursor-pointer"
                    title="Sửa Thể Loại"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Card 6: Create New Genre Card */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-3xl border-2 border-dashed border-[#7C6FE8] hover:border-[#685bc7] bg-white hover:bg-purple-50/40 p-6 flex flex-col items-center justify-center gap-3 text-center transition-all cursor-pointer min-h-[220px] shadow-xs group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 group-hover:bg-[#7C6FE8] text-[#7C6FE8] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
              <Plus className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-extrabold text-sm text-slate-900">Tạo Thể Loại Mới</span>
              <span className="text-xs text-slate-500 font-medium">Thiết lập danh mục & gán màu badge</span>
            </div>
          </button>
        </div>
      </div>

      {/* Modal + Thêm Thể Loại Mới */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#7C6FE8]" />
                <h3 className="text-lg font-extrabold text-slate-900">Thêm Thể Loại Phim Mới</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMsg && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddGenre} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Tên Thể Loại</label>
                <input
                  type="text"
                  value={newGenreName}
                  onChange={(e) => setNewGenreName(e.target.value)}
                  placeholder="Ví dụ: TÂM LÝ XÃ HỘI"
                  required
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Slug đường dẫn</label>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="/tam-ly-xa-hoi"
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  TẠO THỂ LOẠI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
