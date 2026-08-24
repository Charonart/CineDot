'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Ticket,
  AlertTriangle,
  ShoppingBag,
  UserCheck,
  CheckCheck,
  Trash2,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export interface AdminNotificationItem {
  id: string;
  type: 'booking' | 'fnb' | 'system' | 'user';
  title: string;
  description: string;
  timeAgo: string;
  isRead: boolean;
  linkUrl?: string;
}

const INITIAL_NOTIFICATIONS: AdminNotificationItem[] = [
  {
    id: 'notif-1',
    type: 'booking',
    title: 'Đơn Vé Mới Đã Thanh Toán',
    description: 'Đơn vé #BK-9021 (2 vé IMAX Phim Lật Mặt 7) vừa thanh toán thành công qua VNPay.',
    timeAgo: '2 phút trước',
    isRead: false,
    linkUrl: '/admin/booking',
  },
  {
    id: 'notif-2',
    type: 'fnb',
    title: 'Đơn Hàng Star Shop F&B',
    description: 'Khách hàng vừa đặt Combo Bắp Nước Couple #FNB-4410 tại Rạp Landmark 81.',
    timeAgo: '12 phút trước',
    isRead: false,
    linkUrl: '/admin/concessions',
  },
  {
    id: 'notif-3',
    type: 'user',
    title: 'Cập Nhật Phân Quyền RBAC',
    description: 'Tài khoản lequy27102006@gmail.com vừa được gán quyền Quản Trị Hệ Thống Admin.',
    timeAgo: '30 phút trước',
    isRead: false,
    linkUrl: '/admin/users-staff/roles',
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Cảnh Báo Tồn Kho F&B',
    description: 'Vật phẩm Ly Phim Limited tại Rạp Q1 sắp hết hàng trong kho (Còn 5 ly).',
    timeAgo: '1 giờ trước',
    isRead: true,
    linkUrl: '/admin/concessions',
  },
];

export const AdminNotificationCenter: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'booking' | 'system'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'booking') return n.type === 'booking' || n.type === 'fnb';
    if (activeTab === 'system') return n.type === 'system' || n.type === 'user';
    return true;
  });

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleItemClick = (item: AdminNotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    );
    if (item.linkUrl) {
      router.push(item.linkUrl);
      setIsOpen(false);
    }
  };

  const getItemIcon = (type: AdminNotificationItem['type']) => {
    switch (type) {
      case 'booking':
        return <Ticket className="w-4 h-4 text-[#7C6FE8]" />;
      case 'fnb':
        return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case 'user':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'system':
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    }
  };

  const getItemIconBg = (type: AdminNotificationItem['type']) => {
    switch (type) {
      case 'booking':
        return 'bg-purple-50 border-purple-100';
      case 'fnb':
        return 'bg-emerald-50 border-emerald-100';
      case 'user':
        return 'bg-blue-50 border-blue-100';
      case 'system':
      default:
        return 'bg-amber-50 border-amber-100';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Header Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-slate-100/80 hover:bg-purple-50 text-slate-600 hover:text-[#7C6FE8] transition-colors relative cursor-pointer border border-transparent hover:border-purple-100 active:scale-95"
        title="Trung Tâm Thông Báo Đẩy Admin"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black leading-none ring-2 ring-white shadow-xs animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-purple-100/80 rounded-3xl shadow-2xl z-50 overflow-hidden text-slate-900 select-none"
          >
            {/* Panel Top Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-bold">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                    <span>Thông Báo Đẩy</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#7C6FE8] text-white text-[10px] font-mono font-bold">
                        {unreadCount} mới
                      </span>
                    )}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Cập nhật các sự kiện thời gian thực
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="p-1.5 rounded-xl hover:bg-purple-50 text-slate-400 hover:text-[#7C6FE8] transition-colors cursor-pointer"
                    title="Đánh dấu đã đọc tất cả"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Xóa tất cả thông báo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-2 bg-slate-100/60 border-b border-gray-100 text-xs font-bold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex-1 text-center ${
                  activeTab === 'all'
                    ? 'bg-white text-[#7C6FE8] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Tất Cả
              </button>
              <button
                onClick={() => setActiveTab('booking')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex-1 text-center ${
                  activeTab === 'booking'
                    ? 'bg-white text-[#7C6FE8] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Đơn Vé & F&B
              </button>
              <button
                onClick={() => setActiveTab('system')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex-1 text-center ${
                  activeTab === 'system'
                    ? 'bg-white text-[#7C6FE8] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Hệ Thống
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-100/80">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 px-4 text-center flex flex-col items-center justify-center gap-2 text-slate-400">
                  <Sparkles className="w-8 h-8 text-purple-200" />
                  <span className="text-xs font-bold">Không có thông báo nào</span>
                </div>
              ) : (
                filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    className={`p-3.5 flex items-start gap-3 hover:bg-purple-50/40 transition-colors cursor-pointer relative group ${
                      !n.isRead ? 'bg-purple-50/20' : ''
                    }`}
                  >
                    {/* Unread indicator dot */}
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#7C6FE8] absolute top-4 right-3 shrink-0" />
                    )}

                    <div className={`p-2.5 rounded-2xl border shrink-0 ${getItemIconBg(n.type)}`}>
                      {getItemIcon(n.type)}
                    </div>

                    <div className="flex flex-col gap-1 flex-1 pr-3 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-black text-slate-900 tracking-tight truncate">
                          {n.title}
                        </h4>
                        <span className="text-[10px] font-medium text-slate-400 shrink-0">
                          {n.timeAgo}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-600 leading-snug line-clamp-2">
                        {n.description}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Panel Bottom Footer */}
            <div className="p-3 border-t border-gray-100 bg-slate-50/50 flex items-center justify-between text-xs font-bold text-[#7C6FE8]">
              <span className="text-[11px] text-slate-400">Tự động cập nhật thời gian thực</span>
              <button
                onClick={handleMarkAllRead}
                className="hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Đã đọc tất cả</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
