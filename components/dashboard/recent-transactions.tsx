'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowRight, ArrowUpRight, ReceiptText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Transaction } from '@/types';

interface RecentTransactionsProps {
  transactions: Transaction[];
  loading: boolean;
}

export function RecentTransactions({ transactions, loading }: RecentTransactionsProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Recent Transactions</CardTitle>
        <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground gap-1">
          <Link href="/transactions">View all <ArrowRight className="h-3 w-3" /></Link>
        </Button>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {loading ? (
          <div className="space-y-0">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-4 px-6 py-3">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center text-muted-foreground">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
              <ReceiptText className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-foreground">No transactions yet.</p>
            <p className="mt-1 text-xs">Add income or expenses to see your latest activity.</p>
            <Button asChild size="sm" className="mt-3">
              <Link href="/add-transaction">Add your first</Link>
            </Button>
          </div>
        ) : (
          <div>
            {transactions.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40 sm:gap-4 sm:px-6"
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                }`}>
                  {tx.type === 'income'
                    ? <ArrowUpRight className="h-4 w-4" />
                    : <ArrowDownRight className="h-4 w-4" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{tx.category}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(tx.transaction_date)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                  <Badge variant={tx.type === 'income' ? 'income' : 'expense'} className="text-[10px] px-1.5 py-0">
                    {tx.type}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
