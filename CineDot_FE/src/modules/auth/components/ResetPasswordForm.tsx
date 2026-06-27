import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useResetPassword } from '../hooks/useResetPassword';
import { resetPasswordSchema } from '../schemas/auth.schema';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { appRoutes } from '@/shared/routes/appRoutes';

export const ResetPasswordForm: React.FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get('token') || '' : '';
  const email = searchParams ? searchParams.get('email') || '' : '';

  const resetPasswordMutation = useResetPassword();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Local validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetPasswordMutation.isPending) return;

    setFieldErrors({});
    setGlobalError(null);

    // Verify token and email are present
    if (!token) {
      setGlobalError('Mã xác nhận (token) khôi phục không hợp lệ hoặc thiếu.');
      return;
    }
    if (!email) {
      setGlobalError('Địa chỉ email khôi phục không hợp lệ hoặc thiếu.');
      return;
    }

    // Validate inputs locally
    const result = resetPasswordSchema.safeParse({
      token,
      email,
      password,
      passwordConfirmation,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (!errors[path]) {
          errors[path] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    // Call mutation
    resetPasswordMutation.mutate(
      {
        token,
        email,
        password,
        passwordConfirmation,
      },
      {
        onError: (err: unknown) => {
          const errorObj = err as { code?: string; errors?: Record<string, string[]>; message?: string };
          if (errorObj.code === 'VALIDATION_ERROR' && errorObj.errors) {
            const serverErrors: Record<string, string> = {};
            Object.keys(errorObj.errors).forEach((key) => {
              const fieldErr = errorObj.errors?.[key];
              if (fieldErr && fieldErr[0]) {
                serverErrors[key] = fieldErr[0];
              }
            });
            setFieldErrors(serverErrors);
          } else {
            setGlobalError(errorObj.message || 'Thiết lập mật khẩu thất bại. Vui lòng kiểm tra lại liên kết khôi phục.');
          }
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      {globalError && (
        <div className="auth-error-banner">
          {globalError}
        </div>
      )}

      {/* Show readonly email for context */}
      <div className="auth-input-group readonly-email-group">
        <label>Tài khoản khôi phục</label>
        <div className="readonly-email-box">{email || 'Chưa xác định'}</div>
      </div>

      <div className="auth-input-group">
        <label htmlFor="password">Mật khẩu mới</label>
        <div className="password-wrapper">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tối thiểu 8 ký tự"
            disabled={resetPasswordMutation.isPending}
            className={fieldErrors.password ? 'has-error' : ''}
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            disabled={resetPasswordMutation.isPending}
            tabIndex={-1}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {fieldErrors.password && <span className="auth-field-error">{fieldErrors.password}</span>}
      </div>

      <div className="auth-input-group">
        <label htmlFor="passwordConfirmation">Xác nhận mật khẩu mới</label>
        <div className="password-wrapper">
          <input
            id="passwordConfirmation"
            type={showConfirmPassword ? 'text' : 'password'}
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            disabled={resetPasswordMutation.isPending}
            className={fieldErrors.passwordConfirmation ? 'has-error' : ''}
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={resetPasswordMutation.isPending}
            tabIndex={-1}
            aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {fieldErrors.passwordConfirmation && (
          <span className="auth-field-error">{fieldErrors.passwordConfirmation}</span>
        )}
      </div>

      <button
        type="submit"
        className="auth-submit-btn"
        disabled={resetPasswordMutation.isPending}
      >
        {resetPasswordMutation.isPending ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            <span>Đang thiết lập lại...</span>
          </>
        ) : (
          <span>Xác nhận mật khẩu mới</span>
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
        .readonly-email-box {
          height: 48px;
          border: 1px solid #E9ECEF;
          background: #F8F9FA;
          border-radius: 10px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          font-size: 14.5px;
          color: #495057;
          font-weight: 500;
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
        .password-wrapper {
          position: relative;
          width: 100%;
        }
        .password-toggle-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6C757D;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .password-toggle-btn:hover {
          color: #212529;
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
