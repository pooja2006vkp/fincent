'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MonthlyData } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface MonthlyTrendChartProps {
  data: MonthlyData[];
  loading: boolean;
}

const CustomTooltip = ({ active, payload, label }: {active?: boolean; payload?: Array<{value: number}>; label?: string}) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl border bg-popover/95 px-3 py-2 text-sm shadow-2xl backdrop-blur">
        <p className="font-medium mb-1">{label}</p>
        <p className="text-rose-500">Expenses: {formatCurrency(payload[0]?.value ?? 0)}</p>
      </div>
    );
  }
  return null;
};

export function MonthlyTrendChart({ data, loading }: MonthlyTrendChartProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Monthly Spending Trend</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-56 w-full rounded-xl" />
        ) : data.length === 0 ? (
          <div className="flex h-56 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ top: 10, right: 6, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fill="url(#expenseGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
