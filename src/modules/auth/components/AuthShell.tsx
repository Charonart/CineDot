import React from 'react';
import Link from 'next/link';

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthShell: React.FC<AuthShellProps> = ({ children, title, subtitle }) => {
  return (
    <div className="auth-shell-container">
      <div className="auth-shell-card">
        <div className="auth-shell-header">
          <Link href="/" className="auth-logo">
            CINE
          </Link>
          <h1 className="auth-title">{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        </div>
        <div className="auth-shell-content">{children}</div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .auth-shell-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F8F9FA;
          padding: 40px 20px;
          font-family: var(--font-sans, sans-serif);
        }
        .auth-shell-card {
          width: 100%;
          max-width: 460px;
          background: #FFFFFF;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(0, 0, 0, 0.06);
          padding: 48px 40px;
          transition: transform 0.3s ease;
        }
        .auth-shell-header {
          text-align: center;
          margin-bottom: 36px;
        }
        .auth-logo {
          font-size: 32px;
          font-weight: 900;
          letter-spacing: 3px;
          color: #1A1A1A;
          text-decoration: none;
          display: inline-block;
          margin-bottom: 24px;
          background: linear-gradient(135deg, #1A1A1A 0%, #4A4A4A 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .auth-title {
          font-size: 24px;
          font-weight: 700;
          color: #1A1A1A;
          margin: 0;
        }
        .auth-subtitle {
          font-size: 14.5px;
          color: #6C757D;
          margin-top: 8px;
          margin-bottom: 0;
        }
        .auth-shell-content {
          width: 100%;
        }
        @media (max-width: 480px) {
          .auth-shell-card {
            padding: 32px 24px;
            border-radius: 16px;
          }
          .auth-logo {
            font-size: 28px;
            margin-bottom: 16px;
          }
          .auth-title {
            font-size: 20px;
          }
        }
      `}} />
    </div>
  );
};
