import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Star, Heart, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { UserProfile } from "@/lib/mock-data";

export interface FeedGig {
  id: string;
  user: UserProfile;
  imageUrl: string;
  title: string;
  price: number;
  expertise: string;
  category: string;
}

interface PortfolioPostProps {
  post: FeedGig;
}

const CATEGORY_COLORS: Record<string, string> = {
  Engineering: "bg-blue-500/90 text-white",
  Design: "bg-pink-500/90 text-white",
  Writing: "bg-emerald-500/90 text-white",
  Other: "bg-zinc-800/90 text-white dark:bg-zinc-200/90 dark:text-black",
};

export function PortfolioPost({ post }: PortfolioPostProps) {
  const categoryColor = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.Other;
  
  return (
    <div className="flex flex-col bg-card border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden group">
      {/* Image Thumbnail */}
      <Link href={`/profile/${post.user.id}`} className="block relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <img 
          src={post.imageUrl} 
          alt={post.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        {/* Category Badge */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${categoryColor}`}>
          {post.category}
        </div>
        {/* Heart Icon (Mock Save) */}
        <button className="absolute top-3 right-3 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-colors" onClick={(e) => e.preventDefault()}>
          <Heart className="h-4 w-4" />
        </button>
      </Link>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Seller Info */}
        <div className="flex items-center gap-2 mb-3">
          <Link href={`/profile/${post.user.id}`}>
            <Avatar className="h-6 w-6 border border-border">
              <AvatarImage src={post.user.avatarUrl} alt={post.user.username} />
              <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col">
            <Link href={`/profile/${post.user.id}`} className="flex items-center gap-1 group/name">
              <span className="text-sm font-semibold group-hover/name:underline leading-none">{post.user.username}</span>
              <BadgeCheck className="h-3.5 w-3.5 text-blue-500 fill-blue-500/20" aria-label="Verified Student" />
            </Link>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              {post.expertise === "Expert Level" ? "Top Rated Seller" : "Level 1 Seller"}
            </span>
          </div>
        </div>

        {/* Gig Title */}
        <Link href={`/profile/${post.user.id}`} className="block mb-3">
          <h3 className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            I will provide high-quality {post.title.toLowerCase()} tailored to your needs
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-auto mb-4">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="font-bold text-sm">{(post.user.rating || 5.0).toFixed(1)}</span>
          <span className="text-muted-foreground text-sm">
            ({post.user.completedJobs || 12})
          </span>
        </div>

        {/* Footer: Price */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-between">
          <button className="text-muted-foreground hover:text-primary transition-colors p-1" title="Options">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
          <div className="text-right">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider block leading-none mb-1">
              Starting at
            </span>
            <span className="text-lg font-bold leading-none">
              ₹{post.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
