'use client';

import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { useProfileDashboard } from '../hooks/useProfileDashboard';
import { ProfileSidebar } from './ProfileSidebar';
import { UserTicketCard } from './UserTicketCard';
import { StarShopOrdersTab } from './StarShopOrdersTab';
import { TabRewards } from './TabRewards';
import { TabTransactionHistory } from './TabTransactionHistory';
import { TabAccountInfo } from './TabAccountInfo';
import { TabSecurity } from './TabSecurity';
import { Skeleton } from '@/shared/ui/Skeleton';

export function ProfileTicketsClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const { isAuthenticated } = useAuthStore();

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

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !profile) {
    return (
      <div className="w-full pt-28 pb-20 bg-[#FEFEFE] min-h-screen">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <Skeleton variant="card" className="w-full h-[500px] rounded-3xl" />
            </div>
            <div className="lg:col-span-8 flex flex-col gap-6">
              <Skeleton variant="text" className="w-1/3 h-10" />
              <Skeleton variant="card" className="w-full h-48 rounded-3xl" />
              <Skeleton variant="card" className="w-full h-48 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col font-sans bg-[#FEFEFE] text-[#131413] min-h-screen pt-28 pb-20 selection:bg-[#7C6FE8] selection:text-white">
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: 25% Width (lg:col-span-4 - User Profile Sidebar Panel) */}
            <div className="lg:col-span-4">
              <ProfileSidebar
                profile={profile}
                activeTab={activeNavTab}
                onSelectTab={setActiveNavTab}
              />
            </div>

            {/* Right Column: 75% Width (lg:col-span-8 - Active Tab Content) */}
            <div className="lg:col-span-8">
              {/* TAB 1: VÉ CỦA TÔI */}
              {activeNavTab === 'TICKETS' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131413] tracking-tight">
                      Vé Của Tôi
                    </h1>

                    <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
                      <button
                        onClick={() => setTicketFilterTab('UPCOMING')}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          ticketFilterTab === 'UPCOMING'
                            ? 'bg-[#7C6FE8] text-white shadow-sm'
                            : 'text-slate-600 hover:text-[#7C6FE8]'
                        }`}
                      >
                        Vé Sắp Chiếu
                      </button>

                      <button
                        onClick={() => setTicketFilterTab('PAST')}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          ticketFilterTab === 'PAST'
                            ? 'bg-[#7C6FE8] text-white shadow-sm'
                            : 'text-slate-600 hover:text-[#7C6FE8]'
                        }`}
                      >
                        Vé Đã Xem
                      </button>
                    </div>
                  </div>

                  {tickets.length === 0 ? (
                    <div className="w-full bg-white rounded-3xl p-12 text-center border border-gray-100 flex flex-col items-center gap-3">
                      <span className="text-4xl">🎟️</span>
                      <h3 className="font-bold text-base text-[#131413]">Không tìm thấy vé xem phim nào</h3>
                      <p className="text-xs text-slate-400">Bạn chưa có vé xem phim ở mục này.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
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

              {/* TAB 2: ĐƠN HÀNG CỦA BẠN */}
              {activeNavTab === 'ORDERS' && <StarShopOrdersTab orders={orders} />}

              {/* TAB 3: KHO VOUCHER & ƯU ĐÃI */}
              {activeNavTab === 'REWARDS' && <TabRewards profile={profile} vouchers={vouchers} />}

              {/* TAB 4: LỊCH SỬ GIAO DỊCH */}
              {activeNavTab === 'TRANSACTIONS' && <TabTransactionHistory transactions={transactions} />}

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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
