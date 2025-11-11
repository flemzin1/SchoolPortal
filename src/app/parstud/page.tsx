
'use client';
import { Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { allUsers, announcements, performanceData as defaultPerformanceData, chartConfig } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronRight, Home, School } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

function DashboardContent() {
  const searchParams = useSearchParams();
  const loggedInUserRegId = searchParams.get('loggedInUserRegId');
  const user = allUsers.find(u => u.regId === loggedInUserRegId);

  if (!user) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <School className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold">User not found</h2>
            <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                The user ID in the URL is not valid. Please sign in again.
            </p>
            <Button asChild className="mt-6">
                <Link href="/">
                    <Home className="mr-2 h-4 w-4" /> Go to Login
                </Link>
            </Button>
        </div>
    );
  }

  const isParent = user.role === 'Parent';

  const PerformanceSection = ({ title, performanceData, viewReportRegId }: { title: string, performanceData: typeof defaultPerformanceData, viewReportRegId: string }) => {
    
    const allSessionsData = useMemo(() => {
        const classData: { [key: string]: { total: number, count: number } } = {};
        const classRegex = /(JS|SS)\d+/;

        performanceData.forEach(d => {
            const match = d.term.match(classRegex);
            if(match) {
                const className = match[0];
                if (!classData[className]) {
                    classData[className] = { total: 0, count: 0 };
                }
                classData[className].total += d.average;
                classData[className].count += 1;
            }
        });

        return Object.keys(classData).map(className => ({
            name: className,
            average: classData[className].total / classData[className].count,
        })).sort((a,b) => a.name.localeCompare(b.name));

    }, [performanceData]);

    const academicClasses = useMemo(() => {
        const classRegex = /(JS|SS)\d+/;
        const uniqueClasses = [...new Set(performanceData.map(d => {
            const match = d.term.match(classRegex);
            return match ? match[0] : null;
        }).filter(Boolean))].sort().reverse();
        return uniqueClasses;
    }, [performanceData]);

    return (
    <Card>
       <Tabs defaultValue="all-sessions">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Average score over the last few terms.</CardDescription>
             <ScrollArea className="w-full whitespace-nowrap pt-2">
                <TabsList className="w-max">
                    <TabsTrigger value="all-sessions">All Sessions</TabsTrigger>
                    {academicClasses.map(className => (
                        <TabsTrigger key={className} value={className}>{className}</TabsTrigger>
                    ))}
                </TabsList>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </CardHeader>
        <CardContent>
            <TabsContent value="all-sessions" className="mt-0">
                <div className="w-full aspect-[4/3] max-h-[250px]">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={allSessionsData} accessibilityLayer>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                domain={[0, 100]}
                            />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted))', radius: 4 }}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Bar dataKey="average" fill="hsl(var(--chart-1))" radius={4} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </TabsContent>
            {academicClasses.map(className => {
                 const processedData = (() => {
                    const filteredData = performanceData.filter(d => d.term.includes(className));
                    const termMap = new Map(filteredData.map(d => [d.term.split(" ")[0], d.average]));
                    
                    const terms = ["1st", "2nd", "3rd"];
                    return terms.map(term => ({
                        term,
                        average: termMap.get(term) || 0,
                    }));
                })();

                return (
                    <TabsContent key={className} value={className} className="mt-0">
                         <div className="w-full aspect-[4/3] max-h-[250px]">
                            <ChartContainer config={chartConfig} className="h-full w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={processedData} accessibilityLayer>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="term"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => `${value} Term`}
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        domain={[0, 100]}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'hsl(var(--muted))', radius: 4 }}
                                        content={<ChartTooltipContent indicator="dot" />}
                                    />
                                    <Bar dataKey="average" fill="hsl(var(--primary))" radius={4} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    </TabsContent>
                )
            })}
            <Button asChild variant="link" className="mt-4 px-0">
            <Link href={`/parstud/results?regId=${viewReportRegId}&loggedInUserRegId=${loggedInUserRegId}`}>
                View Full Report <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
            </Button>
        </CardContent>
       </Tabs>
    </Card>
  )};


  return (
    <div className="space-y-8">

      {/* Profile Card */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="profile picture" />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
            <p className="text-muted-foreground">Here is your academic and school activity overview.</p>
          </div>
        </CardHeader>
      </Card>
      
      {/* Performance History Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{isParent ? "Children's Performance Overview" : "Your Performance Overview"}</h2>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            {isParent && user.children && user.children.length > 0 ? (
                <Tabs defaultValue={user.children[0].regId}>
                    <ScrollArea className="w-full whitespace-nowrap">
                        <TabsList className="w-max">
                            {user.children.map(child => (
                                <TabsTrigger key={child.regId} value={child.regId}>{child.name} ({child.class})</TabsTrigger>
                            ))}
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                    {user.children.map(child => (
                        <TabsContent key={child.regId} value={child.regId} className="mt-4">
                            <PerformanceSection 
                                title={`${child.name}'s Performance`}
                                performanceData={child.performanceData}
                                viewReportRegId={child.regId}
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            ) : (
                 <PerformanceSection 
                    title="Academic Performance"
                    performanceData={isParent ? [] : defaultPerformanceData}
                    viewReportRegId={user.regId}
                 />
            )}
        </div>
      </div>
      
      {/* Recent News Section */}
      <div className="space-y-6">
         <h2 className="text-2xl font-bold">Recent News & Information</h2>
          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.slice(0, 3).map(ann => (
                <Link href={`/parstud/announcements/${ann.id}?loggedInUserRegId=${loggedInUserRegId}`} key={ann.id} className="block p-4 rounded-lg border bg-card-foreground/5 transition-all hover:bg-card-foreground/10">
                  <h3 className="font-semibold">{ann.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{ann.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">{ann.date}</p>
                </Link>
              ))}
              <Button asChild variant="link" className="px-0">
                <Link href={`/parstud/announcements?loggedInUserRegId=${loggedInUserRegId}`}>
                    View All Announcements <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}

export default function ParStudDashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        </CardHeader>
      </Card>
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-60 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
