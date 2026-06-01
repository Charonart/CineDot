'use client';

import React, { Suspense } from 'react';
import MoviesPageContent from './MoviesPageContent';

export default function MoviesPage() {
  return (
    <Suspense 
      fallback={
        <div 
          className="movies-page" 
          style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'var(--color-background)',
            color: 'var(--color-text-primary)'
          }}
        >
          <p style={{ fontSize: '16px', fontWeight: 500 }}>Đang tải danh sách phim...</p>
        </div>
      }
    >
      <MoviesPageContent />
    </Suspense>
  );
}
