'use client';

import React, { useState, useEffect } from 'react';
import { useCinemas } from '@/modules/cinemas/hooks/useCinemas';
import { useCartStore } from '../store/useCartStore';

export const DeliveryLocationSelector = () => {
  const { data: cinemaList } = useCinemas();
  const cinemas = cinemaList?.items || [];
  
  const { deliveryInfo, setDeliveryInfo } = useCartStore();
  
  const city = deliveryInfo?.city || '';
  const cinemaId = deliveryInfo?.cinemaId || '';

  // Lọc danh sách thành phố độc nhất từ các rạp
  const cities = Array.from(new Set(cinemas.map(c => c.city))).sort();
  
  // Lọc rạp theo thành phố đã chọn
  const filteredCinemas = city ? cinemas.filter(c => c.city === city) : [];

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    setDeliveryInfo({ ...deliveryInfo, city: newCity, cinemaId: '', cinemaName: '' });
  };

  const handleCinemaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    const selectedCinema = cinemas.find(c => c.id === newId);
    setDeliveryInfo({ ...deliveryInfo, cinemaId: newId, cinemaName: selectedCinema ? selectedCinema.name : '' });
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid var(--border)',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
      marginBottom: '24px'
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#131413', margin: '0 0 4px 0' }}>
        Thông tin nhận hàng
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--text3)', margin: '0 0 20px 0' }}>
        Sản phẩm sẽ được giao đến rạp bạn chọn. Vui lòng mang mã đơn hàng đến quầy để nhận.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* City and Cinema Location */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text2)', marginBottom: '8px' }}>
              Khu vực (Tỉnh/Thành phố) *
            </label>
            <select
              value={city}
              onChange={handleCityChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: '#f9f9f9',
                fontSize: '14px',
                outline: 'none',
                color: 'var(--text)',
                cursor: 'pointer'
              }}
            >
              <option value="" disabled>-- Chọn Tỉnh/Thành phố --</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text2)', marginBottom: '8px' }}>
              Rạp nhận hàng *
            </label>
            <select
              value={cinemaId}
              onChange={handleCinemaChange}
              disabled={!city}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: city ? '#f9f9f9' : '#e0e0e0',
                fontSize: '14px',
                outline: 'none',
                color: 'var(--text)',
                cursor: city ? 'pointer' : 'not-allowed'
              }}
            >
              <option value="" disabled>-- Chọn Rạp --</option>
              {filteredCinemas.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
