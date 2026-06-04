'use client';
import { motion } from 'framer-motion';
import { IndianRupee, TrendingDown, TrendingUp, WalletCards } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { DashboardStats } from '@/types';

interface StatsCardsProps {
  stats: DashboardStats | null;
  loading: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  const cards = [
    {
      label: 'Total Income',
      value: stats?.totalIncome ?? 0,
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      accent: 'from-emerald-500/18',
    },
    {
      label: 'Total Expenses',
      value: stats?.totalExpenses ?? 0,
      icon: TrendingDown,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      accent: 'from-rose-500/18',
    },
    {
      label: 'Current Balance',
      value: stats?.balance ?? 0,
      icon: WalletCards,
      color: (stats?.balance ?? 0) >= 0 ? 'text-blue-500' : 'text-orange-500',
      bg: (stats?.balance ?? 0) >= 0 ? 'bg-blue-500/10' : 'bg-orange-500/10',
      border: (stats?.balance ?? 0) >= 0 ? 'border-blue-500/20' : 'border-orange-500/20',
      accent: (stats?.balance ?? 0) >= 0 ? 'from-blue-500/18' : 'from-orange-500/18',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Card key={i}><CardContent className="p-5 sm:p-6"><Skeleton className="h-20 w-full rounded-xl" /></CardContent></Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Card className={`relative overflow-hidden border ${card.border}`}>
            <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${card.accent} to-transparent`} />
            <CardContent className="relative p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{card.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{formatCurrency(card.value)}</p>
                  <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                    <IndianRupee className="h-3 w-3" />
                    INR account summary
                  </p>
                </div>
                <div className={`${card.bg} ${card.color} rounded-xl p-2.5`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
