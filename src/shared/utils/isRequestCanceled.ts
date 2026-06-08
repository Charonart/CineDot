import axios from 'axios';

type CancelLikeError = {
  code?: string;
  name?: string;
  message?: string;
};

export const isRequestCanceled = (error: unknown): boolean => {
  if (axios.isCancel(error)) return true;

  if (error instanceof DOMException && error.name === 'AbortError') {
    return true;
  }

  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const candidate = error as CancelLikeError;

  return (
    candidate.code === 'ERR_CANCELED' ||
    candidate.code === 'REQUEST_CANCELED' ||
    candidate.name === 'CanceledError' ||
    candidate.name === 'AbortError' ||
    candidate.message === 'canceled'
  );
};
