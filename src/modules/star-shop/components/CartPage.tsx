'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/useCartStore';
import Link from 'next/link';

export const CartPage = () => {
  const router = useRouter();
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  const handleCheckout = () => {
    router.push('/cart/payment');
  };

  const handleCancel = () => {
    router.push('/star-shop');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 20px', textAlign: 'center' }}>
        <div style={{ padding: '60px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>
            Giỏ hàng của bạn đang trống
          </h2>
          <p style={{ color: 'var(--text2)', marginBottom: '32px' }}>
            Hãy quay lại cửa hàng để chọn cho mình những món đồ ưng ý nhé.
          </p>
          <button 
            onClick={handleCancel}
            style={{
              padding: '12px 24px',
              background: '#7C6FE8',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 20px 60px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '32px', color: 'var(--text)' }}>
        Giỏ Hàng
      </h1>

      <style dangerouslySetInnerHTML={{__html: `
        .cart-grid-container {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .cart-grid-container {
            grid-template-columns: 1fr;
          }
        }
      `}} />

      <div className="cart-grid-container">
        {/* Cart Items List */}
        <div>
          <div style={{ 
            background: 'var(--surface)', 
            borderRadius: '16px', 
            border: '1px solid var(--border)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              padding: '16px 24px', 
              borderBottom: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.02)',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text2)'
            }}>
              <div style={{ flex: 2 }}>Sản phẩm</div>
              <div style={{ flex: 1, textAlign: 'center' }}>Số lượng</div>
              <div style={{ flex: 1, textAlign: 'right' }}>Thành tiền</div>
            </div>

            {/* Items */}
            <div>
              {items.map((item, index) => (
                <div key={`${item.productId}-${index}`} style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  padding: '24px', 
                  borderBottom: '1px solid var(--border)',
                  gap: '16px'
                }}>
                  {/* Product Info */}
                  <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ 
                      width: '80px', height: '80px', 
                      borderRadius: '8px', overflow: 'hidden',
                      background: '#f5f5f5', flexShrink: 0
                    }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <Link href={`/star-shop/product/${item.productId}`} style={{ 
                        fontSize: '16px', fontWeight: 600, color: 'var(--text)', 
                        textDecoration: 'none', display: 'block', marginBottom: '8px'
                      }}>
                        {item.name}
                      </Link>
                      <div style={{ fontSize: '14px', color: '#7C6FE8', fontWeight: 500 }}>
                        {formatPrice(item.price)}
                      </div>
                      <button 
                        onClick={() => removeItem(item.productId)}
                        style={{ 
                          background: 'none', border: 'none', color: '#ff4d4f', 
                          fontSize: '13px', cursor: 'pointer', padding: 0, marginTop: '8px',
                          display: 'flex', alignItems: 'center', gap: '4px'
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Xóa
                      </button>
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ 
                      display: 'flex', alignItems: 'center', 
                      border: '1px solid var(--border)', borderRadius: '6px',
                      overflow: 'hidden'
                    }}>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        style={{ width: '32px', height: '32px', background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }}
                      >-</button>
                      <div style={{ 
                        width: '40px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', fontWeight: 600, borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)'
                      }}>
                        {item.quantity}
                      </div>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        style={{ width: '32px', height: '32px', background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }}
                      >+</button>
                    </div>
                  </div>

                  {/* Total Price for item */}
                  <div style={{ flex: 1, textAlign: 'right', fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <button 
                  onClick={handleCancel}
                  style={{
                    padding: '10px 20px',
                    background: 'transparent',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ← Tiếp tục mua sắm
                </button>
                <button 
                  onClick={clearCart}
                  style={{
                    background: 'none', border: 'none', color: '#ff4d4f', 
                    fontSize: '14px', cursor: 'pointer', padding: '10px',
                    textDecoration: 'underline'
                  }}
                >
                  Xóa tất cả
                </button>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div>
          <div style={{ 
            background: 'var(--surface)', 
            padding: '24px',
            borderRadius: '16px', 
            border: '1px solid var(--border)',
            position: 'sticky',
            top: '100px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: 'var(--text)' }}>
              Tổng đơn hàng
            </h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '15px', color: 'var(--text2)' }}>
              <span>Tạm tính ({items.reduce((acc, item) => acc + item.quantity, 0)} sản phẩm)</span>
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>{formatPrice(totalPrice)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '15px', color: 'var(--text2)' }}>
              <span>Phí giao hàng</span>
              <span style={{ color: '#4CAF50', fontWeight: 600 }}>Miễn phí</span>
            </div>

            <div style={{ 
              display: 'flex', justifyContent: 'space-between', 
              paddingTop: '20px', borderTop: '1px dashed var(--border)',
              marginBottom: '32px'
            }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>Tổng cộng</span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#7C6FE8' }}>
                {formatPrice(totalPrice)}
              </span>
            </div>

            <button 
              onClick={handleCheckout}
              style={{
                width: '100%',
                padding: '16px',
                background: '#7C6FE8',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Tiến hành Thanh toán
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
