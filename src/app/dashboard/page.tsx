"use client";

import { useMemo, useState } from "react";
import { PortfolioPost, FeedGig } from "@/components/feed/PortfolioPost";
import { SuggestedSellers } from "@/components/feed/SuggestedSellers";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserProfile } from "@/lib/mock-data"; // Just for type if needed later, but actually we only need it if we define a state

const CATEGORIES = {
  Engineering: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "API"],
  Design: ["Figma", "UI/UX", "Tailwind"],
  Writing: ["Copywriting", "SEO", "Content"],
};

type SortOption = "Relevant" | "Newest" | "Top Rated" | "Price: Low to High" | "Price: High to Low";

export default function DashboardFeed() {
  const { user } = useAuth();
  const effectiveUid = user?.uid;
  const currentUser: UserProfile | undefined = undefined;

  // Placeholder for real feed gigs fetching
  const feedPosts: FeedGig[] = useMemo(() => {
    return [];
  }, [effectiveUid]);


  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("Relevant");

  const displayedPosts = useMemo(() => {
    let filtered = feedPosts;

    if (activeCategory) {
      const categorySkills = CATEGORIES[activeCategory as keyof typeof CATEGORIES];
      filtered = filtered.filter(post => post.user.skills.some(s => categorySkills.includes(s)));
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "Price: Low to High": return a.price - b.price;
        case "Price: High to Low": return b.price - a.price;
        case "Top Rated": return (b.user.rating || 0) - (a.user.rating || 0);
        case "Newest": return b.id.localeCompare(a.id);
        case "Relevant":
        default: return a.id.localeCompare(b.id);
      }
    });
  }, [feedPosts, activeCategory, sortBy]);

  // Calculate matching skills for the banner
  const matchingSkillsCount = useMemo(() => {
    return 0;
  }, []);

  return (
    <div className="py-8 px-6 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8">
      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        
        {/* Personalized Banner */}
        <div className="mb-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span>🎯</span> {matchingSkillsCount > 0 ? `${matchingSkillsCount} gigs match your profile` : "Discover top campus talent"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {user ? "We found several students offering skills related to your interests." : "Sign in to see personalized matches from your batchmates."}
            </p>
          </div>
          <button className="hidden sm:block px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition-colors">
            View Matches
          </button>
        </div>

        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Explore Services</h1>
          <p className="text-muted-foreground text-base">Find the perfect student talent for your project.</p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-full pb-2 md:pb-0">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${!activeCategory ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              All Categories
            </button>
            {Object.keys(CATEGORIES).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
            <select 
              className="bg-transparent border border-border rounded-lg px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none cursor-pointer hover:bg-muted/50 transition-colors"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="Relevant">Relevant</option>
              <option value="Newest">Newest Arrivals</option>
              <option value="Top Rated">Top Rated</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Grid Feed */}
        {displayedPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedPosts.map((post) => (
              <PortfolioPost key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center bg-muted/30 border border-border/50 rounded-2xl w-full">
            <div className="h-16 w-16 mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <h3 className="text-lg font-bold mb-1">No services found</h3>
            <p className="text-muted-foreground">Try selecting a different category.</p>
          </div>
        )}
      </div>

      {/* Right Sidebar (Social/Trending) */}
      <div className="hidden lg:block w-80 shrink-0">
        <SuggestedSellers />
      </div>
    </div>
  );
}
