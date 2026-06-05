"use client";

import { useMemo } from "react";
import { PortfolioPost, FeedGig } from "@/components/feed/PortfolioPost";
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
          price: Math.floor(Math.random() * 5000) + 1000,
          expertise: u.rating > 4.8 ? "Expert Level" : "Intermediate",
        });
      });
    });

    // Shuffle the posts to make the feed look more natural
    return posts.sort(() => Math.random() - 0.5);
  }, [effectiveUid]);

  return (
    <div className="py-8 px-4 w-full">
      <div className="max-w-xl mx-auto mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Explore Portfolios</h1>
        <p className="text-muted-foreground text-sm mt-1">Discover top student talent and their best work.</p>
      </div>

      <div className="flex flex-col gap-6">
        {feedPosts.length > 0 ? (
          feedPosts.map((post) => (
            <PortfolioPost key={post.id} post={post} />
          ))
        ) : (
          <div className="py-12 text-center text-muted-foreground bg-card border border-border rounded-xl max-w-xl mx-auto w-full">
            No portfolios found right now.
          </div>
        )}
      </div>
    </div>
  );
}
