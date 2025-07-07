'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import AuthForm from '@/components/auth-form';
import Logo from '@/components/logo';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || (!loading && user)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-8 p-8">
          <div className="flex justify-center">
            <Skeleton className="h-10 w-60" />
          </div>
          <Skeleton className="h-[450px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex w-full max-w-md flex-col items-center space-y-8">
        <Logo />
        <AuthForm />
      </div>
    </main>
  );
}
