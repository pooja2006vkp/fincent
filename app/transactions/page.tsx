'use client';
import Link from 'next/link';
import { PlusCircle, ReceiptText } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { TransactionTable } from '@/components/transactions/transaction-table';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/hooks/useTransactions';

export default function TransactionsPage() {
  const { transactions, loading, remove, refetch } = useTransactions();

  return (
    <AppLayout>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ReceiptText className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">All Transactions</h2>
            <p className="text-sm text-muted-foreground">{transactions.length} total</p>
          </div>
          <Button asChild>
            <Link href="/add-transaction">
              <PlusCircle className="h-4 w-4" />
              Add new
            </Link>
          </Button>
        </div>
        <TransactionTable
          transactions={transactions}
          loading={loading}
          onDelete={remove}
          onRefetch={refetch}
        />
      </div>
    </AppLayout>
  );
}
