'use client';
import { useState, useEffect } from 'react';
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from '@/components/ui/toast';
import { setGlobalToast } from '@/hooks/useToast';

interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    setGlobalToast(({ title, description, variant = 'default' }) => {
      const id = String(Date.now());
      setToasts(prev => [...prev, { id, title, description, variant }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    });
  }, []);

  return (
    <ToastProvider>
      {toasts.map(t => (
        <Toast key={t.id} variant={t.variant}>
          <div className="flex-1">
            {t.title && <ToastTitle>{t.title}</ToastTitle>}
            {t.description && <ToastDescription>{t.description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
