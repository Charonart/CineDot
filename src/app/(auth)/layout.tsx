import React, { Suspense } from 'react';
import "@/styles/template.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={
      <div className="auth-suspense-loading" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F8F9FA',
        fontFamily: 'sans-serif',
        fontSize: '15px',
        color: '#6C757D'
      }}>
        Đang tải...
      </div>
    }>
      {children}
    </Suspense>
  );
}
