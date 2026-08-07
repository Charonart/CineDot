'use client';

import React, { useState } from 'react';
import { Gift, Plus, CheckCircle2, X, Tag } from 'lucide-react';

export function AdminVouchersView() {
  const [vouchers, setVouchers] = useState([
    {
      id: 'v-1',
      code: 'CINEDOT50K',
      title: 'Giảm 50.000đ Cho Đơn Đặt Vé IMAX',
      discountAmount: 50000,
      minSpend: 200000,
      expiryDate: '31/08/2026',
      usedCount: 450,
      totalLimit: 1000,
      status: 'ACTIVE',
    },
    {
      id: 'v-2',
      code: 'SUMMERCOMBO',
      title: 'Tặng 1 Bắp Ngọt Khi Mua 2 Vé Xem Phim',
      discountAmount: 45000,
      minSpend: 180000,
      expiryDate: '15/09/2026',
      usedCount: 890,
      totalLimit: 2000,
      status: 'ACTIVE',
    },
    {
      id: 'v-3',
      code: 'VNPAY20K',
      title: 'Giảm 20.000đ Khi Thanh Toán VNPAY-QR',
      discountAmount: 20000,
      minSpend: 100000,
      expiryDate: '30/08/2026',
      usedCount: 1500,
      totalLimit: 5000,
      status: 'ACTIVE',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [discountAmount, setDiscountAmount] = useState(30000);
  const [statusMsg, setStatusMsg] = useState('');

  const handleAddVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;

    const newVoucher = {
      id: 'v-' + Date.now(),
      code: code.trim().toUpperCase(),
      title: title.trim(),
      discountAmount: Number(discountAmount),
      minSpend: 150000,
      expiryDate: '30/09/2026',
      usedCount: 0,
      totalLimit: 500,
      status: 'ACTIVE',
    };

    setVouchers([newVoucher, ...vouchers]);
    setStatusMsg(`Đã tạo thành công mã voucher "${code.toUpperCase()}"!`);
    setTimeout(() => {
      setIsModalOpen(false);
      setCode('');
      setTitle('');
      setStatusMsg('');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
            <Gift className="w-4 h-4" />
            <span>QUẢN LÝ ƯU ĐÃI & VOUCHER</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Danh Sách Mã Khuyến Mãi Hệ Thống
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>+ TẠO VOUCHER MỚI</span>
        </button>
      </div>

      {/* Vouchers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vouchers.map((v) => (
          <div
            key={v.id}
            className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex flex-col justify-between gap-4 hover:border-[#7C6FE8] transition-colors"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-purple-50 text-[#7C6FE8] text-xs font-mono font-extrabold border border-purple-200">
                  {v.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                  ĐANG HIỆU LỰC
                </span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mt-1">{v.title}</h3>
              <span className="text-xs text-slate-500 font-medium">Hạn dùng: {v.expiryDate}</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs font-bold">
              <span className="font-mono text-emerald-600 text-sm font-black">
                Giảm {v.discountAmount.toLocaleString('vi-VN')} đ
              </span>
              <span className="text-slate-500 text-xs">
                Đã dùng {v.usedCount}/{v.totalLimit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal + Tạo Voucher Mới */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#7C6FE8]" />
                <h3 className="text-lg font-extrabold text-slate-900">Tạo Mã Voucher Khuyến Mãi</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusMsg && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{statusMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddVoucher} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Mã Voucher (Code)</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ví dụ: CINE2026"
                  required
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#7C6FE8] uppercase"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Tiêu đề chương trình</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Giảm 30.000đ cho đơn hàng..."
                  required
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Số tiền giảm (VNĐ)</label>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  TẠO VOUCHER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
