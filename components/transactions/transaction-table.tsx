'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight, Pencil, ReceiptText, Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { EditTransactionDialog } from './edit-transaction-dialog';
import { formatCurrency, formatDate, CATEGORY_COLORS } from '@/lib/utils';
import { Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types';

const PAGE_SIZE = 10;

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
  onRefetch: () => void;
}

export function TransactionTable({ transactions, loading, onDelete, onRefetch }: TransactionTableProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

  const filtered = transactions.filter(t => {
    const matchSearch = search === '' ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      (t.note?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchType = typeFilter === 'all' || t.type === typeFilter;
    const matchCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchSearch && matchType && matchCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await onDelete(id);
    setDeleting(null);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/60 bg-card/72 p-3 shadow-sm backdrop-blur-xl dark:border-white/10">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_10rem_13rem]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-9"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={typeFilter} onValueChange={v => { setTypeFilter(v); setPage(1); }}>
          <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setPage(1); }}>
          <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {allCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/60 bg-card/72 shadow-sm backdrop-blur-xl dark:border-white/10">
        {loading ? (
          <div className="divide-y">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center text-sm text-muted-foreground">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
              <ReceiptText className="h-5 w-5" />
            </div>
            <p className="font-medium text-foreground">
              {filtered.length === 0 && transactions.length > 0 ? 'No matching transactions' : 'No transactions yet'}
            </p>
            <p className="mt-1 text-xs">
              {filtered.length === 0 && transactions.length > 0 ? 'Try a different search or category.' : 'Add your first income or expense entry.'}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            <AnimatePresence initial={false}>
              {paginated.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 transition-colors hover:bg-muted/40 sm:grid-cols-[auto_minmax(0,1fr)_7rem_auto_auto] sm:gap-4 sm:px-4"
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {tx.type === 'income' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{tx.category}</span>
                      <span
                        className="hidden sm:inline-block h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[tx.category] ?? '#6b7280' }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{tx.note || formatDate(tx.transaction_date)}</p>
                  </div>
                  <div className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                    {formatDate(tx.transaction_date)}
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    <Badge variant={tx.type === 'income' ? 'income' : 'expense'} className="text-[10px] px-1.5 py-0">
                      {tx.type}
                    </Badge>
                  </div>
                  <div className="col-span-3 flex justify-end gap-1 border-t border-border/60 pt-2 opacity-100 transition-opacity sm:col-span-1 sm:border-0 sm:pt-0 sm:opacity-0 sm:group-hover:opacity-100">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditTx(tx)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(tx.id)}
                      disabled={deleting === tx.id}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground">{filtered.length} transactions</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">Page {page} of {totalPages}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {editTx && (
        <EditTransactionDialog
          transaction={editTx}
          open={!!editTx}
          onOpenChange={open => !open && setEditTx(null)}
          onUpdated={onRefetch}
        />
      )}
    </div>
  );
}
