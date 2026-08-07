'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { useAdminAuthStore } from '../store/useAdminAuthStore';

export function AdminLoginForm() {
  const router = useRouter();
  const { loginAdmin, initAdminStore, isAuthenticated } = useAdminAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initAdminStore();
  }, [initAdminStore]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ Email và Mật khẩu quản trị!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = loginAdmin(email, password);
      setLoading(false);
      if (res.success) {
        router.push('/admin');
      } else {
        setErrorMsg(res.error || 'Đăng nhập thất bại!');
      }
    }, 400);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans selection:bg-[#7C6FE8] selection:text-white">
      {/* Ambient Glow */}
      <div className="w-96 h-96 rounded-full bg-[#7C6FE8]/15 blur-3xl absolute -top-20 -left-20 pointer-events-none" />
      <div className="w-96 h-96 rounded-full bg-purple-200/40 blur-3xl absolute -bottom-20 -right-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-purple-100 rounded-3xl p-8 shadow-[0_20px_60px_rgba(124,111,232,0.12)] relative z-10 flex flex-col gap-6"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-[#7C6FE8] text-white flex items-center justify-center shadow-lg shadow-[#7C6FE8]/30 mb-2 font-black text-xl">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>

          <span className="text-[11px] font-extrabold text-[#7C6FE8] uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            CINEDOT SYSTEM PORTAL
          </span>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Đăng Nhập Quản Trị
          </h1>

          <p className="text-xs text-slate-500 font-medium">
            Cổng làm việc dành riêng cho Ban quản trị & Nhân sự rạp CineDot
          </p>
        </div>

        {/* Error Alert Message */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Email Công Việc / Admin</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="admin@cinedot.vn"
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Mật Khẩu Quản Trị</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C6FE8] focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer mt-1 disabled:opacity-50"
          >
            {loading ? (
              <span>Đang xác thực...</span>
            ) : (
              <>
                <span>ĐĂNG NHẬP VÀO ADMIN</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Info Box */}
        <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-[11px] text-slate-600 font-medium flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#7C6FE8] shrink-0 mt-0.5" />
          <span>Tài khoản gốc Super Admin ban đầu: <strong className="text-slate-900">admin@cinedot.vn</strong> / <strong className="text-slate-900">admin123</strong></span>
        </div>
      </motion.div>
    </div>
  );
}
