'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle2, ShieldAlert, Trash2, Search, Filter, ThumbsUp, Eye, EyeOff, X } from 'lucide-react';

interface MovieReviewItem {
  id: string;
  customerName: string;
  customerAvatar: string;
  customerRole: string;
  movieTitle: string;
  rating: number;
  comment: string;
  createdAt: string;
  likesCount: number;
  status: 'APPROVED' | 'PENDING' | 'SPAM';
}

const INITIAL_REVIEWS: MovieReviewItem[] = [
  {
    id: 'rev-1',
    customerName: 'Hoàng Minh Tuấn',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    customerRole: 'Thành viên Platinum',
    movieTitle: 'Dune: Part Two (Hành Tinh Cát 2)',
    rating: 5,
    comment: 'Tuyệt phẩm điện ảnh thực sự! Âm thanh Hans Zimmer dồn dập tại phòng IMAX đỉnh cao không thể rời mắt.',
    createdAt: '10 phút trước',
    likesCount: 24,
    status: 'APPROVED',
  },
  {
    id: 'rev-2',
    customerName: 'Lê Thu Trang',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    customerRole: 'Thành viên Gold',
    movieTitle: 'Deadpool & Wolverine',
    rating: 5,
    comment: 'Phim cười bể bụng từ đầu đến cuối! Nhiều cameo bất ngờ vỡ òa rạp chiếu luôn.',
    createdAt: '25 phút trước',
    likesCount: 18,
    status: 'APPROVED',
  },
  {
    id: 'rev-3',
    customerName: 'Trần Văn Nam (Spammer)',
    customerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    customerRole: 'Thành viên Mới',
    movieTitle: 'Inside Out 2',
    rating: 1,
    comment: 'Click link xxx.spam.com để nhận vé xem phim miễn phí 100%!',
    createdAt: '1 giờ trước',
    likesCount: 0,
    status: 'SPAM',
  },
  {
    id: 'rev-4',
    customerName: 'Phạm Quốc Bảo',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    customerRole: 'Thành viên VIP',
    movieTitle: 'Godzilla x Kong: The New Empire',
    rating: 4,
    comment: 'Kỹ xảo đánh nhau hoành tráng nhưng cốt truyện hơi đơn giản. Giải trí cuối tuần rất ổn!',
    createdAt: '2 giờ trước',
    likesCount: 9,
    status: 'APPROVED',
  },
  {
    id: 'rev-5',
    customerName: 'Nguyễn Phương Anh',
    customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    customerRole: 'Thành viên Gold',
    movieTitle: 'Exhuma: Quật Mộ Trùng Ma',
    rating: 5,
    comment: 'Phim kinh dị Hàn Quốc làm rất cuốn, tình tiết tâm linh và văn hóa dân gian sâu sắc.',
    createdAt: '3 giờ trước',
    likesCount: 15,
    status: 'APPROVED',
  },
];

export function AdminMovieReviewsView() {
  const [reviews, setReviews] = useState<MovieReviewItem[]>(INITIAL_REVIEWS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const handleUpdateStatus = (id: string, newStatus: 'APPROVED' | 'PENDING' | 'SPAM') => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  const handleDeleteReview = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa đánh giá này không?')) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  const filtered = reviews.filter((r) => {
    const matchSearch =
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'ALL') return matchSearch;
    return matchSearch && r.status === statusFilter;
  });

  return (
    <div className="flex flex-col gap-8 font-sans">
      {/* Title Header */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
          <Star className="w-4 h-4" />
          <span>QUẢN LÝ ĐÁNH GIÁ & PHẢN HỒI KHÁN GIẢ</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Kiểm Duyệt Review & Bình Luận Phim
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Theo dõi điểm số xếp hạng, kiểm duyệt nhận xét và lọc bình luận vi phạm trên hệ thống CineDot.
        </p>
      </div>

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-500">Điểm Đánh Giá Trung Bình</span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-amber-500 font-mono">4.8</span>
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <span className="text-xs text-emerald-600 font-bold">96% Khán giả hài lòng</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-500">Tổng Số Bình Luận</span>
          <span className="text-3xl font-black text-slate-900 font-mono">4,850</span>
          <span className="text-xs text-purple-600 font-bold">+340 Bình luận tuần này</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-500">Đã Kiểm Duyệt & Hiển Thị</span>
          <span className="text-3xl font-black text-emerald-600 font-mono">4,790</span>
          <span className="text-xs text-slate-500 font-medium">Tỷ lệ duyệt 98.7%</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-500">Vi Phạm & Bị Khóa Spam</span>
          <span className="text-3xl font-black text-rose-600 font-mono">60</span>
          <span className="text-xs text-rose-600 font-bold">Đã tự động chặn bởi AI</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo Khách hàng, Tên phim hoặc Nội dung..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'Tất Cả' },
            { id: 'APPROVED', label: 'Đã Duyệt' },
            { id: 'SPAM', label: 'Cảnh Báo Spam' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-[#7C6FE8] text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 border border-gray-200 hover:bg-slate-100'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Data Table */}
      <div className="rounded-3xl bg-white border border-gray-200/80 shadow-sm overflow-hidden flex flex-col">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="p-4 rounded-tl-3xl">Khách Hàng</th>
                <th className="p-4">Tác Phẩm & Điểm Số</th>
                <th className="p-4">Nội Dung Bình Luận</th>
                <th className="p-4">Thời Gian</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 rounded-tr-3xl text-center">Thao Tác Duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-slate-700">
              {filtered.map((rev) => (
                <tr key={rev.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.customerAvatar}
                        alt={rev.customerName}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
                        }}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-xs shrink-0 bg-slate-100"
                      />
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-900">{rev.customerName}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{rev.customerRole}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-extrabold text-slate-900 line-clamp-1">{rev.movieTitle}</span>
                      <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="ml-1 text-slate-700">{rev.rating}.0</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <p className="text-slate-800 font-medium max-w-xs line-clamp-2 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </td>

                  <td className="p-4 text-slate-500 font-mono text-[11px]">{rev.createdAt}</td>

                  <td className="p-4">
                    {rev.status === 'APPROVED' ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>ĐÃ DUYỆT</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-extrabold border border-rose-200 flex items-center gap-1 w-fit">
                        <ShieldAlert className="w-3 h-3 text-rose-600" />
                        <span>SPAM / VI PHẠM</span>
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {rev.status === 'APPROVED' ? (
                        <button
                          onClick={() => handleUpdateStatus(rev.id, 'SPAM')}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-extrabold transition-colors cursor-pointer"
                        >
                          Ẩn / Chặn Spam
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(rev.id, 'APPROVED')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-extrabold transition-colors cursor-pointer"
                        >
                          Duyệt Đăng
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Xóa vĩnh viễn"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
