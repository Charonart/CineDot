'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../types/star-shop.type';
import { useCartStore } from '../store/useCartStore';

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product.imageUrl);
  const [showToast, setShowToast] = useState(false);

  // Mock array of images for the gallery
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [
        product.imageUrl,
        'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=400&h=400&fit=crop', // Mock 1
        'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400&h=400&fit=crop', // Mock 2
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop', // Mock 3
      ];

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity: quantity,
    });
    
    // Show toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity: quantity,
    });
    router.push('/cart/payment');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 20px 60px' }}>
      
      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          background: '#4CAF50',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Đã thêm vào giỏ hàng
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}} />

      {/* Main Layout: 2 Columns */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', marginBottom: '60px' }}>
        
        {/* Left Column: Images */}
        <div style={{ flex: '1 1 400px' }}>
          {/* Main Image */}
          <div style={{ 
            width: '100%', 
            aspectRatio: '1/1', 
            borderRadius: '16px', 
            overflow: 'hidden',
            marginBottom: '16px',
            background: '#f5f5f5',
            border: '1px solid var(--border)'
          }}>
            <img 
              src={mainImage} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          
          {/* Thumbnail Gallery */}
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
            {images.map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setMainImage(img)}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: mainImage === img ? '2px solid var(--color-accent)' : '1px solid var(--border)',
                  opacity: mainImage === img ? 1 : 0.6,
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                <img src={img} alt={`thumb-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Product Info */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: 'var(--text)' }}>
            {product.name}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', marginBottom: '24px' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: '#7C6FE8' }}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: '18px', color: 'var(--text2)', textDecoration: 'line-through', marginBottom: '4px' }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text2)', marginBottom: '8px' }}>
              Số lượng:
            </div>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              border: '1px solid var(--border)', 
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <button 
                onClick={handleDecrease}
                disabled={quantity <= 1}
                style={{ 
                  width: '40px', height: '40px', background: 'transparent', 
                  border: 'none', cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                  fontSize: '18px', color: 'var(--text)'
                }}
              >-</button>
              <div style={{ 
                width: '50px', height: '40px', display: 'flex', 
                alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)'
              }}>
                {quantity}
              </div>
              <button 
                onClick={handleIncrease}
                disabled={quantity >= product.stock}
                style={{ 
                  width: '40px', height: '40px', background: 'transparent', 
                  border: 'none', cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
                  fontSize: '18px', color: 'var(--text)'
                }}
              >+</button>
            </div>
            <span style={{ marginLeft: '16px', fontSize: '14px', color: 'var(--text2)' }}>
              (Còn lại {product.stock} sản phẩm)
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={handleBuyNow}
              style={{
                flex: 1,
                padding: '16px',
                background: '#7C6FE8',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Mua ngay
            </button>
            <button 
              onClick={handleAddToCart}
              style={{
                flex: 1,
                padding: '16px',
                background: 'transparent',
                color: '#7C6FE8',
                border: '2px solid #7C6FE8',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124, 111, 232, 0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Thêm vào giỏ
            </button>
          </div>
          
          <div style={{ marginTop: '32px', padding: '24px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
             <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                Cam kết từ CineDot
             </h3>
             <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text2)', fontSize: '14px', lineHeight: '1.6' }}>
               <li>Sản phẩm chính hãng 100%</li>
               <li>Giao hàng miễn phí tại tất cả các cụm rạp CineDot</li>
               <li>Đổi trả miễn phí trong vòng 7 ngày nếu có lỗi từ nhà sản xuất</li>
             </ul>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: 'var(--text)' }}>
          Mô tả sản phẩm
        </h2>
        <div 
          style={{ 
            fontSize: '16px', 
            color: 'var(--text2)', 
            lineHeight: 1.8,
            maxWidth: '800px'
          }}
        >
          {product.description}
          {/* Mock extra description content for better visual */}
          <br /><br />
          Sản phẩm được thiết kế tinh xảo, mang đậm dấu ấn của vũ trụ điện ảnh. Đây chắc chắn là một món đồ không thể thiếu trong bộ sưu tập của bạn. 
          Chất liệu cao cấp, độ bền vượt trội cùng với thiết kế độc quyền chỉ có tại hệ thống rạp CineDot.
        </div>
      </div>
    </div>
  );
};
