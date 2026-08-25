import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Ticket, Calendar, DollarSign } from 'lucide-react';
import { RevenueChartItem } from '../../types/adminReport.types';
import { Skeleton } from '@/shared/ui/Skeleton';

interface RevenueChartProps {
  data: RevenueChartItem[];
  isLoading: boolean;
  timeFilterLabel?: string;
}

type MetricMode = 'revenue' | 'tickets';

export const RevenueChart: React.FC<RevenueChartProps> = ({ data, isLoading, timeFilterLabel }) => {
  const [metricMode, setMetricMode] = useState<MetricMode>('revenue');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Calculate scales and SVG path
  const chartMetrics = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        points: [],
        pathD: '',
        areaD: '',
        yMax: 0,
        yMaxLabel: '0 ₫',
        yMidLabel: '0 ₫',
        totalSumFormatted: '0 ₫',
      };
    }

    const values = data.map((d) => (metricMode === 'revenue' ? d.revenue : d.ticketsSold));
    const maxValue = Math.max(...values, 10);
    // Add 15% headroom
    const yMax = Math.ceil(maxValue * 1.15);
    const yMid = Math.round(yMax / 2);

    const svgWidth = 800;
    const svgHeight = 220;
    const paddingX = 40;
    const paddingY = 20;

    const effectiveWidth = svgWidth - paddingX * 2;
    const effectiveHeight = svgHeight - paddingY * 2;

    const points = data.map((d, index) => {
      const val = metricMode === 'revenue' ? d.revenue : d.ticketsSold;
      const x =
        data.length === 1
          ? svgWidth / 2
          : paddingX + (index / (data.length - 1)) * effectiveWidth;
      const y = svgHeight - paddingY - (val / yMax) * effectiveHeight;

      return {
        x,
        y: Math.max(paddingY, Math.min(y, svgHeight - paddingY)),
        val,
        item: d,
      };
    });

    // Create SVG smooth path (Catmull-Rom or Cubic Bézier)
    let pathD = '';
    if (points.length === 1) {
      pathD = `M ${points[0].x - 20} ${points[0].y} L ${points[0].x + 20} ${points[0].y}`;
    } else if (points.length > 1) {
      pathD = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i === 0 ? 0 : i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }
    }

    const firstX = points[0]?.x || paddingX;
    const lastX = points[points.length - 1]?.x || svgWidth - paddingX;
    const bottomY = svgHeight - paddingY;
    const areaD = pathD ? `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z` : '';

    const totalSum = data.reduce((acc, curr) => acc + (metricMode === 'revenue' ? curr.revenue : curr.ticketsSold), 0);

    const formatFn = (num: number) => {
      if (metricMode === 'revenue') {
        if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + ' Tỷ ₫';
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + ' Tr ₫';
        return num.toLocaleString('vi-VN') + ' ₫';
      }
      return num.toLocaleString('vi-VN') + ' Vé';
    };

    return {
      points,
      pathD,
      areaD,
      yMax,
      yMaxLabel: formatFn(yMax),
      yMidLabel: formatFn(yMid),
      totalSumFormatted: formatFn(totalSum),
    };
  }, [data, metricMode]);

  const activePoint = hoveredPointIndex !== null ? chartMetrics.points[hoveredPointIndex] : null;

  if (isLoading) {
    return (
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Skeleton className="w-48 h-6 rounded-lg" />
          <Skeleton className="w-36 h-9 rounded-2xl" />
        </div>
        <Skeleton className="w-full h-72 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-5">
      {/* Header: Title + Toggle Metric Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-black">
            {metricMode === 'revenue' ? <TrendingUp className="w-4 h-4" /> : <Ticket className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Biểu Đồ {metricMode === 'revenue' ? 'Doanh Thu' : 'Số Vé Bán'}
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {timeFilterLabel || 'Thống kê theo từng mốc thời gian'}
            </span>
          </div>
        </div>

        {/* Metric Switch Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl self-start sm:self-auto border border-slate-200/50">
          <button
            onClick={() => {
              setMetricMode('revenue');
              setHoveredPointIndex(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              metricMode === 'revenue'
                ? 'bg-white text-[#7C6FE8] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3 h-3" />
            <span>Doanh thu</span>
          </button>

          <button
            onClick={() => {
              setMetricMode('tickets');
              setHoveredPointIndex(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              metricMode === 'tickets'
                ? 'bg-white text-[#7C6FE8] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ticket className="w-3 h-3" />
            <span>Số vé</span>
          </button>
        </div>
      </div>

      {/* SVG Chart Canvas */}
      {data.length === 0 ? (
        <div className="w-full h-64 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs font-bold">
          <Calendar className="w-8 h-8 opacity-40 text-slate-400" />
          <span>Chưa có dữ liệu giao dịch trong khoảng thời gian này</span>
        </div>
      ) : (
        <div className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-purple-50/25 to-transparent rounded-2xl p-4 border border-purple-100/60 overflow-hidden">
          {/* Background Grid Lines & Y-Axis Labels */}
          <div className="absolute left-4 right-4 top-4 bottom-8 flex flex-col justify-between pointer-events-none">
            <div className="border-b border-dashed border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono pb-1">
              <span>{chartMetrics.yMaxLabel}</span>
            </div>
            <div className="border-b border-dashed border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono pb-1">
              <span>{chartMetrics.yMidLabel}</span>
            </div>
            <div className="border-b border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono pb-1">
              <span>0</span>
            </div>
          </div>

          <svg viewBox="0 0 800 220" className="w-full h-full overflow-visible relative z-10">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C6FE8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#7C6FE8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area Fill */}
            {chartMetrics.areaD && (
              <motion.path
                key={`area-${metricMode}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                d={chartMetrics.areaD}
                fill="url(#chartGradient)"
              />
            )}

            {/* Smooth Line Path */}
            {chartMetrics.pathD && (
              <motion.path
                key={`line-${metricMode}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                d={chartMetrics.pathD}
                fill="none"
                stroke="#7C6FE8"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            )}

            {/* Interactive Data Points */}
            {chartMetrics.points.map((pt, idx) => {
              const isHovered = hoveredPointIndex === idx;
              return (
                <g key={idx} className="cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 7 : 4.5}
                    className="fill-white stroke-[#7C6FE8] stroke-[3px] transition-all duration-150 hover:stroke-purple-900"
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  />
                  {/* Invisible larger hover area for touch/mouse */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="16"
                    className="fill-transparent"
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Tooltip */}
          <AnimatePresence>
            {activePoint && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{
                  left: `${(activePoint.x / 800) * 100}%`,
                  top: `${(activePoint.y / 220) * 80}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-full mb-3 z-30 pointer-events-none bg-slate-900/95 text-white p-2.5 rounded-xl shadow-xl backdrop-blur-sm border border-slate-700 text-xs flex flex-col gap-1 min-w-[130px]"
              >
                <span className="text-[10px] font-bold text-slate-400">
                  Ngày: {activePoint.item.rawDate || activePoint.item.date}
                </span>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-purple-300">Doanh thu:</span>
                  <strong className="font-mono font-bold text-white">
                    {activePoint.item.revenue.toLocaleString('vi-VN')} ₫
                  </strong>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-slate-300">Số vé:</span>
                  <strong className="font-mono font-bold text-emerald-400">
                    {activePoint.item.ticketsSold.toLocaleString('vi-VN')}
                  </strong>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* X-Axis Date Labels */}
          <div className="absolute bottom-2 left-8 right-8 flex justify-between text-[10px] sm:text-[11px] font-bold text-slate-400 font-mono overflow-hidden">
            {data.length <= 10 ? (
              data.map((pt, i) => (
                <span key={i} className="truncate">
                  {pt.date}
                </span>
              ))
            ) : (
              <>
                <span>{data[0]?.date}</span>
                <span>{data[Math.floor(data.length / 2)]?.date}</span>
                <span>{data[data.length - 1]?.date}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
