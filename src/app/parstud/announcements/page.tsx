
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { announcements as initialAnnouncements } from "@/lib/data";

export default function AnnouncementsPage() {
  const searchParams = useSearchParams();
  const loggedInUserRegId = searchParams.get('loggedInUserRegId');
  const regId = searchParams.get('regId');

  const getLink = (announcementId: number) => {
    const params = new URLSearchParams();
    if (loggedInUserRegId) {
      params.set('loggedInUserRegId', loggedInUserRegId);
    } else if (regId) {
      params.set('regId', regId);
    }
    return `/parstud/announcements/${announcementId}?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold">Announcements</h1>
        <p className="text-muted-foreground">Latest news and updates from the school.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {initialAnnouncements.map((announcement) => (
          <Link href={getLink(announcement.id)} key={announcement.id} className="block h-full">
            <Card className="h-full transition-all hover:shadow-lg hover:border-primary">
              <CardHeader>
                <CardTitle>{announcement.title}</CardTitle>
                <CardDescription>
                  By {announcement.author} on {announcement.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{announcement.content}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
