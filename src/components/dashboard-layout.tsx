'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from './logo';
import { LogOut, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onNewDocument: () => void;
  showNewDocumentButton: boolean;
}

export default function DashboardLayout({ children, onNewDocument, showNewDocumentButton }: DashboardLayoutProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Logout Error',
        description: 'Firebase is not configured.',
      });
      return;
    }
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Logout Error',
        description: 'Failed to log out. Please try again.',
      });
    }
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6">
        <Logo />
        <div className="ml-auto flex items-center gap-4">
          {showNewDocumentButton && (
             <Button variant="outline" onClick={onNewDocument}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Document
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} data-ai-hint="user avatar" />
                  <AvatarFallback>{getInitials(user?.displayName || user?.email)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.displayName || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
