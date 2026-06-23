'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile, useUpdateProfile } from '../hooks/useProfile';
import { profileUpdateFormSchema, ProfileUpdateFormValues } from '../schemas/profile.schema';
import { User, Phone, Mail, Lock, Save, CheckCircle, AlertCircle, Loader2, Camera } from 'lucide-react';

// ─── Simple form state (no react-hook-form dependency needed) ─────────────────
interface FormState {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
}

const validateForm = (values: FormState): FormErrors => {
  const result = profileUpdateFormSchema.safeParse(values);
  if (result.success) return {};
  const errors: FormErrors = {};
  result.error.issues.forEach(issue => {
    const field = issue.path[0] as keyof FormErrors;
    if (!errors[field]) errors[field] = issue.message;
  });
  return errors;
};

// ─── Input Field ──────────────────────────────────────────────────────────────
interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  icon: React.ReactNode;
  error?: string;
  readOnly?: boolean;
  type?: string;
}

const FormField: React.FC<FieldProps> = ({ id, label, value, onChange, placeholder, icon, error, readOnly, type = 'text' }) => (
  <div>
    <label htmlFor={id} style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#6B7280', letterSpacing: '0.06em', marginBottom: 8, textTransform: 'uppercase' }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: readOnly ? '#D1D5DB' : '#9CA3AF', pointerEvents: 'none' }}>
        {icon}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        aria-invalid={!!error}
        style={{
          width: '100%',
          paddingLeft: 44,
          paddingRight: 16,
          paddingTop: 13,
          paddingBottom: 13,
          fontSize: 14.5,
          fontWeight: 500,
          color: readOnly ? '#9CA3AF' : '#1A1A1A',
          background: readOnly ? '#F9FAFB' : '#FFFFFF',
          border: error ? '1.5px solid #EF4444' : readOnly ? '1.5px solid #E5E7EB' : '1.5px solid #E5E7EB',
          borderRadius: 12,
          outline: 'none',
          boxSizing: 'border-box',
          cursor: readOnly ? 'not-allowed' : 'text',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        className={readOnly ? '' : 'account-form-input'}
      />
    </div>
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}
        >
          <AlertCircle size={12} color="#EF4444" />
          <span style={{ fontSize: 12, color: '#EF4444', fontWeight: 500 }}>{error}</span>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────
export const AccountForm: React.FC = () => {
  const { data: profile, isLoading } = useProfile();
  const updateMutation = useUpdateProfile();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [form, setForm] = useState<FormState>({ fullName: '', phone: '', email: '', dateOfBirth: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync form with loaded profile
  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName,
        phone: profile.phone ?? '',
        email: profile.email,
        dateOfBirth: profile.dateOfBirth ?? '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      const payload: any = {
        full_name: form.fullName.trim(),
        phone: form.phone.trim() || null,
        date_of_birth: form.dateOfBirth.trim() || null,
      };

      await updateMutation.mutateAsync(payload);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3500);
    } catch {
      // Error is surfaced via updateMutation.isError
    }
  };

  const isDirty = profile && (
    form.fullName !== profile.fullName ||
    form.phone !== (profile.phone ?? '') ||
    form.dateOfBirth !== (profile.dateOfBirth ?? '')
  );

  return (
    <div style={{ padding: '36px 40px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.02em' }}>
          Thông Tin Tài Khoản
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: 13.5, color: '#9CA3AF' }}>
          Quản lý thông tin cá nhân của bạn
        </p>
      </div>

      {/* Avatar section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 36, padding: '20px 24px', background: '#F8F9FA', borderRadius: 16 }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: profile?.membershipMeta?.color
              ? `linear-gradient(135deg, ${profile.membershipMeta.color}, ${profile.membershipMeta.accentColor})`
              : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
          }}>
            {isLoading ? '…' : profile?.fullName?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <button
            type="button"
            aria-label="Thay đổi ảnh đại diện"
            style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: '#1A1A1A',
              border: '2px solid #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Camera size={11} color="#FFFFFF" />
          </button>
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
            {isLoading ? '…' : profile?.fullName}
          </div>
          <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
            {profile?.membershipMeta?.icon} {profile?.membershipTier} Member
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <FormField
            id="account-name"
            label="Họ & Tên"
            value={form.fullName}
            onChange={v => { setForm(f => ({ ...f, fullName: v })); setErrors(e => ({ ...e, fullName: undefined })); }}
            placeholder="Nhập họ và tên"
            icon={<User size={16} />}
            error={errors.fullName}
          />
          <FormField
            id="account-email"
            label="Email"
            value={form.email}
            readOnly={true}
            placeholder="Nhập địa chỉ email"
            icon={<Mail size={16} />}
            type="email"
          />
          <FormField
            id="account-password"
            label="Mật Khẩu"
            value="********"
            readOnly={true}
            placeholder="Không thể thay đổi tại đây"
            icon={<Lock size={16} />}
            type="password"
          />
          <FormField
            id="account-phone"
            label="Số Điện Thoại"
            value={form.phone}
            onChange={v => { setForm(f => ({ ...f, phone: v })); setErrors(e => ({ ...e, phone: undefined })); }}
            placeholder="0901234567"
            icon={<Phone size={16} />}
            error={errors.phone}
            type="tel"
          />
          <FormField
            id="account-dob"
            label="Ngày Sinh"
            value={form.dateOfBirth}
            onChange={v => { setForm(f => ({ ...f, dateOfBirth: v })); setErrors(e => ({ ...e, dateOfBirth: undefined })); }}
            placeholder="YYYY-MM-DD"
            icon={<User size={16} />}
            error={errors.dateOfBirth}
            type="date"
          />
        </div>

        {/* Actions */}
        <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            id="account-form-save"
            type="submit"
            disabled={!isDirty || updateMutation.isPending}
            aria-label="Lưu thay đổi"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 28px',
              borderRadius: 12,
              background: isDirty && !updateMutation.isPending
                ? 'linear-gradient(135deg, #4F46E5, #7C3AED)'
                : '#E5E7EB',
              color: isDirty && !updateMutation.isPending ? '#FFFFFF' : '#9CA3AF',
              border: 'none',
              fontSize: 14,
              fontWeight: 700,
              cursor: isDirty && !updateMutation.isPending ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}
          >
            {updateMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </button>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10B981', fontSize: 13.5, fontWeight: 600 }}
              >
                <CheckCircle size={16} />
                Đã lưu thành công!
              </motion.div>
            )}
            {updateMutation.isError && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#EF4444', fontSize: 13.5, fontWeight: 600 }}
              >
                <AlertCircle size={16} />
                Cập nhật thất bại
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>

      <style dangerouslySetInnerHTML={{ __html: `
        .account-form-input:focus {
          border-color: #4F46E5 !important;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.12) !important;
          outline: none;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin { animation: spin 1s linear infinite; }
      `}} />
    </div>
  );
};
