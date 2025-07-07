'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AuthForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const showFirebaseConfigError = () => {
    toast({
      variant: 'destructive',
      title: 'Configuration Error',
      description: 'Firebase is not configured. Please add credentials to your .env file.',
    });
  };

  const handleEmailAuth = async (values: FormValues) => {
    if (!auth) {
      showFirebaseConfigError();
      return;
    }
    setIsLoading(true);
    try {
      if (authType === 'login') {
        await signInWithEmailAndPassword(auth, values.email, values.password);
      } else {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
      }
      // The redirect is now handled by the login page based on auth state.
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) {
      showFirebaseConfigError();
      return;
    }
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // The redirect is now handled by the login page based on auth state.
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Login Error',
        description: `${error.message}. This can happen if Google Sign-In is not enabled in your Firebase console or if the current domain is not authorized.`,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const toggleAuthType = () => {
    setAuthType(authType === 'login' ? 'signup' : 'login');
    form.reset();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{authType === 'login' ? 'Welcome Back' : 'Create an Account'}</CardTitle>
        <CardDescription>
          {authType === 'login' ? 'Log in to continue to DocuBrain.' : 'Sign up to get started.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={isLoading || isGoogleLoading || !auth}
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 64.5C308.6 102.3 282.4 96 248 96c-106.1 0-192 85.9-192 192s85.9 192 192 192c110.3 0 162.8-76.3 166-124H248v-96h239.8c4.4 22.2 6.2 46.6 6.2 71.8z"></path></svg>
          )}
          {authType === 'login' ? 'Log in with Google' : 'Sign up with Google'}
        </Button>
        <div className="relative">
          <Separator />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
            <span className="bg-card px-2 text-xs uppercase text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEmailAuth)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="m@example.com" {...field} disabled={isLoading || !auth} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isLoading || !auth} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading || !auth}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {authType === 'login' ? 'Log in' : 'Sign up'}
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm text-muted-foreground">
          {authType === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <Button variant="link" onClick={toggleAuthType} className="px-1" disabled={!auth}>
            {authType === 'login' ? 'Sign up' : 'Log in'}
          </Button>
        </p>
      </CardContent>
    </Card>
  );
}
