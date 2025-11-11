
'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BellOff, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { allUsers, getSupportContacts } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

function SupportContent() {
  const searchParams = useSearchParams();
  const regId = searchParams.get('regId');
  const user = allUsers.find(u => u.regId === regId);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">User not found. Please sign in again.</p>
      </div>
    );
  }
  
  const supportContacts = getSupportContacts(user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Support Channels</h1>
        <p className="text-muted-foreground">Your direct communication channels.</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y">
            {supportContacts.map((contact) => (
              <li key={contact.id}>
                <Link 
                  href={`/staff/support/${contact.id}?regId=${regId}`} 
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{contact.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5">
                            <p className="font-semibold">{contact.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{contact.lastMessageTime}</span>
                        {contact.muted && <BellOff className="h-4 w-4" />}
                        <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
                    </div>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SupportPage() {
    return (
        <Suspense fallback={<SupportSkeleton />}>
            <SupportContent />
        </Suspense>
    )
}

function SupportSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-80" />
            </div>
            <Card>
                <CardContent className="p-0">
                    <ul className="divide-y">
                        {[...Array(3)].map((_, i) => (
                            <li key={i} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="grid gap-1">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                </div>
                                <Skeleton className="h-5 w-20" />
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
