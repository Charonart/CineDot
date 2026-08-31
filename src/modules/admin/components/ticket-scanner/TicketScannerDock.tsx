'use client';

import React, { useRef, useEffect } from 'react';
import {
  QrCode,
  Search,
  Loader2,
  Sparkles,
  ShieldCheck,
  X,
  Keyboard,
  Camera,
  CameraOff,
  CornerDownLeft,
  ScanLine,
} from 'lucide-react';

interface TicketScannerDockProps {
  scanInput: string;
  setScanInput: (val: string) => void;
  onSubmitScan: (e?: React.FormEvent) => void;
  isScanning: boolean;
  isLookingUp: boolean;
  isCheckingIn: boolean;

  isCameraActive: boolean;
  onToggleCamera: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;

  isAutoCheckIn: boolean;
  lastScanStatus?: 'idle' | 'success' | 'error';
}

export function TicketScannerDock({
  scanInput,
  setScanInput,
  onSubmitScan,
  isScanning,
  isLookingUp,
  isCheckingIn,
  isCameraActive,
  onToggleCamera,
  videoRef,
  isAutoCheckIn,
  lastScanStatus = 'idle',
}: TicketScannerDockProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input on mount and whenever scanning finishes
  useEffect(() => {
    inputRef.current?.focus();
  }, [isScanning]);

  const handleClear = () => {
    setScanInput('');
    inputRef.current?.focus();
  };

  return (
    <div className="p-4 bg-white border-r border-gray-200/90 flex flex-col gap-4 h-full font-sans select-none">
      {/* 1. Header & Scanner Status */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-bold shadow-2xs">
            <ScanLine className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Đầu Đọc Mã QR & Barcode
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">Hỗ trợ máy bắn mã vạch & Camera</span>
          </div>
        </div>

        {/* Live Status Beacon */}
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border ${
            isScanning
              ? 'bg-purple-50 text-[#7C6FE8] border-purple-200'
              : lastScanStatus === 'success'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : lastScanStatus === 'error'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-slate-50 text-slate-600 border-slate-200'
          }`}
        >
          {isScanning ? (
            <>
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
              <span>Đang xử lý</span>
            </>
          ) : lastScanStatus === 'success' ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Hợp lệ</span>
            </>
          ) : lastScanStatus === 'error' ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Lỗi mã</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Sẵn sàng</span>
            </>
          )}
        </span>
      </div>

      {/* 2. Barcode/QR Camera Viewfinder (if active) */}
      {isCameraActive ? (
        <div className="flex flex-col gap-2">
          <div className="w-full h-52 rounded-xl bg-slate-950 border border-slate-800 relative flex items-center justify-center overflow-hidden shadow-inner">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-xl"
            />
            {/* Viewfinder Target HUD Corners */}
            <div className="absolute inset-4 pointer-events-none border-2 border-transparent">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#7C6FE8]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#7C6FE8]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#7C6FE8]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#7C6FE8]" />
            </div>

            {/* Laser Line Sweep */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#7C6FE8] to-transparent animate-[bounce_2.5s_infinite] shadow-[0_0_8px_#7C6FE8]" />

            <div className="absolute bottom-2 inset-x-0 text-center">
              <span className="px-2 py-0.5 rounded bg-slate-900/80 text-[10px] font-medium text-slate-300 backdrop-blur-xs">
                Căn chỉnh mã QR vào giữa khung ngắm
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleCamera}
            className="w-full py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <CameraOff className="w-3.5 h-3.5" />
            <span>Tắt Camera</span>
          </button>
        </div>
      ) : (
        /* Standby Laser Hub Graphic */
        <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center gap-2 text-center relative overflow-hidden border border-slate-800 shadow-inner group">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-[#7C6FE8] group-hover:scale-105 transition-transform">
            <QrCode className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-tight text-slate-200">
              Máy Bắn Mã Hoặc Nhập Tay
            </span>
            <span className="text-[10px] text-slate-400">
              Đặt con trỏ vào ô nhập và bấm máy quét
            </span>
          </div>

          {/* Laser Line */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#7C6FE8]/80 to-transparent" />

          <button
            type="button"
            onClick={onToggleCamera}
            className="mt-1 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Camera className="w-3 h-3 text-[#7C6FE8]" />
            <span>Kích hoạt Camera</span>
          </button>
        </div>
      )}

      {/* 3. High Visibility Barcode Input Form */}
      <form onSubmit={onSubmitScan} className="flex flex-col gap-2">
        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
          <span>Mã Vé / Chuỗi QR Code</span>
          <span className="text-slate-400 font-normal font-mono text-[10px]">Tự động bắt tiêu điểm</span>
        </label>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            placeholder="Nhập hoặc quét mã vé (VD: CND-892401)"
            disabled={isScanning}
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-slate-50 border border-gray-200 text-xs font-mono font-bold text-slate-900 uppercase focus:outline-none focus:border-[#7C6FE8] focus:bg-white transition-all shadow-2xs placeholder:normal-case placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
          />

          {scanInput && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              title="Xóa trắng [Esc]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isScanning || !scanInput.trim()}
          className={`w-full py-2 rounded-lg text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99] ${
            isAutoCheckIn
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
              : 'bg-[#7C6FE8] hover:bg-[#6b5edb] shadow-[#7C6FE8]/20'
          }`}
        >
          {isScanning ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>
            {isCheckingIn
              ? 'Đang Xác Nhận Soát...'
              : isLookingUp
              ? 'Đang Tra Cứu...'
              : isAutoCheckIn
              ? 'Soát & Check-In Ngay'
              : 'Tra Cứu Thông Tin Vé'}
          </span>
          <CornerDownLeft className="w-3 h-3 opacity-60 ml-0.5" />
        </button>
      </form>

      {/* 4. Keyboard Shortcut Legend Helper */}
      <div className="p-3 rounded-lg bg-slate-50/80 border border-gray-200/80 flex flex-col gap-1.5 text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[10px] uppercase tracking-wider">
          <Keyboard className="w-3.5 h-3.5 text-slate-400" />
          <span>Phím Tắt Thao Tác Nhanh</span>
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-600">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-mono font-bold text-slate-700 shadow-2xs">
              Enter
            </kbd>
            <span>Quét / Tra cứu</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-mono font-bold text-slate-700 shadow-2xs">
              Space
            </kbd>
            <span>Vào phòng</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-mono font-bold text-slate-700 shadow-2xs">
              Esc
            </kbd>
            <span>Xóa ô nhập</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-mono font-bold text-slate-700 shadow-2xs">
              C
            </kbd>
            <span>Bật/Tắt Cam</span>
          </div>
        </div>
      </div>

      {/* 5. Anti-fraud Assurance Banner */}
      <div className="mt-auto p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-[10px] text-emerald-900 flex items-start gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
        <span className="leading-tight">
          Hệ thống bảo mật CineDot tự động đối soát thanh toán và khóa chặn vé đã quét trùng lặp.
        </span>
      </div>
    </div>
  );
}
