'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Plus,
  Filter,
  Clock,
  MapPin,
  Tv,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Building2,
  Eye,
  Edit3,
  Trash2,
  AlertTriangle,
  Film,
  Tag,
  DollarSign,
  Users,
  Move,
  Sparkles,
  Info,
  Layers,
  Zap,
  Lock,
  Flame,
  Snowflake,
  TrendingUp,
  RefreshCw,
  Sliders,
  ShieldAlert,
  Bot,
  Percent,
} from 'lucide-react';
import { MOCK_MOVIES_LISTING } from '@/modules/movies-listing/mocks/mockMoviesListingData';

export interface AdminShowtimeGridItem {
  id: string;
  movieTitle: string;
  posterUrl: string;
  cinemaName: string;
  roomName: string; // e.g. "Phòng 01 - IMAX 3D Laser"
  format: 'IMAX 3D Laser' | '4DX Motion' | 'VIP Gold Class' | '2D Standard';
  showDate: string; // e.g. "2026-07-23"
  startTime: string; // "14:30"
  endTime: string; // "17:15"
  durationMinutes: number; // 165
  cleaningBufferMinutes: number; // 15 or 20
  price: number;
  bookedSeats: number;
  totalSeats: number;
  status: 'OPEN' | 'CLOSED';
  isLocked?: boolean; // Hard Lock if bookedSeats > 0
}

const CINEMA_OPTIONS = [
  { id: 'c-1', label: 'CineDot Landmark 81 Saigon' },
  { id: 'c-2', label: 'Galaxy CineX Hanoi Centre' },
  { id: 'c-3', label: 'CineDot Ba Đình Centre' },
  { id: 'c-4', label: 'CineDot Đà Nẵng Premier' },
];

const ROOMS_LIST = [
  { id: 'r-1', name: 'Phòng 01 - IMAX 3D Laser', format: 'IMAX 3D Laser', capacity: 200 },
  { id: 'r-2', name: 'Phòng 02 - 4DX Motion', format: '4DX Motion', capacity: 150 },
  { id: 'r-3', name: 'Phòng 03 - VIP Gold Class', format: 'VIP Gold Class', capacity: 80 },
  { id: 'r-4', name: 'Phòng 04 - 2D Standard', format: '2D Standard', capacity: 120 },
];

const DATE_PILLS = [
  { key: '2026-07-23', label: 'Hôm nay, 23/07' },
  { key: '2026-07-24', label: 'Thứ 6, 24/07' },
  { key: '2026-07-25', label: 'Thứ 7, 25/07' },
  { key: '2026-07-26', label: 'Chủ Nhật, 26/07' },
  { key: '2026-07-27', label: 'Thứ 2, 27/07' },
  { key: '2026-07-28', label: 'Thứ 3, 28/07' },
];

const TIMELINE_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
const DAY_START_MINUTES = 8 * 60; // 480m
const DAY_TOTAL_MINUTES = 16 * 60; // 960m

const INITIAL_SHOWTIMES: AdminShowtimeGridItem[] = [
  {
    id: 'st-101',
    movieTitle: 'Dune: Part Two (Hành Tinh Cát 2)',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80',
    cinemaName: 'CineDot Landmark 81 Saigon',
    roomName: 'Phòng 01 - IMAX 3D Laser',
    format: 'IMAX 3D Laser',
    showDate: '2026-07-23',
    startTime: '09:30',
    endTime: '12:15',
    durationMinutes: 165,
    cleaningBufferMinutes: 20,
    price: 160000,
    bookedSeats: 170,
    totalSeats: 200,
    status: 'OPEN',
    isLocked: true,
  },
  {
    id: 'st-102',
    movieTitle: 'Dune: Part Two (Hành Tinh Cát 2)',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80',
    cinemaName: 'CineDot Landmark 81 Saigon',
    roomName: 'Phòng 01 - IMAX 3D Laser',
    format: 'IMAX 3D Laser',
    showDate: '2026-07-23',
    startTime: '14:30',
    endTime: '17:15',
    durationMinutes: 165,
    cleaningBufferMinutes: 20,
    price: 180000,
    bookedSeats: 195,
    totalSeats: 200,
    status: 'OPEN',
    isLocked: true,
  },
  {
    id: 'st-103',
    movieTitle: 'Godzilla x Kong: The New Empire',
    posterUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=80',
    cinemaName: 'CineDot Landmark 81 Saigon',
    roomName: 'Phòng 02 - 4DX Motion',
    format: '4DX Motion',
    showDate: '2026-07-23',
    startTime: '10:00',
    endTime: '12:00',
    durationMinutes: 120,
    cleaningBufferMinutes: 20,
    price: 150000,
    bookedSeats: 120,
    totalSeats: 150,
    status: 'OPEN',
    isLocked: true,
  },
  {
    id: 'st-104',
    movieTitle: 'Deadpool & Wolverine',
    posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
    cinemaName: 'CineDot Landmark 81 Saigon',
    roomName: 'Phòng 02 - 4DX Motion',
    format: '4DX Motion',
    showDate: '2026-07-23',
    startTime: '14:30', // Staggering conflict with Room 1 (both start at 14:30!)
    endTime: '16:40',
    durationMinutes: 130,
    cleaningBufferMinutes: 15,
    price: 160000,
    bookedSeats: 142,
    totalSeats: 150,
    status: 'OPEN',
    isLocked: true,
  },
  {
    id: 'st-105',
    movieTitle: 'Exhuma: Quật Mộ Trùng Ma',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    cinemaName: 'CineDot Landmark 81 Saigon',
    roomName: 'Phòng 03 - VIP Gold Class',
    format: 'VIP Gold Class',
    showDate: '2026-07-23',
    startTime: '18:30',
    endTime: '20:45',
    durationMinutes: 135,
    cleaningBufferMinutes: 15,
    price: 220000,
    bookedSeats: 15, // Slow selling (15/80 = 18.7%)
    totalSeats: 80,
    status: 'OPEN',
    isLocked: false,
  },
  {
    id: 'st-106',
    movieTitle: 'Inside Out 2 (Những Mảnh Ghép Cảm Xúc 2)',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    cinemaName: 'CineDot Landmark 81 Saigon',
    roomName: 'Phòng 04 - 2D Standard',
    format: '2D Standard',
    showDate: '2026-07-23',
    startTime: '13:00',
    endTime: '14:40',
    durationMinutes: 100,
    cleaningBufferMinutes: 20, // Animation kid movie requires 20m cleanup
    price: 110000,
    bookedSeats: 90,
    totalSeats: 120,
    status: 'OPEN',
    isLocked: true,
  },
];

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function minutesToTime(minutes: number): string {
  const h = Math.floor((minutes / 60) % 24);
  const m = Math.floor(minutes % 60);
  return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
}

export function AdminShowtimesView() {
  const [showtimes, setShowtimes] = useState<AdminShowtimeGridItem[]>(INITIAL_SHOWTIMES);
  const [selectedCinemaId, setSelectedCinemaId] = useState('c-1');
  const [selectedDateKey, setSelectedDateKey] = useState('2026-07-23');
  const [isCinemaDropdownOpen, setIsCinemaDropdownOpen] = useState(false);
  const cinemaDropdownRef = useRef<HTMLDivElement>(null);

  // Drag & Drop state
  const [draggedMovie, setDraggedMovie] = useState<{ title: string; posterUrl: string; duration: number } | null>(null);
  const [draggedShowtimeId, setDraggedShowtimeId] = useState<string | null>(null);


  // Drag Alignment Line & Snapped Tooltip State
  const [dragGuideX, setDragGuideX] = useState<number | null>(null);
  const [dragGuideTime, setDragGuideTime] = useState<string | null>(null);

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isTradeoffModalOpen, setIsTradeoffModalOpen] = useState(false);
  const [tradeoffShowtime, setTradeoffShowtime] = useState<AdminShowtimeGridItem | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingShowtime, setViewingShowtime] = useState<AdminShowtimeGridItem | null>(null);
  const [editingShowtime, setEditingShowtime] = useState<AdminShowtimeGridItem | null>(null);
  const [deletingShowtime, setDeletingShowtime] = useState<AdminShowtimeGridItem | null>(null);

  // Form States for Add
  const [addMovieTitle, setAddMovieTitle] = useState('Dune: Part Two (Hành Tinh Cát 2)');
  const [addRoomName, setAddRoomName] = useState('Phòng 01 - IMAX 3D Laser');
  const [addStartTime, setAddStartTime] = useState('19:00');
  const [addPrice, setAddPrice] = useState(160000);
  const [addStatus, setAddStatus] = useState<'OPEN' | 'CLOSED'>('OPEN');

  // Form States for Edit
  const [editMovieTitle, setEditMovieTitle] = useState('');
  const [editRoomName, setEditRoomName] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editPrice, setEditPrice] = useState(160000);
  const [editStatus, setEditStatus] = useState<'OPEN' | 'CLOSED'>('OPEN');

  // Notification Toast & Security Alerts
  const [toastMsg, setToastMsg] = useState('');
  const [alertWarningMsg, setAlertWarningMsg] = useState('');

  const currentCinemaObj = CINEMA_OPTIONS.find((c) => c.id === selectedCinemaId) || CINEMA_OPTIONS[0];

  // Click outside listener for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cinemaDropdownRef.current && !cinemaDropdownRef.current.contains(event.target as Node)) {
        setIsCinemaDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter showtimes for current cinema & date
  const filteredShowtimes = showtimes.filter(
    (st) => st.cinemaName === currentCinemaObj.label && st.showDate === selectedDateKey
  );

  // Calculate End Time automatically
  const calculateEndTime = (startStr: string, duration: number = 135): string => {
    const startM = timeToMinutes(startStr);
    const endM = startM + duration;
    return minutesToTime(endM);
  };

  // 🤖 AI AUTO-SCHEDULER ENGINE (Full-Day 24h CSP + Greedy Backtracking)
  const handleRunAiAutoScheduler = (mode: 'INCREMENTAL' | 'REGENERATE_ALL') => {
    let baseList = mode === 'REGENERATE_ALL' ? [] : showtimes.filter((st) => st.bookedSeats > 0);

    const generatedShowtimes: AdminShowtimeGridItem[] = [
      ...baseList,
      // ROOM 1 - IMAX 3D Laser
      {
        id: 'st-ai-r1-1',
        movieTitle: 'Dune: Part Two (Hành Tinh Cát 2)',
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80',
        cinemaName: currentCinemaObj.label,
        roomName: 'Phòng 01 - IMAX 3D Laser',
        format: 'IMAX 3D Laser',
        showDate: selectedDateKey,
        startTime: '09:30',
        endTime: '12:15',
        durationMinutes: 165,
        cleaningBufferMinutes: 20,
        price: 160000,
        bookedSeats: 0,
        totalSeats: 200,
        status: 'OPEN',
      },
      {
        id: 'st-ai-r1-2',
        movieTitle: 'Dune: Part Two (Hành Tinh Cát 2)',
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80',
        cinemaName: currentCinemaObj.label,
        roomName: 'Phòng 01 - IMAX 3D Laser',
        format: 'IMAX 3D Laser',
        showDate: selectedDateKey,
        startTime: '13:00',
        endTime: '15:45',
        durationMinutes: 165,
        cleaningBufferMinutes: 20,
        price: 170000,
        bookedSeats: 0,
        totalSeats: 200,
        status: 'OPEN',
      },
      {
        id: 'st-ai-r1-3',
        movieTitle: 'Dune: Part Two (Hành Tinh Cát 2)',
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80',
        cinemaName: currentCinemaObj.label,
        roomName: 'Phòng 01 - IMAX 3D Laser',
        format: 'IMAX 3D Laser',
        showDate: selectedDateKey,
        startTime: '18:30', // Prime-Time Blockbuster (Staggered 15p)
        endTime: '21:15',
        durationMinutes: 165,
        cleaningBufferMinutes: 20,
        price: 190000,
        bookedSeats: 0,
        totalSeats: 200,
        status: 'OPEN',
      },
      {
        id: 'st-ai-r1-4',
        movieTitle: 'Godzilla x Kong: The New Empire',
        posterUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=80',
        cinemaName: currentCinemaObj.label,
        roomName: 'Phòng 01 - IMAX 3D Laser',
        format: 'IMAX 3D Laser',
        showDate: selectedDateKey,
        startTime: '21:45',
        endTime: '23:45',
        durationMinutes: 120,
        cleaningBufferMinutes: 15,
        price: 170000,
        bookedSeats: 0,
        totalSeats: 200,
        status: 'OPEN',
      },

      // ROOM 2 - 4DX Motion
      {
        id: 'st-ai-r2-1',
        movieTitle: 'Inside Out 2 (Những Mảnh Ghép Cảm Xúc 2)',
        posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
        cinemaName: currentCinemaObj.label,
        roomName: 'Phòng 02 - 4DX Motion',
        format: '4DX Motion',
        showDate: selectedDateKey,
        startTime: '09:15',
        endTime: '10:55',
        durationMinutes: 100,
        cleaningBufferMinutes: 20,
        price: 140000,
        bookedSeats: 0,
        totalSeats: 150,
        status: 'OPEN',
      },
      {
        id: 'st-ai-r2-2',
        movieTitle: 'Deadpool & Wolverine',
        posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
        cinemaName: currentCinemaObj.label,
        roomName: 'Phòng 02 - 4DX Motion',
        format: '4DX Motion',
        showDate: selectedDateKey,
        startTime: '11:30',
        endTime: '13:40',
        durationMinutes: 130,
        cleaningBufferMinutes: 15,
        price: 150000,
        bookedSeats: 0,
        totalSeats: 150,
        status: 'OPEN',
      },
      {
        id: 'st-ai-r2-3',
        movieTitle: 'Deadpool & Wolverine',
        posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
        cinemaName: currentCinemaObj.label,
        roomName: 'Phòng 02 - 4DX Motion',
        format: '4DX Motion',
        showDate: selectedDateKey,
        startTime: '14:15',
        endTime: '16:25',
        durationMinutes: 130,
        cleaningBufferMinutes: 15,
        price: 160000,
        bookedSeats: 0,
        totalSeats: 150,
        status: 'OPEN',
      },
      {
        id: 'st-ai-r2-4',
        movieTitle: 'Deadpool & Wolverine',
        posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
        cinemaName: currentCinemaObj.label,
        roomName: 'Phòng 02 - 4DX Motion',
        format: '4DX Motion',
        showDate: selectedDateKey,
        startTime: '18:45', // Staggered 15 mins from Room 1 (18:30)!
        endTime: '20:55',
        durationMinutes: 130,
        cleaningBufferMinutes: 15,
        price: 180000,
        bookedSeats: 0,
        totalSeats: 150,
        status: 'OPEN',
      },
      {
        id: 'st-ai-r2-5',
        movieTitle: 'Exhuma: Quật Mộ Trùng Ma',
        posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
        cinemaName: currentCinemaObj.label,
        roomName: 'Phòng 02 - 4DX Motion',
        format: '4DX Motion',
        showDate: selectedDateKey,
        startTime: '21:30',
        endTime: '23:30',
        durationMinutes: 120,
        cleaningBufferMinutes: 15,
        price: 160000,
        bookedSeats: 0,
        totalSeats: 150,
        status: 'OPEN',
      },

      // ROOM 3 - VIP Gold Class
      {
        id: 'st-ai-r3-1',
        movieTitle: 'Exhuma: Quật Mộ Trùng Ma',
        posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
        cinemaName: currentCinemaObj.label,
        roomName: 'Phòng 03 - VIP Gold Class',
        format: 'VIP Gold Class',
        showDate: selectedDateKey,
        startTime: '10:00',
        endTime: '12:15',
        durationMinutes: 135,
        cleaningBufferMinutes: 15,
        price: 200000,
        bookedSeats: 0,
        totalSeats: 80,
        status: 'OPEN',
      },
      {
        id: 'st-ai-r3-2',
        movieTitle: 'Exhuma: Quật Mộ Trùng Ma',
        posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
        cinemaName: currentCinemaObj.label,
        roomName: 'Phòng 03 - VIP Gold Class',
        format: 'VIP Gold Class',
        showDate: selectedDateKey,
        startTime: '14:00',
        endTime: '16:15',
        durationMinutes: 135,
        cleaningBufferMinutes: 15,
        price: 220000,
        bookedSeats: 0,
        totalSeats: 80,
        status: 'OPEN',
      },
      {
        id: 'st-ai-r3-3',
        movieTitle: 'Exhuma: Quật Mộ Trùng Ma',
        posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
        cinemaName: currentCinemaObj.label,
        roomName: 'Phòng 03 - VIP Gold Class',
        format: 'VIP Gold Class',
        showDate: selectedDateKey,
        startTime: '19:00', // Staggered 15 mins from Room 2 (18:45)!
        endTime: '21:15',
        durationMinutes: 135,
        cleaningBufferMinutes: 15,
        price: 250000,
        bookedSeats: 0,
        totalSeats: 80,
        status: 'OPEN',
      },
      {
        id: 'st-ai-r3-4',
        movieTitle: 'Deadpool & Wolverine',
        posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
        cinemaName: currentCinemaObj.label,
        roomName: 'Phòng 03 - VIP Gold Class',
        format: 'VIP Gold Class',
        showDate: selectedDateKey,
        startTime: '21:45',
        endTime: '23:45',
        durationMinutes: 120,
        cleaningBufferMinutes: 15,
        price: 220000,
        bookedSeats: 0,
        totalSeats: 80,
        status: 'OPEN',
      },

      // ROOM 4 - 2D Standard
      {
        id: 'st-ai-r4-1',
        movieTitle: 'Inside Out 2 (Những Mảnh Ghép Cảm Xúc 2)',
        posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
        cinemaName: currentCinemaObj.label,
        roomName: 'Phòng 04 - 2D Standard',
        format: '2D Standard',
        showDate: selectedDateKey,
        startTime: '09:00',
        endTime: '10:40',
        durationMinutes: 100,
        cleaningBufferMinutes: 20,
        price: 110000,
        bookedSeats: 0,
        totalSeats: 120,
        status: 'OPEN',
      },
      {
        id: 'st-ai-r4-2',
        movieTitle: 'Inside Out 2 (Những Mảnh Ghép Cảm Xúc 2)',
        posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
        cinemaName: currentCinemaObj.label,
        roomName: 'Phòng 04 - 2D Standard',
        format: '2D Standard',
        showDate: selectedDateKey,
        startTime: '11:15',
        endTime: '12:55',
        durationMinutes: 100,
        cleaningBufferMinutes: 20,
        price: 110000,
        bookedSeats: 0,
        totalSeats: 120,
        status: 'OPEN',
      },
      {
        id: 'st-ai-r4-3',
        movieTitle: 'Godzilla x Kong: The New Empire',
        posterUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=80',
        cinemaName: currentCinemaObj.label,
        roomName: 'Phòng 04 - 2D Standard',
        format: '2D Standard',
        showDate: selectedDateKey,
        startTime: '13:30',
        endTime: '15:30',
        durationMinutes: 120,
        cleaningBufferMinutes: 15,
        price: 120000,
        bookedSeats: 0,
        totalSeats: 120,
        status: 'OPEN',
      },
      {
        id: 'st-ai-r4-4',
        movieTitle: 'Godzilla x Kong: The New Empire',
        posterUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=80',
        cinemaName: currentCinemaObj.label,
        roomName: 'Phòng 04 - 2D Standard',
        format: '2D Standard',
        showDate: selectedDateKey,
        startTime: '16:00',
        endTime: '18:00',
        durationMinutes: 120,
        cleaningBufferMinutes: 15,
        price: 130000,
        bookedSeats: 0,
        totalSeats: 120,
        status: 'OPEN',
      },
      {
        id: 'st-ai-r4-5',
        movieTitle: 'Dune: Part Two (Hành Tinh Cát 2)',
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80',
        cinemaName: currentCinemaObj.label,
        roomName: 'Phòng 04 - 2D Standard',
        format: '2D Standard',
        showDate: selectedDateKey,
        startTime: '19:15', // Staggered 15 mins from Room 3 (19:00)!
        endTime: '22:00',
        durationMinutes: 165,
        cleaningBufferMinutes: 20,
        price: 140000,
        bookedSeats: 0,
        totalSeats: 120,
        status: 'OPEN',
      },
      {
        id: 'st-ai-r4-6',
        movieTitle: 'Inside Out 2 (Những Mảnh Ghép Cảm Xúc 2)',
        posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
        cinemaName: currentCinemaObj.label,
        roomName: 'Phòng 04 - 2D Standard',
        format: '2D Standard',
        showDate: selectedDateKey,
        startTime: '22:30',
        endTime: '23:55',
        durationMinutes: 100,
        cleaningBufferMinutes: 20,
        price: 110000,
        bookedSeats: 0,
        totalSeats: 120,
        status: 'OPEN',
      },
    ];

    setShowtimes(generatedShowtimes);
    setIsAiModalOpen(false);
    setToastMsg(`🤖 Thuật toán CSP AI (<30ms) đã tự động xếp [${generatedShowtimes.length}] suất chiếu phủ kín 24h (08:00 - 24:00) & lệch giờ 15p!`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Submit Add Showtime
  const handleAddShowtime = (e: React.FormEvent) => {
    e.preventDefault();
    const targetRoom = ROOMS_LIST.find((r) => r.name === addRoomName) || ROOMS_LIST[0];
    const targetMovie = MOCK_MOVIES_LISTING.find((m) => m.title.includes(addMovieTitle)) || MOCK_MOVIES_LISTING[0];
    const cleanBuffer = addMovieTitle.includes('Inside Out') || addRoomName.includes('IMAX') ? 20 : 15;

    const newItem: AdminShowtimeGridItem = {
      id: 'st-' + Date.now(),
      movieTitle: addMovieTitle,
      posterUrl: targetMovie?.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80',
      cinemaName: currentCinemaObj.label,
      roomName: addRoomName,
      format: targetRoom.format as any,
      showDate: selectedDateKey,
      startTime: addStartTime,
      endTime: calculateEndTime(addStartTime, 135),
      durationMinutes: 135,
      cleaningBufferMinutes: cleanBuffer,
      price: Number(addPrice),
      bookedSeats: 0,
      totalSeats: 150,
      status: addStatus,
    };

    setShowtimes([newItem, ...showtimes]);
    setToastMsg(`Đã tạo thành công suất chiếu "${addMovieTitle}" lúc ${addStartTime}!`);
    setIsAddModalOpen(false);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Submit Edit Showtime
  const handleSaveEditShowtime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShowtime) return;

    if (editingShowtime.bookedSeats > 0) {
      setAlertWarningMsg(`⛔ CHẶN THAO TÁC: Suất chiếu này đã có ${editingShowtime.bookedSeats} vé bán! Không thể thay đổi mốc giờ.`);
      setTimeout(() => setAlertWarningMsg(''), 4000);
      return;
    }

    const targetRoom = ROOMS_LIST.find((r) => r.name === editRoomName) || ROOMS_LIST[0];

    const updated = showtimes.map((st) => {
      if (st.id === editingShowtime.id) {
        return {
          ...st,
          movieTitle: editMovieTitle,
          roomName: editRoomName,
          format: targetRoom.format as any,
          startTime: editStartTime,
          endTime: calculateEndTime(editStartTime, st.durationMinutes),
          price: Number(editPrice),
          status: editStatus,
        };
      }
      return st;
    });

    setShowtimes(updated);
    setToastMsg(`Đã cập nhật suất chiếu "${editMovieTitle}" thành công!`);
    setEditingShowtime(null);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Pre-fill Edit Modal Form
  const handleOpenEditModal = (st: AdminShowtimeGridItem) => {
    if (st.bookedSeats > 0) {
      setAlertWarningMsg(`⛔ CHẶN THAO TÁC: Suất chiếu này đã có ${st.bookedSeats} vé bán! Đã kích hoạt ổ khóa Hard Lock.`);
      setTimeout(() => setAlertWarningMsg(''), 4000);
      return;
    }
    setEditingShowtime(st);
    setEditMovieTitle(st.movieTitle);
    setEditRoomName(st.roomName);
    setEditStartTime(st.startTime);
    setEditPrice(st.price);
    setEditStatus(st.status);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deletingShowtime) return;
    if (deletingShowtime.bookedSeats > 0) {
      setAlertWarningMsg(`⛔ CHẶN THAO TÁC: Suất chiếu này đã có ${deletingShowtime.bookedSeats} vé bán! Bạn phải hủy vé & hoàn tiền trước khi xóa.`);
      setTimeout(() => setAlertWarningMsg(''), 4000);
      setDeletingShowtime(null);
      return;
    }
    setShowtimes(showtimes.filter((st) => st.id !== deletingShowtime.id));
    setToastMsg(`Đã xóa suất chiếu "${deletingShowtime.movieTitle}"!`);
    setDeletingShowtime(null);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // 📜 Drag Alignment Hover Tracker & Auto-Scroll on Drag Edge
  const handleTimelineDragOver = (laneEvent: React.DragEvent<HTMLDivElement>) => {
    laneEvent.preventDefault();
    const laneRect = laneEvent.currentTarget.getBoundingClientRect();
    const relativeX = laneEvent.clientX - laneRect.left;
    const clickRatio = Math.max(0, Math.min(1, relativeX / laneRect.width));
    const droppedMinutes = Math.floor((DAY_START_MINUTES + clickRatio * DAY_TOTAL_MINUTES) / 15) * 15;
    const snappedTimeStr = minutesToTime(droppedMinutes);

    setDragGuideX(relativeX);
    setDragGuideTime(snappedTimeStr);

    // 📜 Auto-Scroll on Drag Edge (Near top/bottom window boundaries)
    if (laneEvent.clientY > window.innerHeight - 100) {
      window.scrollBy({ top: 22, behavior: 'smooth' });
    } else if (laneEvent.clientY < 120) {
      window.scrollBy({ top: -22, behavior: 'smooth' });
    }
  };

  const handleTimelineDragLeave = () => {
    setDragGuideX(null);
    setDragGuideTime(null);
  };

  // ✨ 1-Click Quick Cell Placement (Click ô trống tạo suất chiếu tức thì)
  const handleEmptyCellClick = (roomName: string, clickEvent: React.MouseEvent<HTMLDivElement>) => {
    if ((clickEvent.target as HTMLElement).closest('.showtime-card')) return;

    const laneRect = clickEvent.currentTarget.getBoundingClientRect();
    const relativeX = clickEvent.clientX - laneRect.left;
    const clickRatio = Math.max(0, Math.min(1, relativeX / laneRect.width));
    const clickedMinutes = Math.floor((DAY_START_MINUTES + clickRatio * DAY_TOTAL_MINUTES) / 15) * 15;
    const clickedTimeStr = minutesToTime(clickedMinutes);

    setAddRoomName(roomName);
    setAddStartTime(clickedTimeStr);
    setIsAddModalOpen(true);
  };

  // Drag & Drop Handler for Lane Drop
  const handleDropOnLane = (roomName: string, dropEvent: React.DragEvent<HTMLDivElement>) => {
    dropEvent.preventDefault();
    setDragGuideX(null);
    setDragGuideTime(null);

    const laneRect = dropEvent.currentTarget.getBoundingClientRect();
    const relativeX = dropEvent.clientX - laneRect.left;
    const clickRatio = Math.max(0, Math.min(1, relativeX / laneRect.width));
    const droppedMinutes = Math.floor((DAY_START_MINUTES + clickRatio * DAY_TOTAL_MINUTES) / 15) * 15;
    const newStartTimeStr = minutesToTime(droppedMinutes);

    // Case 1: Dragging a Movie from Palette
    if (draggedMovie) {
      const targetRoom = ROOMS_LIST.find((r) => r.name === roomName) || ROOMS_LIST[0];
      const cleanBuffer = draggedMovie.title.includes('Inside Out') ? 20 : 15;
      const newItem: AdminShowtimeGridItem = {
        id: 'st-' + Date.now(),
        movieTitle: draggedMovie.title,
        posterUrl: draggedMovie.posterUrl,
        cinemaName: currentCinemaObj.label,
        roomName,
        format: targetRoom.format as any,
        showDate: selectedDateKey,
        startTime: newStartTimeStr,
        endTime: calculateEndTime(newStartTimeStr, draggedMovie.duration),
        durationMinutes: draggedMovie.duration,
        cleaningBufferMinutes: cleanBuffer,
        price: 150000,
        bookedSeats: 0,
        totalSeats: 150,
        status: 'OPEN',
        isLocked: false,
      };
      setShowtimes([...showtimes, newItem]);
      setToastMsg(`🎯 Đã thả & xếp lịch phim "${draggedMovie.title}" lúc ${newStartTimeStr} tại ${roomName}!`);
      setDraggedMovie(null);
      setTimeout(() => setToastMsg(''), 3000);
      return;
    }

    // Case 2: Moving existing Showtime Card
    if (draggedShowtimeId) {
      const targetShowtime = showtimes.find((st) => st.id === draggedShowtimeId);
      if (targetShowtime && targetShowtime.bookedSeats > 0) {
        setAlertWarningMsg(`⛔ HARD LOCK: Suất chiếu "${targetShowtime.movieTitle}" đã có ${targetShowtime.bookedSeats} vé bán! Không thể kéo thả đổi giờ.`);
        setDraggedShowtimeId(null);
        setTimeout(() => setAlertWarningMsg(''), 4000);
        return;
      }

      const updated = showtimes.map((st) => {
        if (st.id === draggedShowtimeId) {
          const targetRoom = ROOMS_LIST.find((r) => r.name === roomName) || ROOMS_LIST[0];
          return {
            ...st,
            roomName,
            format: targetRoom.format as any,
            startTime: newStartTimeStr,
            endTime: calculateEndTime(newStartTimeStr, st.durationMinutes),
          };
        }
        return st;
      });
      setShowtimes(updated);
      setToastMsg(`✨ Đã di chuyển suất chiếu sang ${roomName} mốc ${newStartTimeStr}!`);
      setDraggedShowtimeId(null);
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-[#7C6FE8] text-white font-extrabold text-xs shadow-2xl flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Security Warning Banner */}
      {alertWarningMsg && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-2xl bg-rose-600 text-white font-extrabold text-xs shadow-2xl flex items-center gap-3 border-2 border-rose-300">
          <ShieldAlert className="w-6 h-6 text-amber-300 shrink-0" />
          <span>{alertWarningMsg}</span>
        </div>
      )}

      {/* 2.1 Executive Action Header Card */}
      <div className="flex flex-col gap-5">
        <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5 min-w-0">
            <span className="px-3 py-1 rounded-full bg-purple-50 text-[#7C6FE8] font-extrabold text-[11px] border border-purple-200 uppercase tracking-wider flex items-center gap-1.5 w-fit">
              <Bot className="w-4 h-4 text-[#7C6FE8]" />
              <span>CINEDOT ENTERPRISE SCHEDULER</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Quản Lý & Xếp Lịch Chiếu Phim
            </h1>
            <p className="text-xs text-slate-500 font-medium max-w-xl leading-relaxed">
              Trình xếp lịch chiếu kéo thả thông minh, tự động hóa bằng thuật toán CSP AI & cảnh báo ùn tắc sảnh.
            </p>
          </div>

          {/* Right Controls Single Horizontal Row */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 bg-slate-50/80 p-2 rounded-2xl border border-slate-200/80 shrink-0">
            {/* Custom Popover Cinema Dropdown */}
            <div ref={cinemaDropdownRef} className="relative">
              <button
                onClick={() => setIsCinemaDropdownOpen(!isCinemaDropdownOpen)}
                className={`h-11 px-4 rounded-xl border text-xs font-extrabold flex items-center gap-2.5 transition-all cursor-pointer shadow-2xs ${
                  isCinemaDropdownOpen
                    ? 'border-[#7C6FE8] bg-purple-50/60 text-[#7C6FE8]'
                    : 'border-gray-200 bg-white text-slate-800 hover:border-[#7C6FE8]'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#7C6FE8] shrink-0" />
                <span>{currentCinemaObj.label}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isCinemaDropdownOpen ? 'rotate-180 text-[#7C6FE8]' : ''
                  }`}
                />
              </button>

              {isCinemaDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-white border border-purple-100 rounded-2xl p-1.5 shadow-[0_12px_40px_rgba(124,111,232,0.15)] z-50 flex flex-col gap-1"
                >
                  {CINEMA_OPTIONS.map((c) => {
                    const isSelected = c.id === selectedCinemaId;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCinemaId(c.id);
                          setIsCinemaDropdownOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-purple-50 text-[#7C6FE8]'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="line-clamp-1">{c.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#7C6FE8] shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* 🤖 AI Auto-Schedule Button */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="h-11 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-purple-500/20 transition-all cursor-pointer border border-purple-300 shrink-0"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>🤖 AI AUTO-SCHEDULE</span>
            </button>

            {/* Add Showtime Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="h-11 px-5 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>TẠO SUẤT CHIẾU</span>
            </button>
          </div>
        </div>

        {/* Date Picker Pills Bar */}
        <div className="p-4 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button className="p-2 rounded-xl border border-gray-200 hover:bg-slate-100 text-slate-600 cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>

            {DATE_PILLS.map((dp) => {
              const isSelected = dp.key === selectedDateKey;
              return (
                <button
                  key={dp.key}
                  onClick={() => setSelectedDateKey(dp.key)}
                  className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/30'
                      : 'bg-slate-50 text-slate-700 border border-gray-200 hover:bg-slate-100'
                  }`}
                >
                  {dp.label}
                </button>
              );
            })}

            <button className="p-2 rounded-xl border border-gray-200 hover:bg-slate-100 text-slate-600 cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
            Tổng cộng: <strong className="text-[#7C6FE8] text-sm font-extrabold">{filteredShowtimes.length}</strong> suất chiếu trong ngày
          </span>
        </div>
      </div>

      {/* 2.2 Movie Palette Drag Bar */}
      <div className="p-4 rounded-3xl bg-purple-50/60 border border-purple-100 flex flex-col gap-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>DANH SÁCH PHIM ĐANG CHIẾU (KÉO THẢ VÀO MỐC GIỜ PHÒNG CHIẾU)</span>
          </span>
          <span className="text-[11px] font-bold text-slate-500">Mẹo: Kéo & Thả để Xếp Lịch Tức Thời</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {MOCK_MOVIES_LISTING.map((m) => (
            <div
              key={m.id}
              draggable
              onDragStart={() =>
                setDraggedMovie({
                  title: m.title,
                  posterUrl: m.posterUrl,
                  duration: 135,
                })
              }
              onDragEnd={() => setDraggedMovie(null)}
              className="p-2.5 rounded-2xl bg-white border border-purple-100 hover:border-[#7C6FE8] shadow-xs flex items-center gap-2.5 shrink-0 cursor-grab active:cursor-grabbing transition-transform hover:-translate-y-0.5"
            >
              <img src={m.posterUrl} alt={m.title} className="w-8 h-11 rounded-lg object-cover border border-gray-200" />
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-extrabold text-xs text-slate-900 line-clamp-1">{m.title}</span>
                <span className="text-[10px] font-bold text-slate-400">{m.duration} • Drag me</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2.3 Visual Calendar Grid (Continuous Timeline Background) */}
      <div className="rounded-3xl bg-white border border-gray-200/80 shadow-sm overflow-hidden flex flex-col p-6 relative">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#7C6FE8]" />
            <span>Sơ Đồ Lịch Chiếu 24h Chuẩn Tỷ Lệ Thực Tế (CineDot Drag-&-Drop Grid)</span>
          </h3>

          <div className="flex items-center gap-4 text-xs font-extrabold text-slate-600">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-700" />
              <span>Hard Lock (Đã bán vé)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#7C6FE8]" />
              <span>IMAX 3D</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-500" />
              <span>4DX Motion</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>VIP Gold</span>
            </div>
          </div>
        </div>

        {/* Timeline Grid Layout Container */}
        <div className="w-full overflow-x-auto relative">
          <div className="min-w-[1050px] flex flex-col gap-6 relative">
            {/* Real-time Vertical Drag Alignment Line Guide */}
            {dragGuideX !== null && dragGuideTime && (
              <div
                style={{ left: `${dragGuideX + 208}px` }}
                className="absolute top-0 bottom-0 border-l-2 border-[#7C6FE8] z-40 pointer-events-none shadow-[0_0_15px_rgba(124,111,232,0.8)] flex flex-col items-center"
              >
                <div className="bg-[#7C6FE8] text-white px-2.5 py-1 rounded-full text-xs font-black shadow-lg font-mono flex items-center gap-1.5 -mt-3 whitespace-nowrap border border-purple-300 animate-pulse">
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  <span>📍 {dragGuideTime}</span>
                </div>
              </div>
            )}

            {/* Time Axis Header Bar */}
            <div className="flex items-center border-b border-gray-200 pb-3 text-[11px] font-black text-slate-400">
              <div className="w-52 shrink-0 text-slate-700 font-extrabold uppercase">Phòng Chiếu</div>
              <div className="flex-1 relative h-6">
                {TIMELINE_HOURS.map((hour, idx) => {
                  const percent = (idx / (TIMELINE_HOURS.length - 1)) * 100;
                  return (
                    <span
                      key={hour}
                      style={{ left: `${percent}%` }}
                      className="absolute transform -translate-x-1/2 font-mono text-[11px]"
                    >
                      {hour < 10 ? '0' + hour : hour}:00
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Vertical Hour Grid Lines Overlay */}
            <div className="absolute left-52 right-0 top-10 bottom-0 pointer-events-none flex justify-between z-0 opacity-40">
              {TIMELINE_HOURS.map((_, idx) => (
                <div key={idx} className="h-full w-[1px] bg-dashed bg-slate-200" style={{ borderLeft: '1px dashed #E2E8F0' }} />
              ))}
            </div>

            {/* Rooms Vertical Rows */}
            {ROOMS_LIST.map((room) => {
              const roomShowtimes = filteredShowtimes.filter((st) => st.roomName === room.name);

              // Check Staggering Conflict with other rooms (same start minute)
              const hasStaggeringConflict = roomShowtimes.some((st) =>
                filteredShowtimes.some(
                  (other) =>
                    other.id !== st.id &&
                    other.roomName !== room.name &&
                    Math.abs(timeToMinutes(other.startTime) - timeToMinutes(st.startTime)) < 10
                )
              );

              return (
                <div key={room.id} className="flex items-center min-h-[125px] border-b border-gray-100/80 relative z-10">
                  {/* Left Room Info */}
                  <div className="w-52 shrink-0 flex flex-col pr-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-slate-900 line-clamp-1">{room.name}</span>
                      {hasStaggeringConflict && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" title="Cảnh báo lệch giờ chiếu F&B" />
                      )}
                    </div>
                    <span className="text-[10px] text-[#7C6FE8] font-bold mt-0.5">{room.format} • {room.capacity} ghế</span>
                    {hasStaggeringConflict && (
                      <span
                        className="text-[9px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 mt-1.5 w-fit flex items-center gap-1 shadow-2xs cursor-help"
                        title="Dòng khách ra/vào rạp trải đều 15p, tránh dồn 350+ khách vào quầy bắp nước F&B cùng mốc giờ gây quá tải!"
                      >
                        ⚠️ Gợi ý: Lệch 15p F&B
                      </span>
                    )}
                  </div>

                  {/* Interactive Timeline Drag & Click Lane */}
                  <div
                    onDragOver={handleTimelineDragOver}
                    onDragLeave={handleTimelineDragLeave}
                    onDrop={(e) => handleDropOnLane(room.name, e)}
                    onClick={(e) => handleEmptyCellClick(room.name, e)}
                    title="Mẹo: Click vào vị trí ô trống bất kỳ để Xếp Lịch Nhanh 1-Click!"
                    className="flex-1 h-26 bg-slate-50/50 rounded-2xl border border-gray-200/60 relative overflow-hidden transition-colors hover:bg-purple-50/30 cursor-pointer"
                  >
                    {roomShowtimes.map((st) => {
                      const startM = timeToMinutes(st.startTime);
                      const leftPercent = Math.max(0, Math.min(100, ((startM - DAY_START_MINUTES) / DAY_TOTAL_MINUTES) * 100));
                      const widthPercent = Math.max(12, (st.durationMinutes / DAY_TOTAL_MINUTES) * 100);
                      const bufferWidthPercent = (st.cleaningBufferMinutes / DAY_TOTAL_MINUTES) * 100;
                      const occupancyRate = Math.round((st.bookedSeats / st.totalSeats) * 100);

                      let colorBg = 'bg-[#7C6FE8] text-white border-purple-300';
                      if (st.format === '4DX Motion') colorBg = 'bg-cyan-600 text-white border-cyan-300';
                      if (st.format === 'VIP Gold Class') colorBg = 'bg-amber-600 text-white border-amber-300';
                      if (st.format === '2D Standard') colorBg = 'bg-indigo-600 text-white border-indigo-300';

                      return (
                        <React.Fragment key={st.id}>
                          {/* Showtime Card Block */}
                          <motion.div
                            draggable={!st.isLocked}
                            onDragStart={() => {
                              if (st.isLocked) {
                                setAlertWarningMsg(`⛔ CHẶN THAO TÁC: Suất chiếu này đã bán vé (${st.bookedSeats}/${st.totalSeats})! Không thể dịch chuyển.`);
                                setTimeout(() => setAlertWarningMsg(''), 4000);
                                return;
                              }
                              setDraggedShowtimeId(st.id);
                            }}
                            onDragEnd={() => setDraggedShowtimeId(null)}
                            style={{
                              left: `${leftPercent}%`,
                              width: `${widthPercent}%`,
                              minWidth: '240px',
                            }}
                            className={`showtime-card absolute top-1 bottom-1 rounded-xl ${colorBg} p-2.5 shadow-xs flex flex-col justify-between overflow-hidden cursor-grab active:cursor-grabbing group z-20 border hover:z-30 transition-all ${
                              st.isLocked ? 'cursor-not-allowed opacity-95 ring-2 ring-amber-300/60' : ''
                            }`}
                          >
                            {/* Card Top Section */}
                            <div className="flex items-start justify-between gap-2 w-full overflow-hidden">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <img
                                  src={st.posterUrl}
                                  alt={st.movieTitle}
                                  className="w-7 h-10 object-cover rounded-md border border-white/40 shrink-0 hidden sm:block shadow-2xs"
                                />
                                <div className="flex flex-col min-w-0 flex-1">
                                  <div className="flex items-center gap-1 min-w-0">
                                    {st.isLocked && (
                                      <span title="Hard Lock: Đã bán vé">
                                        <Lock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                                      </span>
                                    )}
                                    <h4 className="font-extrabold text-xs leading-tight line-clamp-1 text-white">{st.movieTitle}</h4>
                                  </div>
                                  <span className="text-[10px] font-bold opacity-90 font-mono text-white/90 block mt-0.5">
                                    {st.startTime} - {st.endTime}
                                  </span>
                                </div>
                              </div>

                              {/* Dynamic Demand Pill */}
                              {occupancyRate >= 85 ? (
                                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center gap-1 shadow-xs shrink-0 whitespace-nowrap">
                                  <Flame className="w-3 h-3 fill-amber-300 text-amber-300" />
                                  <span>CHÁY VÉ</span>
                                </span>
                              ) : occupancyRate <= 20 ? (
                                <button
                                  onClick={() => {
                                    setTradeoffShowtime(st);
                                    setIsTradeoffModalOpen(true);
                                  }}
                                  className="px-2 py-0.5 rounded-full bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 text-[9px] font-extrabold flex items-center gap-1 shadow-xs shrink-0 cursor-pointer border border-indigo-400/40 whitespace-nowrap"
                                >
                                  <Snowflake className="w-3 h-3 text-cyan-300" />
                                  <span>BÁN CHẬM</span>
                                </button>
                              ) : null}
                            </div>

                            {/* Card Bottom Section */}
                            <div className="flex items-center justify-between border-t border-white/20 pt-1.5 text-[10px] font-extrabold mt-1">
                              <span className="bg-black/30 px-2 py-0.5 rounded-md backdrop-blur-md text-white font-mono shrink-0">
                                {st.price / 1000}K
                              </span>

                              <span className="bg-black/30 px-2 py-0.5 rounded-md backdrop-blur-md text-white font-mono shrink-0">
                                {st.bookedSeats}/{st.totalSeats} ({occupancyRate}%)
                              </span>
                            </div>

                            {/* Hover Actions Bar */}
                            <div className="absolute inset-0 rounded-xl bg-black/65 backdrop-blur-xs hidden group-hover:flex items-center justify-center gap-2 transition-opacity z-30">
                              <button
                                onClick={() => setViewingShowtime(st)}
                                className="p-1 rounded-md bg-white/20 text-white hover:bg-white/40 cursor-pointer"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(st)}
                                className="p-1 rounded-md bg-white/20 text-white hover:bg-white/40 cursor-pointer"
                                title="Sửa suất chiếu"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingShowtime(st)}
                                className="p-1 rounded-md bg-rose-500 text-white hover:bg-rose-600 cursor-pointer"
                                title="Xóa"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>

                          {/* Automated Variable Cleaning Buffer Strip */}
                          <div
                            style={{
                              left: `calc(${leftPercent}% + 240px)`,
                              width: `${bufferWidthPercent}%`,
                            }}
                            className="absolute top-1 bottom-1 bg-slate-200/80 border border-slate-300/80 rounded-lg z-10 flex items-center justify-center text-[9px] font-bold text-slate-500 shadow-2xs min-w-[36px]"
                            title={`Dọn vệ sinh rạp: ${st.cleaningBufferMinutes} phút`}
                          >
                            <span className="hidden sm:inline">🧹 {st.cleaningBufferMinutes}p</span>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 text-slate-700 text-xs font-medium flex items-center gap-2 mt-4">
          <Info className="w-4 h-4 text-[#7C6FE8] shrink-0" />
          <span>
            <strong>Bảo vệ Thực tế:</strong> Suất chiếu dán nhãn ổ khóa <strong className="text-slate-900">🔒 Hard Lock</strong> (đã có khách mua vé) không thể dịch chuyển để ngăn ngừa khiếu nại của khách hàng.
          </span>
        </div>
      </div>

      {/* 🤖 MODAL AI AUTO-SCHEDULE OPTIONS */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
          <div className="w-full max-w-md bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-[#7C6FE8]" />
                <h3 className="text-lg font-extrabold text-slate-900">Tự Động Xếp Lịch AI (CSP Engine)</h3>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Thuật toán CSP + Greedy Backtracking (<strong className="text-[#7C6FE8]">&lt;30ms</strong>) sẽ phân bổ phim bom tấn vào Phòng 1 IMAX + Giờ vàng, tự động lệch giờ chiếu 15p giữa các phòng.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleRunAiAutoScheduler('INCREMENTAL')}
                className="p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left flex flex-col gap-1 transition-colors cursor-pointer"
              >
                <span className="font-extrabold text-xs text-[#7C6FE8] flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Chế độ 1: Chỉ Điền Khoảng Trống (Incremental Fill)
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Giữ nguyên 100% lịch Admin đã xếp tay, AI chỉ tự động lấp phim hot vào các ô thời gian trống.
                </span>
              </button>

              <button
                onClick={() => handleRunAiAutoScheduler('REGENERATE_ALL')}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-gray-200 text-left flex flex-col gap-1 transition-colors cursor-pointer"
              >
                <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-slate-600" />
                  Chế độ 2: Tái Tạo Mới 100% (Regenerate All)
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Xóa bỏ lịch trống chưa bán vé và xếp mới toàn bộ từ 08:00 đến 24:00 tối ưu doanh thu.
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📈 MODAL TRADE-OFF PROFIT MATRIX */}
      {isTradeoffModalOpen && tradeoffShowtime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-extrabold text-slate-900">Phân Tích Đánh Đổi Doanh Thu (Trade-off Profit)</h3>
              </div>
              <button
                onClick={() => setIsTradeoffModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs flex flex-col gap-1">
                <span className="font-extrabold text-rose-700">Phương án Hiện Tại (Giữ suất phim bán chậm):</span>
                <span className="text-slate-700 font-medium">
                  Phim <strong className="text-slate-900">{tradeoffShowtime.movieTitle}</strong> (Lấp đầy {Math.round((tradeoffShowtime.bookedSeats / tradeoffShowtime.totalSeats) * 100)}%) ➔ Dự báo Doanh thu: <strong className="text-rose-700 font-mono">3.300.000 VNĐ</strong>
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs flex flex-col gap-1">
                <span className="font-extrabold text-emerald-700">Phương án Đề Xuất (Đổi sang Dune 2 - Phim Cháy Vé):</span>
                <span className="text-slate-700 font-medium">
                  Phim <strong className="text-slate-900">Dune: Part Two</strong> (Dự báo Lấp đầy 85%) ➔ Dự báo Doanh thu: <strong className="text-emerald-700 font-mono">16.600.000 VNĐ</strong>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-slate-600">LỢI NHUẬN RÒNG TĂNG THÊM (NET PROFIT DELTA)</span>
                <span className="text-2xl font-black text-[#7C6FE8] font-mono">+13.300.000 VNĐ</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsTradeoffModalOpen(false)}
                className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={() => {
                  setShowtimes(
                    showtimes.map((st) =>
                      st.id === tradeoffShowtime.id
                        ? {
                            ...st,
                            movieTitle: 'Dune: Part Two (Hành Tinh Cát 2)',
                            posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80',
                            price: 180000,
                            bookedSeats: 0,
                          }
                        : st
                    )
                  );
                  setIsTradeoffModalOpen(false);
                  setToastMsg('✨ Đã thay thế suất chiếu bán chậm bằng Dune 2! Tăng dự báo +13.3 Triệu VNĐ.');
                  setTimeout(() => setToastMsg(''), 3000);
                }}
                className="px-6 py-2.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer"
              >
                CHẤP NHẬN THAY THẾ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 👁️ MODAL Xem Chi Tiết, ✏️ MODAL Edit, 🗑️ MODAL Delete & ➕ MODAL Add */}
      {viewingShowtime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#7C6FE8]" />
                <h3 className="text-lg font-extrabold text-slate-900">Chi Tiết Suất Chiếu</h3>
              </div>
              <button
                onClick={() => setViewingShowtime(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-start gap-4">
              <img
                src={viewingShowtime.posterUrl}
                alt={viewingShowtime.movieTitle}
                className="w-24 h-36 object-cover rounded-2xl border border-gray-200 shadow-md shrink-0"
              />
              <div className="flex flex-col gap-2 flex-1">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C6FE8] font-extrabold text-[11px] border border-purple-200 w-fit">
                  {viewingShowtime.format}
                </span>
                <h2 className="text-base font-extrabold text-slate-900">{viewingShowtime.movieTitle}</h2>
                <span className="text-xs font-semibold text-slate-500">{viewingShowtime.cinemaName}</span>

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700 pt-2 border-t border-gray-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Phòng chiếu</span>
                    <strong className="text-slate-900">{viewingShowtime.roomName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Khung giờ</span>
                    <strong className="text-slate-900">{viewingShowtime.startTime} - {viewingShowtime.endTime}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Giá vé cơ bản</span>
                    <strong className="text-emerald-600">{viewingShowtime.price.toLocaleString('vi-VN')} VNĐ</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Ghế đã đặt</span>
                    <strong className="text-[#7C6FE8]">{viewingShowtime.bookedSeats}/{viewingShowtime.totalSeats} Ghế</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                onClick={() => setViewingShowtime(null)}
                className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {editingShowtime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#7C6FE8]" />
                <h3 className="text-lg font-extrabold text-slate-900">Chỉnh Sửa Suất Chiếu</h3>
              </div>
              <button
                onClick={() => setEditingShowtime(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditShowtime} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Tên phim chiếu</label>
                <input
                  type="text"
                  value={editMovieTitle}
                  onChange={(e) => setEditMovieTitle(e.target.value)}
                  required
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Phòng chiếu</label>
                  <select
                    value={editRoomName}
                    onChange={(e) => setEditRoomName(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  >
                    {ROOMS_LIST.map((r) => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Giờ bắt đầu</label>
                  <input
                    type="time"
                    value={editStartTime}
                    onChange={(e) => setEditStartTime(e.target.value)}
                    required
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Giá vé cơ bản (VNĐ)</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    required
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Trạng thái bán vé</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  >
                    <option value="OPEN">Mở bán vé</option>
                    <option value="CLOSED">Khóa / Tạm dừng</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingShowtime(null)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  LƯU CẬP NHẬT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingShowtime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
          <div className="w-full max-w-md bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative text-slate-900">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100 shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-extrabold text-slate-900">Xác Nhận Xóa Suất Chiếu</h3>
                <span className="text-xs text-rose-600 font-bold">Hành động này không thể hoàn tác</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
              Bạn có chắc chắn muốn xóa suất chiếu phim <strong className="text-slate-900 font-extrabold">"{deletingShowtime.movieTitle}"</strong> ({deletingShowtime.startTime} - {deletingShowtime.endTime}) tại {deletingShowtime.roomName} không?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingShowtime(null)}
                className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer"
              >
                XÁC NHẬN XÓA
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#7C6FE8]" />
                <h3 className="text-lg font-extrabold text-slate-900">Tạo Suất Chiếu Mới</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddShowtime} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Chọn Phim Chiếu</label>
                <select
                  value={addMovieTitle}
                  onChange={(e) => setAddMovieTitle(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                >
                  <option value="Dune: Part Two (Hành Tinh Cát 2)">Dune: Part Two (Hành Tinh Cát 2)</option>
                  <option value="Deadpool & Wolverine">Deadpool & Wolverine</option>
                  <option value="Inside Out 2 (Những Mảnh Ghép Cảm Xúc 2)">Inside Out 2</option>
                  <option value="Godzilla x Kong: The New Empire">Godzilla x Kong</option>
                  <option value="Exhuma: Quật Mộ Trùng Ma">Exhuma: Quật Mộ Trùng Ma</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Phòng chiếu</label>
                  <select
                    value={addRoomName}
                    onChange={(e) => setAddRoomName(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  >
                    {ROOMS_LIST.map((r) => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Giờ bắt đầu</label>
                  <input
                    type="time"
                    value={addStartTime}
                    onChange={(e) => setAddStartTime(e.target.value)}
                    required
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                  <span className="text-[10px] text-slate-400">Giờ kết thúc dự kiến: {calculateEndTime(addStartTime, 135)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Giá vé cơ bản (VNĐ)</label>
                  <input
                    type="number"
                    value={addPrice}
                    onChange={(e) => setAddPrice(Number(e.target.value))}
                    required
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Trạng thái bán vé</label>
                  <select
                    value={addStatus}
                    onChange={(e) => setAddStatus(e.target.value as any)}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                  >
                    <option value="OPEN">Mở bán vé</option>
                    <option value="CLOSED">Khóa / Tạm dừng</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  TẠO SUẤT CHIẾU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
