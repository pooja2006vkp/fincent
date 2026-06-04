'use client';
import { useState, useCallback } from 'react';

interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

let toastCount = 0;
let globalSetToasts: React.Dispatch<React.SetStateAction<ToastData[]>> | null = null;

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const registerSetter = useCallback((setter: React.Dispatch<React.SetStateAction<ToastData[]>>) => {
    globalSetToasts = setter;
  }, []);

  const toast = useCallback(({ title, description, variant = 'default' }: Omit<ToastData, 'id'>) => {
    const id = String(++toastCount);
    const setter = globalSetToasts;
    if (setter) {
      setter(prev => [...prev, { id, title, description, variant }]);
      setTimeout(() => setter(prev => prev.filter(t => t.id !== id)), 4000);
    }
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, toast, dismiss, registerSetter };
}

// Simple global toast function
type ToastFn = (opts: Omit<ToastData, 'id'>) => void;
let globalToast: ToastFn = () => {};

export function setGlobalToast(fn: ToastFn) { globalToast = fn; }
export function toast(opts: Omit<ToastData, 'id'>) { globalToast(opts); }
