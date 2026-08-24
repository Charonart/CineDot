'use client';

import { useCineToastContext } from '../components/toast/CineToastProvider';

export function useCineToast() {
  const { showToast, removeToast, success, error, warning, info } = useCineToastContext();

  return {
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}
