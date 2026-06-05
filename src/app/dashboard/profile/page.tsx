"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { Project } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Briefcase, Star, Clock, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardProfileView() {
  const { user } = useAuth();
  
  // Placeholder for real projects fetching
  const hiredByMe: Project[] = [];
  const myGigs: Project[] = [];

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-8">
      {/* Profile Header & Statistics */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 mb-10 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
        
        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
          <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
          <AvatarFallback className="bg-muted text-muted-foreground">
            <User className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 w-full space-y-6 z-10">
          <div>
            <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{user?.displayName || "Anonymous User"}</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            <div className="bg-background rounded-xl p-4 border border-border/50 text-center flex flex-col items-center justify-center gap-1">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mb-1" />
              <span className="text-xl font-bold">4.9</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Rating</span>
            </div>
            <div className="bg-background rounded-xl p-4 border border-border/50 text-center flex flex-col items-center justify-center gap-1">
              <CheckCircle2 className="h-5 w-5 text-green-500 mb-1" />
              <span className="text-xl font-bold">{myGigs.length + 12}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Completed</span>
            </div>
            <div className="bg-background rounded-xl p-4 border border-border/50 text-center flex flex-col items-center justify-center gap-1">
              <Briefcase className="h-5 w-5 text-blue-500 mb-1" />
              <span className="text-xl font-bold">{myGigs.length}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Active Gigs</span>
            </div>
            <div className="bg-background rounded-xl p-4 border border-border/50 text-center flex flex-col items-center justify-center gap-1">
              <Clock className="h-5 w-5 text-purple-500 mb-1" />
              <span className="text-xl font-bold">{hiredByMe.length}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Orders</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Your Orders (Hired by me) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-xl font-bold">Your Orders</h2>
            <Badge variant="secondary" className="rounded-full">{hiredByMe.length}</Badge>
          </div>
          
          <div className="space-y-4">
            {hiredByMe.length > 0 ? (
              hiredByMe.map((project, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={project.id}
                >
                  <Link href={`/workspace/${project.id}`} className="block group">
                    <div className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{project.title}</h3>
                        <span className="font-mono font-medium text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-md">₹{project.budget}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6 border border-border">
                            <AvatarImage src={project.worker.avatarUrl} />
                            <AvatarFallback className="text-[10px]">W</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">Worker: <span className="font-medium text-foreground">{project.worker.username}</span></span>
                        </div>
                        <Badge variant="outline" className={`text-[10px] rounded-sm ${project.status === 'In Progress' ? 'border-blue-500/50 text-blue-500' : ''}`}>
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="p-8 text-center border border-dashed border-border rounded-xl bg-muted/30">
                <p className="text-muted-foreground text-sm mb-4">You haven't placed any orders yet.</p>
                <Link href="/dashboard" className="text-primary text-sm font-medium hover:underline">Explore services</Link>
              </div>
            )}
          </div>
        </div>

        {/* Your Gigs (Working on) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-xl font-bold">Your Active Gigs</h2>
            <Badge variant="secondary" className="rounded-full">{myGigs.length}</Badge>
          </div>
          
          <div className="space-y-4">
            {myGigs.length > 0 ? (
              myGigs.map((project, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={project.id}
                >
                  <Link href={`/workspace/${project.id}`} className="block group">
                    <div className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{project.title}</h3>
                        <span className="font-mono font-medium text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-md">₹{project.budget}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6 border border-border">
                            <AvatarImage src={project.client.avatarUrl} />
                            <AvatarFallback className="text-[10px]">C</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">Client: <span className="font-medium text-foreground">{project.client.username}</span></span>
                        </div>
                        <Badge variant="outline" className={`text-[10px] rounded-sm ${project.status === 'In Progress' ? 'border-green-500/50 text-green-500' : ''}`}>
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="p-8 text-center border border-dashed border-border rounded-xl bg-muted/30">
                <p className="text-muted-foreground text-sm mb-4">You don't have any active gigs.</p>
                <Link href="/workspace/new" className="text-primary text-sm font-medium hover:underline">Create a gig</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
