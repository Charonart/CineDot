'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  Search,
  CheckCircle2,
  XCircle,
  Ticket,
  ShieldCheck,
  Film,
  MapPin,
  Clock,
  User,
  Coffee,
  Loader2,
  RefreshCw,
  Camera,
  CameraOff,
  Sparkles,
  AlertTriangle,
  History,
  Check,
  UserCheck,
} from 'lucide-react';
import { useAdminTicketScanner } from '../hooks/useAdminTicketScanner';
import { ScannedTicketDetail } from '../types/adminTicketScanner.types';

export function AdminTicketScannerView() {
  const [scanInput, setScanInput] = useState('');
  const [lastScannedResult, setLastScannedResult] = useState<{
    success: boolean;
    message: string;
    ticket?: ScannedTicketDetail;
  } | null>(null);

  // Camera Scanner Mode State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hook 100% Real API
  const {
    recentScans,
    isLoadingRecent,
    refetchRecent,
    lookupTicket,
    isLookingUp,
    checkInTicket,
    isCheckingIn,
    isScanning,
    claimFnb,
    isClaimingFnb,
  } = useAdminTicketScanner();

  // Auto focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Camera cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Toggle Camera
  const handleToggleCamera = async () => {
    if (isCameraActive) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      setIsCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      } catch {
        alert('Không thể kích hoạt Camera hoặc trình duyệt chưa cấp quyền truy cập Camera.');
        setIsCameraActive(false);
      }
    }
  };

  // Handle Lookup Ticket (Tra cứu thông tin vé - Chưa check-in)
  const handleScanSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = scanInput.trim();
    if (!query) return;

    try {
      const ticketDetail = await lookupTicket(query);
      setLastScannedResult({
        success: true,
        message: ticketDetail.isCheckedIn
          ? `Vé này đã được soát trước đó vào lúc ${ticketDetail.checkedInAt}.`
          : 'VÉ HỢP LỆ! SẴN SÀNG XÁC NHẬN KHÁCH VÀO PHÒNG.',
        ticket: ticketDetail,
      });
      setScanInput('');
    } catch (err: unknown) {
      const errObj = err as { message?: string; response?: { data?: { message?: string } } };
      const errorMessage =
        errObj?.response?.data?.message || errObj?.message || 'MÃ VÉ KHÔNG HỢP LỆ HOẶC KHÔNG TỒN TẠI TRONG HỆ THỐNG!';

      setLastScannedResult({
        success: false,
        message: errorMessage,
      });
    } finally {
      inputRef.current?.focus();
    }
  };

  // Handle Confirm Customer Entered (Cập nhật checked_in_at = now())
  const handleConfirmCustomerEntered = async () => {
    if (!lastScannedResult?.ticket) return;

    try {
      const updatedTicket = await checkInTicket(lastScannedResult.ticket.bookingCode);
      setLastScannedResult({
        success: true,
        message: 'ĐÃ SOÁT VÉ THÀNH CÔNG! KHÁCH ĐÃ VÀO PHÒNG CHIẾU.',
        ticket: updatedTicket,
      });
    } catch (err: unknown) {
      const errObj = err as { message?: string; response?: { data?: { message?: string } } };
      const errorMessage =
        errObj?.response?.data?.message || errObj?.message || 'Không thể xác nhận vào phòng.';
      alert(errorMessage);
    }
  };

  // Handle Claim F&B Combo
  const handleClaimFnb = async (bookingComboId: number) => {
    try {
      await claimFnb(bookingComboId);
      if (lastScannedResult?.ticket) {
        const updatedCombos = lastScannedResult.ticket.combos.map((c) =>
          c.id === bookingComboId ? { ...c, isClaimed: true } : c
        );
        setLastScannedResult({
          ...lastScannedResult,
          ticket: {
            ...lastScannedResult.ticket,
            combos: updatedCombos,
          },
        });
      }
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      alert(errObj?.message || 'Không thể xác nhận trả Combo bắp nước.');
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto font-sans pb-12">
      {/* 1. Header & Live Indicator */}
      <div className="flex flex-col items-center text-center gap-2">
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-purple-50 text-[#7C6FE8] text-xs font-extrabold uppercase border border-purple-100 flex items-center gap-1.5 shadow-2xs">
            <QrCode className="w-4 h-4 text-[#7C6FE8]" />
            <span>KIOSK SOÁT VÉ CỔNG RẠP CINEDOT</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Hệ Thống Trực Tuyến 100% Real API</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Cổng Quét Mã QR Code Soát Vé & Trả Bắp Nước
        </h1>
        <p className="text-xs text-slate-500 font-medium max-w-xl">
          Nhập mã đặt vé, quét bằng máy đọc mã vạch USB hoặc sử dụng Camera để kiểm duyệt vé vào phòng chiếu và phát combo bắp nước cho khán giả.
        </p>
      </div>

      {/* 2. Main Workspace (Scanner on Left / Result Details on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Scanner Input & Viewport (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col gap-5 items-center text-center">
            {/* Viewport Box */}
            <div className="w-full max-w-[280px] h-[260px] rounded-3xl bg-slate-900 border-2 border-dashed border-[#7C6FE8] relative flex flex-col items-center justify-center gap-3 overflow-hidden shadow-inner group">
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover rounded-3xl"
                />
              ) : (
                <>
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#7C6FE8] to-transparent absolute top-0 animate-pulse" />
                  <QrCode className="w-20 h-20 text-[#7C6FE8] opacity-80 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-[11px] font-extrabold text-slate-300 uppercase tracking-widest">
                    SẴN SÀNG QUÉT MÃ
                  </span>
                </>
              )}

              {/* Laser Scan Animation Line */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-500 animate-[bounce_3s_infinite] shadow-[0_0_12px_rgba(124,111,232,0.8)]" />
            </div>

            {/* Camera Switcher Button */}
            <button
              type="button"
              onClick={handleToggleCamera}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                isCameraActive
                  ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                  : 'bg-purple-50 border-purple-100 text-[#7C6FE8] hover:bg-purple-100'
              }`}
            >
              {isCameraActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
              <span>{isCameraActive ? 'Tắt Camera Quét' : 'Bật Camera Quét Mã'}</span>
            </button>

            {/* Input Form */}
            <form onSubmit={handleScanSubmit} className="w-full flex flex-col gap-3">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  ref={inputRef}
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder="Nhập mã đơn vé (VD: CND-892401)"
                  disabled={isScanning}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-mono font-extrabold text-slate-900 uppercase focus:outline-none focus:border-[#7C6FE8] focus:bg-white transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isScanning || !scanInput.trim()}
                className="w-full py-3 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#7C6FE8]/30 cursor-pointer disabled:opacity-50 transition-all active:scale-98"
              >
                {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isLookingUp ? 'ĐANG TRA CỨU VÉ...' : 'TRA CỨU & QUÉT VÉ'}</span>
              </button>
            </form>

            <div className="p-3 rounded-2xl bg-slate-50 border border-gray-200/80 text-[11px] text-slate-500 flex items-center gap-2 text-left">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Hệ thống tự động kiểm tra trạng thái thanh toán và ngăn ngừa gian lận quét trùng vé.</span>
            </div>
          </div>
        </div>

        {/* Right Side: Scan Results & Ticket Details (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {lastScannedResult ? (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-3">
              {/* Result Status Alert Banner */}
              <div
                className={`p-5 rounded-3xl border flex items-center gap-3.5 shadow-sm ${
                  lastScannedResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                {lastScannedResult.success ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
                )}
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm sm:text-base leading-tight">
                    {lastScannedResult.message}
                  </span>
                  {lastScannedResult.ticket && (
                    <span className="text-xs font-mono font-bold text-slate-600 mt-0.5">
                      Mã đơn vé: {lastScannedResult.ticket.bookingCode} • Soát lúc: {lastScannedResult.ticket.checkedInAt}
                    </span>
                  )}
                </div>
              </div>

              {/* Verified Ticket Card */}
              {lastScannedResult.success && lastScannedResult.ticket && (
                <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col gap-5">
                  {/* Movie Info Header */}
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                    {lastScannedResult.ticket.moviePoster ? (
                      <img
                        src={lastScannedResult.ticket.moviePoster}
                        alt={lastScannedResult.ticket.movieTitle}
                        className="w-20 h-28 object-cover rounded-2xl shadow-md border border-gray-100 shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-28 rounded-2xl bg-purple-50 flex items-center justify-center text-[#7C6FE8] shrink-0 border border-purple-100">
                        <Film className="w-8 h-8" />
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-[#7C6FE8] font-black text-[10px] uppercase">
                          {lastScannedResult.ticket.ageRating || 'P'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-extrabold text-[10px]">
                          {lastScannedResult.ticket.roomType}
                        </span>
                        {lastScannedResult.ticket.durationMinutes > 0 && (
                          <span className="text-[11px] text-slate-400 font-bold">
                            {lastScannedResult.ticket.durationMinutes} phút
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                        {lastScannedResult.ticket.movieTitle}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
                        <span>
                          {lastScannedResult.ticket.cinemaName} • <strong>{lastScannedResult.ticket.roomName}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Showtime & Seat Positions Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200/80 flex flex-col gap-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#7C6FE8]" />
                        <span>Suất Chiếu</span>
                      </span>
                      <span className="font-extrabold text-sm text-slate-900">
                        {lastScannedResult.ticket.showtimeFormatted}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex flex-col gap-1">
                      <span className="text-[10px] font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1">
                        <Ticket className="w-3.5 h-3.5 text-[#7C6FE8]" />
                        <span>Vị Trí Ghế ({lastScannedResult.ticket.seats.length} vé)</span>
                      </span>
                      <span className="font-black text-sm text-[#7C6FE8]">
                        {lastScannedResult.ticket.seatsFormatted}
                      </span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200/80 flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-700 font-bold">
                        <User className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-900">
                          {lastScannedResult.ticket.customerName}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {lastScannedResult.ticket.customerPhone || lastScannedResult.ticket.customerEmail || 'Khách vãng lai'}
                        </span>
                      </div>
                    </div>

                    {lastScannedResult.ticket.finalAmount > 0 && (
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Tổng tiền</span>
                        <span className="font-black text-slate-900 text-sm">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                            lastScannedResult.ticket.finalAmount
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Customer Entry Check-in Action Box */}
                  {!lastScannedResult.ticket.isCheckedIn ? (
                    <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#7C6FE8] text-white flex items-center justify-center shadow-md shrink-0">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                            Khách Hàng Đang Chờ Tại Cổng Rạp
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Kiểm tra đúng thông tin vé rồi bấm xác nhận để khách vào phòng chiếu.
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleConfirmCustomerEntered}
                        disabled={isCheckingIn}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 cursor-pointer disabled:opacity-50 transition-all active:scale-98 shrink-0"
                      >
                        {isCheckingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>XÁC NHẬN KHÁCH ĐÃ VÀO</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-extrabold text-xs sm:text-sm text-emerald-950">
                            KHÁCH ĐÃ VÀO PHÒNG CHIẾU
                          </span>
                          <span className="text-[11px] text-emerald-700 font-medium">
                            Thời gian soát vé: {lastScannedResult.ticket.checkedInAt}
                          </span>
                        </div>
                      </div>

                      <span className="px-3.5 py-1.5 rounded-full bg-emerald-200 text-emerald-900 text-xs font-black uppercase tracking-wider shrink-0">
                        ĐÃ SOÁT VÉ
                      </span>
                    </div>
                  )}

                  {/* F&B Combos & Claim Section */}
                  {lastScannedResult.ticket.combos.length > 0 && (
                    <div className="flex flex-col gap-2.5 pt-2 border-t border-gray-100">
                      <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Coffee className="w-4 h-4 text-[#7C6FE8]" />
                        <span>Combo Bắp Nước Đi Kèm ({lastScannedResult.ticket.combos.length})</span>
                      </span>

                      <div className="flex flex-col gap-2">
                        {lastScannedResult.ticket.combos.map((combo) => (
                          <div
                            key={combo.id}
                            className="p-3.5 rounded-2xl bg-slate-50 border border-gray-200 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs">
                                x{combo.quantity}
                              </div>
                              <span className="font-extrabold text-xs text-slate-900">{combo.name}</span>
                            </div>

                            {combo.isClaimed ? (
                              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>ĐÃ TRẢ BẮP NƯỚC</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleClaimFnb(combo.id)}
                                disabled={isClaimingFnb}
                                className="px-3.5 py-1.5 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                              >
                                {isClaimingFnb ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                <span>XÁC NHẬN TRẢ BẮP NƯỚC</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Idle Placeholder */
            <div className="p-12 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-3 text-center text-slate-400">
              <div className="w-16 h-16 rounded-3xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
                <Ticket className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-slate-800 text-base">Chưa Có Vé Được Quét</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Hãy nhập mã đơn vé vào ô bên trái hoặc hướng máy quét vào mã QR để bắt đầu kiểm duyệt vé.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Live Recent Scans Audit Feed */}
      <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#7C6FE8]" />
            <h3 className="font-extrabold text-base text-slate-900">Lịch Sử Soát Vé Gần Nhất</h3>
            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[#7C6FE8] text-xs font-extrabold">
              {recentScans.length} vé
            </span>
          </div>

          <button
            type="button"
            onClick={() => refetchRecent()}
            disabled={isLoadingRecent}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            title="Làm mới lịch sử"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingRecent ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {recentScans.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 font-medium">
            Chưa có vé nào được soát trong ca làm việc này.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-slate-400 font-extrabold uppercase text-[10px]">
                  <th className="pb-3">Mã Vé</th>
                  <th className="pb-3">Bộ Phim</th>
                  <th className="pb-3">Phòng & Rạp</th>
                  <th className="pb-3">Vị Trí Ghế</th>
                  <th className="pb-3">Khách Hàng</th>
                  <th className="pb-3 text-right">Thời Gian Soát</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentScans.map((scan) => (
                  <tr key={scan.bookingId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-mono font-extrabold text-slate-900">{scan.bookingCode}</td>
                    <td className="py-3 font-bold text-slate-800 line-clamp-1 max-w-[200px]">{scan.movieTitle}</td>
                    <td className="py-3 text-slate-500 font-medium">
                      {scan.roomName} • {scan.cinemaName}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#7C6FE8] font-black text-[11px]">
                        {scan.seats}
                      </span>
                    </td>
                    <td className="py-3 text-slate-700 font-medium">{scan.customerName}</td>
                    <td className="py-3 text-right font-mono text-slate-500 text-[11px]">
                      {scan.checkedInAtFormatted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
