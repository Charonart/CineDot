/* Hallmark · genre: modern-minimal · macrostructure: Bento Grid · theme: White Minimal / Iris Cinema · nav: N5 · footer: Ft5 */
/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */
'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket,
  ShoppingBag,
  Gift,
  History,
  User,
  Shield,
  ChevronRight,
  Sparkles,
  Film,
} from 'lucide-react';
import { useProfileDashboard } from '../hooks/useProfileDashboard';
import { ProfileSidebar } from './ProfileSidebar';
import { UserTicketCard } from './UserTicketCard';
import { StarShopOrdersTab } from './StarShopOrdersTab';
import { TabRewards } from './TabRewards';
import { TabTransactionHistory } from './TabTransactionHistory';
import { TabAccountInfo } from './TabAccountInfo';
import { TabSecurity } from './TabSecurity';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ProfileDashboardTab } from '../types/profile.types';

export function ProfileTicketsClientPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab');

  const {
    profile,
    activeNavTab,
    setActiveNavTab,
    ticketFilterTab,
    setTicketFilterTab,
    allTickets,
    tickets,
    upcomingTickets,
    pastTickets,
    cancelledTickets,
    orders,
    vouchers,
    transactions,
    provinces,
    loading,
    accountUpdateSuccess,
    securityUpdateSuccess,
    securityErrorMsg,
    cancellingTicketId,
    handleUpdateAccountInfo,
    handleUpdateSecurityPassword,
    handleCancelTicket,
  } = useProfileDashboard();

  // Sync state from URL query parameter on mount or when URL param changes
  useEffect(() => {
    if (!tabParam) return;
    const lower = tabParam.toLowerCase();
    if (lower === 'my-orders' || lower === 'starshop' || lower === 'orders') {
      setActiveNavTab('ORDERS');
    } else if (lower === 'rewards' || lower === 'vouchers' || lower === 'promotions') {
      setActiveNavTab('REWARDS');
    } else if (lower === 'transactions' || lower === 'history') {
      setActiveNavTab('TRANSACTIONS');
    } else if (lower === 'account' || lower === 'profile' || lower === 'overview') {
      setActiveNavTab('ACCOUNT');
    } else if (lower === 'security' || lower === 'password') {
      setActiveNavTab('SECURITY');
    } else if (lower === 'tickets' || lower === 'my-tickets') {
      setActiveNavTab('TICKETS');
    }
  }, [tabParam, setActiveNavTab]);

  // Synchronize Tab switch to URL search params
  const handleSelectTabWithUrl = (tab: ProfileDashboardTab) => {
    setActiveNavTab(tab);
    const tabParamMap: Record<ProfileDashboardTab, string> = {
      TICKETS: 'tickets',
      ORDERS: 'orders',
      REWARDS: 'rewards',
      TRANSACTIONS: 'transactions',
      ACCOUNT: 'account',
      SECURITY: 'security',
    };
    const param = tabParamMap[tab];
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', param);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const mobileTabs: {
    id: ProfileDashboardTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'TICKETS', label: 'Vé Của Tôi', icon: Ticket },
    { id: 'ORDERS', label: 'Đơn Hàng', icon: ShoppingBag },
    { id: 'REWARDS', label: 'Voucher', icon: Gift },
    { id: 'TRANSACTIONS', label: 'Lịch Sử', icon: History },
    { id: 'ACCOUNT', label: 'Hồ Sơ', icon: User },
    { id: 'SECURITY', label: 'Bảo Mật', icon: Shield },
  ];

  if (loading || !profile) {
    return (
      <div className="w-full pt-28 pb-20 bg-[#F8F9FD] min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-72 xl:w-80 shrink-0">
              <Skeleton variant="card" className="w-full h-[480px] rounded-3xl" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              <Skeleton variant="text" className="w-1/3 h-10" />
              <Skeleton variant="card" className="w-full h-56 rounded-3xl" />
              <Skeleton variant="card" className="w-full h-56 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const waitingOrders = orders.filter((o) => o.status === 'WAITING_PICKUP');

  return (
    <div className="w-full flex flex-col font-sans bg-[#F8F9FD] text-[#0F172A] min-h-screen pt-24 sm:pt-28 pb-24 selection:bg-[#7C6FE8] selection:text-white relative overflow-x-clip">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[1200px] h-[400px] bg-gradient-to-b from-[#7C6FE8]/5 via-indigo-500/3 to-transparent blur-3xl pointer-events-none -z-10" />

      <main className="w-full">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-6"
          >
            <Link href="/" className="hover:text-[#7C6FE8] transition-colors">
              Trang Chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-black">Cá Nhân & Vé Của Tôi</span>
          </nav>

          {/* Mobile Horizontal Tab Strip (Hidden on Desktop) */}
          <div className="lg:hidden w-full overflow-x-auto scrollbar-none mb-6 -mx-4 px-4">
            <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs w-max">
              {mobileTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeNavTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleSelectTabWithUrl(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#7C6FE8] text-white shadow-sm shadow-[#7C6FE8]/25'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Master Layout: Left Sidebar (280-320px) + Expansive Main Workspace */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Sidebar Column */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-28">
              <ProfileSidebar
                profile={profile}
                activeTab={activeNavTab}
                onSelectTab={handleSelectTabWithUrl}
                ticketCount={upcomingTickets.length}
                orderCount={waitingOrders.length}
                voucherCount={vouchers.length}
              />
            </div>

            {/* Right Main Content Area */}
            <div className="flex-1 min-w-0 w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNavTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {/* TAB 1: VÉ CỦA TÔI */}
                  {activeNavTab === 'TICKETS' && (
                    <div className="flex flex-col gap-6">
                      {/* Header & Single-Row Segmented Filter Controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-black shadow-xs">
                              <Ticket className="w-5 h-5" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                              Vé Của Tôi
                            </h1>
                          </div>
                          <p className="text-xs text-slate-500 font-medium pt-1">
                            Quản lý vé xem phim điện tử QR Code, tra cứu số ghế, combo bắp nước và phòng chiếu.
                          </p>
                        </div>

                        {/* Single-Row Segmented Filter Switcher (No wrapping) */}
                        <div className="flex items-center bg-slate-200/60 p-1.5 rounded-2xl w-fit shrink-0 overflow-x-auto scrollbar-none shadow-inner border border-slate-200/80">
                          <button
                            type="button"
                            onClick={() => setTicketFilterTab('UPCOMING')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                              ticketFilterTab === 'UPCOMING'
                                ? 'bg-white text-[#7C6FE8] shadow-sm font-extrabold'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <span>Sắp Chiếu</span>
                            <span
                              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                                ticketFilterTab === 'UPCOMING'
                                  ? 'bg-purple-100 text-[#7C6FE8]'
                                  : 'bg-slate-300/80 text-slate-700'
                              }`}
                            >
                              {upcomingTickets.length}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTicketFilterTab('PAST')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                              ticketFilterTab === 'PAST'
                                ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <span>Đã Xem</span>
                            <span
                              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                                ticketFilterTab === 'PAST'
                                  ? 'bg-slate-100 text-slate-900'
                                  : 'bg-slate-300/80 text-slate-700'
                              }`}
                            >
                              {pastTickets.length}
                            </span>
                          </button>

                          {cancelledTickets.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setTicketFilterTab('CANCELLED')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                                ticketFilterTab === 'CANCELLED'
                                  ? 'bg-white text-rose-600 shadow-sm font-extrabold'
                                  : 'text-slate-600 hover:text-rose-600'
                              }`}
                            >
                              <span>Đã Hủy</span>
                              <span
                                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                                  ticketFilterTab === 'CANCELLED'
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-slate-300/80 text-slate-700'
                                }`}
                              >
                                {cancelledTickets.length}
                              </span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setTicketFilterTab('ALL')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                              ticketFilterTab === 'ALL'
                                ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <span>Tất Cả</span>
                            <span
                              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                                ticketFilterTab === 'ALL'
                                  ? 'bg-slate-100 text-slate-900'
                                  : 'bg-slate-300/80 text-slate-700'
                              }`}
                            >
                              {allTickets.length}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Tickets List or Empty State */}
                      {tickets.length === 0 ? (
                        <div className="w-full bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center text-3xl shadow-inner border border-purple-100">
                            🎟️
                          </div>
                          <div className="flex flex-col gap-1 max-w-md">
                            <h3 className="font-black text-lg text-slate-900">
                              {ticketFilterTab === 'UPCOMING'
                                ? 'Bạn chưa có vé xem phim sắp chiếu nào'
                                : ticketFilterTab === 'CANCELLED'
                                ? 'Bạn không có đơn vé xem phim nào bị hủy'
                                : ticketFilterTab === 'PAST'
                                ? 'Chưa có lịch sử vé đã xem nào'
                                : 'Chưa có lịch sử đặt vé nào tại CineDot'}
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              {ticketFilterTab === 'UPCOMING'
                                ? 'Hãy chọn một bộ phim bom tấn yêu thích và tận hưởng trải nghiệm rạp chiếu chuẩn quốc tế tại CineDot!'
                                : 'Các bộ phim bạn đã thưởng thức tại CineDot sẽ được lưu trữ tự động tại đây.'}
                            </p>
                          </div>

                          <Link href="/movies">
                            <button className="mt-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#7C6FE8] to-indigo-600 hover:from-[#685bc7] hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-[#7C6FE8]/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95">
                              <Film className="w-4 h-4" />
                              <span>Khám Phá Phim Đang Chiếu</span>
                            </button>
                          </Link>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-5">
                          {tickets.map((t) => (
                            <UserTicketCard
                              key={t.bookingId}
                              ticket={t}
                              onCancel={handleCancelTicket}
                              isCancelling={cancellingTicketId === t.bookingId}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: ĐƠN HÀNG STARSHOP */}
                  {activeNavTab === 'ORDERS' && <StarShopOrdersTab orders={orders} />}

                  {/* TAB 3: KHO VOUCHER & ĐẶC QUYỀN */}
                  {activeNavTab === 'REWARDS' && (
                    <TabRewards profile={profile} vouchers={vouchers} />
                  )}

                  {/* TAB 4: LỊCH SỬ GIAO DỊCH */}
                  {activeNavTab === 'TRANSACTIONS' && (
                    <TabTransactionHistory transactions={transactions} />
                  )}

                  {/* TAB 5: THÔNG TIN CÁ NHÂN */}
                  {activeNavTab === 'ACCOUNT' && (
                    <TabAccountInfo
                      profile={profile}
                      provinces={provinces}
                      onUpdate={handleUpdateAccountInfo}
                      updateSuccess={accountUpdateSuccess}
                    />
                  )}

                  {/* TAB 6: BẢO MẬT TÀI KHOẢN */}
                  {activeNavTab === 'SECURITY' && (
                    <TabSecurity
                      onUpdatePassword={handleUpdateSecurityPassword}
                      updateSuccess={securityUpdateSuccess}
                      errorMsg={securityErrorMsg}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
