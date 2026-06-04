'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { TransactionForm } from '@/components/transactions/transaction-form';
import type { TransactionType } from '@/types';

function AddTransactionContent() {
  const searchParams = useSearchParams();
  const type = (searchParams.get('type') as TransactionType) || 'expense';
  return <TransactionForm defaultType={type} />;
}

export default function AddTransactionPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="mx-auto h-96 max-w-2xl animate-pulse rounded-2xl bg-muted" />}>
        <AddTransactionContent />
      </Suspense>
    </AppLayout>
  );
}
