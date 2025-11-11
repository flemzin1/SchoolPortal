
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { calendarEvents } from '@/lib/data';

export default function CalendarPage() {
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold">School Calendar</h1>
            <p className="text-muted-foreground">Important dates and events.</p>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Full Calendar</CardTitle>
          <CardDescription>
            Here are all the important dates for the school year.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Calendar
            mode="multiple"
            selected={calendarEvents.map(e => e.date)}
            className="rounded-md border"
          />
          <div className="mt-6 w-full space-y-4">
            <h4 className="font-semibold text-lg">All Upcoming Events:</h4>
            <div className="grid gap-4 md:grid-cols-2">
                {calendarEvents.map(event => (
                    <div key={event.title} className="text-sm p-3 rounded-lg border bg-card">
                        <p className="font-medium">{event.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-muted-foreground mt-1">{event.title}</p>
                    </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
