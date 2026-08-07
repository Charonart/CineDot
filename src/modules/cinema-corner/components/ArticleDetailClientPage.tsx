'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Quote,
  Star,
  Ticket,
  Copy,
  Check,
} from 'lucide-react';
import { CinemaCornerArticle } from '../types/cinema-corner.types';
import { fetchArticleBySlug, fetchArticles } from '../services/cinema-corner.service';
import { CinemaCornerArticleCard } from './CinemaCornerArticleCard';
import { Skeleton } from '@/shared/ui/Skeleton';

interface ArticleDetailClientPageProps {
  slug: string;
}

export function ArticleDetailClientPage({ slug }: ArticleDetailClientPageProps) {
  const [article, setArticle] = useState<CinemaCornerArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<CinemaCornerArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Interactive comment state
  const [comments, setComments] = useState([
    {
      id: 'c-1',
      author: 'Hoàng Long',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      time: '2 giờ trước',
      content: 'Bài viết phân tích quá xuất sắc! Mình xem lần đầu bỏ lỡ mất 4 Easter Eggs quan trọng.',
      likes: 14,
    },
    {
      id: 'c-2',
      author: 'Minh Trang',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      time: '5 giờ trước',
      content: 'Hình ảnh góc quay trong bản IMAX đợt này quả thực là đỉnh cao thị giác luôn.',
      likes: 8,
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const found = await fetchArticleBySlug(slug);
        setArticle(found);
        if (found) {
          const all = await fetchArticles('ALL');
          setRelatedArticles(all.filter((a) => a.id !== found.id).slice(0, 3));
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments([
      {
        id: 'c-' + Date.now(),
        author: 'Khách Hàng CineDot',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        time: 'Vừa xong',
        content: newComment.trim(),
        likes: 0,
      },
      ...comments,
    ]);
    setNewComment('');
  };

  if (loading) {
    return (
      <div className="w-full pt-28 pb-20 bg-[#FEFEFE] min-h-screen">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-8 flex flex-col gap-6">
          <Skeleton variant="text" className="w-1/4 h-6" />
          <Skeleton variant="text" className="w-3/4 h-12" />
          <Skeleton variant="card" className="w-full h-80 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="w-full pt-36 pb-20 bg-[#FEFEFE] min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="text-2xl font-extrabold text-slate-800">Không tìm thấy bài viết này</h2>
        <p className="text-sm text-slate-500">Bài viết có thể đã bị gỡ bỏ hoặc đường dẫn không khả dụng.</p>
        <Link href="/cinema-corner">
          <button className="px-6 py-2.5 rounded-full bg-[#7C6FE8] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#685bc7] transition-all cursor-pointer">
            Quay lại Góc Điện Ảnh
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col font-sans bg-[#FEFEFE] text-[#131413] min-h-screen pt-28 pb-20 selection:bg-[#7C6FE8] selection:text-white">
      <main className="w-full">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8">
          {/* Breadcrumb Back Button */}
          <div className="mb-6">
            <Link href="/cinema-corner">
              <button className="text-xs font-bold text-[#7C6FE8] hover:text-[#685bc7] flex items-center gap-1.5 transition-colors cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại Góc Điện Ảnh & Blog Tin Phim</span>
              </button>
            </Link>
          </div>

          {/* Article Main Title Header */}
          <div className="flex flex-col gap-4 mb-8 max-w-4xl">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-[#7C6FE8] text-xs font-extrabold w-fit uppercase tracking-wider">
              {article.categoryName}
            </span>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
              {article.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              {article.summary}
            </p>

            {/* Author Info Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-b border-gray-100 py-3 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={article.authorAvatar}
                  alt={article.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-purple-200"
                />
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-900">{article.authorName}</span>
                  <span className="text-[11px] font-semibold text-slate-400">{article.authorRole}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-500 font-bold">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#7C6FE8]" />
                  <span>{article.publishedAt}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#7C6FE8]" />
                  <span>{article.readTime}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-[#7C6FE8]" />
                  <span>{(article.views / 1000).toFixed(1)}k lượt đọc</span>
                </span>

                {/* Share Link Button */}
                <button
                  onClick={handleCopyShareLink}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-purple-50 text-[#7C6FE8] font-extrabold flex items-center gap-1 transition-all cursor-pointer"
                  title="Sao chép đường dẫn bài viết"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Đã chép!' : 'Chia sẻ'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Hero Feature Cover Image */}
          <div className="w-full aspect-video max-h-[460px] rounded-3xl overflow-hidden bg-slate-900 shadow-md mb-12 relative">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Main 2-Column Reading Layout (Grid 8 cols + Sidebar 4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
            {/* Left Column: 8 Cols - Main Editorial Reading Content */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* 1. Rating Score Box (If Movie Review) */}
              {article.ratingScore && (
                <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#7C6FE8] text-white flex flex-col items-center justify-center font-extrabold shadow-md shrink-0">
                      <span className="text-xl leading-none">{article.ratingScore}</span>
                      <span className="text-[10px] text-purple-200">/ 10</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider">
                        ĐÁNH GIÁ TỔNG THỂ CINEDOT
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900">
                        {article.ratingVerdict || 'XUẤT SẮC'}
                      </h3>
                      <div className="flex items-center gap-1 text-amber-500 mt-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-slate-600 font-medium text-center sm:text-right max-w-xs">
                    Tác phẩm xứng đáng thưởng thức trọn vẹn tại các phòng chiếu định dạng cao cấp IMAX 3D.
                  </span>
                </div>
              )}

              {/* 2. Article Rich Paragraphs */}
              <div className="flex flex-col gap-5 text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                {(article.paragraphs || [article.summary]).map((p, idx) => (
                  <React.Fragment key={idx}>
                    <p>{p}</p>
                    {idx === 0 && article.quoteText && (
                      /* Pull-Quote Block inserted after first paragraph */
                      <div className="my-4 p-6 rounded-3xl bg-slate-50 border-l-4 border-[#7C6FE8] flex flex-col gap-2 text-slate-800 italic relative">
                        <Quote className="w-8 h-8 text-[#7C6FE8]/20 absolute top-4 right-4" />
                        <p className="text-sm sm:text-base font-extrabold text-[#7C6FE8]">
                          "{article.quoteText}"
                        </p>
                        {article.quoteAuthor && (
                          <span className="text-xs font-bold text-slate-500 not-italic">
                            — {article.quoteAuthor}
                          </span>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* 3. Pros & Cons Box */}
              {(article.pros || article.cons) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  {/* Pros Column */}
                  {article.pros && (
                    <div className="p-5 rounded-3xl bg-emerald-50/60 border border-emerald-100 flex flex-col gap-3">
                      <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>ƯU ĐIỂM NỔI BẬT</span>
                      </span>
                      <ul className="flex flex-col gap-2 text-xs font-semibold text-slate-700">
                        {article.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cons Column */}
                  {article.cons && (
                    <div className="p-5 rounded-3xl bg-rose-50/60 border border-rose-100 flex flex-col gap-3">
                      <span className="text-xs font-extrabold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>ĐIỂM HẠN CHẾ</span>
                      </span>
                      <ul className="flex flex-col gap-2 text-xs font-semibold text-slate-700">
                        {article.cons.map((con, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-rose-500 font-bold">•</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Reader Comments Section */}
              <div className="border-t border-gray-100 pt-8 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#7C6FE8]" />
                    <span>Bình Luận Độc Giả ({comments.length})</span>
                  </h3>
                </div>

                {/* Comment Input Form */}
                <form onSubmit={handleAddComment} className="flex flex-col gap-3">
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..."
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#7C6FE8] focus:bg-white transition-all resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                    >
                      Gửi Bình Luận
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="flex flex-col gap-4">
                  {comments.map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-gray-100 flex items-start gap-3.5">
                      <img src={c.avatar} alt={c.author} className="w-9 h-9 rounded-full object-cover shrink-0" />
                      <div className="flex flex-col flex-1 gap-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-slate-900">{c.author}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{c.time}</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">{c.content}</p>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 mt-1 cursor-pointer hover:text-[#7C6FE8]">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{c.likes} Thích</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: 4 Cols - Sticky Sidebar Cards */}
            <div className="lg:col-span-4 flex flex-col gap-6 sticky top-28">
              {/* Related Movie Card (If exists) */}
              {article.relatedMovie && (
                <div className="w-full bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
                  <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider border-b border-gray-100 pb-2">
                    Phim Trong Bài Review
                  </span>

                  <div className="flex gap-3.5">
                    <img
                      src={article.relatedMovie.posterUrl}
                      alt={article.relatedMovie.title}
                      className="w-20 h-28 rounded-2xl object-cover shrink-0 border border-gray-100 shadow-xs"
                    />
                    <div className="flex flex-col justify-between flex-1">
                      <div className="flex flex-col gap-1">
                        <h4 className="font-extrabold text-sm text-slate-900 line-clamp-2">
                          {article.relatedMovie.title}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-semibold">
                          {article.relatedMovie.genre}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Đạo diễn: {article.relatedMovie.director}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link href="/movies">
                    <button className="w-full py-3 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer">
                      <Ticket className="w-4 h-4" />
                      <span>ĐẶT VÉ PHIM NÀY</span>
                    </button>
                  </Link>
                </div>
              )}

              {/* Related Articles List */}
              {relatedArticles.length > 0 && (
                <div className="w-full bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                    Bài Viết Cùng Chuyên Mục
                  </span>

                  <div className="flex flex-col gap-4">
                    {relatedArticles.map((rel) => (
                      <Link key={rel.id} href={`/cinema-corner/${rel.slug}`}>
                        <div className="flex items-start gap-3 group cursor-pointer">
                          <img
                            src={rel.imageUrl}
                            alt={rel.title}
                            className="w-16 h-12 rounded-xl object-cover shrink-0 border border-gray-100"
                          />
                          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                            <h5 className="font-extrabold text-xs text-slate-800 group-hover:text-[#7C6FE8] transition-colors line-clamp-2 leading-snug">
                              {rel.title}
                            </h5>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {rel.readTime}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
