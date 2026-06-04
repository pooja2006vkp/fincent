'use client';
import { useState } from 'react';
import { IndianRupee, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { updateTransaction } from '@/services/transactions';
import { Transaction, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types';
import { toast } from '@/hooks/useToast';

interface EditTransactionDialogProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export function EditTransactionDialog({ transaction, open, onOpenChange, onUpdated }: EditTransactionDialogProps) {
  const [amount, setAmount] = useState(String(transaction.amount));
  const [category, setCategory] = useState(transaction.category);
  const [note, setNote] = useState(transaction.note ?? '');
  const [date, setDate] = useState(transaction.transaction_date);
  const [loading, setLoading] = useState(false);

  const categories = transaction.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    setLoading(true);
    try {
      await updateTransaction(transaction.id, {
        amount: Number(amount),
        category,
        note: note || undefined,
        transaction_date: date,
      });
      toast({ title: 'Transaction updated', variant: 'success' });
      onUpdated();
      onOpenChange(false);
    } catch {
      toast({ title: 'Failed to update', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Amount</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="number" step="0.01" min="0" className="pl-9" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Note</Label>
            <Input placeholder="Note..." value={note} onChange={e => setNote(e.target.value)} />
          </div>
          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
