import React, { useState } from 'react';
import Link from 'next/link';
import { useRegister } from '../hooks/useRegister';
import { registerSchema } from '../schemas/auth.schema';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { appRoutes } from '@/shared/routes/appRoutes';

export const RegisterForm: React.FC = () => {
  const registerMutation = useRegister();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Local validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerMutation.isPending) return;

    setFieldErrors({});
    setGlobalError(null);

    // Validate inputs locally
    const result = registerSchema.safeParse({
      name,
      email,
      phone: phone || undefined,
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
    registerMutation.mutate(
      {
        name,
        email,
        phone: phone || undefined,
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
            setGlobalError(errorObj.message || 'Đăng ký thất bại. Email có thể đã tồn tại.');
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

      <div className="auth-input-group">
        <label htmlFor="name">Họ và tên</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Lương Hữu Luyến"
          disabled={registerMutation.isPending}
          className={fieldErrors.name ? 'has-error' : ''}
        />
        {fieldErrors.name && <span className="auth-field-error">{fieldErrors.name}</span>}
      </div>

      <div className="auth-input-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="username@gmail.com"
          disabled={registerMutation.isPending}
          className={fieldErrors.email ? 'has-error' : ''}
        />
        {fieldErrors.email && <span className="auth-field-error">{fieldErrors.email}</span>}
      </div>

      <div className="auth-input-group">
        <label htmlFor="phone">Số điện thoại (tùy chọn)</label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0912345678"
          disabled={registerMutation.isPending}
          className={fieldErrors.phone ? 'has-error' : ''}
        />
        {fieldErrors.phone && <span className="auth-field-error">{fieldErrors.phone}</span>}
      </div>

      <div className="auth-input-group">
        <label htmlFor="password">Mật khẩu</label>
        <div className="password-wrapper">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tối thiểu 8 ký tự"
            disabled={registerMutation.isPending}
            className={fieldErrors.password ? 'has-error' : ''}
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            disabled={registerMutation.isPending}
            tabIndex={-1}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {fieldErrors.password && <span className="auth-field-error">{fieldErrors.password}</span>}
      </div>

      <div className="auth-input-group">
        <label htmlFor="passwordConfirmation">Xác nhận mật khẩu</label>
        <div className="password-wrapper">
          <input
            id="passwordConfirmation"
            type={showConfirmPassword ? 'text' : 'password'}
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="Nhập lại mật khẩu"
            disabled={registerMutation.isPending}
            className={fieldErrors.passwordConfirmation ? 'has-error' : ''}
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={registerMutation.isPending}
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
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            <span>Đang đăng ký...</span>
          </>
        ) : (
          <span>Đăng ký tài khoản</span>
        )}
      </button>

      <div className="auth-footer-link">
        Đã có tài khoản?{' '}
        <Link href={appRoutes.login()}>
          Đăng nhập ngay
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
          margin-top: 5px;
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
