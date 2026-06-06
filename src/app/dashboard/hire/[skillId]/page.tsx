"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadCloud, X, Check, Lock, Loader2, User } from "lucide-react";

export default function HirePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const skillId = params.skillId as string;
  const initialTier = (searchParams.get("tier") || "basic") as "basic" | "standard" | "premium";

  const [skill, setSkill] = useState<any>(null);
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<"basic" | "standard" | "premium">(initialTier);
  const [isChangingTier, setIsChangingTier] = useState(false);

  // Form State
  const [brief, setBrief] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!skillId || !user) return;

    const fetchData = async () => {
      try {
        // Fetch skill
        const { data: skillData, error: skillError } = await supabase
          .from('skills')
          .select('*, users!fk_skills_user_id(username, avatar_url)')
          .eq('id', skillId)
          .single();

        if (skillError || !skillData) {
          router.push('/dashboard');
          return;
        }

        setSkill(skillData);

        // Fetch current user details from Supabase
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('firebase_uid', user.uid)
          .single();

        setCurrentUserData(userData);

        // Prevent self hire
        if (userData && skillData.users?.id === userData.id) {
          router.push(`/dashboard/skill/${skillId}`);
          return; // Self hire prevented
        }

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [skillId, user, router]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'];
      
      const validFiles = newFiles.filter(file => {
        if (file.size > 20 * 1024 * 1024) return false; // Max 20MB
        if (!allowedTypes.includes(file.type) && !file.name.endsWith('.zip')) return false;
        return true;
      });

      if (attachments.length + validFiles.length > 3) {
        alert("Maximum 3 files allowed.");
        return;
      }
      setAttachments(prev => [...prev, ...validFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handlePlaceOrder = async () => {
    if (!brief.trim() || !termsAgreed || !skill || !currentUserData) return;
    
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const uploadedUrls: string[] = [];

      // Upload attachments
      for (const file of attachments) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `orders/${user?.uid}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('order-attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('order-attachments')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrlData.publicUrl);
      }

      // Calculate deadline
      const tierData = getTierData(selectedTier);
      const deliveryDays = parseInt(tierData.time) || 3;
      const dueDate = new Date(Date.now() + deliveryDays * 86400000).toISOString();

      // Insert Order
      const { error: insertError } = await supabase
        .from('orders')
        .insert({
          skill_id: skill.id,
          buyer_id: currentUserData.id,
          seller_id: skill.users.id,
          tier: selectedTier,
          amount: tierData.price,
          status: 'pending',
          due_date: dueDate,
          brief: brief,
          attachment_urls: uploadedUrls,
          service_title: skill.title, // For dashboard UI
          buyer_name: user?.displayName || 'Buyer' // For dashboard UI
        });

      if (insertError) throw insertError;

      router.push('/dashboard/dashboard?order=placed');
      
    } catch (err: any) {
      console.error("Order placement failed:", err);
      setSubmitError(err.message || "An error occurred while placing the order.");
      setIsSubmitting(false);
    }
  };

  const getTierData = (tier: string) => {
    switch (tier) {
      case "premium": return { name: "Premium", price: skill?.price_premium, desc: "Premium Delivery", time: "7" };
      case "standard": return { name: "Standard", price: skill?.price_standard, desc: "Standard Delivery", time: "5" };
      case "basic":
      default: return { name: "Basic", price: skill?.price_basic, desc: "Basic Delivery", time: skill?.delivery_time || "3" };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!skill) return null;

  const currentTierData = getTierData(selectedTier);
  const deliveryDate = new Date(Date.now() + parseInt(currentTierData.time) * 86400000);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const subtotal = currentTierData.price || 0;
  const platformFee = Math.round(subtotal * 0.05); // 5% fee
  const total = subtotal + platformFee;

  const hasStandard = !!skill.price_standard;
  const hasPremium = !!skill.price_premium;

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-10 min-h-screen pb-32">
      
      {/* LEFT COLUMN: Order Form (60%) */}
      <div className="w-full lg:w-[60%] flex flex-col gap-8">
        <div>
          <h1 className="text-[22px] font-bold">Complete Your Order</h1>
          <p className="text-sm text-muted-foreground mt-1">You're hiring {skill.users?.username || "a seller"} for {skill.title}</p>
        </div>

        {/* SECTION 1: Order Details */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Order Details</h2>
            <button 
              onClick={() => setIsChangingTier(!isChangingTier)}
              className="text-primary text-sm font-semibold hover:underline"
            >
              {isChangingTier ? "Cancel" : "Change tier"}
            </button>
          </div>
          
          {isChangingTier ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['basic', 'standard', 'premium'].map((tierType) => {
                const isAvailable = tierType === 'basic' || (tierType === 'standard' && hasStandard) || (tierType === 'premium' && hasPremium);
                if (!isAvailable) return null;
                const data = getTierData(tierType);
                return (
                  <button
                    key={tierType}
                    onClick={() => { setSelectedTier(tierType as any); setIsChangingTier(false); }}
                    className={`flex flex-col items-center justify-center p-4 border rounded-xl text-center transition-all ${selectedTier === tierType ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:bg-muted/50'}`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{data.name}</span>
                    <span className="text-xl font-bold mt-2">₹{data.price}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-5 border-2 border-primary bg-primary/5 rounded-xl flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">{currentTierData.name} Package</span>
                <span className="text-sm text-foreground/80 font-medium mt-1">{currentTierData.desc}</span>
              </div>
              <div className="text-2xl font-bold">₹{currentTierData.price}</div>
            </div>
          )}
        </section>

        {/* SECTION 2: Project Brief */}
        <section className="flex flex-col gap-3">
          <label className="font-bold text-lg">Describe your requirements <span className="text-red-500">*</span></label>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            maxLength={2000}
            placeholder="Explain what you need, any specific requirements, references, or deadlines..."
            className="w-full min-h-[140px] bg-muted/50 border border-border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y"
          />
          <div className="text-xs text-muted-foreground text-right">{brief.length} / 2000</div>
        </section>

        {/* SECTION 3: Attachments */}
        <section className="flex flex-col gap-3">
          <label className="font-bold text-lg">Attach reference files <span className="text-muted-foreground font-normal text-sm">(optional)</span></label>
          
          <label className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors bg-muted/20">
            <input type="file" multiple className="hidden" onChange={handleFileUpload} accept="image/*,.pdf,.doc,.docx,.zip" />
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-semibold mb-1">Click to upload or drag & drop</p>
            <p className="text-xs text-muted-foreground text-center">SVG, PNG, JPG, PDF or ZIP (max 20MB)</p>
          </label>

          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {attachments.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-muted/80 px-3 py-1.5 rounded-lg border border-border">
                  <span className="text-xs font-medium max-w-[150px] truncate">{file.name}</span>
                  <button onClick={() => removeAttachment(idx)} className="p-0.5 hover:bg-black/10 rounded-full transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 4: Delivery Deadline */}
        <section className="flex flex-col gap-2 p-5 bg-muted/30 border border-border rounded-xl">
          <label className="font-bold text-lg">Expected delivery</label>
          <div className="text-base font-semibold">Estimated by {formattedDeliveryDate}</div>
          <div className="text-xs text-muted-foreground mt-1">Seller has {currentTierData.time} days to deliver from the time requirements are submitted.</div>
        </section>

        {/* SECTION 5: Agree to Terms */}
        <section className="flex items-start gap-3 mt-4">
          <input 
            type="checkbox" 
            id="terms" 
            checked={termsAgreed}
            onChange={(e) => setTermsAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary bg-muted/50"
          />
          <label htmlFor="terms" className="text-sm text-foreground/80 leading-snug cursor-pointer select-none">
            I agree to Skillundo's terms of service and understand this is a student-to-student transaction. The payment will be held securely until delivery is approved.
          </label>
        </section>

      </div>

      {/* RIGHT COLUMN: Order Summary (40%) */}
      <div className="w-full lg:w-[40%] relative mt-8 lg:mt-0">
        <div className="sticky top-[24px] flex flex-col gap-6">
          
          <div className="bg-card border border-border rounded-xl shadow-lg p-6 flex flex-col gap-6">
            <h2 className="text-lg font-bold">Order Summary</h2>

            {/* Skill Mini Card */}
            <div className="flex gap-4 items-center">
              <div className="h-[60px] w-[60px] shrink-0 rounded-lg overflow-hidden bg-muted">
                {skill.image_url ? (
                  <img src={skill.image_url} className="h-full w-full object-cover" alt={skill.title} />
                ) : (
                  <div className="h-full w-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary uppercase">{skill.category}</div>
                )}
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <h3 className="text-sm font-semibold truncate text-foreground">{skill.title}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={skill.users?.avatar_url || ""} />
                    <AvatarFallback><User className="h-2 w-2" /></AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground truncate">{skill.users?.username}</span>
                </div>
              </div>
            </div>

            <div className="px-3 py-1 bg-muted/50 rounded-md w-fit border border-border/50 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {currentTierData.name} Tier
            </div>

            <div className="h-px bg-border/60 w-full" />

            {/* Pricing Breakdown */}
            <div className="flex flex-col gap-3 text-sm font-medium">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Platform Fee (5%)</span>
                <span>₹{platformFee}</span>
              </div>
            </div>

            <div className="h-px bg-border/60 w-full" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="font-bold text-base">Total</span>
              <span className="font-bold text-2xl">₹{total}</span>
            </div>

            {submitError && (
              <div className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-lg border border-destructive/20 text-center">
                {submitError}
              </div>
            )}

            <div className="flex flex-col gap-3 mt-2">
              <button 
                onClick={handlePlaceOrder}
                disabled={!termsAgreed || !brief.trim() || isSubmitting}
                className="w-full h-[48px] bg-[#7c6af7] text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isSubmitting ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                ) : (
                  <>Place Order · ₹{total}</>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground mt-1">
                <Lock className="h-3 w-3" /> Payment is held securely until you approve delivery
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
