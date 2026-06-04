'use client';
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { IncomeExpenseChart } from '@/components/charts/income-expense-chart';
import { Button } from '@/components/ui/button';
import { getDashboardStats, getRecentTransactions, getMonthlyData } from '@/services/transactions';
import { formatCurrency } from '@/lib/utils';
import type { DashboardStats, MonthlyData, Transaction } from '@/types';
import Link from 'next/link';
import { ArrowUpRight, PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getRecentTransactions(5), getMonthlyData()])
      .then(([s, r, m]) => { setStats(s); setRecent(r); setMonthly(m); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-2xl border border-white/20 bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_58%,#14b8a6_100%)] p-5 text-white shadow-2xl shadow-blue-950/15 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/80">Fincent overview</p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Your money, organized beautifully.</h2>
              <p className="mt-3 text-sm leading-6 text-blue-50/80">
                Track income, expenses, and monthly movement from one calm workspace.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:items-center">
              <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-xs text-blue-100/75">Current balance</p>
                <p className="text-xl font-semibold">{loading ? 'Loading...' : formatCurrency(stats?.balance ?? 0)}</p>
              </div>
              <Button asChild className="bg-white text-slate-950 hover:bg-blue-50">
                <Link href="/add-transaction">
                  <PlusCircle className="h-4 w-4" />
                  Add transaction
                </Link>
              </Button>
            </div>
          </div>
        </section>
        <StatsCards stats={stats} loading={loading} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <IncomeExpenseChart data={monthly} loading={loading} />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
        <RecentTransactions transactions={recent} loading={loading} />
        <Button asChild variant="ghost" className="text-muted-foreground">
          <Link href="/analytics">
            Open analytics
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </AppLayout>
  );
}
