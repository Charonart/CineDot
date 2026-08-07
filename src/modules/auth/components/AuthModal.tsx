'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Phone, Sparkles, AlertCircle, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore, AuthModalTab } from '@/shared/store/useAuthStore';

export const AuthModal: React.FC = () => {
  const router = useRouter();
  const {
    isAuthModalOpen,
    authModalTab,
    authNotice,
    postLoginRedirectUrl,
    closeAuthModal,
    login,
    register,
    loginDemo,
    openAuthModal,
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<AuthModalTab>(authModalTab);

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form Fields
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Sync state when store tab changes
  React.useEffect(() => {
    setActiveTab(authModalTab);
  }, [authModalTab]);

  if (!isAuthModalOpen) return null;

  const handleFinishLogin = () => {
    closeAuthModal();
    if (postLoginRedirectUrl) {
      router.push(postLoginRedirectUrl);
    }
    // Staying on the exact same page! NO router.push('/profile')
  };

  const handleDemoClick = () => {
    loginDemo();
    handleFinishLogin();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = login(email || 'user@cinedot.vn', password || '123456');
    if (res.success) {
      handleFinishLogin();
    } else {
      setLoginError(res.message || 'Đăng nhập không thành công');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword && confirmPassword && regPassword !== confirmPassword) {
      setRegError('Mật khẩu xác nhận không trùng khớp!');
      return;
    }
    setRegError('');
    const res = register({
      name: fullName || 'Khách Hàng Mới',
      email: regEmail,
      phone: phone || '0988776655',
      pass: regPassword,
    });

    if (!res.success) {
      setRegError(res.message || 'Đăng ký không thành công');
      return;
    }

    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      handleFinishLogin();
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-black/65 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(124,111,232,0.25)] border border-gray-100 flex flex-col gap-5 z-10 overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-none"
        >
          {/* Close Button X */}
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Alert Notice Banner (If triggered by auth gate) */}
          {authNotice && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{authNotice}</span>
            </div>
          )}

          {/* Tab Filter Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => { setActiveTab('login'); setLoginError(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-[#7C6FE8] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Đăng Nhập
            </button>

            <button
              onClick={() => { setActiveTab('register'); setRegError(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-[#7C6FE8] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Đăng Ký
            </button>
          </div>

          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Email hoặc Số Điện Thoại</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@cinedot.vn"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-semibold focus:border-[#7C6FE8] focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Mật Khẩu</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-semibold focus:border-[#7C6FE8] focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {loginError && (
                <p className="text-xs font-semibold text-rose-500">{loginError}</p>
              )}

              {/* Checkbox Ghi Nhớ Đăng Nhập & Quên Mật Khẩu */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-[#7C6FE8] focus:ring-[#7C6FE8] cursor-pointer"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>

                <button
                  type="button"
                  onClick={() => setActiveTab('forgot')}
                  className="font-bold text-[#7C6FE8] hover:underline cursor-pointer"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#7C6FE8]/35 transition-all cursor-pointer mt-1"
              >
                Đăng Nhập Tài Khoản
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
              {registerSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 justify-center">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>Đăng ký thành công! Đang tự động đăng nhập...</span>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Họ và Tên</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nguyễn Văn CineDot"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-semibold focus:border-[#7C6FE8] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="user@cinedot.vn"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-semibold focus:border-[#7C6FE8] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Số Điện Thoại</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0988 123 456"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-semibold focus:border-[#7C6FE8] outline-none"
                      />
                    </div>
                  </div>

                  {/* Field: Mật Khẩu */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Mật Khẩu</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-semibold focus:border-[#7C6FE8] outline-none"
                      />
                    </div>
                  </div>

                  {/* Field: Xác Nhận Mật Khẩu */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Xác Nhận Mật Khẩu</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-semibold focus:border-[#7C6FE8] outline-none"
                      />
                    </div>
                  </div>

                  {regError && (
                    <p className="text-xs font-semibold text-rose-500">{regError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#7C6FE8]/35 transition-all cursor-pointer mt-1"
                  >
                    Tạo Tài Khoản Mới
                  </button>
                </>
              )}
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD FORM */}
          {activeTab === 'forgot' && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-slate-500">
                Nhập email đã đăng ký của bạn. Hệ thống sẽ gửi mã OTP khôi phục mật khẩu.
              </p>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Email Khôi Phục</label>
                <input
                  type="email"
                  placeholder="user@cinedot.vn"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-semibold focus:border-[#7C6FE8] outline-none"
                />
              </div>

              <button
                onClick={() => openAuthModal('login', 'Vui lòng kiểm tra email để lấy mã OTP')}
                className="w-full py-3 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-bold text-xs uppercase cursor-pointer"
              >
                Gửi Mã Khôi Phục
              </button>

              <button
                onClick={() => setActiveTab('login')}
                className="text-xs font-bold text-slate-500 hover:text-[#7C6FE8] text-center cursor-pointer"
              >
                Quay lại Đăng nhập
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
