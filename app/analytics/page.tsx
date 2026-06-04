'use client';
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { MonthlyTrendChart } from '@/components/charts/monthly-trend-chart';
import { CategoryBreakdownChart } from '@/components/charts/category-breakdown-chart';
import { IncomeExpenseChart } from '@/components/charts/income-expense-chart';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { getMonthlyData, getCategoryBreakdown, getDashboardStats } from '@/services/transactions';
import type { MonthlyData, DashboardStats } from '@/types';

export default function AnalyticsPage() {
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [categories, setCategories] = useState<Array<{ name: string; value: number }>>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMonthlyData(), getCategoryBreakdown(), getDashboardStats()])
      .then(([m, c, s]) => { setMonthly(m); setCategories(c); setStats(s); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <StatsCards stats={stats} loading={loading} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyTrendChart data={monthly} loading={loading} />
          <IncomeExpenseChart data={monthly} loading={loading} />
        </div>
        <CategoryBreakdownChart data={categories} loading={loading} />
      </div>
    </AppLayout>
  );
}
