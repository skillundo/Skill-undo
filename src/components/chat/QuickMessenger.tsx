"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, Send, User, ChevronLeft } from "lucide-react";
import { MOCK_MESSAGES, MOCK_PROJECTS } from "@/lib/mock-data";
import { useAuth } from "@/components/auth/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export function QuickMessenger() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // Hide the quick messenger if we are already on the full messages page
  if (pathname === "/dashboard/messages") return null;

  const effectiveUid = user?.uid === "mock-uid-123" ? "u1" : user?.uid || "u1";
  
  // Group messages by projectId
  const threads = MOCK_PROJECTS.map(project => {
    const projectMsgs = MOCK_MESSAGES.filter(m => m.projectId === project.id);
    const otherUser = project.client.id === effectiveUid ? project.worker : project.client;
    
    return {
      project,
      otherUser,
      messages: projectMsgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    };
  }).filter(t => t.messages.length > 0 || t.project.client.id === effectiveUid || t.project.worker.id === effectiveUid);

  const activeThread = threads.find(t => t.project.id === activeThreadId);

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
      {/* Chat Window Popup */}
      {isOpen && (
        <div className="mb-4 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in-20">
          
          {!activeThreadId ? (
            // Inbox View
            <div className="flex flex-col h-80">
              <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
                <h4 className="font-semibold text-sm">Messages</h4>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-primary-foreground/10 rounded-md transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {threads.map(thread => {
                  const lastMsg = thread.messages[thread.messages.length - 1];
                  return (
                    <div 
                      key={thread.project.id}
                      onClick={() => setActiveThreadId(thread.project.id)}
                      className="p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 border-b border-border/50"
                    >
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={thread.otherUser.avatarUrl} />
                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-semibold text-sm truncate">{thread.otherUser.username}</h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {lastMsg ? (lastMsg.senderId === effectiveUid ? `You: ${lastMsg.content}` : lastMsg.content) : "No messages yet"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Active Chat View
            <div className="flex flex-col h-80">
              {/* Header */}
              <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setActiveThreadId(null)}
                    className="p-1 hover:bg-primary-foreground/10 rounded-md transition-colors -ml-1 mr-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <Avatar className="h-8 w-8 border border-primary-foreground/20">
                    <AvatarImage src={activeThread?.otherUser.avatarUrl} />
                    <AvatarFallback className="bg-primary-foreground/10"><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-sm leading-none">{activeThread?.otherUser.username}</h4>
                    <span className="text-[10px] opacity-80">Active now</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-primary-foreground/10 rounded-md transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col">
                {activeThread?.messages.map(msg => {
                  const isMe = msg.senderId === effectiveUid;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-sm ${isMe ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted rounded-bl-sm'}`}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-border bg-card">
                <div className="relative">
                  <Input 
                    placeholder="Type a message..." 
                    className="pr-10 rounded-full bg-muted border-none text-sm h-9"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newMessage.trim()) setNewMessage("");
                    }}
                  />
                  <button 
                    className="absolute right-1 top-0.5 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
                    onClick={() => setNewMessage("")}
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-muted text-foreground rotate-90 scale-90' : 'bg-primary text-primary-foreground hover:scale-105 hover:shadow-xl'}`}
      >
        {isOpen ? <X className="h-6 w-6 -rotate-90" /> : (
          <>
            <MessageSquare className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 border-2 border-background rounded-full" />
          </>
        )}
      </button>
    </div>
  );
}
