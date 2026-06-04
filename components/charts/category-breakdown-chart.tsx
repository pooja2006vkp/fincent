'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CATEGORY_COLORS, formatCurrency } from '@/lib/utils';

interface CategoryBreakdownChartProps {
  data: Array<{ name: string; value: number }>;
  loading: boolean;
}

const CustomTooltip = ({ active, payload }: {active?: boolean; payload?: Array<{name: string; value: number}>}) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl border bg-popover/95 px-3 py-2 text-sm shadow-2xl backdrop-blur">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-muted-foreground">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export function CategoryBreakdownChart({ data, loading }: CategoryBreakdownChartProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Expense by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-56 w-full rounded-xl" />
        ) : data.length === 0 ? (
          <div className="flex h-56 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">No expense data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={62} outerRadius={94} dataKey="value" paddingAngle={3}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={CATEGORY_COLORS[entry.name] ?? '#6b7280'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
