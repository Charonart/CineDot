/* Hallmark · genre: modern-minimal · macrostructure: Bento Grid · theme: White Minimal · nav: N5 · footer: Ft5 */
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
    tickets,
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

  useEffect(() => {
    if (!tabParam) return;
    const lower = tabParam.toLowerCase();
    if (lower === 'my-orders' || lower === 'starshop' || lower === 'orders') {
      setActiveNavTab('ORDERS');
    } else if (lower === 'rewards' || lower === 'vouchers' || lower === 'promotions') {
      setActiveNavTab('REWARDS');
    } else if (lower === 'transactions' || lower === 'history') {
      setActiveNavTab('TRANSACTIONS');
    } else if (lower === 'account' || lower === 'profile') {
      setActiveNavTab('ACCOUNT');
    } else if (lower === 'security' || lower === 'password') {
      setActiveNavTab('SECURITY');
    } else if (lower === 'tickets' || lower === 'my-tickets') {
      setActiveNavTab('TICKETS');
    }
  }, [tabParam, setActiveNavTab]);

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
      <div className="w-full pt-28 pb-20 bg-[#FAFAFB] min-h-screen">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-72 shrink-0">
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

  const upcomingTickets = tickets.filter((t) => t.status === 'UPCOMING');
  const waitingOrders = orders.filter((o) => o.status === 'WAITING_PICKUP');

  return (
    <div className="w-full flex flex-col font-sans bg-[#FAFAFB] text-[#111827] min-h-screen pt-24 sm:pt-28 pb-24 selection:bg-[#7C6FE8] selection:text-white">
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-6"
          >
            <Link href="/" className="hover:text-[#7C6FE8] transition-colors">
              Trang Chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#111827] font-black">Cá Nhân & Vé Của Tôi</span>
          </nav>

          {/* Mobile Horizontal Tab Strip (Hidden on Desktop) */}
          <div className="lg:hidden w-full overflow-x-auto scrollbar-none mb-6 -mx-4 px-4">
            <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-xs w-max">
              {mobileTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeNavTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveNavTab(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#7C6FE8] text-white shadow-sm'
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

          {/* Master Layout: Compact Left Sidebar (280px) + Expansive Main Workspace */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Sidebar Column */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-28">
              <ProfileSidebar
                profile={profile}
                activeTab={activeNavTab}
                onSelectTab={setActiveNavTab}
                ticketCount={upcomingTickets.length}
                orderCount={waitingOrders.length}
                voucherCount={vouchers.length}
              />
            </div>

            {/* Right Main Content Area (Expansive 75% width) */}
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
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Ticket className="w-6 h-6 text-[#7C6FE8]" />
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                              Vé Của Tôi
                            </h1>
                          </div>
                          <p className="text-xs text-slate-500 font-medium pt-0.5">
                            Quản lý vé xem phim điện tử QR Code, tra cứu số ghế và phòng chiếu.
                          </p>
                        </div>

                        {/* Filter Pills */}
                        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl w-fit">
                          <button
                            type="button"
                            onClick={() => setTicketFilterTab('UPCOMING')}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                              ticketFilterTab === 'UPCOMING'
                                ? 'bg-white text-[#7C6FE8] shadow-2xs'
                                : 'text-slate-600 hover:text-[#7C6FE8]'
                            }`}
                          >
                            Vé Sắp Chiếu ({upcomingTickets.length})
                          </button>

                          <button
                            type="button"
                            onClick={() => setTicketFilterTab('PAST')}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                              ticketFilterTab === 'PAST'
                                ? 'bg-white text-slate-900 shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Vé Đã Xem
                          </button>
                        </div>
                      </div>

                      {tickets.length === 0 ? (
                        <div className="w-full bg-white rounded-3xl p-12 text-center border border-slate-200 flex flex-col items-center gap-3">
                          <span className="text-5xl">🎟️</span>
                          <h3 className="font-extrabold text-base text-slate-900">
                            Không tìm thấy vé xem phim nào
                          </h3>
                          <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                            {ticketFilterTab === 'UPCOMING'
                              ? 'Bạn chưa có vé phim sắp chiếu nào. Hãy đặt vé ngay để thưởng thức những bom tấn điện ảnh hấp dẫn!'
                              : 'Bạn chưa có lịch sử vé đã xem nào.'}
                          </p>
                          <Link href="/movies">
                            <button className="mt-2 px-6 py-2.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs shadow-md shadow-[#7C6FE8]/25 transition-all cursor-pointer">
                              Khám Phá Phim Đang Chiếu
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
