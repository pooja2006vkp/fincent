'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, Landmark, LogOut, PlusCircle, ReceiptText, Sparkles, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Landmark },
  { href: '/add-transaction', label: 'Add Transaction', icon: PlusCircle },
  { href: '/transactions', label: 'Transactions', icon: ReceiptText },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/60 bg-card/70 backdrop-blur-xl md:flex dark:border-white/10">
      <div className="flex items-center gap-3 border-b border-white/60 px-5 py-5 dark:border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
          <Wallet className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <span className="block text-base font-semibold tracking-tight">Fincent</span>
          <span className="text-[11px] font-medium text-muted-foreground">Personal finance</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
                {active && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mb-3 rounded-xl border border-white/60 bg-background/60 p-3 dark:border-white/10 dark:bg-background/30">
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Premium dashboard
        </div>
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
            {user?.email?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <span className="text-xs text-muted-foreground truncate flex-1">{user?.email}</span>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-muted-foreground" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
