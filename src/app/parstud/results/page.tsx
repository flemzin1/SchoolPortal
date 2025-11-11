
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allUsers, allResults } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


type Result = {
  subject: string;
  ca1: number;
  ca2: number;
  exam: number;
  total: number;
  grade: string;
  remark: string;
};

type Skill = {
  name: string;
  rating: number;
};

type SessionResult = {
  results: Result[];
  details: {
    name: string;
    regId: string;
    class: string;
    session: string;
    formTeacher: string;
    position: string;
    totalInClass: string;
    totalScore: string;
    averageScore: string;
    overallGrade: string;
    principalComment: string;
    teacherComment: string;
    affectiveSkills: Skill[];
    psychomotorSkills: Skill[];
  }
}

const isGuestSession = (searchParams: URLSearchParams | null) => {
    if (!searchParams) return false;
    const loggedInUserRegId = searchParams.get('loggedInUserRegId');
    return searchParams.get('guest') === 'true' && !loggedInUserRegId;
}

const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'text-green-600';
  if (grade.startsWith('B')) return 'text-blue-600';
  if (grade.startsWith('C')) return 'text-yellow-600';
  if (grade.startsWith('D')) return 'text-orange-500';
  if (grade.startsWith('F')) return 'text-red-600';
  return '';
};

const getOverallLetterGrade = (average: number): string => {
  if (average >= 80) return 'A';
  if (average >= 70) return 'B';
  if (average >= 60) return 'C';
  if (average >= 50) return 'D';
  return 'F';
};

const gradingScale = [
    { grade: 'A', range: '80-100', remark: 'Excellent' },
    { grade: 'B', range: '70-79', remark: 'Very Good' },
    { grade: 'C', range: '60-69', remark: 'Good' },
    { grade: 'D', range: '50-59', remark: 'Pass' },
    { grade: 'F', range: '0-49', remark: 'Fail' },
];


function ResultsDisplay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const isGuest = isGuestSession(searchParams);
  
  const loggedInUserRegId = searchParams.get('loggedInUserRegId');
  const loggedInUser = loggedInUserRegId ? allUsers.find(u => u.regId === loggedInUserRegId) : null;
  const isParentViewing = loggedInUser?.role === 'Parent';
  
  const getInitialStudentRegId = () => {
    const urlRegId = searchParams.get('regId');
    
    // If the regId in the URL belongs to the parent, we should ignore it and find a child to display.
    const isRegIdTheParent = isParentViewing && urlRegId === loggedInUserRegId;

    if (urlRegId && !isRegIdTheParent) {
        return urlRegId;
    }
    
    if (isParentViewing && loggedInUser?.children && loggedInUser.children.length > 0) {
      const sortedChildren = [...loggedInUser.children].sort((a, b) => b.class.localeCompare(a.class));
      return sortedChildren[0].regId;
    }
    
    return loggedInUserRegId;
  };

  const [sessionResults, setSessionResults] = useState<SessionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStudentRegId, setCurrentStudentRegId] = useState<string | null>(getInitialStudentRegId());
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>('');


  useEffect(() => {
    const fetchResults = (studentId: string | null) => {
      if (!studentId) {
          setSessionResults(null);
          setIsLoading(false);
          if (isGuest) {
            toast({
                title: "Invalid Session",
                description: "Registration ID is missing. Redirecting to login.",
                variant: "destructive",
            });
            router.push('/');
          }
          return;
      }
      setIsLoading(true);

      setTimeout(() => {
        const studentResultsData = allResults[studentId.toUpperCase() as keyof typeof allResults];
        
        if (studentResultsData) {
          const availableSessions = Object.keys(studentResultsData).map(key => ({
            value: key,
            label: (studentResultsData as any)[key].details.session,
          })).reverse();

          setSessions(availableSessions);

          const latestSessionKey = availableSessions[0]?.value;
          
          if (latestSessionKey) {
            setSelectedSession(latestSessionKey);
            setSessionResults((studentResultsData as any)[latestSessionKey]);
          } else {
            setSessionResults(null);
          }

        } else {
          setSessionResults(null);
          if (isGuest) {
            toast({
              title: "No Results Found",
              description: "Please check the registration ID and try again.",
              variant: "destructive",
            });
            router.push('/');
          }
        }
        setIsLoading(false);
      }, 1000);
    };

    fetchResults(currentStudentRegId);
  }, [currentStudentRegId, isGuest, router, toast]);

  const handleSessionChange = (sessionKey: string) => {
      if (!currentStudentRegId) return;
      setSelectedSession(sessionKey);
      const studentResults = allResults[currentStudentRegId.toUpperCase() as keyof typeof allResults];
      if (studentResults) {
          setSessionResults((studentResults as any)[sessionKey]);
      }
  }
  
  const handleStudentChange = (studentRegId: string) => {
    setCurrentStudentRegId(studentRegId);
    
    // Core Fix: Update URL without losing loggedInUserRegId
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('regId', studentRegId);
    router.replace(`/parstud/results?${newParams.toString()}`, { scroll: false });
  }

  const skillGradingKey = [
    { rating: 5, label: "Excellent" },
    { rating: 4, label: "Very Good" },
    { rating: 3, label: "Good" },
    { rating: 2, label: "Poor" },
    { rating: 1, label: "Very Poor" },
  ];


  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-8 w-full" />
              </div>
          </CardContent>
      </Card>
      <Card>
          <CardHeader>
              <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
          </CardContent>
      </Card>
      </div>
    )
  }
  
  if (!sessionResults && isParentViewing) {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>No Student Selected</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Select one of your children to view their results.</p>
                     {isParentViewing && loggedInUser && loggedInUser.children && (
                      <div className="mt-4">
                        <Label htmlFor="student-select">Select a Child</Label>
                        <Select onValueChange={handleStudentChange}>
                            <SelectTrigger id="student-select">
                                <SelectValue placeholder="Select a child" />
                            </SelectTrigger>
                            <SelectContent>
                                {loggedInUser.children.map(child => (
                                    <SelectItem key={child.regId} value={child.regId}>{child.name} ({child.class})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                      </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
  }

  if (sessionResults && currentStudentRegId) {
    const studentDetails = sessionResults.details;
    const overallLetterGrade = getOverallLetterGrade(parseFloat(studentDetails.averageScore));

    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        
        {isParentViewing && loggedInUser && loggedInUser.children && (
            <Card>
                <CardHeader>
                    <Label htmlFor="student-select">Viewing Results For</Label>
                    <Select value={currentStudentRegId} onValueChange={handleStudentChange}>
                        <SelectTrigger id="student-select">
                            <SelectValue>{loggedInUser.children.find(c => c.regId === currentStudentRegId)?.name}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {loggedInUser.children.map(child => (
                                <SelectItem key={child.regId} value={child.regId}>{child.name} ({child.class})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardHeader>
            </Card>
        )}

        {/* === Layout 1: Profile & Summary Card === */}
        <Card>
           <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder-images/1.png" alt={studentDetails.name} data-ai-hint="profile picture" />
                  <AvatarFallback>{studentDetails.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <CardTitle>{studentDetails.name}</CardTitle>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2">
                        <Badge variant="outline">Reg. ID: {studentDetails.regId}</Badge>
                        <Badge variant="outline">Class: {studentDetails.class}</Badge>
                        <Badge variant="outline">Teacher: {studentDetails.formTeacher}</Badge>
                    </div>
                </div>
              </div>
              <Select value={selectedSession} onValueChange={handleSessionChange}>
                <SelectTrigger
                  className="w-full md:w-[280px]"
                  id="session-select"
                  disabled={isGuest}
                  onClick={(e) => {
                    if (isGuest) {
                      e.preventDefault();
                      toast({
                        title: "Sign in to see more",
                        description: "Viewing previous term results requires you to be logged in.",
                        action: <Button onClick={() => router.push('/')}>Sign In</Button>,
                      });
                    }
                  }}
                >
                  <SelectValue>{sessionResults.details.session}</SelectValue>
                </SelectTrigger>
                {!isGuest && (
                  <SelectContent>
                    {sessions.map(session => (
                      <SelectItem key={session.value} value={session.value}>{session.label}</SelectItem>
                    ))}
                  </SelectContent>
                )}
              </Select>
            </div>
             <p className="text-sm text-muted-foreground mt-2">Result for {studentDetails.session}</p>
          </CardHeader>
          <CardContent className="border-t pt-4">
             <div className="grid grid-cols-1 gap-4 text-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">Position</p>
                        <p className="text-2xl font-bold">{studentDetails.position}</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">Total in Class</p>
                        <p className="text-2xl font-bold">{studentDetails.totalInClass}</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">Total Score</p>
                        <p className="text-2xl font-bold">{studentDetails.totalScore}</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">Term Average</p>
                        <p className="text-2xl font-bold">{studentDetails.averageScore}%</p>
                    </div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg col-span-1 md:col-span-1">
                    <p className="text-sm font-medium text-muted-foreground">Overall Grade</p>
                    <p className={cn("text-2xl font-bold", getGradeColor(overallLetterGrade))}>{overallLetterGrade}</p>
                    <p className="text-xs text-muted-foreground">{studentDetails.overallGrade}</p>
                </div>
            </div>
          </CardContent>
        </Card>
        
        {/* === Layout 2: Performance & Skills Tabs === */}
        <Tabs defaultValue="subject-performance" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="subject-performance">Subject Performance</TabsTrigger>
              <TabsTrigger value="performance-skills">Performance and Skills</TabsTrigger>
            </TabsList>
            <TabsContent value="subject-performance">
                <Card>
                    <CardHeader>
                        <CardTitle>Academic Performance</CardTitle>
                        <CardDescription>Detailed breakdown of subjects, scores, and grades for the selected term.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="relative w-full overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="sticky left-0 bg-card z-10">Subject</TableHead>
                              <TableHead className="text-right">CA1</TableHead>
                              <TableHead className="text-right">CA2</TableHead>
                              <TableHead className="text-right">Exam</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                              <TableHead className="text-right">Grade</TableHead>
                              <TableHead className="text-right">Remark</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sessionResults.results.map((result) => (
                              <TableRow key={result.subject}>
                                <TableCell className="font-medium sticky left-0 bg-card z-10">{result.subject}</TableCell>
                                <TableCell className="text-right">{result.ca1}</TableCell>
                                <TableCell className="text-right">{result.ca2}</TableCell>
                                <TableCell className="text-right">{result.exam}</TableCell>
                                <TableCell className="text-right font-bold">{result.total}</TableCell>
                                <TableCell className={cn("text-right font-semibold", getGradeColor(result.grade))}>{result.grade}</TableCell>
                                <TableCell className="text-right">{result.remark}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="performance-skills">
                <Card>
                    <CardHeader>
                         <CardTitle>Behaviour & Skills Assessment</CardTitle>
                        <CardDescription>Evaluation of affective and psychomotor skills for the term.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <h3 className="font-semibold mb-2">Affective Skills</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Skill</TableHead>
                                            <TableHead className="text-right">Rating</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {studentDetails.affectiveSkills.map(skill => (
                                            <TableRow key={skill.name}>
                                                <TableCell>{skill.name}</TableCell>
                                                <TableCell className="text-right">{skill.rating}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Psychomotor Skills</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Skill</TableHead>
                                            <TableHead className="text-right">Rating</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {studentDetails.psychomotorSkills.map(skill => (
                                            <TableRow key={skill.name}>
                                                <TableCell>{skill.name}</TableCell>
                                                <TableCell className="text-right">{skill.rating}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                        <div className="mt-6 border-t pt-4">
                            <h4 className="font-semibold mb-2">Rating Key</h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                {skillGradingKey.map(key => (
                                    <p key={key.rating} className="text-sm text-muted-foreground">
                                        <span className="font-semibold">{key.rating}</span> - {key.label}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        {/* === Layout 3: Comments & Grading Card === */}
        <Card>
            <CardHeader>
                <CardTitle>Comments & Grading</CardTitle>
                <CardDescription>Feedback on this term's performance and the official grading scale.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="teacher-comment" className="font-semibold">Form Teacher's Comment</Label>
                        <Textarea id="teacher-comment" readOnly value={studentDetails.teacherComment} className="mt-1 bg-muted/30" />
                    </div>
                    <div>
                        <Label htmlFor="principal-comment" className="font-semibold">Principal's Comment</Label>
                        <Textarea id="principal-comment" readOnly value={studentDetails.principalComment} className="mt-1 bg-muted/30" />
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2 text-base">Grading Scale</h4>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Grade</TableHead>
                                <TableHead>Score Range</TableHead>
                                <TableHead>Remark</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {gradingScale.map(item => (
                                <TableRow key={item.grade}>
                                    <TableCell className={cn("font-semibold", getGradeColor(item.grade))}>{item.grade}</TableCell>
                                    <TableCell>{item.range}</TableCell>
                                    <TableCell>{item.remark}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>

      </div>
    );
  }

  return null;
}


export default function ResultsPage() {
    return (
        <Suspense fallback={
            <div className="w-full max-w-4xl mx-auto space-y-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        }>
            <ResultsDisplay />
        </Suspense>
    )
}

    
