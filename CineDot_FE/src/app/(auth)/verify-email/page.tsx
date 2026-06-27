'use client';

import React, { useState } from 'react';
import { AuthShell } from '@/modules/auth';
import { authService } from '@/modules/auth/services/auth.service';
import { Loader2, Mail, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    if (isResending) return;
    setIsResending(true);
    setError(null);
    setResendSuccess(false);

    try {
      await authService.resendEmailVerification();
      setResendSuccess(true);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || 'Không thể gửi lại email xác thực. Vui lòng thử lại sau.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthShell title="Xác thực Email" subtitle="Vui lòng xác minh địa chỉ email của bạn">
      <div className="verify-email-container">
        <div className="verify-icon-wrapper">
          <Mail size={48} className="verify-icon" />
        </div>

        <p className="verify-text">
          Chúng tôi đã gửi một liên kết xác thực đến địa chỉ email đăng ký của bạn. Vui lòng kiểm tra hộp thư và nhấp vào liên kết để kích hoạt tài khoản.
        </p>

        {resendSuccess && (
          <div className="verify-success-banner">
            <CheckCircle2 size={16} />
            <span>Email xác thực mới đã được gửi thành công!</span>
          </div>
        )}

        {error && (
          <div className="verify-error-banner">
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="verify-resend-btn"
        >
          {isResending ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Đang gửi lại...</span>
            </>
          ) : (
            <span>Gửi lại email xác thực</span>
          )}
        </button>

        <div className="verify-footer-links">
          <Link href="/" className="verify-link-home">
            Quay về Trang chủ
          </Link>
          <span className="verify-link-divider">|</span>
          <Link href="/login" className="verify-link-login">
            Đăng nhập tài khoản khác
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .verify-email-container {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }
        .verify-icon-wrapper {
          width: 80px;
          height: 80px;
          background: #EEF2FF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4F46E5;
        }
        .verify-text {
          font-size: 14.5px;
          color: #495057;
          line-height: 1.6;
          margin: 0;
        }
        .verify-success-banner {
          width: 100%;
          box-sizing: border-box;
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          color: #16A34A;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .verify-error-banner {
          width: 100%;
          box-sizing: border-box;
          background: #FFF5F5;
          border: 1px solid #FED7D7;
          color: #C53030;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
        }
        .verify-resend-btn {
          width: 100%;
          height: 48px;
          background: #1A1A1A;
          color: #FFFFFF;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background-color 0.2s, transform 0.1s;
        }
        .verify-resend-btn:hover:not(:disabled) {
          background: #333333;
        }
        .verify-resend-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .verify-resend-btn:disabled {
          background: #A3A3A3;
          cursor: not-allowed;
        }
        .verify-footer-links {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          margin-top: 6px;
        }
        .verify-link-home, .verify-link-login {
          color: #4F46E5;
          text-decoration: none;
          font-weight: 600;
        }
        .verify-link-home:hover, .verify-link-login:hover {
          text-decoration: underline;
        }
        .verify-link-divider {
          color: #DEE2E6;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </AuthShell>
  );
}
