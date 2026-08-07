'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Ticket,
  Users,
  Film,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Smartphone,
  Globe,
  Store,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { MOCK_ADMIN_METRICS, MOCK_RECENT_TRANSACTIONS } from '../mocks/mockAdminData';

type MetricTabKey = 'revenue' | 'tickets' | 'users' | 'occupancy' | 'concessions';

interface ChartPoint {
  date: string;
  valLabel: string;
  x: number;
  y: number;
}

const CINEMA_OPTIONS = [
  { id: 'ALL', label: 'Tất cả cụm rạp' },
  { id: 'HANOI', label: 'Galaxy CineX Hanoi Centre' },
  { id: 'LANDMARK81', label: 'CineDot Landmark 81 Saigon' },
  { id: 'BADINH', label: 'CineDot Ba Đình Centre' },
  { id: 'DANANG', label: 'CineDot Đà Nẵng Premier' },
];

const CHANNEL_OPTIONS = [
  { id: 'ALL', label: 'Tất cả kênh đặt vé' },
  { id: 'APP', label: 'Mobile App (62%)' },
  { id: 'WEB', label: 'Website (24%)' },
  { id: 'COUNTER', label: 'Tại quầy Rạp (14%)' },
];

const TAB_DATA: Record<
  MetricTabKey,
  {
    title: string;
    value: string;
    growth: string;
    isPositive: boolean;
    points: ChartPoint[];
    pathD: string;
    areaD: string;
    yAxisMax: string;
    yAxisMid: string;
  }
> = {
  revenue: {
    title: 'Doanh Thu Tổng',
    value: '2.85 Tỷ VNĐ',
    growth: '+18.5%',
    isPositive: true,
    yAxisMax: '3.0 Tỷ',
    yAxisMid: '1.5 Tỷ',
    points: [
      { date: '01/08', valLabel: '65 Tr', x: 40, y: 170 },
      { date: '05/08', valLabel: '82 Tr', x: 160, y: 140 },
      { date: '10/08', valLabel: '95 Tr', x: 280, y: 110 },
      { date: '15/08', valLabel: '120 Tr', x: 400, y: 65 },
      { date: '20/08', valLabel: '105 Tr', x: 520, y: 90 },
      { date: '25/08', valLabel: '140 Tr', x: 640, y: 35 },
      { date: '30/08', valLabel: '155 Tr', x: 760, y: 20 },
    ],
    pathD: 'M 40 170 C 100 155, 120 145, 160 140 C 200 135, 240 120, 280 110 C 320 100, 360 75, 400 65 C 440 55, 480 95, 520 90 C 560 85, 600 45, 640 35 C 680 25, 720 22, 760 20',
    areaD: 'M 40 170 C 100 155, 120 145, 160 140 C 200 135, 240 120, 280 110 C 320 100, 360 75, 400 65 C 440 55, 480 95, 520 90 C 560 85, 600 45, 640 35 C 680 25, 720 22, 760 20 L 760 210 L 40 210 Z',
  },
  tickets: {
    title: 'Số Vé Đã Bán',
    value: '28.450 Vé',
    growth: '+12.3%',
    isPositive: true,
    yAxisMax: '30.000',
    yAxisMid: '15.000',
    points: [
      { date: '01/08', valLabel: '650 vé', x: 40, y: 160 },
      { date: '05/08', valLabel: '800 vé', x: 160, y: 135 },
      { date: '10/08', valLabel: '920 vé', x: 280, y: 115 },
      { date: '15/08', valLabel: '1.150 vé', x: 400, y: 70 },
      { date: '20/08', valLabel: '1.020 vé', x: 520, y: 95 },
      { date: '25/08', valLabel: '1.380 vé', x: 640, y: 40 },
      { date: '30/08', valLabel: '1.450 vé', x: 760, y: 25 },
    ],
    pathD: 'M 40 160 C 100 148, 120 140, 160 135 C 200 130, 240 120, 280 115 C 320 110, 360 80, 400 70 C 440 60, 480 100, 520 95 C 560 90, 600 50, 640 40 C 680 30, 720 28, 760 25',
    areaD: 'M 40 160 C 100 148, 120 140, 160 135 C 200 130, 240 120, 280 115 C 320 110, 360 80, 400 70 C 440 60, 480 100, 520 95 C 560 90, 600 50, 640 40 C 680 30, 720 28, 760 25 L 760 210 L 40 210 Z',
  },
  users: {
    title: 'Khách Hàng Đăng Ký',
    value: '15.420 Thành Viên',
    growth: '+8.5%',
    isPositive: true,
    yAxisMax: '18.000',
    yAxisMid: '9.000',
    points: [
      { date: '01/08', valLabel: '12.1K', x: 40, y: 150 },
      { date: '05/08', valLabel: '12.8K', x: 160, y: 130 },
      { date: '10/08', valLabel: '13.4K', x: 280, y: 110 },
      { date: '15/08', valLabel: '14.0K', x: 400, y: 90 },
      { date: '20/08', valLabel: '14.5K', x: 520, y: 75 },
      { date: '25/08', valLabel: '15.0K', x: 640, y: 55 },
      { date: '30/08', valLabel: '15.4K', x: 760, y: 40 },
    ],
    pathD: 'M 40 150 C 100 140, 120 135, 160 130 C 200 120, 240 115, 280 110 C 320 100, 360 95, 400 90 C 440 85, 480 80, 520 75 C 560 65, 600 60, 640 55 C 680 48, 720 42, 760 40',
    areaD: 'M 40 150 C 100 140, 120 135, 160 130 C 200 120, 240 115, 280 110 C 320 100, 360 95, 400 90 C 440 85, 480 80, 520 75 C 560 65, 600 60, 640 55 C 680 48, 720 42, 760 40 L 760 210 L 40 210 Z',
  },
  occupancy: {
    title: 'Tỷ Lệ Lấp Đầy Ghế',
    value: '84.0%',
    growth: '+2.5%',
    isPositive: true,
    yAxisMax: '100%',
    yAxisMid: '50%',
    points: [
      { date: '01/08', valLabel: '72%', x: 40, y: 120 },
      { date: '05/08', valLabel: '75%', x: 160, y: 105 },
      { date: '10/08', valLabel: '78%', x: 280, y: 90 },
      { date: '15/08', valLabel: '86%', x: 400, y: 55 },
      { date: '20/08', valLabel: '81%', x: 520, y: 75 },
      { date: '25/08', valLabel: '88%', x: 640, y: 45 },
      { date: '30/08', valLabel: '84%', x: 760, y: 60 },
    ],
    pathD: 'M 40 120 C 100 112, 120 108, 160 105 C 200 98, 240 92, 280 90 C 320 75, 360 60, 400 55 C 440 65, 480 78, 520 75 C 560 60, 600 50, 640 45 C 680 50, 720 58, 760 60',
    areaD: 'M 40 120 C 100 112, 120 108, 160 105 C 200 98, 240 92, 280 90 C 320 75, 360 60, 400 55 C 440 65, 480 78, 520 75 C 560 60, 600 50, 640 45 C 680 50, 720 58, 760 60 L 760 210 L 40 210 Z',
  },
  concessions: {
    title: 'Doanh Thu Bắp Nước',
    value: '420 Triệu VNĐ',
    growth: '-2.2%',
    isPositive: false,
    yAxisMax: '500 Tr',
    yAxisMid: '250 Tr',
    points: [
      { date: '01/08', valLabel: '12 Tr', x: 40, y: 130 },
      { date: '05/08', valLabel: '15 Tr', x: 160, y: 110 },
      { date: '10/08', valLabel: '14 Tr', x: 280, y: 120 },
      { date: '15/08', valLabel: '18 Tr', x: 400, y: 80 },
      { date: '20/08', valLabel: '13 Tr', x: 520, y: 130 },
      { date: '25/08', valLabel: '16 Tr', x: 640, y: 100 },
      { date: '30/08', valLabel: '14 Tr', x: 760, y: 120 },
    ],
    pathD: 'M 40 130 C 100 118, 120 112, 160 110 C 200 115, 240 118, 280 120 C 320 95, 360 85, 400 80 C 440 105, 480 125, 520 130 C 560 110, 600 105, 640 100 C 680 110, 720 118, 760 120',
    areaD: 'M 40 130 C 100 118, 120 112, 160 110 C 200 115, 240 118, 280 120 C 320 95, 360 85, 400 80 C 440 105, 480 125, 520 130 C 560 110, 600 105, 640 100 C 680 110, 720 118, 760 120 L 760 210 L 40 210 Z',
  },
};

const ITEMS_PER_PAGE = 4;

export function AdminDashboardView() {
  const [activeTab, setActiveTab] = useState<MetricTabKey>('revenue');
  const [timeFilter, setTimeFilter] = useState<'today' | '7d' | '28d' | 'this_month' | 'last_month'>('this_month');
  const [selectedCinema, setSelectedCinema] = useState('ALL');
  const [selectedChannel, setSelectedChannel] = useState('ALL');
  const [activePoint, setActivePoint] = useState<ChartPoint | null>(null);

  // Dropdown open states
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);
  const [isChannelOpen, setIsChannelOpen] = useState(false);

  // Dropdown refs for click-outside detection
  const cinemaRef = React.useRef<HTMLDivElement>(null);
  const channelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cinemaRef.current && !cinemaRef.current.contains(event.target as Node)) {
        setIsCinemaOpen(false);
      }
      if (channelRef.current && !channelRef.current.contains(event.target as Node)) {
        setIsChannelOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pagination state for Recent Transactions Table
  const [txPage, setTxPage] = useState(1);

  const currentTabInfo = TAB_DATA[activeTab];

  // Calculate paginated transactions
  const totalTx = MOCK_RECENT_TRANSACTIONS.length;
  const totalPages = Math.ceil(totalTx / ITEMS_PER_PAGE);
  const startIndex = (txPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalTx);
  const currentTxList = MOCK_RECENT_TRANSACTIONS.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col gap-8 font-sans">
      {/* Title Header */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>TỔNG QUAN DOANH THU VẬN HÀNH</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Bảng Điều Hành CineDot System
        </h1>
      </div>

      {/* 3.1. Time Filter Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Time Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
          {[
            { key: 'today', label: 'Hôm nay' },
            { key: '7d', label: '7 ngày qua' },
            { key: '28d', label: '28 ngày qua' },
            { key: 'this_month', label: 'Tháng này' },
            { key: 'last_month', label: 'Tháng trước' },
          ].map((tf) => (
            <button
              key={tf.key}
              onClick={() => setTimeFilter(tf.key as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                timeFilter === tf.key
                  ? 'bg-white text-[#7C6FE8] shadow-md border border-purple-100 font-extrabold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Custom Popover Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          {/* Cinema Filter Dropdown */}
          <div ref={cinemaRef} className="relative">
            <button
              onClick={() => {
                setIsCinemaOpen(!isCinemaOpen);
                setIsChannelOpen(false);
              }}
              className={`flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                isCinemaOpen
                  ? 'border-[#7C6FE8] bg-purple-50/60 text-[#7C6FE8] shadow-xs'
                  : 'border-gray-200 text-slate-700 hover:border-[#7C6FE8] hover:bg-white'
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
              <span>{CINEMA_OPTIONS.find((c) => c.id === selectedCinema)?.label || 'Tất cả cụm rạp'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isCinemaOpen ? 'rotate-180 text-[#7C6FE8]' : ''
                }`}
              />
            </button>

            {isCinemaOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-64 bg-white border border-purple-100 rounded-2xl p-1.5 shadow-[0_12px_40px_rgba(124,111,232,0.15)] z-50 flex flex-col gap-0.5"
              >
                {CINEMA_OPTIONS.map((opt) => {
                  const isSelected = selectedCinema === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedCinema(opt.id);
                        setIsCinemaOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-purple-50 text-[#7C6FE8]'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="line-clamp-1">{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Channel Filter Dropdown */}
          <div ref={channelRef} className="relative">
            <button
              onClick={() => {
                setIsChannelOpen(!isChannelOpen);
                setIsCinemaOpen(false);
              }}
              className={`flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                isChannelOpen
                  ? 'border-[#7C6FE8] bg-purple-50/60 text-[#7C6FE8] shadow-xs'
                  : 'border-gray-200 text-slate-700 hover:border-[#7C6FE8] hover:bg-white'
              }`}
            >
              <ChevronDown className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
              <span>{CHANNEL_OPTIONS.find((c) => c.id === selectedChannel)?.label || 'Tất cả kênh đặt vé'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isChannelOpen ? 'rotate-180 text-[#7C6FE8]' : ''
                }`}
              />
            </button>

            {isChannelOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white border border-purple-100 rounded-2xl p-1.5 shadow-[0_12px_40px_rgba(124,111,232,0.15)] z-50 flex flex-col gap-0.5"
              >
                {CHANNEL_OPTIONS.map((opt) => {
                  const isSelected = selectedChannel === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedChannel(opt.id);
                        setIsChannelOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-purple-50 text-[#7C6FE8]'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 3.2. UNIFIED MASTER ANALYTICS CARD (Builden Workspace Style) */}
      <div className="rounded-3xl bg-white border border-gray-200/80 shadow-sm overflow-hidden flex flex-col">
        {/* Horizontal Stat Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 border-b border-gray-100 bg-slate-50/50">
          {(
            [
              { key: 'revenue', icon: TrendingUp },
              { key: 'tickets', icon: Ticket },
              { key: 'users', icon: Users },
              { key: 'occupancy', icon: Film },
              { key: 'concessions', icon: ShoppingBag },
            ] as const
          ).map((item) => {
            const data = TAB_DATA[item.key];
            const isActive = activeTab === item.key;
            const IconComp = item.icon;

            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  setActivePoint(null);
                }}
                className={`p-5 flex flex-col gap-2 text-left transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-white border-t-4 border-t-[#7C6FE8] shadow-xs'
                    : 'hover:bg-slate-100/60 border-t-4 border-t-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-[#7C6FE8]' : 'text-slate-400'}`} />
                    <span>{data.title}</span>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-0.5 ${
                      data.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {data.isPositive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    <span>{data.growth}</span>
                  </span>
                </div>

                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                  {data.value}
                </span>

                <span className="text-[10px] text-slate-400 font-medium">so với tháng trước</span>
              </button>
            );
          })}
        </div>

        {/* Master Line Chart Area */}
        <div className="p-6 flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#7C6FE8] animate-pulse" />
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Xu Hướng {currentTabInfo.title} trong 30 ngày qua
              </h3>
            </div>
            <span className="text-xs font-bold text-[#7C6FE8] bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              {currentTabInfo.value}
            </span>
          </div>

          {/* SVG Smooth Curve Line Chart with Glowing Gradient */}
          <div className="w-full h-64 relative bg-gradient-to-b from-purple-50/20 to-transparent rounded-2xl p-4 border border-purple-100/50">
            {/* Grid Y-Axis Lines & Labels */}
            <div className="absolute left-4 right-4 top-6 bottom-10 flex flex-col justify-between pointer-events-none border-b border-gray-100">
              <div className="border-b border-dashed border-gray-200/80 flex items-center justify-between text-[10px] text-slate-400 font-mono pb-1">
                <span>{currentTabInfo.yAxisMax}</span>
              </div>
              <div className="border-b border-dashed border-gray-200/80 flex items-center justify-between text-[10px] text-slate-400 font-mono pb-1">
                <span>{currentTabInfo.yAxisMid}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>0</span>
              </div>
            </div>

            <svg viewBox="0 0 800 240" className="w-full h-full overflow-visible relative z-10">
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C6FE8" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#7C6FE8" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Area Gradient Fill */}
              <motion.path
                key={`area-${activeTab}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                d={currentTabInfo.areaD}
                fill="url(#purpleGradient)"
              />

              {/* Smooth Line Curve */}
              <motion.path
                key={`line-${activeTab}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                d={currentTabInfo.pathD}
                fill="none"
                stroke="#7C6FE8"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#glow)"
              />

              {/* Data Points */}
              {currentTabInfo.points.map((pt, idx) => (
                <g key={idx} className="group cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    className="fill-white stroke-[#7C6FE8] stroke-[3px] transition-transform duration-200 group-hover:r-7 group-hover:stroke-purple-900"
                    onMouseEnter={() => setActivePoint(pt)}
                  />
                  {/* Tooltip Label */}
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    className="text-[10px] font-black fill-[#7C6FE8] font-mono opacity-80 group-hover:opacity-100 group-hover:fill-slate-900 transition-all"
                  >
                    {pt.valLabel}
                  </text>
                </g>
              ))}
            </svg>

            {/* X-Axis Date Labels */}
            <div className="absolute bottom-2 left-10 right-10 flex justify-between text-[11px] font-extrabold text-slate-400 font-mono">
              {currentTabInfo.points.map((pt) => (
                <span key={pt.date}>{pt.date}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3.3. Secondary Analytics Row (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5/12): Nguồn Đặt Vé (Booking Channels Breakdown) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col justify-between gap-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex flex-col">
              <h3 className="font-extrabold text-base text-slate-900">Nguồn Đặt Vé (Channels)</h3>
              <span className="text-xs text-slate-500 font-medium">Tỷ lệ đặt vé qua các nền tảng</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-purple-50 text-[#7C6FE8] text-xs font-bold border border-purple-100">
              100% Khách
            </span>
          </div>

          {/* Breakdown Items */}
          <div className="flex flex-col gap-4">
            {/* Mobile App */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2 text-slate-800">
                  <Smartphone className="w-4 h-4 text-[#7C6FE8]" />
                  <span>Mobile App (iOS & Android)</span>
                </span>
                <span className="font-mono text-[#7C6FE8] font-black">62% (17.639 Vé)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '62%' }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-[#7C6FE8] rounded-full shadow-xs"
                />
              </div>
            </div>

            {/* Website */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2 text-slate-800">
                  <Globe className="w-4 h-4 text-indigo-500" />
                  <span>Website trực tuyến (CineDot.vn)</span>
                </span>
                <span className="font-mono text-indigo-600 font-black">24% (6.828 Vé)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '24%' }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="h-full bg-indigo-500 rounded-full shadow-xs"
                />
              </div>
            </div>

            {/* Direct Counter */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2 text-slate-800">
                  <Store className="w-4 h-4 text-purple-400" />
                  <span>Mua trực tiếp tại Quầy Rạp</span>
                </span>
                <span className="font-mono text-purple-500 font-black">14% (3.983 Vé)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '14%' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full bg-purple-300 rounded-full shadow-xs"
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs text-slate-600 font-semibold flex items-center justify-between">
            <span>Ứng dụng Di động đóng góp lớn nhất:</span>
            <strong className="text-[#7C6FE8] font-extrabold">+24.5% tăng trưởng</strong>
          </div>
        </div>

        {/* Right Column (7/12): Giao Dịch Real-Time (Live Table + Pagination) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex flex-col">
                <h3 className="font-extrabold text-base text-slate-900">Giao Dịch Real-Time</h3>
                <span className="text-xs text-slate-500 font-medium">Danh sách các đơn đặt vé vừa phát sinh</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>HỆ THỐNG LIVE</span>
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[550px]">
                <thead>
                  <tr className="border-b border-gray-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50">
                    <th className="p-3 rounded-l-xl">Mã Đơn / Khách</th>
                    <th className="p-3">Phim & Cụm Rạp</th>
                    <th className="p-3">Số Vé</th>
                    <th className="p-3">Tổng Tiền</th>
                    <th className="p-3 rounded-r-xl">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-semibold text-slate-700">
                  {currentTxList.map((tx) => (
                    <tr key={tx.id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-mono font-extrabold text-[#7C6FE8]">{tx.bookingCode}</span>
                          <span className="text-[11px] text-slate-900 font-bold">{tx.customerName}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 line-clamp-1">{tx.movieTitle}</span>
                          <span className="text-[10px] text-slate-500">{tx.cinemaName}</span>
                        </div>
                      </td>
                      <td className="p-3 font-bold text-slate-900">{tx.seatCount} vé</td>
                      <td className="p-3 font-mono font-extrabold text-emerald-600">
                        {tx.totalAmount.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="p-3">
                        {tx.status === 'CHECKED_IN' ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>ĐÃ ĐẾN RẠP</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-purple-50 text-[#7C6FE8] text-[10px] font-extrabold border border-purple-200 flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3 text-[#7C6FE8]" />
                            <span>THANH TOÁN</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs font-semibold text-slate-500">
            <span>
              Hiển thị <strong className="text-slate-900">{startIndex + 1}</strong> - <strong className="text-slate-900">{endIndex}</strong> trong số <strong className="text-slate-900">{totalTx}</strong> giao dịch
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTxPage((prev) => Math.max(prev - 1, 1))}
                disabled={txPage === 1}
                className="p-1.5 rounded-xl border border-gray-200 hover:bg-slate-100 text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                title="Trang trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setTxPage(p)}
                  className={`w-7 h-7 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    txPage === p
                      ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/30'
                      : 'bg-slate-50 text-slate-600 border border-gray-200 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setTxPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={txPage === totalPages}
                className="p-1.5 rounded-xl border border-gray-200 hover:bg-slate-100 text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                title="Trang sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
