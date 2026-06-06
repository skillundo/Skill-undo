"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Star, Eye, ShoppingBag, BadgeCheck, MessageSquare, ShieldCheck, RefreshCcw, Lock } from "lucide-react";

export default function SkillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const skillId = params.skillId as string;

  const [skill, setSkill] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [sellerStats, setSellerStats] = useState({ activeSkills: 0, completedOrders: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Gallery State
  const [mainImage, setMainImage] = useState<string>("");

  // Description Toggle
  const [showFullDesc, setShowFullDesc] = useState(false);

  // Tier State
  const [activeTier, setActiveTier] = useState<"basic" | "standard" | "premium">("basic");

  useEffect(() => {
    if (!skillId) return;

    const fetchSkillData = async () => {
      setIsLoading(true);
      try {
        // Fetch skill details
        const { data: skillData, error: skillError } = await supabase
          .from('skills')
          .select('*, users!fk_skills_user_id(username, avatar_url, college)')
          .eq('id', skillId)
          .single();

        if (skillError || !skillData) {
          console.error("Skill fetch error:", JSON.stringify(skillError, null, 2));
          setIsLoading(false);
          return;
        }

        setSkill(skillData);
        setMainImage(skillData.image_url);

        // Fetch reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*, reviewer:users!reviewer_id(username, avatar_url)')
          .eq('skill_id', skillId)
          .order('created_at', { ascending: false });

        if (reviewsData) setReviews(reviewsData);

        // Views column does not exist, so we don't track it currently.

        // Fetch Seller Stats
        const { count: sellerSkillCount } = await supabase
          .from('skills')
          .select('id', { count: 'exact' })
          .eq('user_id', skillData.users?.id)
          .eq('status', 'active');

        const { count: completedOrdersCount } = await supabase
          .from('orders')
          .select('id', { count: 'exact' })
          .eq('seller_id', skillData.users?.id)
          .eq('status', 'completed');

        setSellerStats({
          activeSkills: sellerSkillCount || 0,
          completedOrders: completedOrdersCount || 0
        });

      } catch (err) {
        console.error("Error fetching skill data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkillData();
  }, [skillId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground animate-pulse">Loading skill details...</p>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-bold">Skill not found</h2>
        <p className="text-muted-foreground text-center max-w-md">The skill you are looking for does not exist or has been removed.</p>
        <button onClick={() => router.push('/dashboard')} className="mt-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
          Back to Explore
        </button>
      </div>
    );
  }

  // Derived Values
  const images = skill.image_url ? [skill.image_url] : []; // If there are multiple images in the future, they would go here.
  
  const getTierData = () => {
    switch (activeTier) {
      case "premium":
        return { price: skill.price_premium, desc: "Premium Package Delivery", time: "7", revisions: "Unlimited" };
      case "standard":
        return { price: skill.price_standard, desc: "Standard Package Delivery", time: "5", revisions: "5" };
      case "basic":
      default:
        return { price: skill.price_basic, desc: "Basic Package Delivery", time: skill.delivery_time || "3", revisions: skill.revisions || "3" };
    }
  };

  const currentTier = getTierData();
  
  // Only show available tiers
  const hasStandard = !!skill.price_standard;
  const hasPremium = !!skill.price_premium;

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-10 min-h-screen">
      
      {/* LEFT COLUMN: Skill Details (65%) */}
      <div className="w-full lg:w-[65%] flex flex-col gap-8">
        
        {/* Category Breadcrumb */}
        <div className="text-[12px] text-muted-foreground font-medium uppercase tracking-wider">
          {skill.category} {skill.subcategory ? `> ${skill.subcategory}` : ''}
        </div>

        {/* Title */}
        <h1 className="text-[22px] font-bold leading-tight">
          I will provide high-quality {skill.title.toLowerCase()} tailored to your needs
        </h1>

        {/* Seller Info Row */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-border">
            <AvatarImage src={skill.users?.avatar_url || ""} />
            <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold">{skill.users?.username || "Anonymous Seller"}</span>
              {skill.users?.is_verified && <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/20" />}
              <span className="text-muted-foreground text-sm ml-1">• {skill.users?.college || "Student"}</span>
            </div>
            <span className="text-sm text-amber-500 font-medium">
              {skill.users?.seller_level || "Level 1 Seller"}
            </span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="flex flex-col gap-3">
          {mainImage ? (
            <div className="w-full h-[360px] bg-muted rounded-xl overflow-hidden border border-border">
              <img src={mainImage} alt={skill.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full h-[360px] bg-zinc-900 rounded-xl flex items-center justify-center border border-border">
              <div className="px-4 py-2 bg-primary/20 text-primary rounded-lg font-bold uppercase tracking-wider text-sm">
                {skill.category}
              </div>
            </div>
          )}
          
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {images.map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setMainImage(img)}
                  className={`shrink-0 w-20 h-15 rounded-lg overflow-hidden border-2 transition-all ${mainImage === img ? 'border-primary opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 py-4 border-y border-border/50 text-sm font-medium">
          <div className="flex items-center gap-2"><Eye className="h-4 w-4 text-muted-foreground" /> {skill.views || 0} views</div>
          <div className="flex items-center gap-2"><ShoppingBag className="h-4 w-4 text-muted-foreground" /> {sellerStats.completedOrders} orders</div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 
            {reviews.length > 0 ? "5.0 rating" : "New"}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold">About This Gig</h2>
          <div className="text-sm leading-[1.7] text-foreground/90 whitespace-pre-wrap">
            {showFullDesc ? skill.description : skill.description.slice(0, 300) + (skill.description.length > 300 ? "..." : "")}
          </div>
          {skill.description.length > 300 && (
            <button 
              onClick={() => setShowFullDesc(!showFullDesc)}
              className="text-primary font-semibold text-sm w-fit hover:underline"
            >
              {showFullDesc ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* Tags */}
        {skill.tags && skill.tags.length > 0 && (
          <div className="flex flex-col gap-3 mt-2">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Related Tags</h3>
            <div className="flex flex-wrap gap-2">
              {skill.tags.map((tag: string, idx: number) => (
                <span key={idx} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="flex flex-col gap-6 mt-8">
          <h2 className="text-lg font-bold">Reviews ({reviews.length})</h2>
          
          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-sm">No reviews yet.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {reviews.map((review, idx) => (
                <div key={idx} className="flex flex-col gap-3 pb-6 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={review.reviewer?.avatar_url || ""} />
                        <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{review.reviewer?.username || "User"}</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: review.rating || 5 }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: Sticky Order Panel (35%) */}
      <div className="w-full lg:w-[35%] relative">
        <div className="sticky top-[24px] flex flex-col gap-6">
          
          {/* Order Card */}
          <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden flex flex-col">
            
            {/* Tabs */}
            <div className="flex w-full border-b border-border bg-muted/30">
              <button 
                onClick={() => setActiveTier("basic")}
                className={`flex-1 py-4 text-center font-bold text-sm transition-colors border-b-2 ${activeTier === "basic" ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                Basic
              </button>
              {hasStandard && (
                <button 
                  onClick={() => setActiveTier("standard")}
                  className={`flex-1 py-4 text-center font-bold text-sm transition-colors border-b-2 ${activeTier === "standard" ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                  Standard
                </button>
              )}
              {hasPremium && (
                <button 
                  onClick={() => setActiveTier("premium")}
                  className={`flex-1 py-4 text-center font-bold text-sm transition-colors border-b-2 ${activeTier === "premium" ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                  Premium
                </button>
              )}
            </div>

            {/* Tier Content */}
            <div className="p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="px-3 py-1 bg-muted text-muted-foreground font-bold text-xs uppercase tracking-wider rounded-md">
                  {activeTier} Tier
                </div>
                <div className="text-2xl font-bold">₹{currentTier.price}</div>
              </div>

              <p className="text-sm font-medium leading-relaxed text-foreground/80 min-h-[60px]">
                {currentTier.desc}
              </p>

              <div className="flex flex-col gap-3 text-sm font-semibold text-muted-foreground">
                <div className="flex items-center gap-2">
                  <RefreshCcw className="h-4 w-4" /> {currentTier.revisions} Revisions
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg leading-none">🕐</span> {currentTier.time} Days Delivery
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <button 
                  onClick={() => router.push(`/dashboard/hire/${skill.id}?tier=${activeTier}`)}
                  className="w-full h-[48px] bg-[#7c6af7] text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center text-base shadow-md"
                >
                  Hire for ₹{currentTier.price}
                </button>
                <button 
                  onClick={() => router.push(`/dashboard/messages`)}
                  className="w-full h-[48px] bg-transparent border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" /> Message Seller
                </button>
              </div>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-col gap-3 px-2">
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
              <Lock className="h-4 w-4 text-emerald-500" /> Secure payment via Skillundo
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
              <span className="text-lg leading-none">↩️</span> Free cancellation within 24h
            </div>
            {skill.users?.is_verified && (
              <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-blue-500" /> Verified student seller
              </div>
            )}
          </div>

          {/* Seller Quick Stats */}
          <div className="mt-4 p-5 bg-muted/40 border border-border rounded-xl flex flex-col gap-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-1">Seller Highlights</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs">Member since</span>
                <span className="font-semibold">{new Date(skill.users?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs">Response time</span>
                <span className="font-semibold">Usually in a day</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs">Active skills</span>
                <span className="font-semibold">{sellerStats.activeSkills} listed</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs">Total orders</span>
                <span className="font-semibold">{sellerStats.completedOrders} completed</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
