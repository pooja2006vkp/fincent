'use client';
import Link from 'next/link';
import { CircleDollarSign, HandCoins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <Button asChild variant="income" className="h-auto justify-start py-4">
          <Link href="/add-transaction?type=income">
            <HandCoins className="h-5 w-5" />
            <span className="text-sm font-medium">Add Income</span>
          </Link>
        </Button>
        <Button asChild variant="expense" className="h-auto justify-start py-4">
          <Link href="/add-transaction?type=expense">
            <CircleDollarSign className="h-5 w-5" />
            <span className="text-sm font-medium">Add Expense</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
