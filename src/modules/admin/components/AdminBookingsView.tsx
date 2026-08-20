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
import { adminBookingService } from '../services/adminBooking.service';
import { AdminBookingItem } from '../types/adminBooking.types';
import { CineDataTable, useServerTable } from '@/shared/components/table';
import { CineColumnDef, BulkAction } from '@/shared/types/dataTable.types';

export function AdminBookingsView() {
  // Selected Booking for Detail Modal, Refund Modal & Ticket Print Modal
  const [selectedBooking, setSelectedBooking] = useState<AdminBookingItem | null>(null);
  const [refundTargetBooking, setRefundTargetBooking] = useState<AdminBookingItem | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [printTicketBooking, setPrintTicketBooking] = useState<AdminBookingItem | null>(null);

  // Hook 100% Real API
  const {
    refundBooking,
    isRefunding,
  } = useAdminBookings();



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

  // ── CineColumnDef for Admin Bookings Grid ──
  const columns: CineColumnDef<AdminBookingItem>[] = useMemo(
    () => [
      {
        key: 'booking_code',
        title: 'Mã Đơn / Khách Hàng',
        minWidth: 180,
        dataType: 'custom',
        sortable: true,
        filterable: true,
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-mono font-extrabold text-[#7C6FE8] text-xs">
              {row.bookingCode}
            </span>
            <span className="text-[11px] text-slate-900 font-bold">{row.customerName}</span>
            {row.customerPhone && (
              <span className="text-[10px] text-slate-400 font-mono">{row.customerPhone}</span>
            )}
          </div>
        ),
      },
      {
        key: 'movie_title',
        title: 'Bộ Phim & Cụm Rạp',
        minWidth: 220,
        dataType: 'custom',
        filterable: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            {row.moviePoster ? (
              <img
                src={row.moviePoster}
                alt={row.movieTitle}
                className="w-8 h-11 object-cover rounded-lg shadow-2xs shrink-0"
              />
            ) : (
              <div className="w-8 h-11 rounded-lg bg-purple-50 text-[#7C6FE8] flex items-center justify-center shrink-0">
                <Film className="w-4 h-4" />
              </div>
            )}
            <div className="flex flex-col truncate">
              <span className="font-bold text-slate-900 truncate" title={row.movieTitle}>
                {row.movieTitle}
              </span>
              <span className="text-[10px] text-slate-500 truncate">
                {row.cinemaName} • {row.roomName}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: 'showtime',
        title: 'Suất Chiếu',
        dataType: 'text',
        sortable: true,
        filterable: true,
        cell: ({ row }) => (
          <span className="text-slate-600 font-mono text-xs">{row.showtimeFormatted}</span>
        ),
      },
      {
        key: 'seats',
        title: 'Vị Trí Ghế',
        dataType: 'text',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-mono font-bold text-[#7C6FE8]">{row.seatsFormatted}</span>
            <span className="text-[10px] text-slate-400">{row.seatCount} vé</span>
          </div>
        ),
      },
      {
        key: 'combos',
        title: 'Bắp Nước',
        dataType: 'text',
        cell: ({ row }) => (
          row.combos.length > 0 ? (
            <span className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 font-bold text-[11px]">
              {row.combosCount} phần
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Không có</span>
          )
        ),
      },
      {
        key: 'final_amount',
        title: 'Tổng Tiền',
        dataType: 'currency',
        sortable: true,
        filterable: true,
        align: 'right',
        cell: ({ row }) => (
          <span className="font-mono font-extrabold text-slate-900">
            {formatVND(row.finalAmount)}
          </span>
        ),
      },
      {
        key: 'status',
        title: 'Trạng Thái',
        dataType: 'badge',
        sortable: true,
        filterable: true,
        options: [
          { label: 'Đã Thanh Toán', value: 'completed', badgeClass: 'bg-purple-50 text-[#7C6FE8] border-purple-200' },
          { label: 'Đã Soát Vé', value: 'checked_in', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
          { label: 'Chờ Thanh Toán', value: 'pending', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
          { label: 'Đã Hủy', value: 'cancelled', badgeClass: 'bg-slate-100 text-slate-600 border-slate-200' },
          { label: 'Đã Hoàn Tiền', value: 'refunded', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' },
        ],
        cell: ({ row }) => {
          if (row.status === 'refunded') {
            return (
              <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-extrabold border border-rose-200 flex items-center gap-1 w-fit">
                <RotateCcw className="w-3 h-3 text-rose-600" />
                <span>ĐÃ HOÀN TIỀN</span>
              </span>
            );
          }
          if (row.status === 'cancelled') {
            return (
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-extrabold border border-slate-200 flex items-center gap-1 w-fit">
                <span>ĐÃ HỦY</span>
              </span>
            );
          }
          if (row.isCheckedIn) {
            return (
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 flex items-center gap-1 w-fit">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>ĐÃ SOÁT VÉ</span>
              </span>
            );
          }
          if (row.status === 'completed' || row.status === 'paid') {
            return (
              <span className="px-2.5 py-1 rounded-full bg-purple-50 text-[#7C6FE8] text-[10px] font-extrabold border border-purple-200 flex items-center gap-1 w-fit">
                <Clock className="w-3 h-3 text-[#7C6FE8]" />
                <span>ĐÃ THANH TOÁN</span>
              </span>
            );
          }
          return (
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold border border-amber-200 flex items-center gap-1 w-fit">
              <span>CHỜ THANH TOÁN</span>
            </span>
          );
        },
      },
      {
        key: 'actions',
        title: 'Thao Tác',
        width: 130,
        align: 'center',
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedBooking(row)}
              className="p-2 rounded-xl hover:bg-purple-100 text-[#7C6FE8] transition-colors cursor-pointer"
              title="Xem Chi Tiết & Bảng Kê Tài Chính"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPrintTicketBooking(row)}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-[#7C6FE8] transition-colors cursor-pointer"
              title="In Vé Xem Phim (Thermal Cinema Ticket)"
            >
              <Printer className="w-4 h-4" />
            </button>
            {(row.status === 'completed' || row.status === 'paid') && (
              <button
                onClick={() => {
                  setRefundTargetBooking(row);
                  setRefundReason('Sự cố kỹ thuật tại rạp / Khách yêu cầu hoàn tiền');
                }}
                className="p-2 rounded-xl hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                title="Xử Lý Hoàn Tiền Sự Cố"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        ),
      },
    ],
    []
  );

  // ── Hook: Server-Side Table Controller (URL Sync + Query + Inline Edit + Bulk) ──
  const table = useServerTable<AdminBookingItem>({
    queryKey: ['admin', 'bookings'],
    fetcher: (params) => adminBookingService.getBookings(params),
    bulkAction: (action, ids) => adminBookingService.bulkAction(action as any, ids),
    columns,
    exportFileName: 'danh_sach_don_dat_ve_cinedot',
    defaultPerPage: 15,
  });

  // ── Bulk Actions for Bookings ──
  const bulkActions: BulkAction<AdminBookingItem>[] = useMemo(
    () => [
      {
        key: 'bulk_refund',
        label: 'Hoàn Tiền Hàng Loạt',
        variant: 'danger',
        icon: <RotateCcw className="w-3.5 h-3.5" />,
        onClick: async (selectedRows, ids) => {
          if (confirm(`Bạn có chắc muốn xử lý hoàn tiền cho ${ids.length} đơn đặt vé này không?`)) {
            await table.handleBulkAction('bulk_refund');
          }
        },
      },
    ],
    [table]
  );

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

      {/* Universal Notion/Sheets CineDataTable */}
      <CineDataTable<AdminBookingItem>
        table={table}
        title="Danh Sách Đơn Vé & Giao Dịch"
        subtitle="Theo dõi đơn đặt vé trực tuyến, lọc đa dạng, in vé tại quầy và xử lý hóa đơn hoàn tiền sự cố."
        icon={<Ticket className="w-6 h-6 text-[#7C6FE8]" />}
        headerActions={
          <div className="flex items-center gap-3">
            <Link
              href="/admin/ticket-scanner"
              className="px-4 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Kiosk Soát Vé</span>
            </Link>
          </div>
        }
        bulkActions={bulkActions}
        exportFileName="danh_sach_don_dat_ve_cinedot"
      />

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
