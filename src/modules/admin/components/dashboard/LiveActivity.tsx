import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, CheckCircle2, RotateCcw, XCircle, Clock, Inbox } from 'lucide-react';
import { LiveActivityItem } from '../../types/adminReport.types';

interface LiveActivityProps {
  activities: LiveActivityItem[];
}

export const LiveActivity: React.FC<LiveActivityProps> = ({ activities }) => {
  const getBadge = (type: LiveActivityItem['actionType']) => {
    switch (type) {
      case 'payment_completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>ĐÃ THANH TOÁN</span>
          </span>
        );
      case 'check_in':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[10px] font-extrabold border border-sky-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-sky-600" />
            <span>ĐÃ CHECK-IN</span>
          </span>
        );
      case 'refund_completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold border border-amber-200 flex items-center gap-1">
            <RotateCcw className="w-3 h-3 text-amber-600" />
            <span>HOÀN TIỀN</span>
          </span>
        );
      case 'booking_cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-extrabold border border-rose-200 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>ĐÃ HỦY ĐƠN</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C6FE8] text-[10px] font-extrabold border border-purple-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#7C6FE8]" />
            <span>CẬP NHẬT</span>
          </span>
        );
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between gap-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center font-black">
            <Activity className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-extrabold text-base text-slate-900">Hoạt Động Trực Tiếp</h3>
            <span className="text-xs text-slate-400 font-medium">
              Sự kiện đơn hàng phát sinh thời gian thực trong phiên làm việc
            </span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold border border-emerald-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>HỆ THỐNG LIVE</span>
        </span>
      </div>

      {/* Activity List */}
      {activities.length === 0 ? (
        <div className="py-10 flex flex-col items-center justify-center gap-2 text-center text-slate-400">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
            <Inbox className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-600">Chưa có giao dịch phát sinh trong phiên này</p>
          <p className="text-[11px] text-slate-400 max-w-xs">
            Khi khách hàng đặt vé, thanh toán hoặc check-in qua hệ thống, sự kiện sẽ tự động xuất hiện tại đây ngay lập tức.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50/70">
                <th className="p-3 rounded-l-xl">Mã Đơn / Khách Hàng</th>
                <th className="p-3">Hành Động</th>
                <th className="p-3">Số Tiền</th>
                <th className="p-3">Thời Gian</th>
                <th className="p-3 rounded-r-xl text-right">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              <AnimatePresence initial={false}>
                {activities.map((act) => (
                  <motion.tr
                    key={act.id}
                    initial={{ opacity: 0, backgroundColor: '#FAF5FF' }}
                    animate={{ opacity: 1, backgroundColor: 'transparent' }}
                    transition={{ duration: 0.8 }}
                    className="hover:bg-purple-50/30 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-mono font-black text-[#7C6FE8]">{act.bookingCode}</span>
                        {act.customerName && (
                          <span className="text-[11px] text-slate-500 font-medium">{act.customerName}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-bold text-slate-800">{act.action}</td>
                    <td className="p-3 font-mono font-extrabold text-slate-900">
                      {act.amount && act.amount > 0 ? `${act.amount.toLocaleString('vi-VN')} ₫` : '---'}
                    </td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">{act.time}</td>
                    <td className="p-3 text-right flex justify-end">{getBadge(act.actionType)}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
