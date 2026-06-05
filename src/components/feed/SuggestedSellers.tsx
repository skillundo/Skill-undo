"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { MOCK_USERS } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Flame, GraduationCap, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export function SuggestedSellers() {
  const { user } = useAuth();
  const effectiveUid = user?.uid === "mock-uid-123" ? "u1" : user?.uid || "u1";

  const suggestedUsers = useMemo(() => {
    const currentUser = MOCK_USERS.find(u => u.id === effectiveUid);
    
    // Deterministically mock year and department based on user ID
    const getMockDept = (id: string) => {
      const depts = ["Computer Science", "Design", "Business", "Communications"];
      return depts[(id.charCodeAt(0) + id.charCodeAt(1)) % depts.length];
    };
    
    const getMockYear = (id: string) => {
      const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
      return years[(id.charCodeAt(id.length - 1)) % years.length];
    };

    if (!currentUser) {
      return MOCK_USERS.slice(0, 5)
        .filter(u => u.id !== effectiveUid)
        .map(u => ({ user: u, year: getMockYear(u.id), dept: getMockDept(u.id), score: 0 }));
    }

    const scoredUsers = MOCK_USERS.filter(u => u.id !== effectiveUid).map(u => {
      let score = 0;
      if (u.college === currentUser.college) score += 2;
      else if (u.locality === currentUser.locality) score += 1;

      return { user: u, score, year: getMockYear(u.id), dept: getMockDept(u.id) };
    });

    return scoredUsers.sort((a, b) => b.score - a.score).slice(0, 5);
  }, [effectiveUid]);

  return (
    <div className="w-full sticky top-8 space-y-8">
      {/* Trending Panel */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="h-5 w-5 text-orange-500 fill-orange-500/20" />
          <h2 className="text-sm font-bold tracking-tight">Trending on Campus</h2>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="#" className="group flex items-center justify-between text-sm">
            <span className="font-semibold text-foreground/80 group-hover:text-primary transition-colors">#AIPrompting</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3 text-green-500" /> +42%</span>
          </Link>
          <Link href="#" className="group flex items-center justify-between text-sm">
            <span className="font-semibold text-foreground/80 group-hover:text-primary transition-colors">#FigmaDesign</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3 text-green-500" /> +28%</span>
          </Link>
          <Link href="#" className="group flex items-center justify-between text-sm">
            <span className="font-semibold text-foreground/80 group-hover:text-primary transition-colors">#NextJS</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3 text-green-500" /> +15%</span>
          </Link>
        </div>
      </div>

      {/* Suggested Classmates */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2 px-1">
          <GraduationCap className="h-5 w-5 text-blue-500" />
          <h2 className="text-sm font-bold tracking-tight">Suggested Classmates</h2>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          {suggestedUsers.map(({ user, year, dept }, index) => (
            <div key={user.id} className={`flex items-center justify-between p-4 group hover:bg-muted/50 transition-colors cursor-pointer ${index !== suggestedUsers.length - 1 ? 'border-b border-border/50' : ''}`}>
              <div className="flex items-center gap-3 overflow-hidden">
                <Link href={`/profile/${user.id}`}>
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-col overflow-hidden">
                  <Link href={`/profile/${user.id}`} className="text-sm font-bold hover:underline truncate leading-none mb-1">
                    {user.username}
                  </Link>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider truncate">
                    {year} • {dept}
                  </span>
                </div>
              </div>
              <Link 
                href={`/profile/${user.id}`}
                className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-3 bg-primary/10 px-2 py-1 rounded"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
