'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { Button } from '@/components/ui/button';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-5 md:px-6 lg:px-8 lg:py-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        {pathname !== '/add-transaction' && (
          <Button
            asChild
            size="icon"
            className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full shadow-2xl shadow-primary/30 sm:bottom-7 sm:right-7"
            aria-label="Add transaction"
          >
            <Link href="/add-transaction">
              <Plus className="h-5 w-5" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
