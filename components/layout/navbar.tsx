'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Menu,
  Moon,
  PlusCircle,
  ReceiptText,
  Sun,
  Wallet,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/add-transaction', label: 'Add Transaction', icon: PlusCircle },
  { href: '/transactions', label: 'Transactions', icon: ReceiptText },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/add-transaction': 'Add Transaction',
  '/transactions': 'Transactions',
  '/analytics': 'Analytics',
};

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-white/60 bg-background/78 px-4 backdrop-blur-xl md:px-6 dark:border-white/10">
        <div className="flex items-center gap-2 md:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Fincent</span>
        </div>

        <h1 className="hidden text-sm font-semibold text-foreground md:block">
          {PAGE_TITLES[pathname] ?? 'Fincent'}
        </h1>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9 rounded-full"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full md:hidden"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/96 p-5 backdrop-blur-xl md:hidden">
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Fincent</span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto rounded-full"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="space-y-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium',
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={signOut}>
              <CreditCard className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
