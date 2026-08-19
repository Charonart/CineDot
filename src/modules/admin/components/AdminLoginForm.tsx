'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { adminLoginSchema } from '../schemas/adminAuth.schema';
import { useAdminAuthStore } from '../store/useAdminAuthStore';

export function AdminLoginForm() {
  const router = useRouter();
  const { login, isLoggingIn } = useAdminAuth();
  const { isAuthenticated, adminUser, initAdminStore } = useAdminAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    initAdminStore();
  }, [initAdminStore]);

  useEffect(() => {
    if (isAuthenticated && adminUser) {
      if (adminUser.role === 'TICKET_STAFF') {
        router.push('/admin/ticket-scanner');
      } else {
        router.push('/admin');
      }
    }
  }, [isAuthenticated, adminUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});

    // 1. Zod Client Validation
    const validationResult = adminLoginSchema.safeParse({ email, password });
    if (!validationResult.success) {
      const formatted = validationResult.error.format();
      setFieldErrors({
        email: formatted.email?._errors[0],
        password: formatted.password?._errors[0],
      });
      return;
    }

    // 2. Real API Authentication Call
    try {
      const result = await login({ email: email.trim(), password });
      if (result.adminUser.role === 'TICKET_STAFF') {
        router.push('/admin/ticket-scanner');
      } else {
        router.push('/admin');
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string; response?: { data?: { message?: string } } };
      const msg =
        errorObj?.message ||
        errorObj?.response?.data?.message ||
        'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!';
      setErrorMsg(msg);
    }
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
            CINEDOT ADMIN PORTAL
          </span>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Đăng Nhập Quản Trị
          </h1>

          <p className="text-xs text-slate-500 font-medium">
            Cổng làm việc dành riêng cho Ban quản trị & Nhân sự hệ thống CineDot
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
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="admin@cinedot.com"
                disabled={isLoggingIn}
                required
                className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border text-xs font-medium text-slate-900 focus:outline-none focus:bg-white transition-all ${
                  fieldErrors.email
                    ? 'border-rose-400 focus:border-rose-500'
                    : 'border-gray-200 focus:border-[#7C6FE8]'
                }`}
              />
            </div>
            {fieldErrors.email && (
              <span className="text-[11px] text-rose-500 font-semibold">{fieldErrors.email}</span>
            )}
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
                  if (fieldErrors.password)
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••"
                disabled={isLoggingIn}
                required
                className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border text-xs font-medium text-slate-900 focus:outline-none focus:bg-white transition-all ${
                  fieldErrors.password
                    ? 'border-rose-400 focus:border-rose-500'
                    : 'border-gray-200 focus:border-[#7C6FE8]'
                }`}
              />
            </div>
            {fieldErrors.password && (
              <span className="text-[11px] text-rose-500 font-semibold">
                {fieldErrors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer mt-1 disabled:opacity-60"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ĐANG XÁC THỰC...</span>
              </>
            ) : (
              <>
                <span>ĐĂNG NHẬP VÀO ADMIN</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
