'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode as QrCodeIcon, Loader2 } from 'lucide-react';

interface QRCodeImageProps {
  value: string;
  size?: number;
  className?: string;
  alt?: string;
}

/**
 * Robust Client-Side QR Code Component.
 * - Extracts clean data payload even if passed an api.qrserver.com URL.
 * - Generates crisp local SVG/DataURL in memory with ZERO external network latency.
 * - 100% immune to ad blockers, DNS blocks, and offline issues.
 */
export const QRCodeImage: React.FC<QRCodeImageProps> = ({
  value,
  size = 200,
  className = 'w-full h-full object-contain',
  alt = 'QR Code',
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function generateQR() {
      if (!value) {
        setDataUrl('');
        return;
      }

      // If value is a qrserver or other QR API URL, extract the raw payload
      let rawData = value;
      try {
        if (value.includes('data=')) {
          const urlObj = new URL(value);
          const extracted = urlObj.searchParams.get('data');
          if (extracted) {
            rawData = decodeURIComponent(extracted);
          }
        }
      } catch {
        // Use raw value if URL parsing fails
        rawData = value;
      }

      try {
        const url = await QRCode.toDataURL(rawData, {
          width: size * 2, // 2x density for retina displays
          margin: 1,
          color: {
            dark: '#131413',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        });

        if (isMounted) {
          setDataUrl(url);
          setHasError(false);
        }
      } catch (err) {
        console.error('Failed to generate local QR code', err);
        if (isMounted) {
          setHasError(true);
        }
      }
    }

    generateQR();

    return () => {
      isMounted = false;
    };
  }, [value, size]);

  if (hasError || !value) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-100 rounded-xl p-2 text-slate-400 ${className}`}>
        <QrCodeIcon className="w-8 h-8 text-slate-400 mb-1" />
        <span className="text-[10px] font-mono text-slate-500 font-bold">{value || 'N/A'}</span>
      </div>
    );
  }

  if (!dataUrl) {
    return (
      <div className={`flex items-center justify-center bg-slate-50 rounded-xl ${className}`}>
        <Loader2 className="w-6 h-6 text-[#7C6FE8] animate-spin" />
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt={alt}
      className={className}
      loading="eager"
    />
  );
};
