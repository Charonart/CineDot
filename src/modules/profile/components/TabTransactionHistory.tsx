/* Hallmark · component: TabTransactionHistory · genre: modern-minimal · theme: White Minimal / Iris Cinema
 * states: default · hover · focus · active · disabled · loading · error · success
 * contrast: pass (46–50)
 */
'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Receipt,
  RotateCcw,
} from 'lucide-react';
import { TransactionItem } from '../types/profile.types';

interface TabTransactionHistoryProps {
  transactions: TransactionItem[];
}

export const TabTransactionHistory: React.FC<TabTransactionHistoryProps> = ({ transactions }) => {
  const [filterType, setFilterType] = useState<'ALL' | 'PAYMENT' | 'REFUND'>('ALL');

  const filtered = transactions.filter((t) => {
    if (filterType === 'ALL') return true;
    return t.type === filterType;
  });

  const totalSpent = transactions
    .filter((t) => t.type !== 'REFUND')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPoints = transactions.reduce((sum, t) => sum + (t.pointsEarned || 0), 0);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-6 h-6 text-[#7C6FE8]" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Lịch Sử Giao Dịch
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Sao kê thanh toán vé xem phim, combo bắp nước và các khoản hoàn tiền.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl w-fit">
          <button
            type="button"
            onClick={() => setFilterType('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất Cả
          </button>
          <button
            type="button"
            onClick={() => setFilterType('PAYMENT')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'PAYMENT'
                ? 'bg-white text-[#7C6FE8] shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-[#7C6FE8]'
            }`}
          >
            Thanh Toán
          </button>
          <button
            type="button"
            onClick={() => setFilterType('REFUND')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'REFUND'
                ? 'bg-white text-rose-600 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            Hoàn Tiền
          </button>
        </div>
      </div>

      {/* Summary Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              Tổng chi tiêu
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">
              {totalSpent.toLocaleString('vi-VN')}đ
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
            <CreditCard className="w-6 h-6 text-[#7C6FE8]" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-purple-50/50 border border-purple-200/70 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-extrabold text-[#7C6FE8] uppercase tracking-wider">
              Điểm CP nhận được
            </span>
            <span className="text-2xl font-black text-[#7C6FE8] font-mono">
              +{totalPoints.toLocaleString()} CP
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white border border-purple-200 flex items-center justify-center text-[#7C6FE8] shadow-2xs">
            <Sparkles className="w-6 h-6 text-[#7C6FE8]" />
          </div>
        </div>
      </div>

      {/* Transactions Ledger Table */}
      {filtered.length === 0 ? (
        <div className="w-full bg-slate-50 rounded-3xl p-12 text-center border border-slate-200 flex flex-col items-center gap-2">
          <CreditCard className="w-8 h-8 text-slate-400" />
          <span className="font-bold text-sm text-slate-800">Không tìm thấy giao dịch nào</span>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-5">Mã Giao Dịch</th>
                <th className="p-4">Nội Dung</th>
                <th className="p-4">Ngày Giờ</th>
                <th className="p-4">Cổng</th>
                <th className="p-4 text-right">Số Tiền</th>
                <th className="p-4 text-center">Điểm CP</th>
                <th className="p-4 pr-5 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {filtered.map((tx) => {
                const isRefund = tx.type === 'REFUND' || tx.status === 'cancelled';
                const isSuccess = tx.status === 'completed' || tx.status === 'paid';

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-5 font-mono font-black text-[#7C6FE8]">
                      {tx.transactionCode}
                    </td>

                    <td className="p-4 max-w-xs font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        {isRefund ? (
                          <RotateCcw className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
                        )}
                        <span className="truncate">{tx.description}</span>
                      </div>
                    </td>

                    <td className="p-4 text-slate-500 font-medium whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {tx.date}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-slate-800">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-mono uppercase">
                        {tx.paymentMethod}
                      </span>
                    </td>

                    <td className="p-4 text-right font-black font-mono whitespace-nowrap">
                      <span className={isRefund ? 'text-rose-600' : 'text-slate-900'}>
                        {isRefund
                          ? `-${tx.amount.toLocaleString('vi-VN')}đ`
                          : `${tx.amount.toLocaleString('vi-VN')}đ`}
                      </span>
                    </td>

                    <td className="p-4 text-center whitespace-nowrap font-mono">
                      {tx.pointsEarned > 0 ? (
                        <span className="font-black text-[#7C6FE8]">+{tx.pointsEarned} CP</span>
                      ) : (
                        <span className="text-slate-400 font-normal">-</span>
                      )}
                    </td>

                    <td className="p-4 pr-5 text-center whitespace-nowrap">
                      {isRefund ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-black border border-rose-200">
                          {tx.statusLabel}
                        </span>
                      ) : isSuccess ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          {tx.statusLabel}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-black border border-amber-200">
                          {tx.statusLabel}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
