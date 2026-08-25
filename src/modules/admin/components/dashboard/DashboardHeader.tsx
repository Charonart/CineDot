import React from 'react';
import { RefreshCw } from 'lucide-react';
import { RealtimeConnectionStatus } from '../../types/adminReport.types';

interface DashboardHeaderProps {
  connectionStatus: RealtimeConnectionStatus;
  isFetching: boolean;
  onRefresh: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  connectionStatus,
  isFetching,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Title & Description */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <span>Bảng Điều Hành</span>
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500">
          Tổng quan hoạt động và doanh thu thời gian thực hệ thống CineDot.
        </p>
      </div>

      {/* Right Controls: Realtime Status Badge & Refresh Button */}
      <div className="flex items-center gap-3 self-start sm:self-auto">
        {/* Realtime Status Indicator */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors select-none ${
            connectionStatus === 'connected'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : connectionStatus === 'connecting'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}
          title={
            connectionStatus === 'connected'
              ? 'Hệ thống WebSocket đang kết nối và nhận sự kiện trực tiếp.'
              : connectionStatus === 'connecting'
              ? 'Đang kết nối tới máy chủ thời gian thực...'
              : 'Mất kết nối thời gian thực. Hệ thống tự động chuyển sang cập nhật qua REST API.'
          }
        >
          <span className="relative flex h-2 w-2">
            {connectionStatus === 'connected' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-500'
                  : connectionStatus === 'connecting'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-slate-400'
              }`}
            />
          </span>

          <span className="text-[11px]">
            {connectionStatus === 'connected'
              ? 'Realtime'
              : connectionStatus === 'connecting'
              ? 'Đang kết nối'
              : 'Ngoại tuyến'}
          </span>
        </div>

        {/* Refresh Action Button */}
        <button
          onClick={onRefresh}
          disabled={isFetching}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white border border-slate-200/90 hover:border-[#7C6FE8] text-slate-700 hover:text-[#7C6FE8] hover:bg-purple-50/50 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-60"
          title="Làm mới dữ liệu"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-[#7C6FE8]' : ''}`} />
          <span>Làm mới</span>
        </button>
      </div>
    </div>
  );
};
