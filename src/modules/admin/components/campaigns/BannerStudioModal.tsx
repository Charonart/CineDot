'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, X, CheckCircle2, AlertCircle, Layers, Link as LinkIcon, Hash } from 'lucide-react';
import { AdminBanner } from '../../types/adminCampaign.types';
import { CreateBannerPayload, UpdateBannerPayload } from '../../dto/adminCampaign.dto';
import { useAdminCampaigns } from '../../hooks/useAdminCampaigns';

interface BannerStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateBannerPayload | UpdateBannerPayload) => Promise<any>;
  bannerToEdit?: AdminBanner | null;
  defaultCampaignId?: number | null;
}

export const BannerStudioModal: React.FC<BannerStudioModalProps> = ({
  isOpen,
  onClose,
  onSave,
  bannerToEdit,
  defaultCampaignId,
}) => {
  const { campaigns } = useAdminCampaigns({ limit: 100 });

  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [campaignId, setCampaignId] = useState<number | string>('');
  const [order, setOrder] = useState<number | string>(1);
  const [isActive, setIsActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (bannerToEdit) {
      setTitle(bannerToEdit.title || '');
      setImageUrl(bannerToEdit.imageUrl || '');
      setLinkUrl(bannerToEdit.linkUrl || '');
      setCampaignId(bannerToEdit.campaignId || '');
      setOrder(bannerToEdit.order ?? 1);
      setIsActive(bannerToEdit.isActive ?? true);
    } else {
      setTitle('');
      setImageUrl('');
      setLinkUrl('');
      setCampaignId(defaultCampaignId || '');
      setOrder(1);
      setIsActive(true);
    }
    setStatusMsg(null);
  }, [bannerToEdit, defaultCampaignId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      setStatusMsg({ type: 'error', text: 'Vui lòng nhập tiêu đề và URL hình ảnh banner.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const payload: CreateBannerPayload = {
        title: title.trim(),
        image_url: imageUrl.trim(),
        link_url: linkUrl.trim() || undefined,
        campaign_id: campaignId ? Number(campaignId) : null,
        order: Number(order) || 0,
        is_active: isActive,
      };

      await onSave(payload);
      setStatusMsg({
        type: 'success',
        text: bannerToEdit ? 'Đã cập nhật banner thành công!' : 'Đã tạo banner quảng cáo mới thành công!',
      });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err?.response?.data?.message || 'Có lỗi xảy ra khi lưu banner. Vui lòng thử lại.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-xl bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative text-slate-900 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                {bannerToEdit ? 'Chỉnh Sửa Banner Quảng Cáo' : 'Thêm Banner Quảng Cáo Mới'}
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Cấu hình ảnh banner trang chủ, slider sự kiện và đường dẫn đích
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {statusMsg && (
          <div
            className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Tiêu đề */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Tiêu Đề Banner <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Đại Tiệc Bom Tấn Hè 2026 - Giảm 20% Vé Xem Phim"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-semibold text-slate-900"
            />
          </div>

          {/* Image URL & Live Preview */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              URL Hình Ảnh Banner <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="https://images.unsplash.com/... hoặc /banners/summer.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-semibold text-slate-900 font-mono"
            />

            {/* Live Image Preview */}
            {imageUrl && (
              <div className="mt-2 w-full h-36 rounded-2xl overflow-hidden border border-purple-100 relative bg-slate-100">
                <img
                  src={imageUrl}
                  alt="Preview banner"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as any).src = 'https://placehold.co/800x400/png?text=Invalid+Image+URL';
                  }}
                />
                <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs">
                  Xem trước Banner (16:9)
                </span>
              </div>
            )}
          </div>

          {/* Link URL & Campaign Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Link đích */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Link Đích Khi Click</span>
              </label>
              <input
                type="text"
                placeholder="VD: /movies, /booking/seats?showtime_id=1"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-semibold text-slate-800"
              />
            </div>

            {/* Gắn vào Campaign */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Chiến Dịch Liên Kết</span>
              </label>
              <select
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-bold text-slate-800 bg-white"
              >
                <option value="">-- Không gắn Chiến dịch --</option>
                {campaigns.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    #{c.id} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Thứ tự hiển thị & Kích hoạt */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Thứ tự */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span>Thứ Tự Ưu Tiên (Order)</span>
              </label>
              <input
                type="number"
                min={0}
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#7C6FE8] text-xs font-mono font-bold text-slate-900"
              />
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 mt-4 sm:mt-0">
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-800">Hiển Thị Ngay</span>
                <span className="text-[10px] text-slate-500">Bật hiển thị trên trang chủ</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C6FE8]"></div>
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-2xl border border-gray-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer transition-colors"
            >
              HỦY BỎ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              <span>{bannerToEdit ? 'LƯU THAY ĐỔI' : '+ TẠO BANNER'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
