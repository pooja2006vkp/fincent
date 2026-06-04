import { createClient } from '@/lib/supabase/client';
import { Transaction, TransactionInsert } from '@/types';

export async function getTransactions(): Promise<Transaction[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('transaction_date', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getRecentTransactions(limit = 5): Promise<Transaction[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('transaction_date', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function addTransaction(tx: TransactionInsert): Promise<Transaction> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('transactions')
    .insert([{ ...tx, user_id: user.id }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTransaction(id: string, tx: Partial<TransactionInsert>): Promise<Transaction> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('transactions')
    .update(tx)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTransaction(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw error;
}

export async function getDashboardStats() {
  const transactions = await getTransactions();
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
}

export async function getMonthlyData() {
  const transactions = await getTransactions();
  const monthMap: Record<string, { income: number; expenses: number }> = {};

  transactions.forEach(t => {
    const date = new Date(t.transaction_date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthMap[key]) monthMap[key] = { income: 0, expenses: 0 };
    if (t.type === 'income') monthMap[key].income += t.amount;
    else monthMap[key].expenses += t.amount;
  });

  return Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, data]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      ...data,
    }));
}

export async function getCategoryBreakdown() {
  const transactions = await getTransactions();
  const categoryMap: Record<string, number> = {};

  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
}
