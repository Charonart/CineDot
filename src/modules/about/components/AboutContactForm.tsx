'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';

export const AboutContactForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Contact Details (lg:col-span-5) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider">
            THÔNG TIN LIÊN HỆ
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900">
            Trụ Sở Chính CineDot
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Mọi thắc mắc về hợp tác doanh nghiệp, sự kiện truyền thông hoặc góp ý dịch vụ xin vui lòng liên hệ trực tiếp với chúng tôi.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-xs font-semibold text-slate-700">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-gray-100">
            <MapPin className="w-5 h-5 text-[#7C6FE8] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900">Địa chỉ trụ sở:</span>
              <span className="text-slate-600">123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-gray-100">
            <Phone className="w-5 h-5 text-[#7C6FE8] shrink-0" />
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900">Hotline hỗ trợ (24/7):</span>
              <span className="text-[#7C6FE8] font-extrabold">1900 1234 (1.000đ/phút)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-gray-100">
            <Mail className="w-5 h-5 text-[#7C6FE8] shrink-0" />
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900">Email hỗ trợ khách hàng:</span>
              <span className="text-slate-600">support@cinedot.vn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Contact Form (lg:col-span-7) */}
      <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-50/70 border border-gray-200/80 flex flex-col gap-4">
        <h4 className="font-extrabold text-base text-slate-900">Gửi Tin Nhắn Cho CineDot</h4>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Cảm ơn bạn! Yêu cầu liên hệ đã được gửi thành công. Ban quản trị sẽ phản hồi sớm nhất.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Họ và tên của bạn</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                  className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Email liên hệ</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@cinedot.vn"
                  required
                  className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700">Nội dung tin nhắn / Góp ý</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập chi tiết ý kiến hoặc yêu cầu của bạn..."
                required
                className="p-4 rounded-xl bg-white border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] resize-none"
              />
            </div>

            <button
              type="submit"
              className="py-3.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>GỬI TIN NHẮN TỚI CINEDOT</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
