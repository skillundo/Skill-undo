"use client";

import { useMemo, useState, useEffect } from "react";
import { PortfolioPost, FeedGig } from "@/components/feed/PortfolioPost";
import { supabase } from "@/lib/supabase";
import { Search as SearchIcon } from "lucide-react";

const CATEGORY_GROUPS = [
  "TECH & ENGINEERING",
  "CREATIVE & DESIGN",
  "WRITING & CONTENT",
  "ACADEMIC & TUTORING",
  "MUSIC & AUDIO",
  "BUSINESS & MARKETING",
  "PERSONAL & LIFESTYLE",
  "CRAFTS & HANDMADE"
];

type SortOption = "Relevant" | "Newest" | "Price: Low to High" | "Price: High to Low" | "Top Rated";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("Relevant");
  
  const [feedPosts, setFeedPosts] = useState<FeedGig[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch results dynamically
  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);

      try {
        let query = supabase
          .from('skills')
          .select('*, users!fk_skills_user_id(username, avatar_url)')
          .eq('status', 'active');

        if (debouncedSearchTerm) {
          query = query.or(
            `title.ilike.%${debouncedSearchTerm}%,description.ilike.%${debouncedSearchTerm}%,tags.cs.{"${debouncedSearchTerm}"},category.ilike.%${debouncedSearchTerm}%`
          );
        }

        if (activeCategory !== 'All') {
          query = query.ilike('category', `%${activeCategory}%`);
        }

        switch (sortBy) {
          case 'Newest':
            query = query.order('created_at', { ascending: false }); break;
          case 'Price: Low to High':
            query = query.order('price_basic', { ascending: true }); break;
          case 'Price: High to Low':
            query = query.order('price_basic', { ascending: false }); break;
          default:
            query = query.order('created_at', { ascending: false }); break;
        }

        const { data, error } = await query.limit(40);

        if (error) {
          console.error("Error fetching search results:", error);
          return;
        }

        if (data) {
          const posts: FeedGig[] = data.map((skill: any) => ({
            id: skill.id,
            user: {
              id: skill.user_id,
              username: skill.users?.username || 'Unknown',
              displayName: skill.users?.username || 'Unknown',
              avatarUrl: skill.users?.avatar_url || '',
              skills: skill.tags || [],
              rating: 0, // Mocked for now
              completedJobs: 0, // Mocked for now
              college: '',
              locality: '',
              portfolio: [],
            },
            imageUrl: skill.image_url || '',
            title: skill.title,
            price: skill.price_basic || 0,
            expertise: "Expert Level",
            category: skill.category,
          }));
          setFeedPosts(posts);
        }
      } catch (err) {
        console.error("Search fetch failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchTerm, activeCategory, sortBy]);

  return (
    <div className="py-8 px-6 w-full max-w-[1600px] mx-auto flex flex-col gap-6 min-h-screen bg-background">
      
      {/* Search Input Bar */}
      <div className="relative w-full shadow-sm rounded-xl overflow-hidden border border-border">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <input
          type="text"
          className="w-full bg-card pl-12 pr-4 py-5 text-lg outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground"
          placeholder="Search for a skill, subject, or student..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-2 w-full">
        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 flex-1 min-w-0 w-full">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeCategory === "All" ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            All Categories
          </button>
          {CATEGORY_GROUPS.map(cat => (
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

      {/* Result Count */}
      <p className="text-sm text-muted-foreground font-medium">
        {feedPosts.length} skills found
      </p>

      {/* Grid Feed */}
      <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        {feedPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {feedPosts.map((post) => (
              <PortfolioPost key={post.id} post={post} />
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="py-24 flex flex-col items-center justify-center text-center bg-muted/30 border border-border/50 rounded-2xl w-full">
              <div className="h-16 w-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                <SearchIcon className="text-muted-foreground h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold mb-1">No skills found for '{searchTerm}'</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
