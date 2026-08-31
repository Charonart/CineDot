'use client';

/* Hallmark · genre: modern-minimal · macrostructure: Workbench · theme: White Minimal Admin · designed-as-app */
/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { useAdminTicketScanner } from '../hooks/useAdminTicketScanner';
import { adminShowtimeService } from '../services/adminShowtime.service';
import { ScannedTicketDetail } from '../types/adminTicketScanner.types';
import { scannerAudio } from '../utils/scannerAudio';
import {
  TicketScannerToolbar,
  TicketScannerDock,
  TicketScannerResultCard,
  TicketScannerHistoryTable,
} from './ticket-scanner';

export function AdminTicketScannerView() {
  const [scanInput, setScanInput] = useState('');
  const [lastScannedResult, setLastScannedResult] = useState<{
    success: boolean;
    message: string;
    ticket?: ScannedTicketDetail;
  } | null>(null);
  const [lastScanStatus, setLastScanStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Operational Settings (Persisted in localStorage)
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | undefined>(undefined);
  const [isAutoCheckIn, setIsAutoCheckIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cinedot_scanner_auto_checkin') === 'true';
    }
    return false;
  });
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cinedot_scanner_audio');
      return stored !== null ? stored === 'true' : true;
    }
    return true;
  });

  // Batch Claim state
  const [isBatchClaimingFnb, setIsBatchClaimingFnb] = useState(false);

  // Camera Scanner Mode State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Toast Notification State
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sync Audio Setting with Sound Synthesizer
  useEffect(() => {
    scannerAudio.setEnabled(isAudioEnabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cinedot_scanner_audio', String(isAudioEnabled));
    }
  }, [isAudioEnabled]);

  // Sync Auto Check-in Setting to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cinedot_scanner_auto_checkin', String(isAutoCheckIn));
    }
  }, [isAutoCheckIn]);

  // Fetch Cinema Branches for toolbar selector
  const { data: cinemas = [], isLoading: isLoadingCinemas } = useQuery({
    queryKey: ['admin', 'showtimes', 'cinemas'],
    queryFn: () => adminShowtimeService.getCinemas(),
    staleTime: 10 * 60 * 1000,
  });

  // Auto-select first cinema once loaded
  useEffect(() => {
    if (!selectedCinemaId && cinemas.length > 0) {
      setSelectedCinemaId(cinemas[0].id);
    }
  }, [cinemas, selectedCinemaId]);

  // 100% Real API Hook
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

  // Helper to show floating toast
  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => {
      setToastMsg((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  }, []);

  // Camera cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Toggle Camera Viewfinder
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
        setIsCameraActive(true);
        // Small delay to ensure video element is attached
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
        }, 100);
      } catch {
        showToast('Không thể kích hoạt Camera hoặc chưa cấp quyền truy cập.', 'error');
        setIsCameraActive(false);
      }
    }
  };

  // Handle Scan / Lookup Submission (Handles both Auto-CheckIn and Lookup-Only modes)
  const handleScanSubmit = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = (customQuery !== undefined ? customQuery : scanInput).trim();
    if (!query) return;

    try {
      if (isAutoCheckIn) {
        // Mode 1: Auto Check-In Mode (Fast 1-touch pass)
        const checkedInTicket = await checkInTicket(query);
        setLastScannedResult({
          success: true,
          message: 'SOÁT VÉ THÀNH CÔNG! ĐÃ XÁC NHẬN KHÁCH VÀO PHÒNG CHIẾU.',
          ticket: checkedInTicket,
        });
        setLastScanStatus('success');
        scannerAudio.playCheckInSuccess();
        showToast(`Đã soát vé ${checkedInTicket.bookingCode} thành công!`, 'success');
      } else {
        // Mode 2: Lookup & Verify First Mode
        const ticketDetail = await lookupTicket(query);
        const isAlreadyIn = ticketDetail.isCheckedIn;
        setLastScannedResult({
          success: true,
          message: isAlreadyIn
            ? `Vé này đã được soát trước đó vào lúc ${ticketDetail.checkedInAt}.`
            : 'VÉ HỢP LỆ! SẴN SÀNG XÁC NHẬN KHÁCH VÀO PHÒNG.',
          ticket: ticketDetail,
        });
        setLastScanStatus('success');
        scannerAudio.playScanSuccess();
      }

      setScanInput('');
    } catch (err: unknown) {
      const errObj = err as { message?: string; response?: { data?: { message?: string } } };
      const errorMessage =
        errObj?.response?.data?.message ||
        errObj?.message ||
        'MÃ VÉ KHÔNG HỢP LỆ HOẶC KHÔNG TỒN TẠI TRONG HỆ THỐNG!';

      setLastScannedResult({
        success: false,
        message: errorMessage,
      });
      setLastScanStatus('error');
      scannerAudio.playScanError();
      showToast(errorMessage, 'error');
    }
  };

  // Handle Manual Confirm Customer Entry (Check-In)
  const handleConfirmCustomerEntered = async () => {
    if (!lastScannedResult?.ticket || isCheckingIn) return;

    try {
      const updatedTicket = await checkInTicket(lastScannedResult.ticket.bookingCode);
      setLastScannedResult({
        success: true,
        message: 'ĐÃ SOÁT VÉ THÀNH CÔNG! KHÁCH ĐÃ VÀO PHÒNG CHIẾU.',
        ticket: updatedTicket,
      });
      setLastScanStatus('success');
      scannerAudio.playCheckInSuccess();
      showToast(`Đã xác nhận khách vào phòng chiếu (${updatedTicket.bookingCode})!`, 'success');
    } catch (err: unknown) {
      const errObj = err as { message?: string; response?: { data?: { message?: string } } };
      const errorMessage =
        errObj?.response?.data?.message || errObj?.message || 'Không thể xác nhận vào phòng.';
      scannerAudio.playScanError();
      showToast(errorMessage, 'error');
    }
  };

  // Handle Single F&B Combo Claim
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
      scannerAudio.playClaimCombo();
      showToast('Đã xác nhận trả Combo bắp nước thành công!', 'success');
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      showToast(errObj?.message || 'Không thể xác nhận trả Combo bắp nước.', 'error');
    }
  };

  // Handle Batch Claim All F&B Combos
  const handleBatchClaimAllFnb = async () => {
    if (!lastScannedResult?.ticket) return;
    const unclaimedCombos = lastScannedResult.ticket.combos.filter((c) => !c.isClaimed);
    if (unclaimedCombos.length === 0) return;

    setIsBatchClaimingFnb(true);
    try {
      for (const combo of unclaimedCombos) {
        await claimFnb(combo.id);
      }

      const allClaimed = lastScannedResult.ticket.combos.map((c) => ({
        ...c,
        isClaimed: true,
      }));

      setLastScannedResult({
        ...lastScannedResult,
        ticket: {
          ...lastScannedResult.ticket,
          combos: allClaimed,
        },
      });

      scannerAudio.playClaimCombo();
      showToast(`Đã trả tất cả ${unclaimedCombos.length} Combo bắp nước!`, 'success');
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      showToast(errObj?.message || 'Lỗi khi trả combo bắp nước.', 'error');
    } finally {
      setIsBatchClaimingFnb(false);
    }
  };

  // Handle Re-inspecting a Past Scan from History Table
  const handleSelectPastScan = (bookingCode: string) => {
    setScanInput(bookingCode);
    handleScanSubmit(undefined, bookingCode);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInputFocused = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      // Space: Confirm Check-In if a valid unchecked ticket is currently loaded
      if (e.code === 'Space' && !isInputFocused) {
        if (lastScannedResult?.ticket && !lastScannedResult.ticket.isCheckedIn && !isCheckingIn) {
          e.preventDefault();
          handleConfirmCustomerEntered();
        }
      }

      // Escape: Clear scan input & reset focus
      if (e.key === 'Escape') {
        setScanInput('');
      }

      // Shortcuts when NOT focused inside an input field
      if (!isInputFocused) {
        if (e.key === 'c' || e.key === 'C') {
          e.preventDefault();
          handleToggleCamera();
        } else if (e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          setIsAutoCheckIn((prev) => {
            const next = !prev;
            showToast(`Chế độ Soát Nhanh: ${next ? 'ĐANG BẬT' : 'ĐANG TẮT'}`, 'info');
            return next;
          });
        } else if (e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          setIsAudioEnabled((prev) => {
            const next = !prev;
            showToast(`Âm thanh phản hồi: ${next ? 'ĐANG BẬT' : 'ĐANG TẮT'}`, 'info');
            return next;
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastScannedResult, isCheckingIn, showToast]);

  // Compute shift statistics
  const shiftStats = useMemo(() => {
    const total = recentScans.length;
    const pendingCombos = recentScans.reduce((sum, item) => sum + (item.combosCount || 0), 0);
    return { total, pendingCombos };
  }, [recentScans]);

  return (
    <div className="flex flex-col font-sans text-slate-900 select-none bg-white rounded-xl border border-gray-200/90 shadow-2xs overflow-hidden">
      {/* 0. Floating Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-2.5 rounded-lg text-white font-medium text-xs shadow-xl flex items-center gap-2 border animate-in fade-in slide-in-from-top-2 ${
            toastMsg.type === 'error'
              ? 'bg-rose-900 border-rose-800'
              : toastMsg.type === 'info'
              ? 'bg-slate-900 border-slate-800'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          {toastMsg.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMsg.text}</span>
          <button
            onClick={() => setToastMsg(null)}
            className="p-0.5 rounded hover:bg-slate-800 text-slate-400 ml-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Studio Top Command Strip (Showtimes Toolbar Style) */}
      <TicketScannerToolbar
        cinemas={cinemas}
        isLoadingCinemas={isLoadingCinemas}
        selectedCinemaId={selectedCinemaId}
        onSelectCinema={(id) => setSelectedCinemaId(id)}
        isAutoCheckIn={isAutoCheckIn}
        onToggleAutoCheckIn={() => setIsAutoCheckIn((prev) => !prev)}
        isAudioEnabled={isAudioEnabled}
        onToggleAudio={() => setIsAudioEnabled((prev) => !prev)}
        isCameraActive={isCameraActive}
        onToggleCamera={handleToggleCamera}
        totalScannedCount={shiftStats.total}
        pendingCombosCount={shiftStats.pendingCombos}
        isLoadingRecent={isLoadingRecent}
        onRefresh={() => refetchRecent()}
      />

      {/* 2. Main Studio Split Workspace (Left Dock 320px + Right Result Canvas) */}
      <div className="flex flex-col lg:flex-row min-h-[460px]">
        {/* Left Side: Scanner Dock & Camera Viewport */}
        <div className="w-full lg:w-80 shrink-0">
          <TicketScannerDock
            scanInput={scanInput}
            setScanInput={setScanInput}
            onSubmitScan={handleScanSubmit}
            isScanning={isScanning}
            isLookingUp={isLookingUp}
            isCheckingIn={isCheckingIn}
            isCameraActive={isCameraActive}
            onToggleCamera={handleToggleCamera}
            videoRef={videoRef}
            isAutoCheckIn={isAutoCheckIn}
            lastScanStatus={lastScanStatus}
          />
        </div>

        {/* Right Side: Active Ticket Boarding Pass Result Card */}
        <div className="flex-1 min-w-0 bg-slate-50/30">
          <TicketScannerResultCard
            lastScannedResult={lastScannedResult}
            onConfirmCheckIn={handleConfirmCustomerEntered}
            isCheckingIn={isCheckingIn}
            onClaimFnb={handleClaimFnb}
            isClaimingFnb={isClaimingFnb}
            onBatchClaimAllFnb={handleBatchClaimAllFnb}
            isBatchClaimingFnb={isBatchClaimingFnb}
          />
        </div>
      </div>

      {/* 3. Live Recent Scans Audit Feed */}
      <TicketScannerHistoryTable
        recentScans={recentScans}
        isLoadingRecent={isLoadingRecent}
        onRefresh={() => refetchRecent()}
        onSelectScan={handleSelectPastScan}
      />
    </div>
  );
}
