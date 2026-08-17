'use client';

import React from 'react';
import { CreditCard, CheckCircle, Clock } from 'lucide-react';
import { TransactionItem } from '../types/profile.types';

interface TabTransactionHistoryProps {
  transactions: TransactionItem[];
}

export const TabTransactionHistory: React.FC<TabTransactionHistoryProps> = ({ transactions }) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-extrabold text-[#131413]">Lịch Sử Giao Dịch</h2>
        <p className="text-xs text-slate-500">Xem danh sách các giao dịch thanh toán vé phim và combo bắp nước.</p>
      </div>

      {transactions.length === 0 ? (
        <div className="w-full bg-slate-50 rounded-3xl p-12 text-center border border-gray-100 flex flex-col items-center gap-2">
          <CreditCard className="w-8 h-8 text-slate-400" />
          <span className="font-bold text-xs text-[#131413]">Chưa có giao dịch nào</span>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Mã Giao Dịch</th>
                <th className="p-4">Nội Dung</th>
                <th className="p-4">Ngày Giờ</th>
                <th className="p-4">Phương Thức</th>
                <th className="p-4 text-right">Số Tiền</th>
                <th className="p-4 text-center">Điểm CP</th>
                <th className="p-4 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-slate-700">
              {transactions.map((tx) => {
                const isSuccess = tx.status === 'completed' || tx.status === 'paid';
                const isRefund = tx.status === 'cancelled';

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#7C6FE8]">{tx.transactionCode}</td>
                    <td className="p-4 max-w-xs truncate">{tx.description}</td>
                    <td className="p-4 text-slate-500 font-medium whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {tx.date}
                      </span>
                    </td>
                    <td className="p-4 font-bold">{tx.paymentMethod}</td>
                    <td className="p-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                      {isRefund ? `-${tx.amount.toLocaleString()}đ` : `${tx.amount.toLocaleString()}đ`}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      {tx.pointsEarned > 0 ? (
                        <span className="font-extrabold text-purple-600">+{tx.pointsEarned} CP</span>
                      ) : (
                        <span className="text-slate-400 font-normal">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      {isRefund ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                          {tx.statusLabel}
                        </span>
                      ) : isSuccess ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          {tx.statusLabel}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
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
