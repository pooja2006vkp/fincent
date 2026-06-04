import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export const CATEGORY_COLORS: Record<string, string> = {
  Salary: '#16a34a',
  Freelance: '#0891b2',
  Business: '#4f46e5',
  'Other Income': '#7c3aed',
  Food: '#f97316',
  Transport: '#0ea5e9',
  Shopping: '#ec4899',
  Bills: '#eab308',
  Entertainment: '#8b5cf6',
  Health: '#10b981',
  Education: '#2563eb',
  Other: '#64748b',
};
