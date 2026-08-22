'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Award,
  Sparkles,
  Ticket,
  DollarSign,
  Shield,
  Lock,
  Unlock,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { adminUserManagementService } from '../../services/adminUserManagement.service';
import { UserDetailResponseDTO } from '../../dto/adminUserManagement.dto';

interface CustomerDetailDrawerProps {
  userId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPointsModal: (user: any) => void;
  onToggleStatus: (userId: number) => Promise<any>;
}

export function CustomerDetailDrawer({
  userId,
  isOpen,
  onClose,
  onOpenPointsModal,
  onToggleStatus,
}: CustomerDetailDrawerProps) {
  const [detailData, setDetailData] = useState<UserDetailResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      setIsLoading(true);
      adminUserManagementService
        .getUserDetail(userId)
        .then((res) => {
          setDetailData(res);
        })
        .catch((err) => {
          console.error('Failed to load user detail', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setDetailData(null);
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const user = detailData?.user;

  const handleToggle = async () => {
    if (!userId) return;
    setIsToggling(true);
    try {
      const updatedUser = await onToggleStatus(userId);
      if (detailData) {
        setDetailData({
          ...detailData,
          user: updatedUser,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white border-l border-purple-100 shadow-2xl flex flex-col justify-between overflow-y-auto">
          {/* Top Bar */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-black text-slate-900">Hồ Sơ Hội Viên</h3>
                <span className="text-xs text-slate-500 font-mono">
                  ID: #{user?.id || userId}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 flex-1 flex flex-col gap-6">
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#7C6FE8]" />
                <span className="text-xs font-bold">Đang tải hồ sơ khách hàng...</span>
              </div>
            ) : user ? (
              <>
                {/* 1. Header Profile Card */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-50/70 via-indigo-50/40 to-pink-50/30 border border-purple-100 flex flex-col gap-4 relative overflow-hidden">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-white border-2 border-purple-200 shadow-xs flex items-center justify-center font-black text-lg text-[#7C6FE8] overflow-hidden shrink-0">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.fullname || user.username} className="w-full h-full object-cover" />
                        ) : (
                          <span>{(user.fullname || user.username).charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-slate-900">
                            {user.fullname || user.username}
                          </h4>
                          {user.email_verified && (
                            <span title="Đã xác thực email">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 font-mono">@{user.username}</span>
                        <span className="text-xs text-slate-600 font-medium">{user.email}</span>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider ${
                        user.is_active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {user.is_active ? 'HOẠT ĐỘNG' : 'ĐÃ KHÓA'}
                    </span>
                  </div>

                  {/* Loyalty Badge & Points Strip */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-200/60">
                    <div className="p-3 rounded-2xl bg-white/80 border border-purple-100 flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-500" />
                        <span>Hạng Hội Viên</span>
                      </span>
                      <span className="text-sm font-black text-indigo-900 mt-0.5">
                        {user.user_tier || 'Bronze'}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/80 border border-purple-100 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        <span>Điểm Tích Lũy</span>
                      </span>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-sm font-mono font-black text-[#7C6FE8]">
                          {user.point.toLocaleString('vi-VN')} Pts
                        </span>
                        <button
                          onClick={() => onOpenPointsModal(user)}
                          className="text-[10px] font-bold text-[#7C6FE8] hover:underline"
                        >
                          + Điểm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Customer Spending Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>Tổng Chi Tiêu</span>
                    </span>
                    <span className="text-base font-black text-slate-900 font-mono">
                      {(detailData?.total_spent || 0).toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                      <Ticket className="w-4 h-4 text-indigo-600" />
                      <span>Đơn Vé Đã Đặt</span>
                    </span>
                    <span className="text-base font-black text-slate-900 font-mono">
                      {detailData?.paid_bookings_count || 0} Đơn
                    </span>
                  </div>
                </div>

                {/* 3. Personal Information */}
                <div className="flex flex-col gap-3">
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                    Thông Tin Cá Nhân
                  </h5>
                  <div className="p-4 rounded-2xl bg-white border border-gray-200/80 flex flex-col divide-y divide-gray-100 text-xs">
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> Số Điện Thoại
                      </span>
                      <span className="font-bold text-slate-800 font-mono">{user.phone || 'Chưa cập nhật'}</span>
                    </div>

                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> Tỉnh / Thành Phố
                      </span>
                      <span className="font-bold text-slate-800">{user.province || 'Chưa cập nhật'}</span>
                    </div>

                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Ngày Sinh
                      </span>
                      <span className="font-bold text-slate-800">{user.birthday || 'Chưa cập nhật'}</span>
                    </div>

                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Ngày Tham Gia
                      </span>
                      <span className="font-bold text-slate-800 font-mono">
                        {new Date(user.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Recent Bookings List */}
                <div className="flex flex-col gap-3">
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Lịch Sử Đặt Vé Gần Nhất</span>
                    <span className="text-[11px] font-mono text-[#7C6FE8]">
                      ({detailData?.recent_bookings?.length || 0})
                    </span>
                  </h5>

                  {detailData?.recent_bookings && detailData.recent_bookings.length > 0 ? (
                    <div className="flex flex-col gap-2.5">
                      {detailData.recent_bookings.map((b) => (
                        <div
                          key={b.booking_id}
                          className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-xs flex flex-col gap-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-black text-xs text-[#7C6FE8]">
                              {b.booking_code}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                                b.status === 'paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : b.status === 'refunded'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {b.status}
                            </span>
                          </div>
                          <span className="text-xs font-black text-slate-900 line-clamp-1">
                            {b.movie_title}
                          </span>
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>
                              {b.cinema_name} • {b.room_name}
                            </span>
                            <span className="font-mono font-bold text-slate-900">
                              {b.total_price.toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                      Chưa có lịch sử giao dịch đặt vé nào.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="py-20 text-center text-xs text-slate-400 font-bold">
                Không tìm thấy thông tin hội viên.
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          {user && (
            <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0 flex items-center justify-between gap-3">
              <button
                onClick={handleToggle}
                disabled={isToggling}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                  user.is_active
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}
              >
                {user.is_active ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                <span>{user.is_active ? 'Khóa Tài Khoản' : 'Mở Khóa Tài Khoản'}</span>
              </button>

              <button
                onClick={() => onOpenPointsModal(user)}
                className="px-5 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#6b5ddc] text-white font-black text-xs uppercase tracking-wider shadow-sm shadow-[#7C6FE8]/30 flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Điều Chỉnh Điểm</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
