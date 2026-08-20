'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Ticket,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  Printer,
  X,
  RotateCcw,
  Film,
  MapPin,
  Calendar,
  User,
  Coffee,
  DollarSign,
  AlertCircle,
  QrCode,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Tag,
  Loader2,
  Scissors,
} from 'lucide-react';
import { useAdminBookings } from '../hooks/useAdminBookings';
import { AdminBookingItem } from '../types/adminBooking.types';

export function AdminBookingsView() {
  // Search, Filter & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  // Selected Booking for Detail Modal, Refund Modal & Ticket Print Modal
  const [selectedBooking, setSelectedBooking] = useState<AdminBookingItem | null>(null);
  const [refundTargetBooking, setRefundTargetBooking] = useState<AdminBookingItem | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [printTicketBooking, setPrintTicketBooking] = useState<AdminBookingItem | null>(null);

  // Memoized query params
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: perPage,
      status: statusFilter !== 'ALL' && statusFilter !== 'checked_in' ? statusFilter : undefined,
      search: searchTerm.trim() || undefined,
    }),
    [currentPage, perPage, statusFilter, searchTerm]
  );

  // Hook 100% Real API
  const {
    bookingsList,
    pagination,
    isLoadingBookings,
    isFetchingBookings,
    refetchBookings,
    refundBooking,
    isRefunding,
  } = useAdminBookings(queryParams);

  // Client-side filtering for statuses
  const displayedBookings = useMemo(() => {
    if (statusFilter === 'checked_in') {
      return bookingsList.filter((b) => b.isCheckedIn && b.status !== 'refunded' && b.status !== 'cancelled');
    }
    if (statusFilter === 'refunded') {
      return bookingsList.filter((b) => b.status === 'refunded');
    }
    if (statusFilter === 'cancelled') {
      return bookingsList.filter((b) => b.status === 'cancelled');
    }
    if (statusFilter === 'completed') {
      return bookingsList.filter((b) => (b.status === 'completed' || b.status === 'paid') && !b.isCheckedIn);
    }
    return bookingsList;
  }, [bookingsList, statusFilter]);

  // Handle Search Input Change
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  // Handle Status Filter Change
  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Handle Refund Submit
  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTargetBooking || !refundReason.trim()) return;

    try {
      await refundBooking({
        id: refundTargetBooking.id,
        reason: refundReason.trim(),
      });
      alert(`Đã hoàn tiền đơn vé #${refundTargetBooking.bookingCode} thành công!`);
      setRefundTargetBooking(null);
      setRefundReason('');
      if (selectedBooking?.id === refundTargetBooking.id) {
        setSelectedBooking(null);
      }
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errObj?.response?.data?.message || errObj?.message || 'Không thể xử lý hoàn tiền.');
    }
  };

  // Format Currency
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Print Trigger
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 font-sans pb-16">
      {/* Inline Print Media Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #cinedot-print-root,
          #cinedot-print-root * {
            visibility: visible;
          }
          #cinedot-print-root {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 10px 0 0 0;
            margin: 0;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
            <Ticket className="w-4 h-4" />
            <span>HỆ THỐNG QUẢN LÝ ĐƠN ĐẶT VÉ (BOOKINGS)</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Danh Sách Đơn Vé & Giao Dịch
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Theo dõi tất cả đơn đặt vé trực tuyến, in vé xem phim tại quầy và xử lý hóa đơn hoàn tiền sự cố.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetchBookings()}
            disabled={isFetchingBookings}
            className="px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-slate-700 hover:text-[#7C6FE8] hover:border-[#7C6FE8] font-bold text-xs flex items-center gap-2 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingBookings ? 'animate-spin' : ''}`} />
            <span>Làm Mới</span>
          </button>

          <Link
            href="/admin/ticket-scanner"
            className="px-4 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Kiosk Soát Vé</span>
          </Link>
        </div>
      </div>

      {/* 2. Filter & Search Toolbar */}
      <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Box */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Tìm theo Mã đơn, Khách hàng, Phim..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'Tất Cả' },
            { id: 'completed', label: 'Đã Thanh Toán' },
            { id: 'checked_in', label: 'Đã Soát Vé' },
            { id: 'pending', label: 'Chờ Thanh Toán' },
            { id: 'cancelled', label: 'Đã Hủy' },
            { id: 'refunded', label: 'Đã Hoàn Tiền' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => handleStatusChange(st.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st.id
                  ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/25'
                  : 'bg-slate-50 text-slate-600 border border-gray-200 hover:bg-slate-100'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Bookings Data Table */}
      <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="p-3.5 rounded-l-xl">Mã Đơn / Khách Hàng</th>
                <th className="p-3.5">Bộ Phim & Cụm Rạp</th>
                <th className="p-3.5">Suất Chiếu</th>
                <th className="p-3.5">Vị Trí Ghế</th>
                <th className="p-3.5">Bắp Nước</th>
                <th className="p-3.5">Tổng Tiền</th>
                <th className="p-3.5">Trạng Thái</th>
                <th className="p-3.5 rounded-r-xl text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-slate-700">
              {isLoadingBookings ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#7C6FE8]" />
                      <span className="font-bold">Đang tải danh sách đơn đặt vé...</span>
                    </div>
                  </td>
                </tr>
              ) : displayedBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    Không tìm thấy đơn đặt vé nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                displayedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-purple-50/40 transition-colors">
                    {/* Mã Đơn & Khách Hàng */}
                    <td className="p-3.5">
                      <div className="flex flex-col">
                        <span className="font-mono font-extrabold text-[#7C6FE8] text-xs">
                          {b.bookingCode}
                        </span>
                        <span className="text-[11px] text-slate-900 font-bold">{b.customerName}</span>
                        {b.customerPhone && (
                          <span className="text-[10px] text-slate-400 font-mono">{b.customerPhone}</span>
                        )}
                      </div>
                    </td>

                    {/* Bộ Phim & Cụm Rạp */}
                    <td className="p-3.5 max-w-[220px]">
                      <div className="flex items-center gap-2.5">
                        {b.moviePoster ? (
                          <img
                            src={b.moviePoster}
                            alt={b.movieTitle}
                            className="w-8 h-11 object-cover rounded-lg shadow-2xs shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-11 rounded-lg bg-purple-50 text-[#7C6FE8] flex items-center justify-center shrink-0">
                            <Film className="w-4 h-4" />
                          </div>
                        )}
                        <div className="flex flex-col truncate">
                          <span className="font-bold text-slate-900 truncate" title={b.movieTitle}>
                            {b.movieTitle}
                          </span>
                          <span className="text-[10px] text-slate-500 truncate">
                            {b.cinemaName} • {b.roomName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Suất Chiếu */}
                    <td className="p-3.5 text-slate-600 whitespace-nowrap">
                      {b.showtimeFormatted}
                    </td>

                    {/* Vị Trí Ghế */}
                    <td className="p-3.5">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-[#7C6FE8]">{b.seatsFormatted}</span>
                        <span className="text-[10px] text-slate-400">{b.seatCount} vé</span>
                      </div>
                    </td>

                    {/* Bắp Nước */}
                    <td className="p-3.5">
                      {b.combos.length > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 font-bold text-[11px]">
                            {b.combosCount} phần
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Không có</span>
                      )}
                    </td>

                    {/* Tổng Tiền */}
                    <td className="p-3.5 font-mono font-extrabold text-slate-900 whitespace-nowrap">
                      {formatVND(b.finalAmount)}
                    </td>

                    {/* Trạng Thái (Ưu tiên: Refunded > Cancelled > CheckedIn > Paid > Pending) */}
                    <td className="p-3.5 whitespace-nowrap">
                      {b.status === 'refunded' ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-extrabold border border-rose-200 flex items-center gap-1 w-fit">
                          <RotateCcw className="w-3 h-3 text-rose-600" />
                          <span>ĐÃ HOÀN TIỀN</span>
                        </span>
                      ) : b.status === 'cancelled' ? (
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-extrabold border border-slate-200 flex items-center gap-1 w-fit">
                          <span>ĐÃ HỦY</span>
                        </span>
                      ) : b.isCheckedIn ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>ĐÃ SOÁT VÉ</span>
                        </span>
                      ) : b.status === 'completed' || b.status === 'paid' ? (
                        <span className="px-2.5 py-1 rounded-full bg-purple-50 text-[#7C6FE8] text-[10px] font-extrabold border border-purple-200 flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3 text-[#7C6FE8]" />
                          <span>ĐÃ THANH TOÁN</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold border border-amber-200 flex items-center gap-1 w-fit">
                          <span>CHỜ THANH TOÁN</span>
                        </span>
                      )}
                    </td>

                    {/* Thao Tác */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-2 rounded-xl hover:bg-purple-100 text-[#7C6FE8] transition-colors cursor-pointer"
                          title="Xem Chi Tiết & Bảng Kê Tài Chính"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setPrintTicketBooking(b)}
                          className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-[#7C6FE8] transition-colors cursor-pointer"
                          title="In Vé Xem Phim (Thermal Cinema Ticket)"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        {(b.status === 'completed' || b.status === 'paid') && (
                          <button
                            onClick={() => {
                              setRefundTargetBooking(b);
                              setRefundReason('Sự cố kỹ thuật tại rạp / Khách yêu cầu hoàn tiền');
                            }}
                            className="p-2 rounded-xl hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                            title="Xử Lý Hoàn Tiền Sự Cố"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <span>
              Hiển thị <strong>{displayedBookings.length}</strong> / <strong>{pagination.totalResults}</strong> đơn đặt vé
            </span>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1">
              <span>Mỗi trang:</span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 rounded-lg border border-gray-200 bg-slate-50 text-slate-800 font-bold focus:outline-none focus:border-[#7C6FE8]"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1 || isLoadingBookings}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-slate-700 hover:bg-slate-100 font-bold flex items-center gap-1 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trước</span>
            </button>

            <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-[#7C6FE8] font-black">
              Trang {currentPage} / {pagination.totalPages || 1}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={currentPage >= pagination.totalPages || isLoadingBookings}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-slate-700 hover:bg-slate-100 font-bold flex items-center gap-1 disabled:opacity-40 cursor-pointer"
            >
              <span>Sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Modal Chi Tiết Hóa Đơn & Đơn Đặt Vé */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative text-slate-900 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-bold">
                  <Ticket className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Chi Tiết Đơn Vé #{selectedBooking.bookingCode}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Tạo lúc: {selectedBooking.createdAtFormatted}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Movie & Cinema Info Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200 flex items-start gap-4">
              {selectedBooking.moviePoster ? (
                <img
                  src={selectedBooking.moviePoster}
                  alt={selectedBooking.movieTitle}
                  className="w-16 h-24 object-cover rounded-xl shadow-xs shrink-0"
                />
              ) : (
                <div className="w-16 h-24 rounded-xl bg-purple-100 text-[#7C6FE8] flex items-center justify-center shrink-0 font-bold">
                  <Film className="w-6 h-6" />
                </div>
              )}
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 text-[#7C6FE8] font-black text-[10px] uppercase">
                    {selectedBooking.movieAgeRating}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 font-extrabold text-[10px]">
                    {selectedBooking.roomType}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                  {selectedBooking.movieTitle}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
                  <span>
                    {selectedBooking.cinemaName} • <strong>{selectedBooking.roomName}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
                  <span>{selectedBooking.showtimeFormatted}</span>
                </div>
              </div>
            </div>

            {/* Seats & Combos Table Breakdown */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
                1. Danh Sách Vé & Ghế Ngồi ({selectedBooking.seats.length})
              </span>
              <div className="p-3.5 rounded-2xl bg-white border border-gray-200 divide-y divide-gray-100 text-xs">
                {selectedBooking.seats.map((seat) => (
                  <div key={seat.id} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#7C6FE8] font-black text-xs">
                        {seat.seatCode}
                      </span>
                      <span className="text-slate-600 font-medium uppercase text-[11px]">
                        Loại: {seat.ticketType}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{formatVND(seat.price)}</span>
                  </div>
                ))}
              </div>

              {selectedBooking.combos.length > 0 && (
                <>
                  <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider pt-2">
                    2. Combo Bắp Nước Đi Kèm ({selectedBooking.combos.length})
                  </span>
                  <div className="p-3.5 rounded-2xl bg-white border border-gray-200 divide-y divide-gray-100 text-xs">
                    {selectedBooking.combos.map((c) => (
                      <div key={c.id} className="py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-pink-100 text-pink-700 font-bold text-xs">
                            x{c.quantity}
                          </span>
                          <span className="text-slate-900 font-bold">{c.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-900">
                            {formatVND(c.price * c.quantity)}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                              c.isClaimed
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {c.isClaimed ? 'ĐÃ TRẢ BẮP' : 'CHƯA TRẢ'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Financial Summary Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200 flex flex-col gap-2 text-xs">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                3. Bảng Kê Tài Chính & Thanh Toán
              </span>
              <div className="flex justify-between text-slate-600">
                <span>Khách hàng:</span>
                <strong className="text-slate-900">{selectedBooking.customerName}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Liên hệ:</span>
                <span className="font-mono text-slate-700">
                  {selectedBooking.customerPhone || selectedBooking.customerEmail || 'Không có'}
                </span>
              </div>
              {selectedBooking.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Giảm giá khuyến mãi / Hạng thành viên:</span>
                  <span>- {formatVND(selectedBooking.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Trạng thái đơn:</span>
                <span className="font-bold text-[#7C6FE8]">
                  {selectedBooking.status === 'refunded'
                    ? 'Đã hoàn tiền'
                    : selectedBooking.status === 'cancelled'
                    ? 'Đã hủy đơn'
                    : selectedBooking.isCheckedIn
                    ? `Đã soát vé lúc ${selectedBooking.checkedInAtFormatted}`
                    : 'Chờ soát vé tại cổng'}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-extrabold text-slate-900">
                <span>Tổng Tiền Đã Thanh Toán:</span>
                <span className="text-emerald-600 font-mono text-base font-black">
                  {formatVND(selectedBooking.finalAmount)}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              {(selectedBooking.status === 'completed' || selectedBooking.status === 'paid') && (
                <button
                  type="button"
                  onClick={() => {
                    setRefundTargetBooking(selectedBooking);
                    setRefundReason('Sự cố kỹ thuật tại rạp / Khách yêu cầu hoàn tiền');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs flex items-center justify-center gap-2 border border-rose-200 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Hoàn Tiền Sự Cố</span>
                </button>
              )}

              <div className="flex items-center gap-2.5 w-full sm:w-auto sm:ml-auto">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPrintTicketBooking(selectedBooking);
                  }}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#7C6FE8]/30 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>In Vé Điện Tử</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal In Vé Xem Phim Chuẩn Rạp (Authentic Thermal Cinema Ticket) */}
      {printTicketBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="flex flex-col items-center gap-4 my-auto">
            {/* Top Action Bar */}
            <div className="w-full max-w-[360px] flex items-center justify-between no-print text-white px-1">
              <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-purple-200">
                <Printer className="w-4 h-4 text-[#7C6FE8]" />
                <span>Bản In Vé Phim (80mm)</span>
              </span>
              <button
                type="button"
                onClick={() => setPrintTicketBooking(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* PRINT CONTAINER */}
            <div id="cinedot-print-root" className="flex justify-center w-full">
              {/* THERMAL CINEMA TICKET SLIP */}
              <div className="w-[350px] max-w-full bg-white text-slate-900 rounded-2xl border-2 border-slate-800 p-6 flex flex-col gap-4 font-mono shadow-2xl relative text-xs leading-relaxed">
                {/* 1. Header Cinema Brand */}
                <div className="flex flex-col items-center text-center gap-1">
                  <span className="text-lg font-black tracking-widest text-slate-950 uppercase font-sans">
                    CINEDOT CINEMAS
                  </span>
                  <span className="font-extrabold text-xs text-slate-800 uppercase">
                    {printTicketBooking.cinemaName}
                  </span>
                  <span className="text-[11px] text-slate-600">
                    Hotline: 1900 6868 • cinedot.vn
                  </span>
                </div>

                {/* Star Divider */}
                <div className="text-center text-slate-400 text-[10px] tracking-widest overflow-hidden select-none">
                  * * * * * * * * * * * * * * * * * * * * * * * * * *
                </div>

                {/* 2. Movie Name & Info */}
                <div className="flex flex-col items-center text-center gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    VÉ XEM PHIM (MOVIE TICKET)
                  </span>
                  <h2 className="text-base font-black text-slate-950 uppercase tracking-tight font-sans mt-0.5">
                    {printTicketBooking.movieTitle}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-700">
                    <span className="border border-slate-800 px-1.5 py-0.2 rounded font-black text-[10px]">
                      {printTicketBooking.movieAgeRating}
                    </span>
                    <span>{printTicketBooking.roomType}</span>
                  </div>
                </div>

                {/* 3. Showtime & Seats Box */}
                <div className="border-2 border-dashed border-slate-800 rounded-xl p-3 flex flex-col gap-2 bg-slate-50/60">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">SUẤT CHIẾU:</span>
                    <strong className="text-slate-950 font-black">
                      {printTicketBooking.showtimeFormatted}
                    </strong>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">PHÒNG CHIẾU:</span>
                    <strong className="text-slate-950 font-black uppercase">
                      {printTicketBooking.roomName}
                    </strong>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-300 pt-2 text-xs">
                    <span className="text-slate-600 font-bold">VỊ TRÍ GHẾ:</span>
                    <span className="text-base font-black text-slate-950 font-sans tracking-wide">
                      {printTicketBooking.seatsFormatted}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-600">
                    <span>SỐ LƯỢNG:</span>
                    <span className="font-bold text-slate-900">{printTicketBooking.seatCount} Vé</span>
                  </div>

                  {printTicketBooking.combos.length > 0 && (
                    <div className="flex justify-between items-start border-t border-slate-300 pt-2 text-[11px]">
                      <span className="text-slate-600 shrink-0">BẮP NƯỚC:</span>
                      <span className="font-bold text-slate-900 text-right">
                        {printTicketBooking.combos
                          .map((c) => `${c.name} (x${c.quantity})`)
                          .join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* 4. Customer & Payment Details */}
                <div className="flex flex-col gap-1 text-[11px] text-slate-700">
                  <div className="flex justify-between">
                    <span>Khách hàng:</span>
                    <strong className="text-slate-950">{printTicketBooking.customerName}</strong>
                  </div>
                  {printTicketBooking.customerPhone && (
                    <div className="flex justify-between">
                      <span>SĐT:</span>
                      <span className="text-slate-950 font-bold">{printTicketBooking.customerPhone}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-300 pt-1 text-xs font-black text-slate-950">
                    <span>TỔNG TIỀN:</span>
                    <span>{formatVND(printTicketBooking.finalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Trạng thái:</span>
                    <span className="font-bold uppercase text-emerald-800">
                      {printTicketBooking.status === 'refunded'
                        ? '[ĐÃ HOÀN TIỀN]'
                        : '[ĐÃ THANH TOÁN]'}
                    </span>
                  </div>
                </div>

                {/* 5. QR Code & Barcode */}
                <div className="flex flex-col items-center justify-center gap-1.5 pt-1">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(
                      printTicketBooking.bookingCode
                    )}`}
                    alt="Ticket QR"
                    className="w-24 h-24 object-contain"
                  />
                  <span className="font-black text-xs tracking-widest text-slate-950 font-sans">
                    #{printTicketBooking.bookingCode}
                  </span>
                </div>

                {/* 6. Perforated Stub Line with Scissor Icon */}
                <div className="relative my-1 flex items-center justify-center text-slate-500">
                  <div className="w-full border-t-2 border-dashed border-slate-400" />
                  <div className="absolute bg-white px-2 flex items-center gap-1 text-[10px] text-slate-500">
                    <Scissors className="w-3.5 h-3.5 rotate-90" />
                    <span>CUỐNG VÉ KIỂM SOÁT</span>
                  </div>
                </div>

                {/* 7. Tear-off Stub Details */}
                <div className="flex flex-col gap-1 text-[10px] text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div className="flex justify-between font-bold">
                    <span>{printTicketBooking.movieTitle}</span>
                    <span>{printTicketBooking.roomName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Suất: {printTicketBooking.startTime} • {printTicketBooking.showDate}</span>
                    <strong className="text-slate-950 font-sans text-xs">
                      {printTicketBooking.seatsFormatted}
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Mã vé: #{printTicketBooking.bookingCode}</span>
                    <span>{printTicketBooking.customerName}</span>
                  </div>
                </div>

                {/* 8. Footer Note */}
                <div className="text-center text-[10px] text-slate-500 leading-tight pt-1">
                  <p>* Vui lòng xuất trình vé khi vào phòng chiếu.</p>
                  <p className="font-bold text-slate-800 mt-0.5">Chúc Quý Khách Xem Phim Vui Vẻ!</p>
                </div>
              </div>
            </div>

            {/* Bottom Buttons Bar */}
            <div className="w-full max-w-[360px] flex items-center justify-between gap-3 no-print pt-2">
              <button
                type="button"
                onClick={() => setPrintTicketBooking(null)}
                className="flex-1 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs cursor-pointer text-center"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex-2 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#7C6FE8]/40 cursor-pointer transition-all active:scale-98"
              >
                <Printer className="w-4 h-4" />
                <span>IN VÉ NGAY (PRINT)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal Hoàn Tiền Sự Cố (Admin Refund) */}
      {refundTargetBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleRefundSubmit}
            className="w-full max-w-md bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative text-slate-900"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <RotateCcw className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Xác Nhận Hoàn Tiền Sự Cố
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRefundTargetBooking(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex flex-col gap-1 text-xs text-rose-950">
              <span className="font-bold">
                Mã đơn vé: <strong className="font-mono">{refundTargetBooking.bookingCode}</strong>
              </span>
              <span>Khách hàng: <strong>{refundTargetBooking.customerName}</strong></span>
              <span>
                Số tiền hoàn trả: <strong className="font-mono text-rose-700">{formatVND(refundTargetBooking.finalAmount)}</strong>
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-700">
                Lý do hoàn tiền (Bắt buộc) <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Nhập lý do hoàn tiền (VD: Khách hủy vé theo chính sách, phòng chiếu gặp sự cố kỹ thuật...)"
                rows={3}
                required
                className="w-full p-3 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRefundTargetBooking(null)}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                disabled={isRefunding || !refundReason.trim()}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-rose-600/30 cursor-pointer disabled:opacity-50"
              >
                {isRefunding ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                <span>Xác Nhận Hoàn Tiền</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
