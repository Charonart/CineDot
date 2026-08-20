'use client';

import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Heart,
  Wrench,
  Info,
  RefreshCw,
  Plus,
  Trash2,
  Copy,
  Grid,
  Sliders,
  Check,
  X,
  Layers,
  ArrowDown,
  Undo2,
  Redo2,
  Keyboard,
} from 'lucide-react';
import { AdminSeatItem, SeatType } from '../../types/adminCinema.types';
import { adminCinemaMapper } from '../../mappers/adminCinema.mapper';
import { useAdminSeatTypes } from '../../hooks/useAdminSeatTypes';
import { renderSeatIcon } from '../cinemas/SeatTypesStudioModal';

interface AdminSeatCanvasEditorProps {
  seats: AdminSeatItem[];
  roomFormat?: string;
  roomName?: string;
  onChangeSeats: (updatedSeats: AdminSeatItem[]) => void;
  onResetToDefaultLayout?: () => void;
}

const SEAT_SIZE = 30;
const SEAT_GAP = 35; // Khoảng cách chuẩn giữa 2 tâm ghế liền kề

export const AdminSeatCanvasEditor: React.FC<AdminSeatCanvasEditorProps> = ({
  seats,
  roomFormat = 'IMAX 3D Laser',
  roomName,
  onChangeSeats,
  onResetToDefaultLayout,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const { seatTypes = [] } = useAdminSeatTypes();

  // -------------------------------------------------------------
  // UNDO / REDO HISTORY STACK
  // -------------------------------------------------------------
  const historyRef = useRef<AdminSeatItem[][]>([seats]);
  const historyIndexRef = useRef<number>(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const pushHistoryState = useCallback((newSeats: AdminSeatItem[]) => {
    const currentHist = historyRef.current.slice(0, historyIndexRef.current + 1);
    currentHist.push(newSeats);
    if (currentHist.length > 50) currentHist.shift();
    historyRef.current = currentHist;
    historyIndexRef.current = currentHist.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
    onChangeSeats(newSeats);
  }, [onChangeSeats]);

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const prevState = historyRef.current[historyIndexRef.current];
      onChangeSeats(prevState);
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }
  }, [onChangeSeats]);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const nextState = historyRef.current[historyIndexRef.current];
      onChangeSeats(nextState);
      setCanUndo(true);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }
  }, [onChangeSeats]);

  // -------------------------------------------------------------
  // PAN CANVAS STATE (Kéo chuột ở canvas để di chuyển góc nhìn)
  // -------------------------------------------------------------
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const isSpacePressedRef = useRef(false);
  const panStartRef = useRef<{
    clientX: number;
    clientY: number;
    initialPan: { x: number; y: number };
  } | null>(null);

  // -------------------------------------------------------------
  // MULTI-SELECTION STATE (Hỗ trợ Shift + Click chọn nhiều ghế)
  // -------------------------------------------------------------
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const isMultipleSelected = selectedSeatIds.length > 1;
  const singleSelectedSeat = useMemo(
    () => (selectedSeatIds.length === 1 ? seats.find((s) => s.id === selectedSeatIds[0]) || null : null),
    [seats, selectedSeatIds]
  );
  const selectedSeatsList = useMemo(
    () => seats.filter((s) => selectedSeatIds.includes(s.id)),
    [seats, selectedSeatIds]
  );

  // Grid snap state
  const [snapToGrid, setSnapToGrid] = useState(true);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const dragMovedRef = useRef<boolean>(false);
  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    initialSeats: { id: string; cx: number; cy: number }[];
  } | null>(null);

  // Rotating state
  const [isRotating, setIsRotating] = useState(false);
  const rotateCenterRef = useRef<{ x: number; y: number } | null>(null);

  // Add Row Modal State
  const [isAddRowModalOpen, setIsAddRowModalOpen] = useState(false);
  const [newRowLetter, setNewRowLetter] = useState('I');
  const [newRowSeatsCount, setNewRowSeatsCount] = useState(12);
  const [newRowType, setNewRowType] = useState<SeatType>('REGULAR');

  // All distinct rows in room
  const availableRows = useMemo(() => {
    const rowsSet = new Set(seats.map((s) => s.row));
    return Array.from(rowsSet).sort();
  }, [seats]);

  // Calculate bounding box for canvas viewport
  const { maxX, maxY } = useMemo(() => {
    let mx = 0;
    let my = 0;
    seats.forEach((s) => {
      if (s.cx > mx) mx = s.cx;
      if (s.cy > my) my = s.cy;
    });
    return { maxX: Math.max(mx, 460), maxY: Math.max(my, 340) };
  }, [seats]);

  const mapWidth = maxX + SEAT_SIZE * 3;
  const mapHeight = maxY + SEAT_SIZE * 3;

  // Auto-fit scale on mount and on map dimension change
  useEffect(() => {
    if (containerRef.current && mapWidth > 0) {
      const containerW = containerRef.current.clientWidth;
      const bestScale = Math.min(1, Math.max(0.4, (containerW - 40) / mapWidth));
      setScale(bestScale);
    }
  }, [mapWidth]);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 1.8));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.4));
  const handleResetZoomAndPan = () => {
    setPanOffset({ x: 0, y: 0 });
    if (containerRef.current) {
      const containerW = containerRef.current.clientWidth;
      const bestScale = Math.min(1, Math.max(0.4, (containerW - 40) / mapWidth));
      setScale(bestScale);
    }
  };

  // -------------------------------------------------------------
  // CANVAS BACKGROUND PANNING (Kéo chuột ngoài ghế hoặc giữ Space)
  // -------------------------------------------------------------
  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    const isCanvasBg =
      target === containerRef.current ||
      target.classList.contains('canvas-bg') ||
      target.classList.contains('canvas-grid-area');

    if (isCanvasBg || isSpacePressedRef.current) {
      if (!isSpacePressedRef.current && !e.shiftKey) {
        setSelectedSeatIds([]);
      }
      panStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        initialPan: { ...panOffset },
      };
      setIsPanning(true);
    }
  };

  // -------------------------------------------------------------
  // SEAT CLICK & MULTI-SELECT & DRAGGING
  // -------------------------------------------------------------
  const handleSeatPointerDown = (e: React.PointerEvent, seatId: string) => {
    e.stopPropagation();
    dragMovedRef.current = false;

    let targetIds = selectedSeatIds;

    // Shift + Click: Toggle seat in selection
    if (e.shiftKey) {
      if (selectedSeatIds.includes(seatId)) {
        targetIds = selectedSeatIds.filter((id) => id !== seatId);
      } else {
        targetIds = [...selectedSeatIds, seatId];
      }
      setSelectedSeatIds(targetIds);
    } else {
      // Normal Click without shift
      if (!selectedSeatIds.includes(seatId)) {
        targetIds = [seatId];
        setSelectedSeatIds([seatId]);
      }
    }

    // Prepare dragging for all currently selected seats
    const seatsToDrag = seats.filter((s) => targetIds.includes(s.id));
    if (seatsToDrag.length > 0) {
      dragStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        initialSeats: seatsToDrag.map((s) => ({ id: s.id, cx: s.cx, cy: s.cy })),
      };
      setIsDragging(true);
    }
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      // 1. Pan canvas background
      if (isPanning && panStartRef.current) {
        const deltaX = e.clientX - panStartRef.current.clientX;
        const deltaY = e.clientY - panStartRef.current.clientY;
        setPanOffset({
          x: panStartRef.current.initialPan.x + deltaX,
          y: panStartRef.current.initialPan.y + deltaY,
        });
      }
      // 2. Drag selected seats (Single or Multiple)
      else if (isDragging && dragStartRef.current) {
        const distMoved = Math.hypot(
          e.clientX - dragStartRef.current.clientX,
          e.clientY - dragStartRef.current.clientY
        );
        if (distMoved > 3) {
          dragMovedRef.current = true;
        }

        const deltaX = (e.clientX - dragStartRef.current.clientX) / scale;
        const deltaY = (e.clientY - dragStartRef.current.clientY) / scale;

        const updated = seats.map((seat) => {
          const init = dragStartRef.current?.initialSeats.find((s) => s.id === seat.id);
          if (init) {
            let newCx = Math.max(20, init.cx + deltaX);
            let newCy = Math.max(20, init.cy + deltaY);
            if (snapToGrid) {
              newCx = Math.round(newCx / 5) * 5;
              newCy = Math.round(newCy / 5) * 5;
            }
            return { ...seat, cx: Math.round(newCx), cy: Math.round(newCy) };
          }
          return seat;
        });

        onChangeSeats(updated);
      }
      // 3. Rotate selected seat(s)
      else if (isRotating && rotateCenterRef.current) {
        const { x, y } = rotateCenterRef.current;
        const rad = Math.atan2(e.clientY - y, e.clientX - x);
        let deg = Math.round(rad * (180 / Math.PI)) - 90;

        while (deg > 180) deg -= 360;
        while (deg < -180) deg += 360;
        const clampedDeg = Math.max(-60, Math.min(60, deg));

        const updated = seats.map((seat) => {
          if (selectedSeatIds.includes(seat.id)) {
            return { ...seat, angle: clampedDeg };
          }
          return seat;
        });

        onChangeSeats(updated);
      }
    },
    [isPanning, isDragging, isRotating, scale, snapToGrid, seats, selectedSeatIds, onChangeSeats]
  );

  const handlePointerUp = useCallback(() => {
    if (isDragging && dragMovedRef.current) {
      pushHistoryState(seats);
    }
    if (isRotating) {
      pushHistoryState(seats);
    }
    setIsPanning(false);
    setIsDragging(false);
    setIsRotating(false);
    panStartRef.current = null;
    dragStartRef.current = null;
    rotateCenterRef.current = null;
  }, [isDragging, isRotating, seats, pushHistoryState]);

  useEffect(() => {
    if (isPanning || isDragging || isRotating) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isPanning, isDragging, isRotating, handlePointerMove, handlePointerUp]);

  // -------------------------------------------------------------
  // ROTATION HANDLE DRAG
  // -------------------------------------------------------------
  const handleRotateHandleDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    const seatElem = (e.currentTarget.parentElement as HTMLElement) || e.currentTarget;
    const rect = seatElem.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    rotateCenterRef.current = { x: centerX, y: centerY };
    setIsRotating(true);
  };

  // -------------------------------------------------------------
  // KEYBOARD SHORTCUTS LISTENER
  // -------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') {
        return;
      }

      // Space pan
      if (e.code === 'Space') {
        isSpacePressedRef.current = true;
      }

      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        return;
      }

      // Redo: Ctrl+Y
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Delete / Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedSeatIds.length > 0) {
          e.preventDefault();
          const updated = seats.filter((s) => !selectedSeatIds.includes(s.id));
          setSelectedSeatIds([]);
          pushHistoryState(updated);
        }
        return;
      }

      // Arrow keys (↑, ↓, ←, →): Move selected seats by 5px
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (selectedSeatIds.length > 0) {
          e.preventDefault();
          let dx = 0;
          let dy = 0;
          if (e.key === 'ArrowUp') dy = -5;
          if (e.key === 'ArrowDown') dy = 5;
          if (e.key === 'ArrowLeft') dx = -5;
          if (e.key === 'ArrowRight') dx = 5;

          const updated = seats.map((seat) => {
            if (selectedSeatIds.includes(seat.id)) {
              return {
                ...seat,
                cx: Math.max(0, seat.cx + dx),
                cy: Math.max(0, seat.cy + dy),
              };
            }
            return seat;
          });

          pushHistoryState(updated);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        isSpacePressedRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedSeatIds, seats, handleUndo, handleRedo, pushHistoryState]);

  // -------------------------------------------------------------
  // SEAT PROPERTY MUTATIONS (Inspector Panel)
  // -------------------------------------------------------------
  const handleUpdateSeatType = (type: SeatType) => {
    if (selectedSeatIds.length === 0) return;
    const updated = seats.map((s) => (selectedSeatIds.includes(s.id) ? { ...s, type } : s));
    pushHistoryState(updated);
  };

  const handleUpdateSeatPosition = (field: 'cx' | 'cy', delta: number) => {
    if (selectedSeatIds.length === 0) return;
    const updated = seats.map((s) => {
      if (selectedSeatIds.includes(s.id)) {
        const currentVal = Number(s[field] ?? 0);
        return { ...s, [field]: Math.max(0, currentVal + delta) };
      }
      return s;
    });
    pushHistoryState(updated);
  };

  const handleSetExactPosition = (field: 'cx' | 'cy', val: number) => {
    if (selectedSeatIds.length === 0) return;
    const updated = seats.map((s) => {
      if (selectedSeatIds.includes(s.id)) {
        return { ...s, [field]: Math.max(0, val) };
      }
      return s;
    });
    pushHistoryState(updated);
  };

  const handleSetExactAngle = (angle: number) => {
    if (selectedSeatIds.length === 0) return;
    const updated = seats.map((s) => (selectedSeatIds.includes(s.id) ? { ...s, angle } : s));
    pushHistoryState(updated);
  };

  const handleUpdateSeatLabel = (newRow: string, newNumber: number) => {
    if (selectedSeatIds.length !== 1) return;
    const targetId = selectedSeatIds[0];
    const cleanRow = (newRow || 'A').toUpperCase().trim().slice(0, 2);
    const cleanNum = Math.max(1, newNumber || 1);
    const newId = `${cleanRow}${cleanNum < 10 ? '0' + cleanNum : cleanNum}`;

    const updated = seats.map((s) => {
      if (s.id === targetId) {
        return { ...s, id: newId, row: cleanRow, number: cleanNum };
      }
      return s;
    });

    setSelectedSeatIds([newId]);
    pushHistoryState(updated);
  };

  const handleDeleteSelectedSeats = () => {
    if (selectedSeatIds.length === 0) return;
    const updated = seats.filter((s) => !selectedSeatIds.includes(s.id));
    setSelectedSeatIds([]);
    pushHistoryState(updated);
  };

  const handleDuplicateSelectedSeats = () => {
    if (selectedSeatIds.length === 0) return;
    const newAdded: AdminSeatItem[] = [];

    selectedSeatsList.forEach((s) => {
      const nextNumber = s.number + 1;
      const newId = `${s.row}${nextNumber < 10 ? '0' + nextNumber : nextNumber}_copy_${Date.now().toString().slice(-4)}`;
      newAdded.push({
        ...s,
        id: newId,
        cx: s.cx + SEAT_GAP,
        cy: s.cy,
      });
    });

    const updated = [...seats, ...newAdded];
    setSelectedSeatIds(newAdded.map((s) => s.id));
    pushHistoryState(updated);
  };

  // -------------------------------------------------------------
  // ADD DELIBERATE ROW STUDIO TOOL
  // -------------------------------------------------------------
  const handleOpenAddRowModal = () => {
    const lastRow = availableRows[availableRows.length - 1] || 'H';
    const nextCharCode = lastRow.charCodeAt(0) + 1;
    const nextLetter = String.fromCharCode(nextCharCode <= 90 ? nextCharCode : 65);
    setNewRowLetter(nextLetter);
    setNewRowSeatsCount(12);
    setNewRowType('REGULAR');
    setIsAddRowModalOpen(true);
  };

  const handleConfirmAddRow = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRow = (newRowLetter || 'A').toUpperCase().trim().slice(0, 2);
    const count = Math.max(1, Math.min(30, newRowSeatsCount || 12));

    const newRowY = maxY > 40 ? maxY + 45 : 40;
    const startX = 40;

    const newRowSeats: AdminSeatItem[] = [];
    for (let c = 1; c <= count; c++) {
      const seatId = `${cleanRow}${c < 10 ? '0' + c : c}`;
      newRowSeats.push({
        id: seatId,
        row: cleanRow,
        number: c,
        type: newRowType,
        cx: startX + (c - 1) * SEAT_GAP,
        cy: newRowY,
        angle: 0,
      });
    }

    const updated = [...seats, ...newRowSeats];
    pushHistoryState(updated);
    setIsAddRowModalOpen(false);
  };

  const handleDeleteRow = (rowLetter: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa toàn bộ ghế trong Hàng ${rowLetter}?`)) {
      const updated = seats.filter((s) => s.row !== rowLetter);
      setSelectedSeatIds((prev) => prev.filter((id) => !id.startsWith(rowLetter)));
      pushHistoryState(updated);
    }
  };

  // -------------------------------------------------------------
  // ROW TOOLS (Uốn cong cánh quạt & Căn thẳng hàng)
  // -------------------------------------------------------------
  const handleCurveRow = (rowLetter: string) => {
    const rowSeats = seats.filter((s) => s.row === rowLetter).sort((a, b) => a.number - b.number);
    if (rowSeats.length === 0) return;

    const count = rowSeats.length;
    const midIndex = (count - 1) / 2;
    const avgY = rowSeats.reduce((acc, s) => acc + s.cy, 0) / count;
    const avgX = rowSeats.reduce((acc, s) => acc + s.cx, 0) / count;
    const startX = avgX - midIndex * SEAT_GAP;

    const updatedSeats = seats.map((seat) => {
      if (seat.row === rowLetter) {
        const idx = rowSeats.findIndex((s) => s.id === seat.id);
        const distFromCenter = idx - midIndex;
        const angle = Math.round(distFromCenter * 3.5);
        const arcY = avgY + Math.abs(distFromCenter) * 2;
        const arcX = startX + idx * SEAT_GAP;

        return {
          ...seat,
          cx: Math.round(arcX),
          cy: Math.round(arcY),
          angle: Math.max(-45, Math.min(45, angle)),
        };
      }
      return seat;
    });

    pushHistoryState(updatedSeats);
  };

  const handleAlignRowStraight = (rowLetter: string) => {
    const rowSeats = seats.filter((s) => s.row === rowLetter).sort((a, b) => a.number - b.number);
    if (rowSeats.length === 0) return;

    const avgY = Math.round(rowSeats.reduce((acc, s) => acc + s.cy, 0) / rowSeats.length);
    const minX = Math.min(...rowSeats.map((s) => s.cx));

    const updatedSeats = seats.map((seat) => {
      if (seat.row === rowLetter) {
        const idx = rowSeats.findIndex((s) => s.id === seat.id);
        return {
          ...seat,
          cx: minX + idx * SEAT_GAP,
          cy: avgY,
          angle: 0,
        };
      }
      return seat;
    });

    pushHistoryState(updatedSeats);
  };

  const handleResetMatrix = () => {
    if (confirm('Bạn có chắc chắn muốn đặt lại sơ đồ ghế về ma trận tiêu chuẩn (8 hàng x 12 cột)? Toàn bộ tọa độ cũ sẽ được làm mới.')) {
      setSelectedSeatIds([]);
      const freshSeats = adminCinemaMapper.generateDefaultSeats();
      pushHistoryState(freshSeats);
    }
  };

  // Seat statistics
  const regularCount = seats.filter((s) => s.type === 'REGULAR').length;
  const vipCount = seats.filter((s) => s.type === 'VIP').length;
  const sweetboxCount = seats.filter((s) => s.type === 'SWEETBOX').length;
  const maintenanceCount = seats.filter((s) => s.type === 'MAINTENANCE').length;

  return (
    <div className="w-full flex flex-col gap-4 font-sans select-none">
      {/* 1. Studio Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-gray-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Undo / Redo buttons */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              title="Hoàn tác (Ctrl + Z)"
              className="p-1.5 rounded-lg bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-600 hover:text-[#7C6FE8] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={!canRedo}
              title="Làm lại (Ctrl + Y)"
              className="p-1.5 rounded-lg bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-600 hover:text-[#7C6FE8] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenAddRowModal}
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C6FE8] font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-purple-100"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Hàng Ghế Mới</span>
          </button>

          <button
            type="button"
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              snapToGrid
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-50 text-slate-500 border-gray-200 hover:bg-slate-100'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Hít Lưới (Snap 5px): {snapToGrid ? 'BẬT' : 'TẮT'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetMatrix}
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-gray-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Đặt Lại Ma Trận Chuẩn</span>
          </button>
        </div>

        {/* Zoom & Pan Controls */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-gray-200">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Phóng to"
            className="p-1.5 rounded-lg bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-600 hover:text-[#7C6FE8] transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetZoomAndPan}
            title="Căn giữa & vừa màn hình"
            className="p-1.5 rounded-lg bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-600 hover:text-[#7C6FE8] transition-colors cursor-pointer"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Thu nhỏ"
            className="p-1.5 rounded-lg bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-600 hover:text-[#7C6FE8] transition-colors cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-bold text-slate-500 px-2">{Math.round(scale * 100)}%</span>
        </div>
      </div>

      {/* 2. Main Workspace (Canvas on Left / Inspector on Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left Side: Interactive Canvas Workspace (8 Cols) */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          <div
            ref={containerRef}
            onPointerDown={handleCanvasPointerDown}
            className={`canvas-bg w-full h-[540px] overflow-hidden bg-[#F9F9FB] rounded-3xl border border-dashed border-gray-300 flex flex-col items-center relative shadow-inner p-6 select-none ${
              isPanning ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {/* Dotted Grid & Curved Screen LED Arc Workspace */}
            <div
              className="canvas-grid-area relative transition-transform duration-75 ease-out origin-top select-none"
              style={{
                width: mapWidth,
                height: mapHeight,
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
              }}
            >
              {/* Curved Screen LED Arc */}
              <div className="w-full flex flex-col items-center gap-1.5 pt-1 pb-6 pointer-events-none">
                <div className="relative w-full max-w-lg h-10 flex flex-col items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#7C6FE8]/25 via-transparent to-transparent blur-xl rounded-t-[100px]" />
                  <div className="w-full h-3 border-t-4 border-[#7C6FE8] rounded-[100%] shadow-[0_-8px_24px_rgba(124,111,232,0.6)]" />
                  <span className="text-[10px] font-black text-slate-400 tracking-[0.25em] uppercase -mt-0.5">
                    MÀN HÌNH CHẾU ({roomFormat.toUpperCase()})
                  </span>
                </div>
              </div>

              {/* Render all seats */}
              {seats.map((seat) => {
                const isSelected = selectedSeatIds.includes(seat.id);
                const normType = (seat.type || 'standard').toLowerCase();
                const isMaintenance = normType === 'maintenance' || normType === 'blocked';
                const matchedType = seatTypes.find(
                  (st) =>
                    st.key.toLowerCase() === normType ||
                    (normType === 'regular' && st.key.toLowerCase() === 'standard')
                );

                const isCoupleLike =
                  normType === 'couple' ||
                  normType === 'sweetbox' ||
                  normType === 'bed' ||
                  matchedType?.icon === 'heart' ||
                  matchedType?.icon === 'bed';

                let seatBg = matchedType ? matchedType.color : '#64748B';

                if (isMaintenance) {
                  seatBg = '#EF4444';
                }

                return (
                  <div
                    key={seat.id}
                    onPointerDown={(e) => handleSeatPointerDown(e, seat.id)}
                    title={`Ghế ${seat.id} (${matchedType ? matchedType.name : seat.type})\nTọa độ: X:${seat.cx}, Y:${seat.cy}, Góc:${seat.angle}°\nGiữ Shift + Click để chọn nhiều ghế\nKéo chuột để di chuyển`}
                    className={`absolute rounded-xl text-[11px] font-black flex items-center justify-center border border-black/10 select-none transition-all cursor-grab active:cursor-grabbing text-white shadow-2xs ${
                      isSelected
                        ? 'ring-3 ring-offset-2 ring-[#7C6FE8] z-40 shadow-lg scale-105'
                        : 'hover:brightness-110 z-10'
                    }`}
                    style={{
                      left: seat.cx,
                      top: seat.cy,
                      width: isCoupleLike ? SEAT_SIZE * 1.5 : SEAT_SIZE,
                      height: SEAT_SIZE,
                      transform: `rotate(${seat.angle}deg)`,
                      backgroundColor: seatBg,
                    }}
                  >
                    {/* Rotation Handle on Top of Selected Seat (Shown when only 1 seat selected or on the primary selected seat) */}
                    {isSelected && selectedSeatIds[0] === seat.id && (
                      <div
                        onPointerDown={handleRotateHandleDown}
                        title="Kéo nốt tròn này để xoay góc ghế"
                        className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#7C6FE8] border-2 border-white shadow-md flex items-center justify-center cursor-crosshair hover:scale-125 transition-transform z-50"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}

                    <span className="leading-none tracking-tight">{seat.id}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Seat Inspector Panel (4 Cols) */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col gap-4">
            {singleSelectedSeat ? (
              /* PANEL A: SINGLE SELECTED SEAT PROPERTIES */
              <div className="flex flex-col gap-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-black text-xs">
                      {singleSelectedSeat.id}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">Thuộc Tính Ghế #{singleSelectedSeat.id}</h4>
                      <span className="text-[11px] text-slate-400">Điều chỉnh vị trí, góc xoay và phân loại</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedSeatIds([])}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 1. Seat Label Inputs (Row & Number) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Hàng Ghế
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={singleSelectedSeat.row}
                      onChange={(e) => handleUpdateSeatLabel(e.target.value, singleSelectedSeat.number)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 uppercase focus:outline-none focus:border-[#7C6FE8]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Số Ghế
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={singleSelectedSeat.number}
                      onChange={(e) => handleUpdateSeatLabel(singleSelectedSeat.row, parseInt(e.target.value, 10) || 1)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                    />
                  </div>
                </div>

                {/* 2. Dynamic Seat Type Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Loại Ghế (Từ CSDL)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {seatTypes.map((st) => {
                      const isCurrent =
                        singleSelectedSeat.type.toLowerCase() === st.key.toLowerCase() ||
                        (singleSelectedSeat.type.toUpperCase() === 'REGULAR' && st.key.toLowerCase() === 'standard');
                      return (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() => handleUpdateSeatType(st.key.toUpperCase())}
                          className={`p-2 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-purple-50 border-[#7C6FE8] text-[#7C6FE8] shadow-xs'
                              : 'bg-white border-gray-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <div
                              style={{ backgroundColor: st.color }}
                              className="w-3.5 h-3.5 rounded-md text-white flex items-center justify-center text-[8px] shrink-0"
                            >
                              {renderSeatIcon(st.icon, 'w-2.5 h-2.5')}
                            </div>
                            <span className="truncate">{st.name}</span>
                          </div>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => handleUpdateSeatType('MAINTENANCE')}
                      className={`p-2 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        singleSelectedSeat.type === 'MAINTENANCE' || singleSelectedSeat.type === 'BLOCKED'
                          ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-xs'
                          : 'bg-white border-gray-200 text-slate-600 hover:bg-rose-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded-md bg-rose-500 text-white flex items-center justify-center shrink-0">
                          <Wrench className="w-2.5 h-2.5" />
                        </div>
                        <span>Bảo Trì</span>
                      </div>
                      {(singleSelectedSeat.type === 'MAINTENANCE' || singleSelectedSeat.type === 'BLOCKED') && (
                        <Check className="w-3.5 h-3.5 text-rose-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 3. Coordinate Adjustments (cx, cy) */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Tọa Độ Không Gian (Pixels)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-gray-200">
                      <span className="text-xs font-bold text-slate-500">X (cx):</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateSeatPosition('cx', -5)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-700 text-sm font-black flex items-center justify-center cursor-pointer active:scale-95"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={singleSelectedSeat.cx}
                          onChange={(e) => handleSetExactPosition('cx', parseInt(e.target.value, 10) || 0)}
                          className="font-mono text-xs font-extrabold text-slate-900 w-12 text-center bg-white border border-gray-200 rounded-md py-0.5"
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdateSeatPosition('cx', 5)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-700 text-sm font-black flex items-center justify-center cursor-pointer active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-gray-200">
                      <span className="text-xs font-bold text-slate-500">Y (cy):</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateSeatPosition('cy', -5)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-700 text-sm font-black flex items-center justify-center cursor-pointer active:scale-95"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={singleSelectedSeat.cy}
                          onChange={(e) => handleSetExactPosition('cy', parseInt(e.target.value, 10) || 0)}
                          className="font-mono text-xs font-extrabold text-slate-900 w-12 text-center bg-white border border-gray-200 rounded-md py-0.5"
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdateSeatPosition('cy', 5)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-700 text-sm font-black flex items-center justify-center cursor-pointer active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Rotation Angle Slider & Presets */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Góc Xoay Hướng Màn Hình
                    </label>
                    <span className="font-mono font-extrabold text-xs text-[#7C6FE8]">
                      {singleSelectedSeat.angle > 0 ? `+${singleSelectedSeat.angle}°` : `${singleSelectedSeat.angle}°`}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={-45}
                    max={45}
                    step={1}
                    value={singleSelectedSeat.angle}
                    onChange={(e) => handleSetExactAngle(parseInt(e.target.value, 10) || 0)}
                    className="w-full accent-[#7C6FE8] cursor-pointer"
                  />

                  <div className="flex items-center justify-between gap-1 pt-1">
                    {[-20, -10, 0, 10, 20].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => handleSetExactAngle(deg)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                          singleSelectedSeat.angle === deg
                            ? 'bg-purple-100 border-[#7C6FE8] text-[#7C6FE8]'
                            : 'bg-slate-50 border-gray-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {deg > 0 ? `+${deg}°` : `${deg}°`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Action Buttons (Duplicate, Delete) */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleDuplicateSelectedSeats}
                    className="flex-1 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C6FE8] font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-purple-100"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Nhân Bản</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteSelectedSeats}
                    className="flex-1 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-rose-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa Ghế</span>
                  </button>
                </div>
              </div>
            ) : isMultipleSelected ? (
              /* PANEL B: MULTIPLE SELECTION BATCH PROPERTIES */
              <div className="flex flex-col gap-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C6FE8] flex items-center justify-center font-black text-xs">
                      {selectedSeatIds.length}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">
                        Đang Chọn {selectedSeatIds.length} Ghế
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Di chuyển, đổi loại hoặc xoay đồng thời
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedSeatIds([])}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Notice: Row & Seat Number cannot be batch edited */}
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-medium flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Chỉ cho phép di chuyển, xoay góc hoặc đổi loại ghế hàng loạt. Tên hàng và số ghế giữ nguyên theo từng ghế.
                  </span>
                </div>

                {/* 1. Batch Seat Type Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Đổi Loại Toàn Bộ {selectedSeatIds.length} Ghế (Từ CSDL)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {seatTypes.map((st) => (
                      <button
                        key={st.key}
                        type="button"
                        onClick={() => handleUpdateSeatType(st.key.toUpperCase())}
                        className="p-2 rounded-xl border bg-white border-gray-200 text-slate-700 hover:bg-purple-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer truncate"
                      >
                        <div
                          style={{ backgroundColor: st.color }}
                          className="w-3.5 h-3.5 rounded-md text-white flex items-center justify-center text-[8px] shrink-0"
                        >
                          {renderSeatIcon(st.icon, 'w-2.5 h-2.5')}
                        </div>
                        <span className="truncate">{st.name}</span>
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleUpdateSeatType('MAINTENANCE')}
                      className="p-2 rounded-xl border bg-rose-50 border-rose-400 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Wrench className="w-3.5 h-3.5 text-rose-600" />
                      <span>Bảo Trì</span>
                    </button>
                  </div>
                </div>

                {/* 2. Batch Coordinate Move */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Dịch Chuyển Đồng Thời (5px)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-gray-200">
                      <span className="text-xs font-bold text-slate-500">Trục X:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateSeatPosition('cx', -5)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-700 text-xs font-black cursor-pointer active:scale-95"
                        >
                          -5px
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateSeatPosition('cx', 5)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-700 text-xs font-black cursor-pointer active:scale-95"
                        >
                          +5px
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-gray-200">
                      <span className="text-xs font-bold text-slate-500">Trục Y:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateSeatPosition('cy', -5)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-700 text-xs font-black cursor-pointer active:scale-95"
                        >
                          -5px
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateSeatPosition('cy', 5)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-700 text-xs font-black cursor-pointer active:scale-95"
                        >
                          +5px
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Batch Angle Presets */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Xoay Góc Hàng Loạt
                  </label>
                  <div className="flex items-center justify-between gap-1">
                    {[-20, -10, 0, 10, 20].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => handleSetExactAngle(deg)}
                        className="flex-1 py-1.5 rounded-lg text-[11px] font-bold bg-slate-50 border border-gray-200 text-slate-700 hover:bg-purple-50 hover:border-[#7C6FE8] hover:text-[#7C6FE8] transition-colors cursor-pointer"
                      >
                        {deg > 0 ? `+${deg}°` : `${deg}°`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleDuplicateSelectedSeats}
                    className="flex-1 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C6FE8] font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-purple-100"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Nhân Bản ({selectedSeatIds.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteSelectedSeats}
                    className="flex-1 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-rose-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa {selectedSeatIds.length} Ghế</span>
                  </button>
                </div>
              </div>
            ) : (
              /* PANEL C: ROOM OVERVIEW & SHORTCUTS HELP */
              <div className="flex flex-col gap-4 animate-in fade-in">
                <div className="flex flex-col gap-0.5 border-b border-gray-100 pb-3">
                  <h4 className="font-extrabold text-sm text-slate-900">Bảng Điều Khiển Tổng Thể</h4>
                  <span className="text-[11px] text-slate-400">Chọn 1 hoặc nhiều ghế trên Canvas để chỉnh sửa</span>
                </div>

                {/* Summary Badges */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-gray-200 flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase">Ghế Thường</span>
                    <span className="text-base font-black text-slate-800">{regularCount} ghế</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold text-[#7C6FE8] uppercase">Ghế VIP</span>
                    <span className="text-base font-black text-[#7C6FE8]">{vipCount} ghế</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-pink-50/60 border border-pink-100 flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold text-pink-600 uppercase">Sweetbox Đôi</span>
                    <span className="text-base font-black text-pink-600">{sweetboxCount} ghế</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100 flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold text-rose-600 uppercase">Bảo Trì</span>
                    <span className="text-base font-black text-rose-600">{maintenanceCount} ghế</span>
                  </div>
                </div>

                {/* Quick Row Alignment Tools */}
                <div className="flex flex-col gap-2 pt-1 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#7C6FE8]" />
                      <span>Công Cụ Hàng Ghế</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleOpenAddRowModal}
                      className="text-[11px] font-extrabold text-[#7C6FE8] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Thêm hàng mới</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                    {availableRows.map((rowLetter) => (
                      <div
                        key={rowLetter}
                        className="w-full p-2.5 rounded-2xl bg-slate-50 border border-gray-200 flex items-center justify-between"
                      >
                        <span className="font-extrabold text-xs text-slate-900">Hàng {rowLetter}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCurveRow(rowLetter)}
                            title="Uốn cong hình cánh quạt chuẩn rạp IMAX"
                            className="px-2 py-1 rounded-lg bg-purple-100 hover:bg-[#7C6FE8] hover:text-white text-[#7C6FE8] text-[10px] font-extrabold transition-colors cursor-pointer"
                          >
                            Uốn Vòm
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAlignRowStraight(rowLetter)}
                            title="Căn thẳng hàng ngang phẳng"
                            className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-extrabold transition-colors cursor-pointer"
                          >
                            Căn Thẳng
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(rowLetter)}
                            title="Xóa toàn bộ hàng này"
                            className="p-1 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keyboard Shortcuts Cheat Sheet */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-gray-200 flex flex-col gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-extrabold text-slate-800 text-[11px] uppercase">
                    <Keyboard className="w-3.5 h-3.5 text-[#7C6FE8]" />
                    <span>Phím Tắt Thao Tác Nhanh</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px]">
                    <div>
                      <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-gray-300 font-mono text-[10px]">Shift</kbd> + Click: Chọn nhiều ghế
                    </div>
                    <div>
                      <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-gray-300 font-mono text-[10px]">Space</kbd> + Kéo: Pan canvas
                    </div>
                    <div>
                      <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-gray-300 font-mono text-[10px]">↑ ↓ ← →</kbd>: Dịch 5px
                    </div>
                    <div>
                      <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-gray-300 font-mono text-[10px]">Del</kbd>: Xóa ghế chọn
                    </div>
                    <div>
                      <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-gray-300 font-mono text-[10px]">Ctrl+Z</kbd>: Hoàn tác
                    </div>
                    <div>
                      <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-gray-300 font-mono text-[10px]">Ctrl+Y</kbd>: Làm lại
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ➕ MODAL THÊM HÀNG GHẾ MỚI */}
      <AnimatePresence>
        {isAddRowModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-3xl border border-purple-100 p-6 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Thêm Hàng Ghế Mới</h3>
                    <span className="text-xs text-slate-400">Tự động căn tọa độ ngay ngắn</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddRowModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmAddRow} className="flex flex-col gap-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Tên Hàng (A-Z) *</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={newRowLetter}
                      onChange={(e) => setNewRowLetter(e.target.value.toUpperCase())}
                      required
                      className="px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 uppercase focus:outline-none focus:border-[#7C6FE8]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Số lượng ghế trong hàng</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={newRowSeatsCount}
                      onChange={(e) => setNewRowSeatsCount(parseInt(e.target.value, 10) || 12)}
                      required
                      className="px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Loại ghế mặc định</label>
                  <select
                    value={newRowType}
                    onChange={(e) => setNewRowType(e.target.value as SeatType)}
                    className="px-3.5 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  >
                    {seatTypes.map((st) => (
                      <option key={st.key} value={st.key.toUpperCase()}>
                        {st.name} {st.surcharge > 0 ? `(+${st.surcharge.toLocaleString()} ₫)` : ''}
                      </option>
                    ))}
                    <option value="MAINTENANCE">Bảo Trì</option>
                  </select>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-slate-600 flex items-center gap-2">
                  <ArrowDown className="w-4 h-4 text-[#7C6FE8] shrink-0" />
                  <span>Hàng mới sẽ được chèn ngay bên dưới các hàng hiện có với khoảng cách chuẩn 35px.</span>
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddRowModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tạo Hàng Ghế</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
