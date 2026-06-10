import React, { useState } from 'react';
import Link from 'next/link';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { forgotPasswordSchema } from '../schemas/auth.schema';
import { Loader2, MailCheck } from 'lucide-react';
import { appRoutes } from '@/shared/routes/appRoutes';

export const ForgotPasswordForm: React.FC = () => {
  const forgotPasswordMutation = useForgotPassword();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Local validation errors
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotPasswordMutation.isPending) return;

    setFieldError(null);
    setGlobalError(null);

    // Validate inputs locally
    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setFieldError(result.error.issues[0].message);
      return;
    }

    // Call mutation
    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setSuccess(true);
        },
        onError: (err: unknown) => {
          const errorObj = err as { message?: string };
          setGlobalError(errorObj.message || 'Không thể gửi yêu cầu khôi phục mật khẩu. Vui lòng thử lại sau.');
        },
      }
    );
  };

  if (success) {
    return (
      <div className="auth-success-state">
        <div className="success-icon-wrapper">
          <MailCheck size={48} className="success-icon" />
        </div>
        <p className="success-message">
          Liên kết đặt lại mật khẩu đã được gửi tới <strong>{email}</strong>. Vui lòng kiểm tra hộp thư (bao gồm cả thư rác/spam).
        </p>
        <Link href={appRoutes.login()} className="auth-back-to-login-btn">
          Quay lại Đăng nhập
        </Link>

        <style dangerouslySetInnerHTML={{ __html: `
          .auth-success-state {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }
          .success-icon-wrapper {
            width: 80px;
            height: 80px;
            background: #EEF2FF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #4F46E5;
          }
          .success-message {
            font-size: 14.5px;
            color: #495057;
            line-height: 1.6;
            margin: 0;
          }
          .auth-back-to-login-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 48px;
            background: #1A1A1A;
            color: #FFFFFF;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 700;
            text-decoration: none;
            transition: background-color 0.2s;
          }
          .auth-back-to-login-btn:hover {
            background: #333333;
          }
        `}} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      <p className="auth-intro-text">
        Nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi một liên kết để bạn thiết lập lại mật khẩu mới.
      </p>

      {globalError && (
        <div className="auth-error-banner">
          {globalError}
        </div>
      )}

      <div className="auth-input-group">
        <label htmlFor="email">Email đăng ký</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="username@gmail.com"
          disabled={forgotPasswordMutation.isPending}
          className={fieldError ? 'has-error' : ''}
        />
        {fieldError && <span className="auth-field-error">{fieldError}</span>}
      </div>

      <button
        type="submit"
        className="auth-submit-btn"
        disabled={forgotPasswordMutation.isPending}
      >
        {forgotPasswordMutation.isPending ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            <span>Đang gửi liên kết...</span>
          </>
        ) : (
          <span>Gửi liên kết khôi phục</span>
        )}
      </button>

      <div className="auth-footer-link">
        <Link href={appRoutes.login()}>
          Quay lại Đăng nhập
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .auth-intro-text {
          font-size: 14px;
          color: #6C757D;
          line-height: 1.5;
          margin: 0 0 10px 0;
          text-align: center;
        }
        .auth-error-banner {
          background: #FFF5F5;
          border: 1px solid #FED7D7;
          color: #C53030;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          line-height: 1.4;
        }
        .auth-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .auth-input-group label {
          font-size: 13.5px;
          font-weight: 600;
          color: #495057;
        }
        .auth-input-group input {
          width: 100%;
          height: 48px;
          padding: 0 16px;
          border-radius: 10px;
          border: 1px solid #DEE2E6;
          font-size: 14.5px;
          color: #212529;
          background: #FFFFFF;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .auth-input-group input:focus {
          border-color: #4F46E5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
          outline: none;
        }
        .auth-input-group input.has-error {
          border-color: #E53E3E;
        }
        .auth-input-group input.has-error:focus {
          box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
        }
        .auth-field-error {
          font-size: 12px;
          color: #E53E3E;
          margin-top: 4px;
          font-weight: 500;
        }
        .auth-submit-btn {
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
        .auth-submit-btn:hover:not(:disabled) {
          background: #333333;
        }
        .auth-submit-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .auth-submit-btn:disabled {
          background: #A3A3A3;
          cursor: not-allowed;
        }
        .auth-footer-link {
          text-align: center;
          font-size: 14px;
          color: #6C757D;
          margin-top: 10px;
        }
        .auth-footer-link a {
          color: #4F46E5;
          text-decoration: none;
          font-weight: 600;
        }
        .auth-footer-link a:hover {
          text-decoration: underline;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}} />
    </form>
  );
};
