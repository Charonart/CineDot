'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from '../store/useCartStore';
import { DeliveryLocationSelector } from './DeliveryLocationSelector';
import { StarShopPaymentMethod } from './StarShopPaymentMethod';
import { StarShopOrderSummary } from './StarShopOrderSummary';
import { useCreateZaloPayOrder } from '@/modules/booking/hooks/useZaloPay';

export const ProductPaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { items, paymentMethod, deliveryInfo, clearCart } = useCartStore();
  const { mutateAsync: createZaloPayOrder } = useCreateZaloPayOrder();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (hasHydrated) {
      const status = searchParams?.get('status');
      if (status === '1') {
        setIsSuccessOpen(true);
        router.replace('/cart/payment');
      } else if (status === '-1') {
        setErrorMsg('Thanh toán ZaloPay bị hủy hoặc thất bại.');
        router.replace('/cart/payment');
      } else if (items.length === 0 && !isSuccessOpen) {
        // Empty cart and not just finished checkout -> go to shop
        router.replace('/star-shop');
      }
    }
  }, [hasHydrated, items.length, router, isSuccessOpen, searchParams]);

  const handleCheckout = async () => {
    setErrorMsg('');
    
    // Validations
    if (!deliveryInfo?.cinemaId) {
      setErrorMsg('Vui lòng chọn rạp nhận hàng.');
      return;
    }
    if (!paymentMethod) {
      setErrorMsg('Vui lòng chọn phương thức thanh toán.');
      return;
    }

    if (paymentMethod === 'zalopay') {
      try {
        setIsProcessingPayment(true);
        const amountToPay = items.reduce((total, item) => total + item.price * item.quantity, 0);
        const itemPayload = items.map(item => ({
          itemid: item.productId,
          itemname: item.name,
          itemprice: item.price,
          itemquantity: item.quantity
        }));
        const description = `Star Shop: ${items.map(i => i.name).join(', ')}`;
        
        const orderData = {
          amount: amountToPay,
          description: description.substring(0, 250),
          app_user: 'CineDotStarShop',
          items: itemPayload,
          embed_data: JSON.stringify({
            cinema_id: deliveryInfo.cinemaId,
            cart_items: items.length,
            redirecturl: 'http://localhost:3000/cart/payment'
          })
        };
        const response = await createZaloPayOrder(orderData);
        
        if (response.success && response.order_url) {
          window.location.href = response.order_url;
        } else {
          setErrorMsg('Lỗi tạo đơn hàng ZaloPay: ' + (response.message || 'Unknown error'));
          setIsProcessingPayment(false);
        }
      } catch (error: any) {
        setErrorMsg('Đã có lỗi xảy ra khi kết nối ZaloPay.');
        setIsProcessingPayment(false);
      }
    } else {
      // Mock Process Payment for other methods
      setIsSuccessOpen(true);
    }
  };

  const handleCloseSuccess = () => {
    setIsSuccessOpen(false);
    clearCart();
    router.push('/star-shop'); // Quay lại trang cửa hàng
  };

  if (!hasHydrated || items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F6F6F6' }}>
        Đang tải...
      </div>
    );
  }

  return (
    <div style={{ background: '#F6F6F6', minHeight: '100vh', padding: '120px 0 100px 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Tiêu đề */}
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '32px', color: '#131413' }}>
          Thanh Toán Đơn Hàng
        </h1>

        <div className="payment-layout-wrap" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* Main Selection Column */}
          <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Back Button */}
            <button
              type="button"
              onClick={() => router.replace('/cart')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                color: '#7C6FE8',
                fontSize: '14.5px',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '4px 0',
                marginRight: 'auto',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Quay lại
            </button>

            {/* Thông tin nhận hàng (Rạp) */}
            <DeliveryLocationSelector />

            {/* Chọn phương thức thanh toán */}
            <StarShopPaymentMethod />

            {/* Error Message */}
            {errorMsg && (
              <div style={{
                padding: '14px 20px', borderRadius: '14px', background: '#FFF5F5',
                border: '1px solid #FED7D7', color: '#C53030', fontSize: '14px', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errorMsg}
              </div>
            )}
          </div>

          {/* Right Sidebar: Order Summary */}
          <div style={{ width: '100%', maxWidth: '380px' }} className="price-summary-wrap">
            <StarShopOrderSummary onContinue={handleCheckout} />
            {isProcessingPayment && (
               <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px', color: 'var(--text2)' }}>
                 Đang chuyển hướng sang ZaloPay...
               </div>
            )}
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 991px) {
          .price-summary-wrap {
            width: 100% !important;
            max-width: 100% !important;
            margin-top: 16px;
          }
          .payment-layout-wrap {
            flex-direction: column !important;
          }
        }
      `}} />

      {/* Success Modal Mock */}
      {isSuccessOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(19, 20, 19, 0.6)',
          backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '24px', padding: '36px 32px',
            maxWidth: '460px', width: '100%', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            textAlign: 'center', border: '1px solid var(--border)'
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%', background: '#E6FFFA',
              color: '#319795', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#131413', margin: '0 0 12px 0' }}>
              Đặt Hàng Thành Công!
            </h3>
            <div style={{ fontSize: '14.5px', color: 'var(--text2)', lineHeight: 1.5, margin: '0 0 24px 0' }}>
              <p>Mã đơn hàng: <strong>#{Math.floor(Math.random() * 1000000)}</strong></p>
              <p>Vui lòng đến rạp <strong>{deliveryInfo?.cinemaName}</strong> cung cấp mã này để nhận hàng nhé.</p>
            </div>

            <button
              onClick={handleCloseSuccess}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px', background: '#7C6FE8',
                color: '#ffffff', fontWeight: 700, fontSize: '14.5px', border: 'none', cursor: 'pointer'
              }}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
