export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string | null;
  transaction_date: string;
  created_at: string;
}

export interface TransactionInsert {
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  transaction_date: string;
}

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Other Income'] as const;
export const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'] as const;

export type IncomeCategory = typeof INCOME_CATEGORIES[number];
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}
