import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type BookingToastContextValue = {
  toastMessage: string | null;
  showToast: (message: string) => void;
  clearToast: () => void;
};

const BookingToastContext = createContext<BookingToastContextValue | undefined>(undefined);

export function BookingToastProvider({ children }: { children: React.ReactNode }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const value = useMemo(
    () => ({ toastMessage, showToast, clearToast }),
    [toastMessage, showToast, clearToast]
  );

  return <BookingToastContext.Provider value={value}>{children}</BookingToastContext.Provider>;
}

export function useBookingToast() {
  const ctx = useContext(BookingToastContext);
  if (!ctx) throw new Error('useBookingToast must be used within BookingToastProvider');
  return ctx;
}
