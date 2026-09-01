'use client';

import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Plus,
  Trash2,
  Copy,
  Grid,
  Check,
  X,
  Undo2,
  Redo2,
  Keyboard,
  RotateCcw,
  SlidersHorizontal,
  Heart,
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

const SEAT_SIZE = 32;
const SEAT_GAP = 40;

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
  // PAN CANVAS STATE
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
  // MULTI-SELECTION STATE
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

  // Connect 2 close Sweetbox / Couple seats in the same row naturally
  const sweetboxPairBridges = useMemo(() => {
    const coupleSeats = seats.filter((s) => {
      const norm = (s.type || '').toLowerCase();
      return norm === 'sweetbox' || norm === 'couple' || norm === 'bed';
    });

    const byRow: Record<string, AdminSeatItem[]> = {};
    coupleSeats.forEach((s) => {
      if (!byRow[s.row]) byRow[s.row] = [];
      byRow[s.row].push(s);
    });

    const bridges: {
      id: string;
      seat1Id: string;
      seat2Id: string;
      x: number;
      y: number;
      width: number;
      height: number;
      angle: number;
      isSelected: boolean;
    }[] = [];

    Object.values(byRow).forEach((rowSeats) => {
      const sorted = [...rowSeats].sort((a, b) => a.cx - b.cx || a.number - b.number);
      const visited = new Set<string>();

      for (let i = 0; i < sorted.length; i++) {
        const s1 = sorted[i];
        if (visited.has(s1.id)) continue;

        let bestPair: AdminSeatItem | null = null;
        let minDistance = Infinity;

        for (let j = i + 1; j < sorted.length; j++) {
          const s2 = sorted[j];
          if (visited.has(s2.id)) continue;

          const dist = Math.hypot(s2.cx - s1.cx, s2.cy - s1.cy);
          if (dist <= SEAT_GAP * 1.35 && dist < minDistance) {
            minDistance = dist;
            bestPair = s2;
          }
        }

        if (bestPair) {
          visited.add(s1.id);
          visited.add(bestPair.id);

          const minX = Math.min(s1.cx, bestPair.cx);
          const maxX = Math.max(s1.cx, bestPair.cx);
          const avgY = (s1.cy + bestPair.cy) / 2;
          const avgAngle = (s1.angle + bestPair.angle) / 2;
          const width = maxX - minX + SEAT_SIZE;
          const isPairSelected = selectedSeatIds.includes(s1.id) || selectedSeatIds.includes(bestPair.id);

          bridges.push({
            id: `${s1.id}-${bestPair.id}`,
            seat1Id: s1.id,
            seat2Id: bestPair.id,
            x: minX,
            y: avgY,
            width,
            height: SEAT_SIZE,
            angle: avgAngle,
            isSelected: isPairSelected,
          });
        }
      }
    });

    return bridges;
  }, [seats, selectedSeatIds]);

  // Bounding box for canvas viewport
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

  // Auto-fit scale on mount
  useEffect(() => {
    if (containerRef.current && mapWidth > 0) {
      const containerW = containerRef.current.clientWidth;
      const bestScale = Math.min(1.15, Math.max(0.6, (containerW - 40) / mapWidth));
      setScale(bestScale);
    }
  }, [mapWidth]);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2.0));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.4));
  const handleResetZoomAndPan = () => {
    setPanOffset({ x: 0, y: 0 });
    if (containerRef.current) {
      const containerW = containerRef.current.clientWidth;
      const bestScale = Math.min(1.15, Math.max(0.6, (containerW - 40) / mapWidth));
      setScale(bestScale);
    }
  };

  // Canvas background panning
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

  // Seat Pointer down
  const handleSeatPointerDown = (e: React.PointerEvent, seatId: string) => {
    e.stopPropagation();
    dragMovedRef.current = false;

    let targetIds = selectedSeatIds;

    // Shift + Click: Toggle selection
    if (e.shiftKey) {
      if (selectedSeatIds.includes(seatId)) {
        targetIds = selectedSeatIds.filter((id) => id !== seatId);
      } else {
        targetIds = [...selectedSeatIds, seatId];
      }
      setSelectedSeatIds(targetIds);
    } else {
      if (!selectedSeatIds.includes(seatId)) {
        targetIds = [seatId];
        setSelectedSeatIds([seatId]);
      }
    }

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
      // 2. Drag selected seats
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

  const handleRotateHandleDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    const seatElem = (e.currentTarget.parentElement as HTMLElement) || e.currentTarget;
    const rect = seatElem.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    rotateCenterRef.current = { x: centerX, y: centerY };
    setIsRotating(true);
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') {
        return;
      }

      if (e.code === 'Space') {
        isSpacePressedRef.current = true;
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        handleRedo();
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedSeatIds.length > 0) {
          e.preventDefault();
          const updated = seats.filter((s) => !selectedSeatIds.includes(s.id));
          setSelectedSeatIds([]);
          pushHistoryState(updated);
        }
        return;
      }

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

  // Seat Property Mutations
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

  return (
    <div className="w-full flex flex-col gap-3 font-sans select-none">
      {/* 1. Sleek Studio Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-lg bg-slate-50 border border-gray-200">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Undo / Redo */}
          <div className="flex items-center bg-white rounded-md border border-gray-200 p-0.5">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              title="Hoàn tác (Ctrl+Z)"
              className="p-1 rounded text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={!canRedo}
              title="Làm lại (Ctrl+Y)"
              className="p-1 rounded text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-gray-200 mx-1" />

          {/* Add Row Button */}
          <button
            type="button"
            onClick={handleOpenAddRowModal}
            className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5 border border-gray-200 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#7C6FE8]" />
            <span>Thêm hàng</span>
          </button>

          {/* Grid Snap Toggle */}
          <button
            type="button"
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
              snapToGrid
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-gray-200 hover:bg-slate-100'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Hít lưới ({snapToGrid ? 'Bật' : 'Tắt'})</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-gray-200 text-xs text-slate-600">
          <button
            type="button"
            onClick={handleZoomOut}
            title="Thu nhỏ"
            className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="tabular-nums font-medium text-xs px-1 text-slate-700">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            title="Phóng to"
            className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetZoomAndPan}
            title="Vừa màn hình"
            className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer ml-0.5"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Main Workspace (Canvas on Left / Inspector on Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* Left: Interactive Canvas */}
        <div className="xl:col-span-9 flex flex-col">
          <div
            ref={containerRef}
            onPointerDown={handleCanvasPointerDown}
            className={`canvas-bg w-full h-[600px] overflow-hidden bg-slate-50/50 rounded-xl border border-gray-200 flex flex-col items-center relative select-none ${
              isPanning ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {/* Screen Arc & Seats Container */}
            <div
              className="canvas-grid-area relative transition-transform duration-75 ease-out origin-top select-none p-6"
              style={{
                width: mapWidth,
                height: mapHeight,
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
              }}
            >
              {/* Dynamic Cinema Screen Arc / Multi-wall Layout */}
              <div className="w-full flex flex-col items-center gap-1.5 pt-1 pb-6 pointer-events-none select-none">
                {roomFormat.toLowerCase().includes('screenx') ? (
                  <div className="w-full max-w-lg flex items-center justify-between gap-3 px-2">
                    <div className="flex-1 flex flex-col items-end">
                      <div className="w-full h-1.5 border-t-2 border-l-2 border-[#7C6FE8] rounded-tl-lg transform -skew-y-6" />
                      <span className="text-[8px] font-bold text-[#7C6FE8]">TƯỜNG TRÁI 270°</span>
                    </div>
                    <div className="flex-[2] flex flex-col items-center">
                      <div className="w-full h-2 border-t-2 border-[#7C6FE8] rounded-[100%]" />
                      <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">
                        SCREENX 270° ({roomFormat})
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col items-start">
                      <div className="w-full h-1.5 border-t-2 border-r-2 border-[#7C6FE8] rounded-tr-lg transform skew-y-6" />
                      <span className="text-[8px] font-bold text-[#7C6FE8]">TƯỜNG PHẢI 270°</span>
                    </div>
                  </div>
                ) : roomFormat.toLowerCase().includes('onyx') ? (
                  <div className="w-full max-w-md flex flex-col items-center gap-1">
                    <div className="w-full h-2 bg-slate-900 border-2 border-cyan-400 rounded-sm shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
                    <span className="text-[9px] font-bold text-cyan-700 tracking-widest uppercase">
                      MÀN HÌNH SAMSUNG ONYX 4K LED
                    </span>
                  </div>
                ) : roomFormat.toLowerCase().includes('imax') ? (
                  <div className="w-full max-w-lg flex flex-col items-center gap-1">
                    <div className="w-full h-3 border-t-3 border-[#7C6FE8] rounded-[100%] shadow-[0_-2px_8px_rgba(124,111,232,0.4)]" />
                    <span className="text-[9px] font-bold text-[#7C6FE8] tracking-widest uppercase">
                      MÀN HÌNH CONG IMAX LASER 3D (1.90:1)
                    </span>
                  </div>
                ) : roomFormat.toLowerCase().includes('dolby') ? (
                  <div className="w-full max-w-md flex flex-col items-center gap-1">
                    <div className="w-full h-2.5 border-t-2 border-amber-500 rounded-[100%]" />
                    <span className="text-[9px] font-bold text-amber-700 tracking-widest uppercase">
                      MÀN HÌNH DOLBY VISION HDR (2.39:1)
                    </span>
                  </div>
                ) : (
                  <div className="w-full max-w-md flex flex-col items-center gap-1">
                    <div className="w-full h-2 border-t-2 border-slate-300 rounded-[100%]" />
                    <span className="text-[9px] font-medium text-slate-500 tracking-widest uppercase">
                      MÀN HÌNH CHIẾU ({roomFormat})
                    </span>
                  </div>
                )}
              </div>

              {/* 1. Sweetbox / Couple Pair Connector Enclosures */}
              {sweetboxPairBridges.map((bridge) => (
                <div
                  key={bridge.id}
                  className={`absolute rounded-lg pointer-events-none transition-all flex items-center justify-center ${
                    bridge.isSelected
                      ? 'bg-pink-500/20 border-2 border-pink-500/70'
                      : 'bg-pink-500/10 border border-dashed border-pink-400/60'
                  }`}
                  style={{
                    left: bridge.x - 3,
                    top: bridge.y - 3,
                    width: bridge.width + 6,
                    height: bridge.height + 6,
                    transform: `rotate(${bridge.angle}deg)`,
                    zIndex: 5,
                  }}
                >
                  <div className="w-4 h-4 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shadow-2xs">
                    <Heart className="w-2.5 h-2.5 text-pink-600 fill-pink-500" />
                  </div>
                </div>
              ))}

              {/* 2. Render All Seats */}
              {seats.map((seat) => {
                const isSelected = selectedSeatIds.includes(seat.id);
                const normType = (seat.type || 'standard').toLowerCase();
                const isMaintenance = normType === 'maintenance' || normType === 'blocked';
                const matchedType = seatTypes.find(
                  (st) =>
                    st.key.toLowerCase() === normType ||
                    (normType === 'regular' && st.key.toLowerCase() === 'standard')
                );

                let seatBg = matchedType ? matchedType.color : '#64748B';
                if (isMaintenance) seatBg = '#EF4444';

                return (
                  <div
                    key={seat.id}
                    onPointerDown={(e) => handleSeatPointerDown(e, seat.id)}
                    title={`Ghế ${seat.id} (${matchedType ? matchedType.name : seat.type})`}
                    className={`absolute rounded-md text-[11px] font-semibold flex items-center justify-center border border-black/15 select-none transition-all cursor-grab active:cursor-grabbing text-white ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-[#7C6FE8] z-30 shadow-sm'
                        : 'hover:brightness-105 z-10'
                    }`}
                    style={{
                      left: seat.cx,
                      top: seat.cy,
                      width: SEAT_SIZE,
                      height: SEAT_SIZE,
                      transform: `rotate(${seat.angle}deg)`,
                      backgroundColor: seatBg,
                    }}
                  >
                    {/* Rotation Handle */}
                    {isSelected && selectedSeatIds[0] === seat.id && (
                      <div
                        onPointerDown={handleRotateHandleDown}
                        title="Kéo nốt tròn để xoay góc ghế"
                        className="absolute -top-5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#7C6FE8] border-2 border-white shadow-sm flex items-center justify-center cursor-crosshair hover:scale-125 transition-transform z-40"
                      >
                        <div className="w-1 h-1 rounded-full bg-white" />
                      </div>
                    )}

                    <span className="leading-none">{seat.id}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Inspector Panel */}
        <div className="xl:col-span-3 flex flex-col">
          <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-2xs flex flex-col gap-3.5">
            {singleSelectedSeat ? (
              /* SINGLE SEAT PROPERTY SHEET */
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-800">
                      Thuộc tính ghế {singleSelectedSeat.id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSeatIds([])}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Row & Number */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] text-slate-500 font-medium">Hàng</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={singleSelectedSeat.row}
                      onChange={(e) => handleUpdateSeatLabel(e.target.value, singleSelectedSeat.number)}
                      className="px-2.5 py-1 rounded-md bg-slate-50 border border-gray-200 text-xs font-semibold text-slate-800 uppercase focus:outline-none focus:border-[#7C6FE8]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] text-slate-500 font-medium">Số</label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={singleSelectedSeat.number}
                      onChange={(e) => handleUpdateSeatLabel(singleSelectedSeat.row, parseInt(e.target.value, 10) || 1)}
                      className="px-2.5 py-1 rounded-md bg-slate-50 border border-gray-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#7C6FE8]"
                    />
                  </div>
                </div>

                {/* Seat Type Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-500 font-medium">Loại ghế</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {seatTypes.map((st) => {
                      const isCurrent =
                        singleSelectedSeat.type.toLowerCase() === st.key.toLowerCase() ||
                        (singleSelectedSeat.type.toUpperCase() === 'REGULAR' && st.key.toLowerCase() === 'standard');
                      return (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() => handleUpdateSeatType(st.key.toUpperCase())}
                          className={`px-2 py-1.5 rounded-md border text-left text-xs flex items-center justify-between transition-colors cursor-pointer truncate ${
                            isCurrent
                              ? 'bg-purple-50 border-[#7C6FE8] text-[#7C6FE8] font-semibold'
                              : 'bg-white border-gray-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <div
                              style={{ backgroundColor: st.color }}
                              className="w-2.5 h-2.5 rounded-sm shrink-0"
                            />
                            <span className="truncate">{st.name}</span>
                          </div>
                          {isCurrent && <Check className="w-3 h-3 text-[#7C6FE8] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Coordinates (X, Y) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-500 font-medium">Tọa độ (X, Y)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between px-2 py-1 rounded-md bg-slate-50 border border-gray-200 text-xs">
                      <span className="text-slate-400 font-normal">X:</span>
                      <input
                        type="number"
                        value={singleSelectedSeat.cx}
                        onChange={(e) => handleSetExactPosition('cx', parseInt(e.target.value, 10) || 0)}
                        className="font-mono text-xs font-semibold text-slate-800 w-12 text-right bg-transparent focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-between px-2 py-1 rounded-md bg-slate-50 border border-gray-200 text-xs">
                      <span className="text-slate-400 font-normal">Y:</span>
                      <input
                        type="number"
                        value={singleSelectedSeat.cy}
                        onChange={(e) => handleSetExactPosition('cy', parseInt(e.target.value, 10) || 0)}
                        className="font-mono text-xs font-semibold text-slate-800 w-12 text-right bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Angle */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] text-slate-500 font-medium">Góc xoay</label>
                    <span className="font-mono text-xs text-slate-700">
                      {singleSelectedSeat.angle}°
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[-15, 0, 15].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => handleSetExactAngle(deg)}
                        className={`flex-1 py-1 rounded text-xs border cursor-pointer ${
                          singleSelectedSeat.angle === deg
                            ? 'bg-[#7C6FE8]/10 border-[#7C6FE8] text-[#7C6FE8] font-semibold'
                            : 'bg-slate-50 border-gray-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {deg > 0 ? `+${deg}°` : `${deg}°`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleDuplicateSelectedSeats}
                    className="flex-1 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Nhân bản</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteSelectedSeats}
                    className="flex-1 py-1.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            ) : isMultipleSelected ? (
              /* MULTI SEAT PROPERTY SHEET */
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <span className="font-semibold text-xs text-slate-800">
                    Đang chọn {selectedSeatIds.length} ghế
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedSeatIds([])}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Batch Type Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-500 font-medium">Đổi loại đồng thời</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {seatTypes.map((st) => (
                      <button
                        key={st.key}
                        type="button"
                        onClick={() => handleUpdateSeatType(st.key.toUpperCase())}
                        className="px-2 py-1.5 rounded-md border bg-white border-gray-200 text-slate-700 hover:bg-slate-50 text-xs flex items-center gap-1.5 cursor-pointer truncate"
                      >
                        <div
                          style={{ backgroundColor: st.color }}
                          className="w-2.5 h-2.5 rounded-sm shrink-0"
                        />
                        <span className="truncate">{st.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Batch Move */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-500 font-medium">Dịch chuyển (5px)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between px-2 py-1 rounded-md bg-slate-50 border border-gray-200 text-xs">
                      <span className="text-slate-400">X:</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateSeatPosition('cx', -5)}
                          className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateSeatPosition('cx', 5)}
                          className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          +5
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-2 py-1 rounded-md bg-slate-50 border border-gray-200 text-xs">
                      <span className="text-slate-400">Y:</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateSeatPosition('cy', -5)}
                          className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateSeatPosition('cy', 5)}
                          className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleDuplicateSelectedSeats}
                    className="flex-1 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Nhân bản</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteSelectedSeats}
                    className="flex-1 py-1.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa ({selectedSeatIds.length})</span>
                  </button>
                </div>
              </div>
            ) : (
              /* NO SEAT SELECTED - CLEAN TOOLS & ROWS */
              <div className="flex flex-col gap-3.5">
                <div className="flex flex-col border-b border-gray-100 pb-2.5">
                  <span className="font-semibold text-xs text-slate-800">
                    Thao tác hàng ghế
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Chọn ghế trên sơ đồ để xem chi tiết
                  </span>
                </div>

                {/* Row Alignment List */}
                <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-0.5">
                  {availableRows.map((rowLetter) => (
                    <div
                      key={rowLetter}
                      className="w-full px-2.5 py-1.5 rounded-md bg-slate-50 border border-gray-200 flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-slate-800">Hàng {rowLetter}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleCurveRow(rowLetter)}
                          title="Uốn cong hình cánh quạt"
                          className="px-1.5 py-0.5 rounded text-[10px] bg-white border border-gray-200 hover:border-[#7C6FE8] hover:text-[#7C6FE8] text-slate-600 transition-colors cursor-pointer"
                        >
                          Uốn vòm
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAlignRowStraight(rowLetter)}
                          title="Căn thẳng hàng ngang"
                          className="px-1.5 py-0.5 rounded text-[10px] bg-white border border-gray-200 hover:border-slate-400 text-slate-600 transition-colors cursor-pointer"
                        >
                          Căn thẳng
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(rowLetter)}
                          title="Xóa hàng này"
                          className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shortcuts */}
                <div className="pt-2 border-t border-gray-100 flex flex-col gap-1 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1 font-medium text-slate-700">
                    <Keyboard className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phím tắt</span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-slate-600 pt-0.5">
                    <div><kbd className="px-1 py-0.2 rounded bg-slate-100 font-mono text-[10px]">Shift</kbd> + Click: Chọn nhiều</div>
                    <div><kbd className="px-1 py-0.2 rounded bg-slate-100 font-mono text-[10px]">Space</kbd> + Kéo: Di chuyển canvas</div>
                    <div><kbd className="px-1 py-0.2 rounded bg-slate-100 font-mono text-[10px]">Ctrl+Z/Y</kbd>: Hoàn tác / Làm lại</div>
                    <div><kbd className="px-1 py-0.2 rounded bg-slate-100 font-mono text-[10px]">Del</kbd>: Xóa ghế đang chọn</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL THÊM HÀNG GHẾ */}
      <AnimatePresence>
        {isAddRowModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in font-sans">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-xl border border-gray-200 p-5 shadow-xl flex flex-col gap-3.5"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h3 className="text-sm font-semibold text-slate-900">Thêm hàng ghế mới</h3>
                <button
                  type="button"
                  onClick={() => setIsAddRowModalOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmAddRow} className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-600 font-medium">Tên hàng (A-Z) *</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={newRowLetter}
                      onChange={(e) => setNewRowLetter(e.target.value.toUpperCase())}
                      required
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs font-semibold text-slate-900 uppercase focus:outline-none focus:border-[#7C6FE8]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-600 font-medium">Số ghế</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={newRowSeatsCount}
                      onChange={(e) => setNewRowSeatsCount(parseInt(e.target.value, 10) || 12)}
                      required
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-600 font-medium">Loại ghế mặc định</label>
                  <select
                    value={newRowType}
                    onChange={(e) => setNewRowType(e.target.value as SeatType)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  >
                    {seatTypes.map((st) => (
                      <option key={st.key} value={st.key.toUpperCase()}>
                        {st.name} {st.surcharge > 0 ? `(+${st.surcharge.toLocaleString()} ₫)` : ''}
                      </option>
                    ))}
                    <option value="MAINTENANCE">Bảo trì</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddRowModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-[#7C6FE8] hover:bg-[#685bc7] text-white text-xs font-medium cursor-pointer"
                  >
                    Tạo hàng
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
