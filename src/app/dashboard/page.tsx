"use client";

import { useMemo, useState } from "react";
import { PortfolioPost, FeedGig } from "@/components/feed/PortfolioPost";
import { SuggestedSellers } from "@/components/feed/SuggestedSellers";
import { MOCK_USERS } from "@/lib/mock-data";
import { useAuth } from "@/components/auth/AuthProvider";

export default function DashboardFeed() {
  const { user } = useAuth();
  
  const effectiveUid = user?.uid === "mock-uid-123" ? "u1" : user?.uid;

  // Generate mock feed gigs from the users' portfolios
  const feedPosts: FeedGig[] = useMemo(() => {
    const posts: FeedGig[] = [];
    
    MOCK_USERS.forEach((u) => {
      // Don't show the current user's own gigs in the main discover feed
      if (u.id === effectiveUid) return;
      
      u.portfolio.forEach((imgUrl, index) => {
        posts.push({
          id: `${u.id}-gig-${index}`,
          user: u,
          imageUrl: imgUrl,
          title: `${u.skills[0] || "Custom"} Services`,
          price: ((u.id.charCodeAt(0) + index) * 499) % 4000 + 1000,
          expertise: u.rating > 4.8 ? "Expert Level" : "Intermediate",
        });
      });
    });

    // Sort the posts deterministically to avoid hydration mismatch
    return posts.sort((a, b) => a.id.localeCompare(b.id));
  }, [effectiveUid]);

  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    feedPosts.forEach(post => post.user.skills.forEach(s => skills.add(s)));
    return Array.from(skills);
  }, [feedPosts]);

  const displayedPosts = useMemo(() => {
    if (!activeFilter) return feedPosts;
    return feedPosts.filter(post => post.user.skills.includes(activeFilter));
  }, [feedPosts, activeFilter]);

  return (
    <div className="py-8 px-4 w-full max-w-5xl mx-auto flex justify-center gap-12">
      {/* Main Feed Column */}
      <div className="flex-1 max-w-xl w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Explore Portfolios</h1>
          <p className="text-muted-foreground text-sm mt-1">Discover top student talent and their best work.</p>
        </div>

        {/* Filters */}
        {allSkills.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar scroll-smooth">
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!activeFilter ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
            >
              All
            </button>
            {allSkills.map(skill => (
              <button
                key={skill}
                onClick={() => setActiveFilter(skill)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === skill ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
              >
                {skill}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-6">
          {displayedPosts.length > 0 ? (
            displayedPosts.map((post) => (
              <PortfolioPost key={post.id} post={post} />
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground bg-card border border-border rounded-xl w-full">
              No portfolios found for this skill.
            </div>
          )}
        </div>
      </div>

      {/* Suggested Sellers Sidebar */}
      <div className="hidden lg:block w-80 shrink-0 pt-4">
        <SuggestedSellers />
      </div>
    </div>
  );
}
