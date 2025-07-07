'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import Dashboard from '@/components/dashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="w-full max-w-7xl space-y-6 p-8">
          <Skeleton className="h-16 w-1/3" />
          <Skeleton className="h-48 w-full" />
          <div className="flex justify-end">
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}
