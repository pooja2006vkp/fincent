'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CalendarDays, IndianRupee, Loader2, NotebookPen, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addTransaction } from '@/services/transactions';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, TransactionType } from '@/types';
import { toast } from '@/hooks/useToast';
import { cn, formatCurrency } from '@/lib/utils';

interface TransactionFormProps {
  defaultType?: TransactionType;
}

export function TransactionForm({ defaultType = 'expense' }: TransactionFormProps) {
  const router = useRouter();
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = 'Enter a valid amount';
    if (!category) e.category = 'Select a category';
    if (!date) e.date = 'Select a date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await addTransaction({
        type,
        amount: Number(amount),
        category,
        note: note || undefined,
        transaction_date: date,
      });
      toast({ title: 'Transaction added', description: `${type} of ${formatCurrency(Number(amount))} saved.`, variant: 'success' });
      router.push('/transactions');
    } catch (err: unknown) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to save', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl overflow-visible">
      <CardHeader>
        <CardTitle className="text-xl">New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-2 rounded-xl bg-muted p-1">
            {(['income', 'expense'] as TransactionType[]).map(t => (
              <motion.button
                key={t}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => { setType(t); setCategory(''); }}
                className={cn(
                  'flex-1 rounded-lg py-2.5 text-sm font-medium capitalize transition-all',
                  type === t
                    ? t === 'income'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-rose-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t}
              </motion.button>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-9"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>
            {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><Tags className="h-3.5 w-3.5" />Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="date" className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              max={new Date().toISOString().split('T')[0]}
              onChange={e => setDate(e.target.value)}
            />
            {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note" className="flex items-center gap-1.5">
              <NotebookPen className="h-3.5 w-3.5" />
              Note <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="note"
              placeholder="Add a note..."
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
            variant={type === 'income' ? 'income' : 'expense'}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Saving...' : `Add ${type}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
