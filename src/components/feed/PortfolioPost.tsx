import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";
import { UserProfile } from "@/lib/mock-data";

export interface FeedGig {
  id: string;
  user: UserProfile;
  imageUrl: string;
  title: string;
  price: number;
  expertise: string;
}

interface PortfolioPostProps {
  post: FeedGig;
}

export function PortfolioPost({ post }: PortfolioPostProps) {
  return (
    <article className="max-w-xl mx-auto mb-10 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <Link href={`/profile/${post.user.id}`} className="flex items-center gap-3 group">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={post.user.avatarUrl} alt={post.user.username} />
            <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm group-hover:underline">{post.user.username}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {post.user.college}
            </p>
          </div>
        </Link>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontalIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Visual Content */}
      <div className="w-full aspect-square bg-muted relative overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Details & Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Link 
            href={`/dashboard/messages?to=${post.user.id}`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-9 px-4 py-2 hover:bg-primary/90 transition-colors w-full sm:w-auto"
          >
            Send Enquiry
          </Link>
          <Link 
            href={`/profile/${post.user.id}`}
            className="text-sm font-medium text-primary hover:underline hidden sm:block"
          >
            View Full Portfolio
          </Link>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base">{post.title}</h2>
            <span className="font-mono font-medium text-sm">₹{post.price}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="h-3.5 w-3.5" />
            <span>{post.expertise}</span>
          </div>
          <p className="text-sm mt-2">
            <span className="font-semibold mr-2">{post.user.username}</span>
            Offering high-quality services for {post.title.toLowerCase()}. I have extensive experience and can deliver great results quickly.
          </p>
          <div className="flex flex-wrap gap-1 mt-3">
            {post.user.skills.slice(0, 3).map(skill => (
              <span key={skill} className="text-xs font-medium text-blue-500 dark:text-blue-400 cursor-pointer hover:underline">
                #{skill.toLowerCase().replace(/\s+/g, '')}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function MoreHorizontalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}
