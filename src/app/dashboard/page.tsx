"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProfileCard } from "@/components/feed/ProfileCard";
import { MOCK_USERS } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  
  const effectiveUid = user?.uid === "mock-uid-123" ? "u1" : user?.uid;

  // Filter out the current user and apply search filter
  const feedUsers = MOCK_USERS.filter((u) => {
    if (u.id === effectiveUid) return false;
    
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      u.username.toLowerCase().includes(query) ||
      u.college.toLowerCase().includes(query) ||
      u.locality.toLowerCase().includes(query) ||
      u.skills.some(skill => skill.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-10 bg-black/[0.01] dark:bg-white/[0.01] min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Discover Skills</h1>
              <p className="text-muted-foreground mt-2">Hire top student talent or find your next gig.</p>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, skills, college, locality..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {feedUsers.length > 0 ? (
              feedUsers.map(user => (
                <ProfileCard key={user.id} user={user} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No users found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
