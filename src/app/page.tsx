"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { ProfileCard } from "@/components/feed/ProfileCard";
import { MOCK_USERS, CURRENT_USER } from "@/lib/mock-data";

export default function Home() {
  // Filter out the current user from the feed
  const feedUsers = MOCK_USERS.filter(u => u.id !== CURRENT_USER.id);

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-10 bg-black/[0.01] dark:bg-white/[0.01]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Discover Skills</h1>
            <p className="text-muted-foreground mt-2">Hire top student talent or find your next gig.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {feedUsers.map(user => (
              <ProfileCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
