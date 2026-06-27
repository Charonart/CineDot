'use client';

import React, { useState } from 'react';
import { ComboItem } from '../types';

interface FoodComboCardProps {
  combo: ComboItem;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export const FoodComboCard: React.FC<FoodComboCardProps> = ({
  combo,
  quantity,
  onDecrease,
  onIncrease,
}) => {
  const [imgSrc, setImgSrc] = useState(combo.image);

  const handleImgError = () => {
    // Fallback Unsplash placeholder for popcorn/beverage combo
    setImgSrc('https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=500&q=80');
  };

  return (
    <div
      className="food-combo-card"
      style={{
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Visual wrapper styling for card hover effect */}
      <style dangerouslySetInnerHTML={{__html: `
        .food-combo-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(79, 60, 147, 0.06) !important;
        }
      `}} />

      {/* Image header */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#f0f0f0' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={combo.name}
          onError={handleImgError}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Card Info */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '8px' }}>
        <h4 style={{ fontSize: '15.5px', fontWeight: 700, color: '#131413', margin: 0 }}>
          {combo.name}
        </h4>
        <p 
          style={{ 
            fontSize: '13px', 
            color: 'var(--text2)', 
            lineHeight: 1.5, 
            margin: 0, 
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {combo.description}
        </p>

        {/* Action / Price Bottom Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', gap: '12px' }}>
          <strong style={{ fontSize: '15px', color: '#4f3c93', fontWeight: 800 }}>
            {combo.price.toLocaleString('vi-VN')} đ
          </strong>

          {/* Quantity selector or Add CTA */}
          {quantity === 0 ? (
            <button
              type="button"
              onClick={onIncrease}
              style={{
                background: '#4f3c93',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              Thêm
            </button>
          ) : (
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                background: '#F0EEF9',
                border: '1px solid #CFC9EB',
                borderRadius: '8px',
                padding: '4px 8px',
              }}
            >
              <button
                type="button"
                onClick={onDecrease}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#4f3c93',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                −
              </button>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#4f3c93', minWidth: '16px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={onIncrease}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#4f3c93',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
