"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Send, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Project, UserProfile, Message } from "@/lib/mock-data";

export default function MessagesPage() {
  const { user } = useAuth();
  const effectiveUid = user?.uid || "u1";

  // Placeholder for real threads fetching
  const threads: { project: Project; otherUser: UserProfile; messages: Message[] }[] = [];

  const [activeThreadId, setActiveThreadId] = useState<string | null>(threads[0]?.project.id || null);
  const [newMessage, setNewMessage] = useState("");

  const activeThread = threads.find(t => t.project.id === activeThreadId);

  return (
    <div className="flex h-[calc(100vh)] bg-card border-l border-border w-full max-w-6xl mx-auto">
      {/* Threads List */}
      <div className="w-1/3 min-w-[300px] border-r border-border flex flex-col">
        <div className="p-4 border-b border-border font-bold text-xl h-20 flex items-center gap-3">
          <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
             <ArrowLeft className="h-5 w-5" />
          </Link>
          Messages
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.map(thread => {
            const lastMsg = thread.messages[thread.messages.length - 1];
            const isActive = thread.project.id === activeThreadId;
            return (
              <div 
                key={thread.project.id}
                onClick={() => setActiveThreadId(thread.project.id)}
                className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${isActive ? 'bg-muted' : 'hover:bg-muted/50'}`}
              >
                <Avatar className="h-12 w-12 border border-border">
                  <AvatarImage src={thread.otherUser.avatarUrl} />
                  <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm truncate">{thread.otherUser.username}</h4>
                    {lastMsg && (
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {new Date(lastMsg.timestamp).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate font-medium">Project: {thread.project.title}</p>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {lastMsg ? (lastMsg.senderId === effectiveUid ? `You: ${lastMsg.content}` : lastMsg.content) : "No messages yet"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Thread */}
      {activeThread ? (
        <div className="flex-1 flex flex-col h-full">
          {/* Chat Header */}
          <div className="p-4 border-b border-border h-20 flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={activeThread.otherUser.avatarUrl} />
              <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold">{activeThread.otherUser.username}</h3>
              <p className="text-xs text-muted-foreground">Order: {activeThread.project.title}</p>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/[0.02] dark:bg-white/[0.02]">
            {activeThread.messages.map(msg => {
              const isMe = msg.senderId === effectiveUid;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted rounded-bl-sm'}`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-card border-t border-border">
            <div className="relative">
              <Input 
                placeholder="Message..." 
                className="pr-12 rounded-full bg-muted border-none focus-visible:ring-1"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newMessage.trim()) {
                    setNewMessage(""); // Mock send
                  }
                }}
              />
              <button 
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
                onClick={() => setNewMessage("")}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-4">
          <MessageSquare className="h-12 w-12 opacity-20" />
          <p>Your messages</p>
          <p className="text-sm">Send private photos and messages to a friend or client.</p>
        </div>
      )}
    </div>
  );
}
