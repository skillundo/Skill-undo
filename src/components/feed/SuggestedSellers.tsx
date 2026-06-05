"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { MOCK_USERS } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, MapPin, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export function SuggestedSellers() {
  const { user } = useAuth();
  const effectiveUid = user?.uid === "mock-uid-123" ? "u1" : user?.uid || "u1";

  const suggestedUsers = useMemo(() => {
    const currentUser = MOCK_USERS.find(u => u.id === effectiveUid);
    
    if (!currentUser) {
      return MOCK_USERS.slice(0, 5)
        .filter(u => u.id !== effectiveUid)
        .map(u => ({ user: u, reason: "Suggested for you", score: 0 }));
    }

    // Score users based on shared college or locality
    const scoredUsers = MOCK_USERS.filter(u => u.id !== effectiveUid).map(u => {
      let score = 0;
      let reason = "";
      
      if (u.college === currentUser.college) {
        score += 2;
        reason = "From your college";
      } else if (u.locality === currentUser.locality) {
        score += 1;
        reason = "Near you";
      } else {
        reason = "Suggested for you";
      }

      return { user: u, score, reason };
    });

    // Sort by score and take top 5
    return scoredUsers.sort((a, b) => b.score - a.score).slice(0, 5);
  }, [effectiveUid]);

  if (suggestedUsers.length === 0) return null;

  return (
    <div className="w-full max-w-sm sticky top-24 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">Suggested for you</h2>
        <Link href="/dashboard/search" className="text-xs font-semibold text-primary hover:text-primary/80">See All</Link>
      </div>

      <div className="space-y-4">
        {suggestedUsers.map(({ user, reason }) => (
          <div key={user.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-3 overflow-hidden">
              <Link href={`/profile/${user.id}`}>
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={user.avatarUrl} alt={user.username} />
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-col overflow-hidden">
                <Link href={`/profile/${user.id}`} className="text-sm font-semibold hover:underline truncate">
                  {user.username}
                </Link>
                <span className="text-xs text-muted-foreground truncate flex items-center gap-1">
                  {reason === "From your college" ? <GraduationCap className="h-3 w-3" /> : reason === "Near you" ? <MapPin className="h-3 w-3" /> : null}
                  {reason}
                </span>
              </div>
            </div>
            <Link 
              href={`/profile/${user.id}`}
              className="text-xs font-semibold text-primary hover:text-primary/80 ml-3"
            >
              View
            </Link>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-border/50 text-xs text-muted-foreground space-y-4">
        <div className="flex flex-wrap gap-x-3 gap-y-2">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/help" className="hover:underline">Help</Link>
          <Link href="/press" className="hover:underline">Press</Link>
          <Link href="/api" className="hover:underline">API</Link>
          <Link href="/jobs" className="hover:underline">Jobs</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
        </div>
        <p>© 2026 SKILLUNDO</p>
      </div>
    </div>
  );
}
