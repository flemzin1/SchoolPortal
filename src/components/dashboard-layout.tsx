
"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { School, Home, GraduationCap, Calendar, MessageSquare, Megaphone, User, LogOut, Wallet, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { allUsers, notifications } from "@/lib/data"
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  isGuest?: boolean;
}

const adminNavItems: NavItem[] = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { href: '/admin/support', label: 'Support', icon: MessageSquare },
];

const staffNavItems: NavItem[] = [
    { href: '/staff', label: 'Dashboard', icon: Home },
    { href: '/staff/announcements', label: 'Announcements', icon: Megaphone },
    { href: '/staff/support', label: 'Support', icon: MessageSquare },
];

const parStudNavItems: NavItem[] = [
    { href: '/parstud', label: 'Home', icon: Home },
    { href: '/parstud/results', label: 'Results', icon: GraduationCap },
    { href: '/parstud/calendar', label: 'Calendar', icon: Calendar },
    { href: '/parstud/support', label: 'Support', icon: MessageSquare },
    { href: '/parstud/announcements', label: 'Announcements', icon: Megaphone },
    { href: '/parstud/fees', label: 'Fees', icon: Wallet },
];


const GuestAwareLink = ({ 
    href, 
    children,
    className,
} : { 
    href: string; 
    children: React.ReactNode;
    className?: string;
}) => {
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isGuest = searchParams.get('guest') === 'true';
    const loggedInUserRegId = searchParams.get('loggedInUserRegId');
    const guestRegId = searchParams.get('regId');

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isGuest && (href !== '/parstud/results' && href !== '/parstud')) {
            e.preventDefault();
            toast({
                title: "Authentication Required",
                description: "Please sign in to access this page.",
                variant: "destructive",
                action: <Button onClick={() => router.push('/')}>Sign In</Button>
            });
        }
    };
    
    const newParams = new URLSearchParams();

    if (loggedInUserRegId) {
      newParams.set('loggedInUserRegId', loggedInUserRegId);
      newParams.set('regId', loggedInUserRegId);
    } else if (isGuest) {
      newParams.set('guest', 'true');
      if (guestRegId) {
        newParams.set('regId', guestRegId);
      }
    }
    
    // Special handling for results page to show correct child
    if (href === '/parstud/results' && loggedInUserRegId) {
        const urlRegId = searchParams.get('regId');
        if (urlRegId && urlRegId !== loggedInUserRegId) {
            newParams.set('regId', urlRegId);
        }
    }
    
    const finalHref = `${href}?${newParams.toString()}`;
    const isActive = pathname === href;

    return (
        <Link
          href={finalHref}
          onClick={handleClick}
          className={cn(className, isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground')}
          prefetch={true}
        >
          {children}
        </Link>
    );
};

export function DashboardLayout({ children, isGuest: isGuestProp }: DashboardLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    const sessionString = localStorage.getItem('flemzin_session');
    if (!sessionString) {
        if (searchParams.get('loggedInUserRegId') || searchParams.get('guest') === 'true') {
            router.push('/');
        }
        return;
    }

    const session = JSON.parse(sessionString);
    const now = new Date().getTime();
    const sessionAge = now - session.loginTime;

    let sessionExpired = false;
    let expiryDuration = 0;

    if (session.type === 'user') {
      expiryDuration = 7 * 24 * 60 * 60 * 1000; // 7 days
      if (sessionAge > expiryDuration) {
        sessionExpired = true;
      }
    } else if (session.type === 'guest') {
      expiryDuration = 5 * 60 * 60 * 1000; // 5 hours
      if (sessionAge > expiryDuration) {
        sessionExpired = true;
      }
    }

    if (sessionExpired) {
      localStorage.removeItem('flemzin_session');
      toast({
        title: "Session Expired",
        description: "For your security, you have been logged out. Please sign in again.",
        variant: 'destructive',
      });
      router.push('/');
    }
  }, [pathname, searchParams, router, toast]);

  const loggedInUserRegId = searchParams.get('loggedInUserRegId');
  const user = loggedInUserRegId ? allUsers.find(u => u.regId === loggedInUserRegId) : null;
  
  const isGuest = !user && searchParams.get('guest') === 'true';

  const isMobile = useIsMobile();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('flemzin_session');
    toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
    });
    router.push('/');
  }

  let role = 'parstud';
  if (pathname.startsWith('/admin')) {
      role = 'admin';
  } else if (pathname.startsWith('/staff')) {
      role = 'staff';
  }
  
  const getProfileHref = () => {
    const params = new URLSearchParams();
    if(loggedInUserRegId) {
      params.set('loggedInUserRegId', loggedInUserRegId);
      params.set('regId', loggedInUserRegId); // Profile page always shows the logged in user
    }
    return `/${role}/profile?${params.toString()}`;
  }

  let currentNavItems: NavItem[] = parStudNavItems;
  if (role === 'admin') currentNavItems = adminNavItems;
  else if (role === 'staff') currentNavItems = staffNavItems;

  const navItemsLeft = currentNavItems.filter(item => ['Results', 'Calendar'].includes(item.label));
  const navItemCenter = currentNavItems.find(item => item.label === 'Home' || item.label === 'Dashboard');
  const navItemsRight = currentNavItems.filter(item => ['Support', 'Announcements', 'Fees'].includes(item.label));
  
  const allNavItemsForLargeScreen = [
    ...(navItemCenter ? [navItemCenter] : []),
    ...currentNavItems.filter(item => item.label !== 'Home' && item.label !== 'Dashboard'),
  ];

  const HomeLink = () => {
    let href = `/${role}`;
    const params = new URLSearchParams(searchParams.toString());
    
    if (isGuest) {
      href = '/parstud/results';
    } else if (loggedInUserRegId) {
      params.set('loggedInUserRegId', loggedInUserRegId);
      params.set('regId', loggedInUserRegId);
    }
    
    const finalHref = `${href}?${params.toString()}`;
    
    return (
        <Link href={finalHref} className="flex items-center gap-2 font-semibold" prefetch={true}>
            <School className="h-6 w-6 text-primary" />
            <span>FlemzinPortal</span>
        </Link>
    )
  }

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 shrink-0 md:px-6">
            <HomeLink />

            <nav className="hidden flex-1 justify-center items-center gap-4 md:flex">
                {allNavItemsForLargeScreen.map((item) => (
                    <GuestAwareLink
                        key={item.href}
                        href={item.href}
                        className='flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium hover:text-primary hover:bg-primary/5'
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </GuestAwareLink>
                ))}
            </nav>

            <div className="flex items-center gap-4">
                {isGuest ? (
                     <Button asChild>
                        <Link href="/" prefetch={true}>Sign In</Link>
                    </Button>
                ) : !user ? (
                   <Skeleton className="h-9 w-24" />
                ) : (
                    <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                                <Bell className="h-5 w-5" />
                                {unreadNotifications.length > 0 && 
                                    <span className="absolute top-1 right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                    </span>
                                }
                                <span className="sr-only">Toggle notifications</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-80" align="end">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {notifications.length > 0 ? (
                                notifications.map(notification => (
                                    <DropdownMenuItem key={notification.id} className={cn("flex items-start gap-3", !notification.read && "bg-primary/5")}>
                                        <div className="mt-1">
                                            {notification.type === 'announcement' && <Megaphone className="h-4 w-4 text-muted-foreground" />}
                                            {notification.type === 'message' && <MessageSquare className="h-4 w-4 text-muted-foreground" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{notification.title}</p>
                                            <p className="text-xs text-muted-foreground">{notification.description}</p>
                                            <p className="text-xs text-muted-foreground/70 mt-1">{notification.timestamp}</p>
                                        </div>
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    No new notifications
                                </div>
                            )}
                            <DropdownMenuSeparator />
                             <DropdownMenuItem className="justify-center">
                                Mark all as read
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={user.avatar} alt={`@${user.name}`} data-ai-hint="profile picture" />
                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                                </p>
                            </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={getProfileHref()} prefetch={true}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </>
                )}
            </div>
        </header>

        <main className="flex-1 overflow-auto pb-24 p-4 sm:px-6 sm:py-6">
            {children}
        </main>

        {isClient && isMobile && (
            <footer className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card md:hidden">
                <nav className="grid h-16 grid-cols-5 items-center justify-around">
                    {navItemsLeft.map(item => (
                        <GuestAwareLink
                            key={item.href}
                            href={item.href}
                            className='flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all'
                        >
                            <item.icon className="h-6 w-6" />
                            <span className="text-xs text-center truncate w-full">{item.label}</span>
                        </GuestAwareLink>
                    ))}
                    
                    {navItemCenter && (
                        <GuestAwareLink
                            key={navItemCenter.href}
                            href={navItemCenter.href}
                            className='flex flex-col items-center justify-center gap-1 p-2 scale-110 -translate-y-2 bg-card rounded-full shadow-lg border'
                        >
                            <div className="p-3 rounded-full bg-primary/20 text-primary">
                            <navItemCenter.icon className="h-7 w-7" />
                            </div>
                        </GuestAwareLink>
                    )}
                    
                    {navItemsRight.map(item => (
                        <GuestAwareLink
                            key={item.href}
                            href={item.href}
                            className='flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all'
                        >
                            <item.icon className="h-6 w-6" />
                            <span className="text-xs text-center truncate w-full">{item.label}</span>
                        </GuestAwareLink>
                    ))}
                </nav>
            </footer>
        )}
    </div>
  );
}
