
'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { announcements } from '@/lib/data';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

function AnnouncementContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;
  const regId = searchParams.get('regId');
  const loggedInUserRegId = searchParams.get('loggedInUserRegId');

  const announcement = announcements.find((ann) => ann.id.toString() === id);

  const getBackLink = () => {
    let base = `/parstud/announcements`;
    const params = new URLSearchParams();
    if (loggedInUserRegId) {
      params.set('loggedInUserRegId', loggedInUserRegId);
    } else if (regId) {
      params.set('regId', regId);
    }
    const queryString = params.toString();
    return queryString ? `${base}?${queryString}` : base;
  }

  if (!announcement) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Announcement not found</h2>
        <p className="text-muted-foreground">This announcement may have been removed.</p>
        <Link href={getBackLink()} className="mt-4 inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all announcements
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href={getBackLink()} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Announcements
        </Link>
      </div>
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative h-48 md:h-64 w-full">
            <Image
              src={`https://picsum.photos/seed/${announcement.id}/1200/400`}
              alt={announcement.title}
              fill
              className="object-cover"
              data-ai-hint="announcement header image"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
             <div className="absolute bottom-0 left-0 p-6">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{announcement.title}</h1>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline">By {announcement.author}</Badge>
              <Badge variant="outline">Published on {new Date(announcement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Badge>
          </div>
          <div className="prose prose-stone dark:prose-invert max-w-none text-foreground text-base leading-relaxed">
            <p>{announcement.content}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnnouncementSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
        <div className="mb-6">
            <Skeleton className="h-6 w-48" />
        </div>
        <Card className="overflow-hidden">
            <CardHeader className="p-0">
                <Skeleton className="h-48 md:h-64 w-full" />
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default function AnnouncementDetailPage() {
    return (
        <Suspense fallback={<AnnouncementSkeleton />}>
            <AnnouncementContent />
        </Suspense>
    )
}
