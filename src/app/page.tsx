
"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { School } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { allResults, allUsers } from "@/lib/data";

export default function LoginPage() {
  const router = useRouter();
  const { toast, dismiss } = useToast();
  
  const [signInStep, setSignInStep] = React.useState(1);
  const [emailOrId, setEmailOrId] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const [loginToastId, setLoginToastId] = React.useState<string | null>(null);

  const [resultsStep, setResultsStep] = React.useState(1);
  const [regId, setRegId] = React.useState("");
  const [securityAnswer, setSecurityAnswer] = React.useState("");
  const [isFetchingResults, setIsFetchingResults] = React.useState(false);

  const securityQuestion = "What is your favourite subject?";

  React.useEffect(() => {
    return () => {
      if (loginToastId) {
        dismiss(loginToastId);
      }
    };
  }, [loginToastId, dismiss]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    setTimeout(() => {
      toast({
        title: 'OTP Sent',
        description: `An OTP has been sent to your registered contact method.`,
      });
      setSignInStep(2);
      setIsSigningIn(false);
    }, 1000);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    setIsRedirecting(true);

    setTimeout(() => {
      const user = allUsers.find(u => u.email.toLowerCase() === emailOrId.toLowerCase() || u.regId.toLowerCase() === emailOrId.toLowerCase());

      if (user && otp === '555') {
        const { id: newToastId } = toast({
          title: 'Login Successful',
          description: `Redirecting to your dashboard...`,
        });
        setLoginToastId(newToastId);

        const session = {
            type: 'user',
            regId: user.regId,
            loginTime: new Date().getTime()
        };
        localStorage.setItem('flemzin_session', JSON.stringify(session));

        const rolePath = user.role.toLowerCase() === 'parent' || user.role.toLowerCase() === 'student' 
          ? 'parstud' 
          : user.role.toLowerCase();
        
        const redirectRegId = user.regId;
        
        setTimeout(() => {
            router.push(`/${rolePath}?loggedInUserRegId=${redirectRegId}`);
        }, 500);

      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid credentials or OTP. Please try again.',
          variant: 'destructive',
        });
        setIsSigningIn(false);
        setIsRedirecting(false);
      }
    }, 1000);
  };

  const handleResultsNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (regId) {
      setResultsStep(2);
    } else {
      toast({
        title: "Registration ID required",
        description: "Please enter a registration ID.",
        variant: "destructive",
      });
    }
  };

  const handleFetchResults = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFetchingResults(true);

    const correctAnswer = "Computer Science";

    if (securityAnswer.toLowerCase() !== correctAnswer.toLowerCase()) {
      toast({
        title: "Incorrect Answer",
        description: "The answer to the security question is not correct.",
        variant: "destructive",
      });
      setIsFetchingResults(false);
      return;
    }

    setTimeout(() => {
      const studentResults = allResults[regId.toUpperCase() as keyof typeof allResults];
      if (studentResults) {
        const session = {
            type: 'guest',
            regId: regId.toUpperCase(),
            loginTime: new Date().getTime()
        };
        localStorage.setItem('flemzin_session', JSON.stringify(session));
        router.push(`/parstud/results?regId=${regId.toUpperCase()}&guest=true`);
      } else {
        toast({
          title: "No Results Found",
          description: "Please check the registration ID and try again.",
          variant: "destructive",
        });
      }
      setIsFetchingResults(false);
    }, 1000);
  };

  const resetResultsView = () => {
    setResultsStep(1);
    setRegId("");
    setSecurityAnswer("");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center space-y-4 mb-6">
          <School className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold tracking-tighter text-foreground">FlemzinPortal</h1>
          <p className="text-muted-foreground">Your gateway to academic excellence.</p>
        </div>
        <Card className="w-full shadow-2xl">
          <Tabs defaultValue="signin" className="w-full" onValueChange={resetResultsView}>
            <CardHeader>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="results">View Results</TabsTrigger>
                </TabsList>
            </CardHeader>
            <TabsContent value="signin">
                <CardHeader className="pt-0">
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    {signInStep === 1 && (
                        <form onSubmit={handleNextStep} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="id">Registration ID / Email</Label>
                                <Input 
                                  id="id" 
                                  type="text" 
                                  placeholder="e.g., FZP-12345 or user@email.com" 
                                  required 
                                  value={emailOrId}
                                  onChange={(e) => setEmailOrId(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSigningIn}>
                                {isSigningIn ? 'Sending OTP...' : 'Next'}
                            </Button>
                        </form>
                    )}
                     {signInStep === 2 && (
                        <form onSubmit={handleSignIn} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="id-disabled">Registration ID / Email</Label>
                                <Input 
                                  id="id-disabled" 
                                  type="text" 
                                  value={emailOrId}
                                  disabled 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="otp">Enter OTP</Label>
                                <Input 
                                    id="otp" 
                                    type="password" 
                                    required 
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter the OTP (e.g., 555)"
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSigningIn || isRedirecting}>
                                {isRedirecting ? 'Redirecting...' : isSigningIn ? 'Confirming...' : 'Confirm & Sign In'}
                            </Button>
                            <Button variant="link" size="sm" className="p-0" onClick={() => setSignInStep(1)}>
                                Go back
                            </Button>
                        </form>
                    )}
                </CardContent>
            </TabsContent>
            <TabsContent value="results">
                 <CardHeader className="pt-0">
                    <CardTitle className="text-2xl">View Results</CardTitle>
                    <CardDescription>Enter a student registration ID to view their results.</CardDescription>
                </CardHeader>
                <CardContent>
                    {resultsStep === 1 && (
                      <form onSubmit={handleResultsNextStep} className="grid gap-4">
                          <div className="grid gap-2">
                          <Label htmlFor="regId">Student Registration ID</Label>
                          <Input
                              id="regId"
                              value={regId}
                              onChange={(e) => setRegId(e.target.value)}
                              placeholder="e.g., FZP-12345"
                              required
                          />
                          </div>
                          <Button type="submit">
                            Next
                          </Button>
                      </form>
                    )}
                    {resultsStep === 2 && (
                      <form onSubmit={handleFetchResults} className="grid gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="regId-disabled">Student Registration ID</Label>
                            <Input
                                id="regId-disabled"
                                value={regId}
                                disabled
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="securityQuestion">{securityQuestion}</Label>
                            <Input
                                id="securityAnswer"
                                value={securityAnswer}
                                onChange={(e) => setSecurityAnswer(e.target.value)}
                                placeholder="Enter your answer"
                                required
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Button variant="link" size="sm" className="p-0" onClick={() => setResultsStep(1)}>
                                Go back
                            </Button>
                            <Button type="submit" disabled={isFetchingResults}>
                              {isFetchingResults ? "Fetching..." : "Fetch Results"}
                            </Button>
                          </div>
                      </form>
                    )}
                </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  );
}
