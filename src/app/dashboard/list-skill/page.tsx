"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Check, X, UploadCloud, Image as ImageIcon, Plus, Info, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDashboardContext } from "@/context/DashboardContext";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";

const CATEGORIES = [
  "Engineering", "Design", "Writing", "Marketing", "Video & Animation", 
  "Photography", "Music & Audio", "Data & Analytics", "Tutoring & Teaching"
];

const SUBCATEGORIES: Record<string, string[]> = {
  Engineering: ["Frontend Development", "Backend Development", "Mobile Apps"],
  Design: ["UI/UX Design", "Graphic Design", "Logo Design"],
  Writing: ["Content Writing", "SEO", "Copywriting"],
  // Just provide defaults for others or fallbacks
};

const SUGGESTED_TAGS = [
  "React", "Figma", "Python", "Node.js", "Logo Design", 
  "SEO Writing", "Machine Learning", "Video Editing", "Flutter", "Photoshop"
];

export default function ListASkill() {
  const router = useRouter();
  const { addSkill } = useDashboardContext();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");

  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [basicPrice, setBasicPrice] = useState("");
  const [basicDesc, setBasicDesc] = useState("");
  const [standardPrice, setStandardPrice] = useState("");
  const [standardDesc, setStandardDesc] = useState("");
  const [premiumPrice, setPremiumPrice] = useState("");
  const [premiumDesc, setPremiumDesc] = useState("");

  const [delivery, setDelivery] = useState("3 Days");
  const [revisions, setRevisions] = useState("3");

  const [verifyCusat, setVerifyCusat] = useState(true);
  const [verifyCert, setVerifyCert] = useState(false);
  const [verifyGithub, setVerifyGithub] = useState(false);
  const [verifyLinkedin, setVerifyLinkedin] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState("");

  const [isAvailable, setIsAvailable] = useState(true);
  const [acceptCustom, setAcceptCustom] = useState(true);
  const [rushDelivery, setRushDelivery] = useState(false);
  const [maxActiveOrders, setMaxActiveOrders] = useState("3");

  const [publishError, setPublishError] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newImages = newFiles.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages].slice(0, 5));
      setImageFiles(prev => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else if (tags.length < 5) {
      setTags([...tags, tag]);
    }
  };

  const handleCustomTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customTag.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(customTag.trim()) && tags.length < 5) {
        setTags([...tags, customTag.trim()]);
        setCustomTag("");
      }
    }
  };

  const hasTitle = title.trim().length > 0;
  const hasCategory = category !== "";
  const hasDesc = description.trim().length > 20;
  const hasPrice = Number(basicPrice) > 0;
  const hasImage = images.length > 0;
  const isReady = hasTitle && hasCategory && hasDesc && hasPrice && hasImage;

  const handlePublish = async () => {
    if (!isReady) {
      setPublishError("Please complete all required fields in the checklist.");
      return;
    }
    
    if (!user) {
      setPublishError("You must be logged in to publish a skill.");
      return;
    }

    setIsPublishing(true);
    setPublishError("");
    
    try {
      let mainImageUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"; // fallback

      // Upload first image to Supabase Storage if available
      if (imageFiles.length > 0) {
        const file = imageFiles[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `skills/${user.uid}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('skill-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('skill-images')
          .getPublicUrl(filePath);
          
        mainImageUrl = publicUrlData.publicUrl;
      }

      // Insert into Supabase DB
      const { error: insertError } = await supabase
        .from('skills')
        .insert({
          user_id: user.uid,
          title,
          category,
          subcategory,
          description,
          tags,
          price_basic: Number(basicPrice),
          price_standard: Number(standardPrice) || null,
          price_premium: Number(premiumPrice) || null,
          delivery_time: delivery,
          revisions: revisions,
          image_url: mainImageUrl,
          status: "active",
        });

      if (insertError) throw insertError;

      // Update DashboardContext for backward compatibility (optional but safe)
      const categoryColors: Record<string, string> = {
        Engineering: "bg-blue-500",
        Design: "bg-pink-500",
        Writing: "bg-green-500",
      };

      addSkill({
        title,
        category,
        catColor: categoryColors[category] || "bg-zinc-500",
        status: "Active",
        price: Number(basicPrice),
        imageUrl: mainImageUrl,
      });

      router.push("/dashboard/my-skills");
    } catch (err: any) {
      console.error("Publish error:", err);
      setPublishError(err.message || "An error occurred while publishing.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col bg-background relative w-full min-h-screen">
      {/* Topbar */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-border px-6 py-4 flex items-center">
        <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground absolute left-4 md:left-6">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 flex items-center justify-center pl-8 md:pl-0">
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar max-w-full">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
              <Check className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium hidden sm:block text-foreground">Overview</span>
          </div>
          <div className="h-px w-8 sm:w-16 bg-border" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
              2
            </div>
            <span className="text-sm font-medium hidden sm:block text-primary">Pricing & Scope</span>
          </div>
          <div className="h-px w-8 sm:w-16 bg-border" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full border border-border text-muted-foreground flex items-center justify-center font-bold text-sm shrink-0">
              3
            </div>
            <span className="text-sm font-medium hidden sm:block text-muted-foreground">Gallery</span>
          </div>
          <div className="h-px w-8 sm:w-16 bg-border" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full border border-border text-muted-foreground flex items-center justify-center font-bold text-sm shrink-0">
              4
            </div>
            <span className="text-sm font-medium hidden sm:block text-muted-foreground">Publish</span>
          </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row relative">
        {/* Left Form Area */}
        <div className="flex-1 lg:max-w-[calc(100%-320px)] overflow-y-auto p-6 pb-32">
          <div className="max-w-[760px] mx-auto space-y-12">
            
            {/* Section 1 */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground shrink-0">1. Skill Overview</h3>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    maxLength={80}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. I will build a modern React application"
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                  <div className="text-xs text-muted-foreground mt-1.5 text-right">{title.length} / 80</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setSubcategory("");
                      }}
                      className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm appearance-none"
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Subcategory</label>
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      disabled={!category}
                      className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm appearance-none disabled:opacity-50"
                    >
                      <option value="">Select a subcategory</option>
                      {(SUBCATEGORIES[category] || []).map((sub: string) => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    maxLength={1000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what you offer in detail..."
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm min-h-[100px] resize-y"
                  />
                  <div className="text-xs text-muted-foreground mt-1.5 text-right">{description.length} / 1000</div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground shrink-0">2. Tags & Skills</h3>
                <div className="h-px bg-border flex-1" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-4">Select up to 5 relevant tags to help buyers find your skill.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {SUGGESTED_TAGS.map(tag => {
                    const isSelected = tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                          isSelected 
                            ? 'bg-primary/20 border-primary text-primary' 
                            : 'bg-muted border-border text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={handleCustomTagKeyDown}
                  placeholder="Add custom tag and press Enter..."
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors text-sm"
                  disabled={tags.length >= 5}
                />
                <div className="text-xs text-muted-foreground mt-2">{tags.length} / 5 tags selected</div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground shrink-0">3. Portfolio Images</h3>
                <div className="h-px bg-border flex-1" />
              </div>

              <div>
                <div 
                  className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-sm font-semibold mb-1">Click or drag & drop to upload</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB each</p>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {images.map((src, idx) => (
                      <div key={idx} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border group bg-muted">
                        <img src={src} alt={`Upload ${idx+1}`} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {images.length < 5 && (
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-[4/3] rounded-lg border border-border border-dashed flex items-center justify-center hover:bg-muted/30 hover:border-primary/50 transition-colors text-muted-foreground"
                      >
                        <Plus className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-2">{images.length} / 5 images max</div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground shrink-0">4. Pricing Tiers</h3>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="space-y-4">
                {/* Basic */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2.5 py-1 bg-muted text-muted-foreground text-xs font-bold uppercase tracking-wider rounded-md">Basic</span>
                    <div className="flex-1" />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                      <input 
                        type="number"
                        placeholder="500"
                        value={basicPrice}
                        onChange={(e) => setBasicPrice(e.target.value)}
                        className="w-32 bg-background border border-border rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Describe what's included in basic tier..."
                    value={basicDesc}
                    onChange={(e) => setBasicDesc(e.target.value)}
                    className="w-full bg-transparent border-b border-border/50 pb-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Standard */}
                <div className="bg-card border-2 border-primary/50 rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                    ✦ Most Popular
                  </div>
                  <div className="flex items-center gap-3 mb-4 mt-2">
                    <span className="px-2.5 py-1 bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider rounded-md">Standard</span>
                    <div className="flex-1" />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                      <input 
                        type="number"
                        placeholder="1500"
                        value={standardPrice}
                        onChange={(e) => setStandardPrice(e.target.value)}
                        className="w-32 bg-background border border-border rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Describe what's included in standard tier..."
                    value={standardDesc}
                    onChange={(e) => setStandardDesc(e.target.value)}
                    className="w-full bg-transparent border-b border-border/50 pb-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Premium */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider rounded-md">Premium</span>
                    <div className="flex-1" />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                      <input 
                        type="number"
                        placeholder="3500"
                        value={premiumPrice}
                        onChange={(e) => setPremiumPrice(e.target.value)}
                        className="w-32 bg-background border border-border rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Describe what's included in premium tier..."
                    value={premiumDesc}
                    onChange={(e) => setPremiumDesc(e.target.value)}
                    className="w-full bg-transparent border-b border-border/50 pb-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground shrink-0">5. Delivery & Extras</h3>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold mb-3">Delivery Time</label>
                  <div className="flex flex-wrap gap-2">
                    {["1 Day", "3 Days", "5 Days", "7 Days", "14 Days", "Custom"].map(time => (
                      <button
                        key={time}
                        onClick={() => setDelivery(time)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          delivery === time 
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                            : 'bg-muted/50 border-border text-foreground hover:bg-muted'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Included Revisions</label>
                  <select
                    value={revisions}
                    onChange={(e) => setRevisions(e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm appearance-none"
                  >
                    <option value="1">1</option>
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="Unlimited">Unlimited</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground shrink-0">6. Verification & Trust</h3>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "🎓 CUSAT Student ID", state: verifyCusat, setter: setVerifyCusat },
                  { label: "🏅 Course Certificate", state: verifyCert, setter: setVerifyCert },
                  { label: "🔗 GitHub / Portfolio", state: verifyGithub, setter: setVerifyGithub },
                  { label: "📋 LinkedIn Profile", state: verifyLinkedin, setter: setVerifyLinkedin },
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => item.setter(!item.state)}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      item.state ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-muted/50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors shrink-0 ${
                      item.state ? 'bg-primary border-primary text-primary-foreground' : 'border-border'
                    }`}>
                      {item.state && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Portfolio / Proof URL</label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://"
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
            </section>

            {/* Section 7 */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground shrink-0">7. Availability & Settings</h3>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="space-y-6">
                {[
                  { title: "Available for orders", desc: "Visible to buyers on Explore", state: isAvailable, setter: setIsAvailable },
                  { title: "Accept custom requests", desc: "Buyers can ask for tailored work", state: acceptCustom, setter: setAcceptCustom },
                  { title: "Rush delivery (2x price)", desc: "Buyers can pay extra for faster delivery", state: rushDelivery, setter: setRushDelivery },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold">{item.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                    </div>
                    <button 
                      onClick={() => item.setter(!item.state)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        item.state ? 'bg-primary' : 'bg-muted border border-border'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        item.state ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-semibold mb-2">Max active orders</label>
                  <select
                    value={maxActiveOrders}
                    onChange={(e) => setMaxActiveOrders(e.target.value)}
                    className="w-full sm:w-64 bg-muted/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm appearance-none"
                  >
                    <option value="1">1</option>
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="Unlimited">Unlimited</option>
                  </select>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Right Preview Panel (Sticky) */}
        <div className="hidden lg:block w-[320px] shrink-0 border-l border-border bg-muted/10 p-6 sticky top-0 h-screen overflow-y-auto">
          <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Live preview</div>

          {/* Preview Card */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col mb-8">
            <div className="relative aspect-[4/3] bg-muted w-full overflow-hidden flex items-center justify-center">
              {images.length > 0 ? (
                <img src={images[0]} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="bg-zinc-800 w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-zinc-600" />
                </div>
              )}
              {category && (
                <div className="absolute top-3 left-3 px-2.5 py-1 backdrop-blur-md bg-black/40 text-white rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  {category}
                </div>
              )}
            </div>

            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                  ME
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold leading-none">Your Name</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">New Seller</span>
                </div>
              </div>

              <h3 className="font-medium text-sm leading-snug line-clamp-2 mb-3 min-h-[40px]">
                {title ? (title.length > 60 ? title.substring(0, 60) + '...' : title) : <span className="text-muted-foreground">I will...</span>}
              </h3>

              <div className="flex items-center gap-1.5 mt-auto mb-4">
                <span className="font-bold text-sm">⭐ New</span>
                <span className="text-muted-foreground text-sm">· (0 reviews)</span>
              </div>

              <div className="pt-3 border-t border-border/50 text-right">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider block leading-none mb-1">
                  Starting at
                </span>
                <span className="text-lg font-bold leading-none">
                  {basicPrice ? `₹${basicPrice}` : "₹0"}
                </span>
              </div>
            </div>
          </div>

          {/* Readiness Checklist */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold">Readiness checklist</h4>
            <div className="space-y-3">
              {[
                { label: "Add a skill title", done: hasTitle },
                { label: "Select a category", done: hasCategory },
                { label: "Write a description", done: hasDesc },
                { label: "Set a starting price", done: hasPrice },
                { label: "Upload at least 1 image", done: hasImage },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${item.done ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
                  <span className={`text-sm ${item.done ? 'text-foreground' : 'text-muted-foreground'}`}>{item.label}</span>
                </div>
              ))}
            </div>
            
            {publishError && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-lg flex gap-2">
                <Info className="h-4 w-4 shrink-0" />
                {publishError}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 lg:left-64 right-0 z-30 bg-background/95 backdrop-blur-md border-t border-border p-4 flex items-center justify-between">
        <button 
          onClick={() => console.log("Draft saved")}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          Save as draft
        </button>
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard"
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            &larr; Back
          </Link>
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-6 py-2.5 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPublishing ? "Publishing..." : "Publish Skill \u2192"}
          </button>
        </div>
      </div>
    </div>
  );
}
