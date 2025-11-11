
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { allUsers, chatMessages, getAdminSupportContacts } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

type Message = {
    id: number;
    sender: string;
    text: string;
    time: string;
};

function ChatContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const chatId = params.id as string;
    const regId = searchParams.get('regId');
    const user = regId ? allUsers.find(u => u.regId === regId) : null;
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    const supportContacts = getAdminSupportContacts();
    const contact = supportContacts.find(c => c.id.toString() === chatId);

    useEffect(() => {
        if (chatId) {
            setMessages((chatMessages as any)[chatId] || []);
        }
    }, [chatId]);
    
    if (!user || !contact) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <h2 className="text-xl font-semibold">Chat not found</h2>
                <p className="text-muted-foreground mt-2">The chat you are looking for may not exist or you may not have permission to view it.</p>
                <Button asChild className="mt-4">
                    <Link href={`/admin/support?regId=${regId || ''}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Support
                    </Link>
                </Button>
            </div>
        );
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const newMsg: Message = {
            id: messages.length + 1,
            sender: user.name,
            text: newMessage,
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        };

        setMessages([...messages, newMsg]);
        setNewMessage('');
    };

    return (
         <div className="flex flex-col h-full max-w-4xl mx-auto">
            <header className="flex items-center justify-between p-4 border-b bg-card">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/support?regId=${regId}`}>
                            <ArrowLeft className="h-5 w-5" />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <Avatar>
                        <AvatarFallback>{contact.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5">
                        <p className="text-lg font-semibold">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.online ? 'Online' : 'Offline'}</p>
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 md:pb-28">
                {messages.map((message, index) => (
                    <div key={index} className={cn('flex items-end gap-2', message.sender === user.name ? 'justify-end' : 'justify-start')}>
                        {message.sender !== user.name && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{message.sender.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn(
                            "max-w-xs md:max-w-md rounded-2xl px-4 py-2", 
                            message.sender === user.name ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'
                        )}>
                            <p className="text-sm">{message.text}</p>
                            <p className="text-xs text-right mt-1 opacity-70">{message.time}</p>
                        </div>
                            {message.sender === user.name && (
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
            </main>

            <div className="fixed bottom-[4.5rem] md:bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm md:relative md:bg-transparent">
                    <div className="max-w-4xl mx-auto p-4">
                    <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                        <Textarea
                            id="message"
                            placeholder="Type your message..."
                            className="flex-1 resize-none bg-card shadow-sm"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                        />
                        <Button type="submit" size="icon" className="h-12 w-12 rounded-full" disabled={!newMessage.trim()}>
                            <Send className="h-5 w-5" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}


export default function ChatPage() {
    return (
        <Suspense fallback={<ChatSkeleton/>}>
            <ChatContent />
        </Suspense>
    )
}

function ChatSkeleton() {
    return (
      <div className="flex flex-col h-full max-w-4xl mx-auto">
        <header className="flex items-center justify-between p-4 border-b bg-card">
              <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-16" />
                  </div>
              </div>
          </header>
          <main className="flex-1 p-4 space-y-4">
              <div className="flex items-end gap-2 justify-start">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-16 w-64 rounded-xl" />
              </div>
               <div className="flex items-end gap-2 justify-end">
                  <Skeleton className="h-20 w-48 rounded-xl" />
                  <Skeleton className="h-8 w-8 rounded-full" />
              </div>
               <div className="flex items-end gap-2 justify-start">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-12 w-56 rounded-xl" />
              </div>
          </main>
           <div className="p-4 border-t bg-card">
              <div className="flex w-full items-center space-x-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
          </div>
      </div>
    );
}
